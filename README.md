# Step 29.1 — Security & Trust Center

## Install
Copy `src/app/security/page.tsx` into the same location in your Next.js project, replacing the old page. No dependencies or database changes required.

## Verification
```powershell
pnpm exec eslint src/app/security/page.tsx
pnpm exec tsc --noEmit
pnpm build
```
Open `/security` and verify dark/light mode, mobile behavior, CTAs and canonical metadata.

## Source-review findings (not automatically fixed)
- The prior `/security` page claimed AES-256, TLS 1.3, industry compliance, regular penetration tests, and 24/7 monitoring without supporting evidence. New content states areas for project-specific review instead of certifying specific controls.
- `/enterprise` remains an older Vietnamese landing page with 99.99% uptime, 24/7 support, <1h response, unlimited traffic, and open-source availability claims. Verify with product/legal owners or revise separately.
- Do not present a security certification or SLA until documented, approved evidence exists.

## Scope
Only `/security` changes. No admin, Supabase, CRM, demo form, developer portal or payment integrations touched.
