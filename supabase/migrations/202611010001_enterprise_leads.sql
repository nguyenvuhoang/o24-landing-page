-- Step 24. Additive: original requests, email statuses and record_demo_email_event are preserved.
-- Requires the Step 23 demo_requests (UUID id, submitted_at) and demo_email_events tables.
begin;
-- The webhook is a server-to-server operation; preserve its body but remove public RPC execution.
do $$ declare f regprocedure;
begin
 for f in select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid=p.pronamespace
 where n.nspname='public' and p.proname='record_demo_email_event' loop
  execute format('revoke all on function %s from public, anon, authenticated',f);
  execute format('grant execute on function %s to service_role',f);
 end loop;
end $$;
create table public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (length(display_name) between 1 and 160),
 role text not null default 'admin' check (role = 'admin'),
 created_at timestamptz not null default now()
);
create function public.is_lead_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.admin_users where user_id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_lead_admin() from public;
grant execute on function public.is_lead_admin() to authenticated;
alter table public.admin_users enable row level security;
create policy admin_directory on public.admin_users for select to authenticated using (public.is_lead_admin());
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

create table public.lead_management (
 lead_id uuid primary key references public.demo_requests(id) on delete restrict,
 lead_status text not null default 'NEW' check (lead_status in ('NEW','CONTACTED','QUALIFIED','DEMO_SCHEDULED','WON','LOST')),
 assigned_admin uuid references public.admin_users(user_id) on delete set null,
 last_contacted_at timestamptz,
 demo_scheduled_at timestamptz,
 updated_at timestamptz not null default now()
);
create table public.lead_history (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.demo_requests(id) on delete restrict,
 actor_id uuid references auth.users(id) on delete set null,
 actor_name text not null,
 created_at timestamptz not null default now(),
 changes jsonb not null default '{}'::jsonb,
 note text check (length(note) between 1 and 5000)
);
create index on public.lead_history(lead_id, created_at desc);
create index on public.lead_management(lead_status);
create index on public.lead_management(assigned_admin);
create index if not exists demo_requests_submitted_id_idx on public.demo_requests(submitted_at desc,id);
create index if not exists demo_requests_email_status_idx on public.demo_requests(email_status);
insert into public.lead_management(lead_id) select id from public.demo_requests on conflict do nothing;
create function public.initialize_lead_management() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.lead_management(lead_id) values(new.id) on conflict do nothing; return new; end;
$$;
revoke all on function public.initialize_lead_management() from public;
create trigger initialize_lead_management after insert on public.demo_requests for each row execute function public.initialize_lead_management();

alter table public.lead_management enable row level security;
alter table public.lead_history enable row level security;
alter table public.demo_requests enable row level security;
alter table public.demo_email_events enable row level security;
revoke all on public.lead_management, public.lead_history, public.demo_requests, public.demo_email_events from anon, authenticated;
grant select on public.lead_management, public.lead_history, public.demo_requests, public.demo_email_events to authenticated;
grant all on public.lead_management, public.lead_history, public.admin_users to service_role;
create policy admin_read on public.lead_management for select to authenticated using (public.is_lead_admin());
create policy admin_read on public.lead_history for select to authenticated using (public.is_lead_admin());
create policy admin_read on public.demo_requests for select to authenticated using (public.is_lead_admin());
create policy admin_read on public.demo_email_events for select to authenticated using (public.is_lead_admin());
-- Restrictive policies also constrain any legacy permissive policies; service-role bypass stays intact.
create policy admin_only on public.demo_requests as restrictive for all to authenticated using (public.is_lead_admin()) with check (public.is_lead_admin());
create policy admin_only on public.demo_email_events as restrictive for all to authenticated using (public.is_lead_admin()) with check (public.is_lead_admin());

create view public.enterprise_leads with (security_invoker = true) as
 select r.*, m.lead_status, m.assigned_admin, m.last_contacted_at, m.demo_scheduled_at, m.updated_at
 from public.demo_requests r join public.lead_management m on m.lead_id=r.id;
revoke all on public.enterprise_leads from anon, authenticated;
grant select on public.enterprise_leads to authenticated;

create function public.update_enterprise_lead(p_id uuid, p_change jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare old_row public.lead_management; new_row public.lead_management; actor text; delta jsonb;
begin
 if not public.is_lead_admin() then raise exception 'Admin access required' using errcode='42501'; end if;
 if p_change is null or jsonb_typeof(p_change) <> 'object' or exists(select 1 from jsonb_object_keys(p_change) k where k not in ('status','assignedAdmin','lastContactedAt','demoScheduledAt','note','expectedUpdatedAt')) then raise exception 'Invalid fields' using errcode='22023'; end if;
 if not p_change ? 'expectedUpdatedAt' or jsonb_typeof(p_change->'expectedUpdatedAt') <> 'string' then raise exception 'Version required' using errcode='22023'; end if;
 if p_change ? 'status' and (jsonb_typeof(p_change->'status') <> 'string' or p_change->>'status' not in ('NEW','CONTACTED','QUALIFIED','DEMO_SCHEDULED','WON','LOST')) then raise exception 'Invalid status' using errcode='22023'; end if;
 if p_change ? 'note' and (jsonb_typeof(p_change->'note') <> 'string' or length(trim(p_change->>'note')) not between 1 and 5000) then raise exception 'Invalid note' using errcode='22023'; end if;
 if p_change ? 'assignedAdmin' and p_change->>'assignedAdmin' is not null and not exists(select 1 from public.admin_users where user_id=(p_change->>'assignedAdmin')::uuid and role='admin') then raise exception 'Invalid assignee' using errcode='22023'; end if;
 select * into old_row from public.lead_management where lead_id=p_id for update;
 if not found then raise exception 'Lead not found' using errcode='P0002'; end if;
 if old_row.updated_at <> (p_change->>'expectedUpdatedAt')::timestamptz then raise exception 'Lead changed; reload and try again' using errcode='40001'; end if;
 new_row:=old_row;
 if p_change ? 'status' then
  if p_change->>'status' <> old_row.lead_status and p_change->>'status' <> 'LOST' and not (
   (old_row.lead_status='NEW' and p_change->>'status'='CONTACTED') or
   (old_row.lead_status='CONTACTED' and p_change->>'status'='QUALIFIED') or
   (old_row.lead_status='QUALIFIED' and p_change->>'status'='DEMO_SCHEDULED') or
   (old_row.lead_status='DEMO_SCHEDULED' and p_change->>'status'='WON')
  ) then raise exception 'Follow the lead pipeline or mark as LOST' using errcode='22023'; end if;
  new_row.lead_status:=p_change->>'status';
 end if;
 if p_change ? 'assignedAdmin' then new_row.assigned_admin:=(p_change->>'assignedAdmin')::uuid; end if;
 if p_change ? 'lastContactedAt' then new_row.last_contacted_at:=(p_change->>'lastContactedAt')::timestamptz; end if;
 if p_change ? 'demoScheduledAt' then new_row.demo_scheduled_at:=(p_change->>'demoScheduledAt')::timestamptz; end if;
 if new_row.lead_status='DEMO_SCHEDULED' and new_row.demo_scheduled_at is null then raise exception 'Set a demo date when scheduling' using errcode='22023'; end if;
 select coalesce(jsonb_object_agg(n.key,jsonb_build_object('before',o.value,'after',n.value)), '{}'::jsonb) into delta
 from jsonb_each(to_jsonb(new_row)) n join jsonb_each(to_jsonb(old_row)) o using(key) where n.value is distinct from o.value;
 if delta='{}'::jsonb and not p_change ? 'note' then return; end if;
 update public.lead_management set lead_status=new_row.lead_status, assigned_admin=new_row.assigned_admin,
 last_contacted_at=new_row.last_contacted_at, demo_scheduled_at=new_row.demo_scheduled_at, updated_at=clock_timestamp() where lead_id=p_id;
 select display_name into actor from public.admin_users where user_id=auth.uid();
 insert into public.lead_history(lead_id,actor_id,actor_name,changes,note) values(p_id,auth.uid(),actor,delta,trim(p_change->>'note'));
end;
$$;
revoke all on function public.update_enterprise_lead(uuid,jsonb) from public;
grant execute on function public.update_enterprise_lead(uuid,jsonb) to authenticated;

-- Cohort: submissions in [p_start,p_end), capped at 366 days. Statuses reflect current state.
create function public.enterprise_lead_metrics(p_start timestamptz, p_end timestamptz) returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
declare result jsonb;
begin
 if not public.is_lead_admin() then raise exception 'Admin access required' using errcode='42501'; end if;
 if p_start is null or p_end is null or p_end<=p_start or p_end-p_start>interval '366 days' then raise exception 'Invalid metric range' using errcode='22023'; end if;
 with cohort as (select * from public.enterprise_leads where submitted_at>=p_start and submitted_at<p_end),
 days as (select generate_series(p_start at time zone 'UTC',(p_end-interval '1 millisecond') at time zone 'UTC',interval '1 day')::date d)
 select jsonb_build_object(
 'total',(select count(*) from cohort),
 'statuses',(select coalesce(jsonb_object_agg(lead_status,n),'{}'::jsonb) from (select lead_status,count(*) n from cohort group by lead_status) s),
 'delivered',(select count(*) from cohort where email_status='delivered'),
 'attempted',(select count(*) from cohort where email_status in ('accepted','sent','delivered','delivery_delayed','bounced','complained','failed')),
 'failures',(select count(*) from cohort where email_status in ('bounced','complained','failed','delivery_delayed')),
 'daily',(select jsonb_agg(jsonb_build_object('date',d,'count',(select count(*) from cohort where (submitted_at at time zone 'UTC')::date=d)) order by d) from days)
 ) into result;
 return result;
end;
$$;
revoke all on function public.enterprise_lead_metrics(timestamptz,timestamptz) from public;
grant execute on function public.enterprise_lead_metrics(timestamptz,timestamptz) to authenticated;
commit;
