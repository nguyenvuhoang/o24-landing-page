# Enterprise Leads Dashboard implementation plan

Spec: Step 24 user brief. Execute directly in this repository; no commits or production writes.

Architecture: Existing Supabase SSR sessions plus explicit admin_users membership. Authenticated reads use RLS; a guarded transactional RPC updates separate lead_management records and appends immutable lead_history. Original submissions and email RPC remain intact. All dashboard routes, including legacy W4S, require admin authorization; login is the sole public exception.

- [x] Add failing behavioral tests for access decisions, filters, mutation validation, demo submission and signed webhooks.
- [x] Implement additive migration, SSR authorization and protected route group.
- [x] Implement real aggregate overview, paginated leads and audited details.
- [x] Verify typecheck, ESLint, build, tests and inspect security boundaries.
- [x] Document schema preflight, bootstrap, environment and manual deployment checks.

Review focus: revoked roles; direct API requests; unsafe search syntax and date bounds; concurrent edits and immutable original data; delayed/failed email events without automatic resending.

Ruling: Use current working directory (initial git status clean) and do not create commits/worktrees, matching the request to implement directly. No production migration or bootstrap is executed. Step 23 schema inspected read-only via REST; constraints/RPC source require SQL preflight before deployment.

Verification: 12/12 tests, typecheck, targeted ESLint and production build pass. Repository-wide lint retains 26 errors/38 warnings in unchanged existing code. See enterprise-leads-dashboard.md for rollout and review details.
