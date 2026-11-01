-- STEP 25.1: CRM activities. Additive; Step 23/24 untouched.
BEGIN;

CREATE TABLE public.crm_lead_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES public.demo_requests(id) ON DELETE RESTRICT,
    actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    activity_type text NOT NULL CHECK (activity_type IN ('CALL', 'EMAIL', 'MEETING', 'DEMO', 'NOTE')),
    subject text NOT NULL CHECK (char_length(btrim(subject)) BETWEEN 1 AND 200),
    description text CHECK (description IS NULL OR char_length(description) <= 5000),
    occurred_at timestamptz NOT NULL,
    next_follow_up_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT crm_activity_followup_after_activity CHECK (
        next_follow_up_at IS NULL OR next_follow_up_at >= occurred_at
    )
);

CREATE INDEX crm_lead_activities_lead_occurred_idx
    ON public.crm_lead_activities(lead_id, occurred_at DESC, id DESC);
CREATE INDEX crm_lead_activities_followup_idx
    ON public.crm_lead_activities(next_follow_up_at)
    WHERE next_follow_up_at IS NOT NULL;

ALTER TABLE public.crm_lead_activities ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_lead_activities FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.crm_lead_activities TO authenticated;
GRANT ALL ON public.crm_lead_activities TO service_role;
CREATE POLICY crm_activities_admin_read
    ON public.crm_lead_activities FOR SELECT TO authenticated
    USING (public.is_lead_admin());

CREATE FUNCTION public.record_crm_lead_activity(
    p_lead_id uuid,
    p_activity_type text,
    p_subject text,
    p_description text,
    p_occurred_at timestamptz,
    p_next_follow_up_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_id uuid;
    v_actor uuid;
BEGIN
    IF NOT public.is_lead_admin() THEN
        RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
    END IF;
    v_actor := auth.uid();
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'Authenticated user required' USING ERRCODE = '42501';
    END IF;
    IF p_lead_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.lead_management WHERE lead_id = p_lead_id
    ) THEN
        RAISE EXCEPTION 'Lead not found' USING ERRCODE = 'P0002';
    END IF;
    IF p_activity_type IS NULL OR p_activity_type NOT IN ('CALL','EMAIL','MEETING','DEMO','NOTE') THEN
        RAISE EXCEPTION 'Invalid activity type' USING ERRCODE = '22023';
    END IF;
    IF p_subject IS NULL OR char_length(btrim(p_subject)) NOT BETWEEN 1 AND 200 THEN
        RAISE EXCEPTION 'Invalid activity subject' USING ERRCODE = '22023';
    END IF;
    IF p_description IS NOT NULL AND char_length(p_description) > 5000 THEN
        RAISE EXCEPTION 'Description too long' USING ERRCODE = '22023';
    END IF;
    IF p_occurred_at IS NULL OR p_occurred_at > now() + interval '5 minutes' THEN
        RAISE EXCEPTION 'Invalid activity timestamp' USING ERRCODE = '22023';
    END IF;
    IF p_next_follow_up_at IS NOT NULL AND p_next_follow_up_at < p_occurred_at THEN
        RAISE EXCEPTION 'Follow-up cannot precede activity' USING ERRCODE = '22023';
    END IF;
    INSERT INTO public.crm_lead_activities (
        lead_id, actor_id, activity_type, subject, description,
        occurred_at, next_follow_up_at
    ) VALUES (
        p_lead_id, v_actor, p_activity_type, btrim(p_subject),
        nullif(btrim(p_description), ''), p_occurred_at, p_next_follow_up_at
    ) RETURNING id INTO v_id;
    RETURN v_id;
END;
$function$;
REVOKE ALL ON FUNCTION public.record_crm_lead_activity(uuid,text,text,text,timestamptz,timestamptz)
    FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_crm_lead_activity(uuid,text,text,text,timestamptz,timestamptz)
    TO authenticated;

COMMIT;
