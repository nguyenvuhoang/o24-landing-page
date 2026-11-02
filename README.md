# O24 Step 31 — Final Public Website Refinement (31.1–31.7)

Built for the existing Next.js 16 + React 19 + Tailwind project. **No admin dashboard, Supabase, leads tables, API routes or existing form handlers are changed.**

## Scope

| Step | Implementation | How to verify |
|---|---|---|
| 31.1 Global navigation / footer | English primary navigation; useful 4-column footer, removes placeholder social links, adds Security, Deployment, FAQ, Developer routes | Desktop/mobile menu and Footer |
| 31.2 Pricing | Rebuilt `/pricing` with existing `src/data/pricing.ts` (no invented prices), compact FAQs and CTAs | Starter, Business, Enterprise paths |
| 31.3 About | English `/about`, engineering focus, avoids invented client logos/team credentials | SEO + mobile |
| 31.4 Contact / Demo | `/contact` now links directly to actual `/demo`, `/enterprise`, Security Review and support email; removes misleading inputs with non-submitting Zalo button. **Existing DemoForm and EnterpriseForm retained.** | Submit real test request in staging |
| 31.5 Mobile / UI | Responsive grids and min-height CTAs in changed pages; remaining site requires browser visual review | 375, 768, 1440 px + dark mode |
| 31.6 SEO / Performance | Canonical metadata + OpenGraph on changed pages; read-only audit tool; sitemap route checks | Lighthouse + `/sitemap.xml` + `/robots.txt` |
| 31.7 Production readiness | Audit script, link inventory, verification checklist and recommended release commands | Build, smoke test, deploy |

## Install safely

1. Back up your current work / branch: `git status` then `git switch -c feature/step31-public-site` (only if appropriate to your working tree).
2. Copy the **contents** of `step31/` into the repository root, preserving paths.
3. Review diff before commit. This package **replaces** `src/components/layout/Footer.tsx`, `src/data/navigation.ts`, `src/app/pricing/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`.
4. Does **not** replace Header, DemoForm, EnterpriseForm, Admin, CTA analytics or any other prior Step component.

```powershell
cd C:\O24\o24-landing-page
pnpm exec eslint src/components/layout/Footer.tsx src/data/navigation.ts src/app/pricing/page.tsx src/app/about/page.tsx src/app/contact/page.tsx
pnpm exec tsc --noEmit
pnpm test
pnpm build
node scripts/step31-audit.mjs
node scripts/step31-site-links.mjs

git diff --check
git diff --stat
```

## Manual checks before marking Production PASS

- Desktop + mobile navigation (375/768/1440) and overlay closure; pay particular attention to header width at `md` (six links may wrap on smaller tablets).
- Light/dark mode on about, pricing, contact, security, banking, enterprise, developers, plus real mobile Safari.
- Browser paths: `/`, `/features`, `/solutions`, `/solutions/bank-fintech`, `/solutions/enterprise`, `/developers`, `/security`, `/enterprise/deployment`, `/enterprise/security-review`, `/pricing`, `/about`, `/contact`, `/demo`.
- Successful real *staging* demo and enterprise submissions (check lead storage, email notification, error and loading states); do **not** submit sensitive production customer data.
- Browser Lighthouse in clean/incognito Chrome, mobile + desktop: collect actual Performance, Accessibility, Best Practices and SEO scores (do not assume thresholds).
- Validate social preview image `/images/og-image.png`, robots/sitemap and canonical tags on deployed domain.
- Review company contact email and all public legal/commercial statements with website owner.
- Audit script is deliberately conservative; flags missing routes, but is not a crawler and does not prove successful browser navigation.

## Known boundaries

- Source observed in default GitHub branch may be older than local uncommitted changes. Back up and inspect diffs.
- Existing main header has a `md` desktop breakpoint; testing at 768–1024 px is necessary; package intentionally does not overwrite its Supabase authentication/session flow.
- `/contact` intentionally does **not** present fake form inputs: it directs the visitor to real forms already backed by APIs.
- No external social links are shown unless an authentic destination is known.
- Do not treat sample snippets, deployment modes, pricing plan names or capabilities as contractual promises.
