-- Step 24.2 — production hardening: terminal lead statuses.
-- Applies AFTER 202611010001_enterprise_leads.sql.
-- Preserves existing RPC signature, grants, audit and concurrency checks.
begin;
create or replace function public.update_enterprise_lead(p_id uuid, p_change jsonb) returns void
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
 if old_row.lead_status in ('WON','LOST')
    and p_change ? 'status'
    and p_change->>'status' is distinct from old_row.lead_status then
  raise exception 'Terminal lead status cannot be changed' using errcode='22023';
 end if;
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
-- Preserve restricted execution privileges on replacement.
revoke all on function public.update_enterprise_lead(uuid,jsonb) from public, anon;
grant execute on function public.update_enterprise_lead(uuid,jsonb) to authenticated;
commit;
