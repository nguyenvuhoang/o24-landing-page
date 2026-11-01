# O24 Enterprise Leads Dashboard — Step 24

Implemented in the existing Next.js application. No commits, pushes, production schema changes, admin creation or outbound test emails were performed.

## Routes and behavior

- `/dashboard/login`: Supabase password login for accounts provisioned by an administrator; no signup link or signup action.
- `/dashboard`: real 30-calendar-day UTC submission cohort, six KPIs, daily/seven-day trends, status distribution, recent requests and email issue monitoring.
- `/dashboard/leads`: server-side search across name/email/company, status/interest/deployment/date filters, stable submission-date sorting and 25-row pages.
- `/dashboard/leads/[id]`: immutable original submission, assignment, pipeline status, contact timestamp, demo scheduling, append-only internal notes, change history and existing email events. History and email events have independent 25-row pages.
- `GET /api/dashboard/leads`: same filters and pagination, with admin authorization.
- `PATCH /api/dashboard/leads/[id]`: same-origin JSON changes; requires the current `expectedUpdatedAt` version. Stale writes return 409.
- Existing dashboard URLs moved into the `(admin)` route group; their URLs are unchanged. **W4S pages now also require an authenticated admin**, replacing the former public dashboard exception.

Pipeline: NEW → CONTACTED → QUALIFIED → DEMO_SCHEDULED → WON. LOST is available at every stage. Terminal leads cannot be reopened through this version. Scheduling requires a demo timestamp. Notes and original request records are never overwritten through the dashboard.

The submission cohort runs from UTC midnight 29 days before today, inclusive, to tomorrow at UTC midnight, exclusive. Status KPIs describe the current status of those submissions, not transitions during the period. Weekly charts use seven-day buckets from the cohort start and label the partial final bucket. Delivery rate is delivered / all non-pending known notification states: accepted, sent, delivered, delivery_delayed, bounced, complained, failed. An empty denominator displays an em dash. Pending is excluded. Failures/delays monitoring uses the same submission cohort. Nothing resends mail.

## Required environment variables

No new secret is needed. Keep all existing Step 23 values:

| Variable | Purpose | Browser exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Existing Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Existing anon/publishable client key | Public; access constrained by RLS |
| `SUPABASE_SECRET_KEY` **or** `SUPABASE_SERVICE_ROLE_KEY` | Existing demo persistence and webhook RPC | Server only |
| `RESEND_API_KEY` | Existing notification sending | Server only |
| `SMTP_FROM` | Verified notification sender | Server only |
| `DEMO_NOTIFICATION_EMAIL` | Existing recipient; defaults to support@vknight.io.vn | Server only |
| `RESEND_WEBHOOK_SECRET` | Existing Svix signature verification | Server only |

Use HTTPS in production. Supabase SSR cookies use `getAll`/`setAll`, SameSite=Lax and Secure in production. Server authorization verifies `auth.getUser()` and database membership; it never trusts user-editable metadata. Browser access uses only the public key. The administrative demo client and SSR server client have `server-only` import guards.

## Supabase preflight and migration

1. Run `supabase/preflight/enterprise_leads.sql` in the SQL Editor and review the results. This is read-only and includes existing constraints, status counts, policies, grants and the actual `record_demo_email_event` definition. Check Postgres 15+ (required for security-invoker views).
2. The connected project's field names were inspected read-only. `demo_requests` has `id`, `name`, `email`, `company`, `role`, `interest`, `deployment`, `message`, `timeline`, `open_source`, `email_status`, `resend_email_id`, `email_status_at`, `submitted_at`. `demo_email_events` has `event_id`, `resend_email_id`, `event_type`, `received_at`. Existing production constraints and RPC source were not available from repository migrations; the preflight supplies those checks before deployment.
3. Apply `supabase/migrations/202611010001_enterprise_leads.sql` through your normal Supabase migration deployment or SQL Editor, once. It is transactional, backfills NEW management rows for existing requests, and adds an insert trigger for future submissions. It does not rewrite original requests, email statuses, constraints or webhook event mappings.
4. The migration adds `admin_users`, `lead_management`, `lead_history`, an RLS-aware `enterprise_leads` view and guarded metrics/update RPCs. Authenticated users have SELECT only; all lead mutations go through the audited RPC. Anonymous table privileges are removed. Restrictive policies constrain legacy permissive read policies. Service-role demo persistence and webhook access remain available.
5. The existing email RPC body stays intact, but execution is restricted to `service_role` for every overload named `public.record_demo_email_event`. Anonymous and authenticated users cannot forge webhook updates directly through that RPC.
6. Keep the existing Resend webhook destination and signing secret. No Resend configuration change is required.

Migration does not bootstrap an administrator and does not require public signup to be enabled. It is a forward migration intended to be tracked once by Supabase, not an idempotent seed script. Backfill/index creation can hold locks, so use your normal migration window for a large production table.

## Admin bootstrap

1. In Supabase Authentication → Users, provision the intended admin account using your normal invite/password process. Disable public email signup if it is not needed by other site users; dashboard authorization never grants admin membership from signup or OAuth alone.
2. After checking the user's ID/email, run SQL with your own values:

```sql
insert into public.admin_users(user_id, display_name, role)
select id, 'Sales administrator', 'admin'
from auth.users
where lower(email) = lower('YOUR_ADMIN_EMAIL')
on conflict (user_id) do update set display_name = excluded.display_name;
```

3. Confirm exactly the intended user is present in `admin_users`, then sign in at `/dashboard/login`. Add further admins only through trusted SQL/server administration. There is no client-side role management API.
4. To revoke access, delete their row from `admin_users`. Subsequent page/API/database authorization denies access even if the Auth session remains valid. Existing history retains actor identity/name; assignment is set to null if the admin membership is removed.

## Verification

- `pnpm install --frozen-lockfile`: passes. New dependencies are `server-only` (runtime) and `tsx`/`@electric-sql/pglite` (development only). `esbuild` install scripts are explicitly disabled in the existing pnpm build allowlist; the optional platform executable runs the test harness successfully.
- `pnpm exec tsc --noEmit`: passes.
- `pnpm build`: passes.
- `pnpm test`: 12 tests pass. Coverage includes real Supabase SDK query emission, signed Svix webhook handling and a local PostgreSQL-compatible PGlite migration/RLS/RPC integration test. Network dependencies use disposable test responses; no live email is sent.
- Targeted ESLint on all new and directly edited feature code: passes.
- `pnpm lint`: **fails on 26 pre-existing errors and 38 warnings**. Every error-bearing file was compared with HEAD (mapping moved dashboard files to their old paths); its contents are unchanged. Existing failures include explicit `any`, React effects that update state, unescaped entities and empty interfaces. These unrelated issues were not suppressed or changed.
- Local production login was reviewed in the browser. Authenticated production UI and real post-migration Supabase operations require the manual checks below; no production administrator was created for testing.

The database test covers anon access, non-admin access despite a legacy permissive policy, admin reads, immutable submissions/history, valid pipeline transitions through scheduling/WON/LOST, mandatory demo dates, invalid status/fields, assignment/contact notes, concurrent-edit rejection, metrics, preserved email RPC definition, service-role insertion, notification updates, management initialization and role revocation.

## Manual staging/deployment checks

- Apply the migration in staging and verify the preflight's email constraints/event mappings against the existing Step 23 source.
- Confirm unauthenticated dashboard URLs redirect to login, ordinary authenticated accounts receive 403, and only bootstrapped admins can access pages or APIs. Repeat at a nested route and W4S.
- Submit one staging demo through `/demo`; verify its unchanged original data, NEW management row, internal Resend acceptance and delivered callback. Retry a signed callback to confirm the **existing** RPC's idempotence and ordering behavior. Those internals were intentionally preserved, not reimplemented.
- As admin, filter/page leads, add a note, assign, record contact, schedule a demo and advance or mark LOST. Open two tabs and confirm a stale save is rejected.
- Verify overview counts against SQL for the displayed UTC cohort and check delivered/non-pending denominator, including no-data/pending-only cases.
- Verify detail/event pagination, mobile/tablet layouts and keyboard navigation with real staging data. The table scrolls horizontally on small screens.

## Focused security review

The new leads surface enforces identity and explicit role membership in the proxy, server data access, each API request and the database. Role membership is not editable by authenticated clients. Reads use the user's session/RLS rather than the service role. Mutations allow only management fields, use a row lock/version check, and insert their audit history in the same transaction. API responses are private/no-store; mutation bodies have a real streamed size limit and an exact-origin check. React escapes request/note content. Notes cannot inject HTML. No automated email retries were added.

No unresolved authorization bypass was identified in the new surface during focused source review and regression checks. This is not a full application penetration test. Deployment-specific grants/RPC internals and real account flows still need the staging checks above.

Existing separate `/api/reports` endpoints retain their legacy shared-access-key authentication and service-role client. They are outside the new `/api/dashboard` API namespace and do not query leads, but should receive a separate authentication hardening pass if the reporting system is exposed. Existing dashboard users/profile/W4S client pages are otherwise unchanged inside the new protected group.

For SSR integration reference, see the official Supabase guide: https://supabase.com/docs/guides/auth/server-side/creating-a-client

## Changed files

See `docs/enterprise-leads-changed-files.md` for the complete file manifest, including dashboard route moves.
