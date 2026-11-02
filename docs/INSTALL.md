# Step 25.3 — CRM Conversion Analytics

## Add files

Copy the two source files into the repository, retaining their paths:

- `supabase/migrations/202611010006_crm_conversion_analytics.sql`
- `src/app/dashboard/(admin)/analytics/page.tsx`

## Navigation edit (one existing file)

In `src/components/dashboard/DashboardNav.tsx` add `ChartNoAxesCombined` to the `lucide-react` imports, and insert below the Follow-ups entry in the navigation array:

```tsx
{
  href: "/dashboard/analytics",
  label: "Conversion analytics",
  icon: ChartNoAxesCombined,
},
```

The current breadcrumb implementation automatically derives `Analytics` from the route.

## Database migration

Apply migration 006 to staging, test, then Production; don't re-run migrations 001–005.

The RPC uses `SECURITY INVOKER`, `is_lead_admin()` and existing RLS; it grants EXECUTE only to `authenticated` (which still needs admin membership).

Check (read-only):

```sql
SELECT
  to_regprocedure('public.crm_conversion_metrics(timestamptz,timestamptz)') AS rpc,
  has_function_privilege('anon', 'public.crm_conversion_metrics(timestamptz,timestamptz)', 'EXECUTE') AS anon_execute,
  has_function_privilege('authenticated', 'public.crm_conversion_metrics(timestamptz,timestamptz)', 'EXECUTE') AS authenticated_execute;
```

## Verify

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint "src/app/dashboard/(admin)/analytics/page.tsx" "src/components/dashboard/DashboardNav.tsx"
pnpm test
pnpm build
```

Open `/dashboard/analytics` as administrator. Confirm 30/90/180/365 day ranges, KPIs and charts match Supabase. Verify non-admin forbidden and unauthenticated login redirect. Check an empty cohort shows no divisions by zero.

## Metric semantics

- Submission cohort: `[start UTC, end UTC)`; status metrics are current state, not event transitions.
- Win rate: WON / (WON + LOST), null if no closed leads.
- Lead-to-won rate: WON / all submitted leads in cohort.
- Qualification rate: (QUALIFIED + DEMO_SCHEDULED + WON) / total. A LOST lead that was previously qualified isn't counted, because its current status is LOST.
- Average time to WON/LOST uses first matching audited status change timestamp. If audit is missing, exclude from average.
- Recorded contact lag uses `last_contacted_at - submitted_at`; it is NOT first response time. Treat as proxy only.
- Demo tasks and overdue tasks are associated with cohort leads, irrespective of when the task was scheduled or created.
- No Revenue/ROI or stage-to-stage historical funnel metrics without additional structured event data.

This feature is read-only; no schema changes to existing tables and no new auth secrets.
