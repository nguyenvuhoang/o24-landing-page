# Step 25.4 — Sales Conversion Funnel & Export Reports

## Prerequisites
- Steps 23–25.3 and migration 006 already applied.
- Administrator authenticated through existing `/dashboard` session.

## Install
1. Copy the directory structure into `C:\O24\o24-landing-page` (merge; do not delete existing files).
2. Apply `supabase/migrations/202611020007_crm_conversion_funnel.sql` in **staging first**.
3. `/dashboard/analytics/funnel?days=30` is the new funnel screen. Link it from Analytics page as below.
4. Optionally add a "Sales funnel" item in DashboardNav, or keep it nested under Conversion Analytics.

## Add link to Analytics page
In `src/app/dashboard/(admin)/analytics/page.tsx` add this inside the top `<header>` or just before KPI cards:

```tsx
<Link className="crm-button crm-button-secondary" href={`/dashboard/analytics/funnel?days=${days}`}>
  View sales funnel and export reports →
</Link>
```

## Verify
```powershell
pnpm exec eslint "src/app/dashboard/(admin)/analytics/funnel/page.tsx" "src/app/api/dashboard/analytics/export/route.ts" "src/lib/leads/analytics-range.ts"
pnpm exec tsc --noEmit
pnpm test
pnpm build
```

The endpoint `/api/dashboard/analytics/export?days=30&report=funnel` returns CSV. Other report types: `summary`, `daily`. Supported days: 30/90/180/365.

## SQL smoke tests
```sql
select to_regprocedure('public.crm_conversion_funnel(timestamptz,timestamptz)') as rpc;
select has_function_privilege('anon','public.crm_conversion_funnel(timestamptz,timestamptz)','EXECUTE') as anon_execute;
select has_function_privilege('authenticated','public.crm_conversion_funnel(timestamptz,timestamptz)','EXECUTE') as authenticated_execute;
```
Expected: exists, false, true. The RPC **must be invoked in a signed-in admin session**, not SQL editor as superuser, for real RLS test.

## Semantics
- Includes leads submitted in the selected UTC cohort.
- Current WON/LOST is still displayed by existing Step 25.3 analytics.
- Funnel is *ever reached* based on max historical audited non-LOST status and current status. Because the workflow enforces sequential transitions, reaching a later stage implies earlier ones.
- LOST is a terminal outcome, not a funnel progression step. LOST leads with missing historical changes may have undercounted earlier stages.
- Scheduling a DEMO task does NOT automatically update lead status.
- Export contains aggregated data only (no customer PII), server-side authenticated/admin-only.

## Security smoke tests
- Logged out GET CSV -> HTTP 401.
- Authenticated non-admin GET CSV -> HTTP 403.
- Admin GET CSV -> HTTP 200 with content-type text/csv and attachment.
- `days=9999`, unsupported report -> HTTP 400.
- Never cache/export to public CDN; headers force private/no-store.
