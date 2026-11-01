-- Step 25.2 - additive follow-up and demo scheduling.
-- Apply only after Step 24 and Step 25.1 migrations.
BEGIN;

CREATE TABLE public.crm_followup_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES public.demo_requests(id) ON DELETE RESTRICT,
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    assigned_admin uuid REFERENCES public.admin_users(user_id) ON DELETE SET NULL,
    kind text NOT NULL CHECK (kind IN ('FOLLOW_UP', 'CALL', 'EMAIL', 'MEETING', 'DEMO')),
    title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
    description text CHECK (description IS NULL OR char_length(description) <= 5000),
    due_at timestamptz NOT NULL,
    ends_at timestamptz,
    status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','COMPLETED','CANCELLED')),
    completed_at timestamptz,
    completed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT crm_followup_demo_end CHECK (
      (kind = 'DEMO' AND ends_at IS NOT NULL AND ends_at > due_at)
      OR (kind <> 'DEMO' AND (ends_at IS NULL OR ends_at > due_at))
    ),
    CONSTRAINT crm_followup_completion CHECK (
      (status = 'COMPLETED' AND completed_at IS NOT NULL AND completed_by IS NOT NULL)
      OR (status <> 'COMPLETED' AND completed_at IS NULL AND completed_by IS NULL)
    )
);
CREATE INDEX crm_followup_due_idx ON public.crm_followup_tasks(status,due_at,id);
CREATE INDEX crm_followup_lead_idx ON public.crm_followup_tasks(lead_id,due_at DESC);

CREATE TABLE public.crm_followup_task_events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_id uuid NOT NULL REFERENCES public.crm_followup_tasks(id) ON DELETE RESTRICT,
    actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    old_status text,
    new_status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX crm_followup_events_task_idx ON public.crm_followup_task_events(task_id,created_at);

ALTER TABLE public.crm_followup_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_followup_task_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_followup_tasks FROM PUBLIC,anon,authenticated;
REVOKE ALL ON public.crm_followup_task_events FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.crm_followup_tasks TO authenticated;
GRANT SELECT ON public.crm_followup_task_events TO authenticated;
GRANT ALL ON public.crm_followup_tasks TO service_role;
GRANT ALL ON public.crm_followup_task_events TO service_role;
CREATE POLICY crm_followup_tasks_admin_read ON public.crm_followup_tasks
    FOR SELECT TO authenticated USING (public.is_lead_admin());
CREATE POLICY crm_followup_events_admin_read ON public.crm_followup_task_events
    FOR SELECT TO authenticated USING (public.is_lead_admin());

CREATE FUNCTION public.create_crm_followup_task(
    p_lead_id uuid, p_kind text, p_title text, p_description text,
    p_due_at timestamptz, p_ends_at timestamptz, p_assigned_admin uuid
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $fn$
DECLARE v_id uuid; v_actor uuid := auth.uid();
BEGIN
    IF v_actor IS NULL OR NOT public.is_lead_admin() THEN
        RAISE EXCEPTION 'Admin access required' USING ERRCODE='42501';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.lead_management WHERE lead_id=p_lead_id) THEN
        RAISE EXCEPTION 'Lead not found' USING ERRCODE='P0002';
    END IF;
    IF p_assigned_admin IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id=p_assigned_admin AND role='admin'
    ) THEN RAISE EXCEPTION 'Invalid assignee' USING ERRCODE='22023'; END IF;
    IF p_kind IS NULL OR p_kind NOT IN ('FOLLOW_UP','CALL','EMAIL','MEETING','DEMO')
      OR p_title IS NULL OR char_length(btrim(p_title)) NOT BETWEEN 1 AND 200
      OR (p_description IS NOT NULL AND char_length(p_description)>5000)
      OR p_due_at IS NULL
      OR (p_kind='DEMO' AND (p_ends_at IS NULL OR p_ends_at<=p_due_at))
      OR (p_ends_at IS NOT NULL AND p_ends_at<=p_due_at)
    THEN RAISE EXCEPTION 'Invalid task details' USING ERRCODE='22023'; END IF;
    INSERT INTO public.crm_followup_tasks
      (lead_id,created_by,assigned_admin,kind,title,description,due_at,ends_at)
    VALUES (p_lead_id,v_actor,COALESCE(p_assigned_admin,v_actor),p_kind,btrim(p_title),
      NULLIF(btrim(p_description),''),p_due_at,p_ends_at)
    RETURNING id INTO v_id;
    INSERT INTO public.crm_followup_task_events(task_id,actor_id,old_status,new_status)
      VALUES(v_id,v_actor,NULL,'OPEN');
    RETURN v_id;
END;
$fn$;

CREATE FUNCTION public.change_crm_followup_status(p_task_id uuid,p_status text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $fn$
DECLARE v_old text; v_actor uuid := auth.uid();
BEGIN
    IF v_actor IS NULL OR NOT public.is_lead_admin() THEN
        RAISE EXCEPTION 'Admin access required' USING ERRCODE='42501';
    END IF;
    IF p_status IS NULL OR p_status NOT IN ('COMPLETED','CANCELLED') THEN
        RAISE EXCEPTION 'Invalid status' USING ERRCODE='22023';
    END IF;
    SELECT status INTO v_old FROM public.crm_followup_tasks WHERE id=p_task_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Task not found' USING ERRCODE='P0002'; END IF;
    IF v_old <> 'OPEN' THEN
        RAISE EXCEPTION 'Task already closed' USING ERRCODE='22023';
    END IF;
    UPDATE public.crm_followup_tasks SET status=p_status,
      completed_at=CASE WHEN p_status='COMPLETED' THEN now() ELSE NULL END,
      completed_by=CASE WHEN p_status='COMPLETED' THEN v_actor ELSE NULL END,
      updated_at=clock_timestamp() WHERE id=p_task_id;
    INSERT INTO public.crm_followup_task_events(task_id,actor_id,old_status,new_status)
      VALUES(p_task_id,v_actor,v_old,p_status);
END;
$fn$;

REVOKE ALL ON FUNCTION public.create_crm_followup_task(uuid,text,text,text,timestamptz,timestamptz,uuid)
    FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.create_crm_followup_task(uuid,text,text,text,timestamptz,timestamptz,uuid)
    TO authenticated;
REVOKE ALL ON FUNCTION public.change_crm_followup_status(uuid,text)
    FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.change_crm_followup_status(uuid,text)
    TO authenticated;
COMMIT;
