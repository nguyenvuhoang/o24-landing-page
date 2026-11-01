-- Step 24.2: Restrict exposed RPC permissions
BEGIN;

REVOKE ALL ON FUNCTION public.enterprise_lead_metrics(
    timestamptz, timestamptz
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.enterprise_lead_metrics(
    timestamptz, timestamptz
) TO authenticated;

REVOKE ALL ON FUNCTION public.is_lead_admin()
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_lead_admin()
TO authenticated;

REVOKE ALL ON FUNCTION public.update_enterprise_lead(uuid, jsonb)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.update_enterprise_lead(uuid, jsonb)
TO authenticated;

REVOKE ALL ON FUNCTION public.record_demo_email_event(text, text, text)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_demo_email_event(text, text, text)
TO service_role;

COMMIT;
