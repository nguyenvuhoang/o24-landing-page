# Step 25.2 integration

1. Copy `supabase/migrations/202611010005_crm_followup_tasks.sql` to the matching repo path. Run on staging first and perform an RLS/security smoke test, then migrate Production once. Do not rerun 001-004.
2. Copy the three Next.js files (two API routes and FollowUpWorkspace, plus the page) to their exact paths.
3. In `src/components/dashboard/DashboardNav.tsx`, add `CalendarClock` to the lucide-react import and add item `{ href: "/dashboard/follow-ups", label: "Follow-ups", icon: CalendarClock }` to the navigation array.
4. In `src/components/dashboard/LeadDetailView.tsx`, add `import { FollowUpWorkspace } from "./FollowUpWorkspace";` and add `<FollowUpWorkspace initialLeadId={l.id} />` after `<LeadPipeline status={l.lead_status} />` or inside the detail grid as preferred.
5. Run `pnpm exec tsc --noEmit`, `pnpm exec eslint` on changed TSX/TS files, `pnpm test`, `pnpm build`.
6. Verify admin creates FOLLOW_UP and DEMO (end required), sees Upcoming/Overdue/Completed, completes a task, and non-admin receives HTTP 403. No email notifications, automatic reminders, or calendar synchronization in this iteration.

## Database check
```sql
select to_regclass('public.crm_followup_tasks'), to_regclass('public.crm_followup_task_events');
select has_function_privilege('anon', 'public.create_crm_followup_task(uuid,text,text,text,timestamptz,timestamptz,uuid)', 'EXECUTE');
```
Expected: both tables exist, anon_execute false.

## Limitations
- The global creation form requires an existing lead UUID. Prefer scheduling from a lead detail page.
- Tasks are created as assigned to the acting admin by default. Assignment to another admin is supported by the RPC but intentionally not in the initial form.
- The Follow-up schedule is a list, not a drag-and-drop calendar.
- `next_follow_up_at` from Step 25.1 activities is historical metadata and is NOT automatically migrated into tasks; create a task explicitly to track completion.
- All times displayed in browser local timezone. Server stores UTC timestamps.
- No automatic emails or reminders are sent; tasks are visible only to admins within dashboard.
