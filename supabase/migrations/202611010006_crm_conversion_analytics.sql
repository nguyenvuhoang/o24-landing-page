-- STEP 25.3 - CRM Conversion Analytics
-- Additive analytics RPC; Step 23-25.2 data and APIs remain unchanged.
-- Uses a submission-time cohort [p_start, p_end) and CURRENT lead statuses.
BEGIN;

CREATE FUNCTION public.crm_conversion_metrics(
  p_start timestamptz,
  p_end timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  v_result jsonb;
BEGIN
  IF NOT public.is_lead_admin() THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;
  IF p_start IS NULL OR p_end IS NULL OR p_start >= p_end
     OR p_end - p_start > interval '366 days' THEN
    RAISE EXCEPTION 'Invalid analytics date range' USING ERRCODE = '22023';
  END IF;

  WITH cohort AS MATERIALIZED (
    SELECT r.id, r.submitted_at, m.lead_status, m.last_contacted_at,
           m.demo_scheduled_at
    FROM public.demo_requests r
    JOIN public.lead_management m ON m.lead_id = r.id
    WHERE r.submitted_at >= p_start AND r.submitted_at < p_end
  ),
  transitions AS (
    SELECT c.id,
      min(h.created_at) FILTER (
        WHERE h.changes ? 'lead_status'
          AND h.changes #>> '{lead_status,after}' = 'WON'
      ) AS won_at,
      min(h.created_at) FILTER (
        WHERE h.changes ? 'lead_status'
          AND h.changes #>> '{lead_status,after}' = 'LOST'
      ) AS lost_at
    FROM cohort c
    LEFT JOIN public.lead_history h ON h.lead_id = c.id
    GROUP BY c.id
  ),
  tallies AS (
    SELECT count(*)::integer AS total,
      count(*) FILTER (WHERE lead_status = 'NEW')::integer AS new_count,
      count(*) FILTER (WHERE lead_status = 'CONTACTED')::integer AS contacted,
      count(*) FILTER (WHERE lead_status = 'QUALIFIED')::integer AS qualified,
      count(*) FILTER (WHERE lead_status = 'DEMO_SCHEDULED')::integer AS demo_scheduled,
      count(*) FILTER (WHERE lead_status = 'WON')::integer AS won,
      count(*) FILTER (WHERE lead_status = 'LOST')::integer AS lost,
      count(*) FILTER (WHERE lead_status IN ('WON','LOST'))::integer AS closed,
      count(*) FILTER (WHERE lead_status <> 'NEW')::integer AS progressed,
      round((avg(extract(epoch FROM (last_contacted_at - submitted_at)) / 3600)
        FILTER (WHERE last_contacted_at >= submitted_at))::numeric, 1) AS avg_first_contact_hours
    FROM cohort
  ),
  closing AS (
    SELECT round((avg(extract(epoch FROM (t.won_at - c.submitted_at)) / 86400)
      FILTER (WHERE c.lead_status = 'WON' AND t.won_at >= c.submitted_at))::numeric,1)
        AS avg_won_days,
      round((avg(extract(epoch FROM (t.lost_at - c.submitted_at)) / 86400)
      FILTER (WHERE c.lead_status = 'LOST' AND t.lost_at >= c.submitted_at))::numeric,1)
        AS avg_lost_days
    FROM cohort c JOIN transitions t USING(id)
  ),
  task_metrics AS (
    SELECT count(*) FILTER (WHERE t.kind = 'DEMO')::integer AS demo_tasks,
      count(*) FILTER (WHERE t.kind = 'DEMO' AND t.status = 'COMPLETED')::integer
        AS completed_demos,
      count(*) FILTER (WHERE t.status = 'OPEN' AND t.due_at < now())::integer
        AS overdue_tasks,
      count(*) FILTER (WHERE t.status = 'OPEN' AND t.due_at >= now())::integer
        AS upcoming_tasks
    FROM public.crm_followup_tasks t
    JOIN cohort c ON c.id = t.lead_id
  ),
  days AS (
    SELECT generate_series(
      (p_start AT TIME ZONE 'UTC')::date,
      ((p_end - interval '1 microsecond') AT TIME ZONE 'UTC')::date,
      interval '1 day'
    )::date AS day
  ),
  daily AS (
    SELECT d.day,
      count(c.id)::integer AS total,
      count(c.id) FILTER (WHERE c.lead_status = 'WON')::integer AS won,
      count(c.id) FILTER (WHERE c.lead_status = 'LOST')::integer AS lost
    FROM days d
    LEFT JOIN cohort c ON (c.submitted_at AT TIME ZONE 'UTC')::date = d.day
    GROUP BY d.day
  )
  SELECT jsonb_build_object(
    'total', a.total, 'statuses', jsonb_build_object(
      'NEW', a.new_count, 'CONTACTED', a.contacted,
      'QUALIFIED', a.qualified, 'DEMO_SCHEDULED', a.demo_scheduled,
      'WON', a.won, 'LOST', a.lost
    ),
    'won', a.won, 'lost', a.lost, 'closed', a.closed,
    'progressed', a.progressed,
    'win_rate_percent', CASE WHEN a.closed > 0
      THEN round(a.won::numeric * 100 / a.closed, 1) END,
    'lead_to_won_percent', CASE WHEN a.total > 0
      THEN round(a.won::numeric * 100 / a.total, 1) END,
    'qualification_percent', CASE WHEN a.total > 0
      THEN round((a.qualified + a.demo_scheduled + a.won)::numeric * 100 / a.total, 1) END,
    'avg_first_contact_hours', a.avg_first_contact_hours,
    'avg_won_days', b.avg_won_days, 'avg_lost_days', b.avg_lost_days,
    'demo_tasks', t.demo_tasks, 'completed_demos', t.completed_demos,
    'overdue_tasks', t.overdue_tasks, 'upcoming_tasks', t.upcoming_tasks,
    'daily', coalesce((SELECT jsonb_agg(jsonb_build_object(
      'date', day, 'total', total, 'won', won, 'lost', lost) ORDER BY day)
      FROM daily), '[]'::jsonb)
  ) INTO v_result
  FROM tallies a CROSS JOIN closing b CROSS JOIN task_metrics t;
  RETURN v_result;
END;
$function$;

REVOKE ALL ON FUNCTION public.crm_conversion_metrics(timestamptz,timestamptz)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_conversion_metrics(timestamptz,timestamptz)
  TO authenticated;
COMMIT;
