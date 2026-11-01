-- Read-only checks BEFORE applying the Step 24 migration. Run in the Supabase SQL Editor.
select current_setting('server_version') as postgres_version;
select table_name,column_name,data_type,is_nullable,column_default
from information_schema.columns where table_schema='public' and table_name in ('demo_requests','demo_email_events')
order by table_name,ordinal_position;
select conrelid::regclass as table_name,conname,pg_get_constraintdef(oid) as definition
from pg_constraint where conrelid in ('public.demo_requests'::regclass,'public.demo_email_events'::regclass);
select email_status,count(*) from public.demo_requests group by email_status;
select event_type,count(*) from public.demo_email_events group by event_type;
select p.oid::regprocedure as signature,p.prosecdef as security_definer,p.proacl as grants,pg_get_functiondef(p.oid) as definition
from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='record_demo_email_event';
select * from pg_policies where schemaname='public' and tablename in ('demo_requests','demo_email_events');
select grantee,table_name,privilege_type from information_schema.role_table_grants
where table_schema='public' and table_name in ('demo_requests','demo_email_events');
