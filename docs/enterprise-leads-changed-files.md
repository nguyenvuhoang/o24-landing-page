# Step 24 changed files

## Modified / replaced

- `next.config.ts`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/demo/DemoForm.tsx`
- `src/components/chat/ChatBox.tsx`
- `src/lib/demo-admin.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/proxy.ts`

## Added

- `docs/enterprise-leads-changed-files.md`
- `docs/enterprise-leads-dashboard.md`
- `docs/enterprise-leads-plan.md`
- `src/app/api/dashboard/leads/[id]/route.ts`
- `src/app/api/dashboard/leads/route.ts`
- `src/app/dashboard/(admin)/error.tsx`
- `src/app/dashboard/(admin)/layout.tsx`
- `src/app/dashboard/(admin)/leads/[id]/page.tsx`
- `src/app/dashboard/(admin)/leads/page.tsx`
- `src/app/dashboard/(admin)/loading.tsx`
- `src/app/dashboard/(admin)/page.tsx`
- `src/app/dashboard/login/actions.ts`
- `src/app/dashboard/login/page.tsx`
- `src/app/forbidden.tsx`
- `src/components/dashboard/LeadEditor.tsx`
- `src/components/dashboard/LeadTable.tsx`
- `src/components/dashboard/SignInButton.tsx`
- `src/lib/leads/api.ts`
- `src/lib/leads/auth.ts`
- `src/lib/leads/data.ts`
- `src/lib/leads/domain.ts`
- `supabase/migrations/202611010001_enterprise_leads.sql`
- `supabase/preflight/enterprise_leads.sql`
- `tests/access.test.ts`
- `tests/database.test.ts`
- `tests/http.test.ts`
- `tests/leads.test.ts`

## Moved into the protected admin group (URLs unchanged, contents unchanged)

- `src/app/dashboard/billing/page.tsx` → `src/app/dashboard/(admin)/billing/page.tsx`
- `src/app/dashboard/credentials/page.tsx` → `src/app/dashboard/(admin)/credentials/page.tsx`
- `src/app/dashboard/profile/page.tsx` → `src/app/dashboard/(admin)/profile/page.tsx`
- `src/app/dashboard/security/page.tsx` → `src/app/dashboard/(admin)/security/page.tsx`
- `src/app/dashboard/settings/page.tsx` → `src/app/dashboard/(admin)/settings/page.tsx`
- `src/app/dashboard/support/page.tsx` → `src/app/dashboard/(admin)/support/page.tsx`
- `src/app/dashboard/users/page.tsx` → `src/app/dashboard/(admin)/users/page.tsx`
- `src/app/dashboard/w4s/delivery/page.tsx` → `src/app/dashboard/(admin)/w4s/delivery/page.tsx`
- `src/app/dashboard/w4s/page.tsx` → `src/app/dashboard/(admin)/w4s/page.tsx`
- `src/app/dashboard/workflows/page.tsx` → `src/app/dashboard/(admin)/workflows/page.tsx`

The old `src/app/dashboard/page.tsx` mock overview is replaced by `src/app/dashboard/(admin)/page.tsx`. No Step 23 API or webhook source was changed.
