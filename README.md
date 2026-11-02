# Step 31.11 — Final Production Release Audit

This package is **read-only** by default and does not change any website source code, databases, forms or environment variables. Copy the `scripts` directory into the project root. The optional test may be run with `node --test tests/step31-11-audit.test.mjs` (run from the project root).

## Local checks

```powershell
cd C:\O24\o24-landing-page
node scripts/step31-11-audit.mjs
node scripts/step31-11-audit.mjs --output reports/step31-11.json
pnpm exec tsc --noEmit
pnpm test
pnpm build
pnpm exec eslint .
git diff --check
```

## Optional deployed site HTTP audit

```powershell
node scripts/step31-11-audit.mjs --url https://vknight.io.vn/ --output reports/step31-11-live.json
```

Live audit makes GET requests to a fixed allowlist of **public pages only**. It does not submit forms, authenticate, scrape customer data or inspect connected private resources. Run it only against the domain you control. The website must be available to the machine performing the audit.

## Exit codes

- `0`: no ERROR findings (warnings may still exist)
- `1`: warnings exist with `--strict`
- `2`: ERROR findings exist

`ERROR` and `WARN` describe **indicators found by the audit**, not a verified exploit. Resolve findings and confirm whether they apply to your deployed architecture before release.

## Mandatory manual release gate

1. Desktop 1440px, tablet 768px, mobile 375px: Header, Footer, dropdowns, overflow, light/dark mode, focus states and contrast.
2. Navigate Home → Features → Solutions → Enterprise → Security → Demo, test back/forward, active navigation and keyboard tab order.
3. Confirm `/demo` and `/enterprise` forms with authorized test data on staging; verify both successful delivery and controlled failure states. Do not use live customer records.
4. Confirm Privacy and Terms were reviewed and approved by the owner/legal counsel; confirm Careers listings and recruitment email are valid.
5. Confirm TLS/HTTPS, environment variables, Vercel deployment logs, no credentials committed, configured sender domain and recipient, and secure email delivery. Rate limiting/abuse protection remain separate release decisions.
6. Run Lighthouse on staging/production for Performance, Accessibility, Best Practices and SEO; capture actual results for mobile and desktop. No scores are asserted by this package.
7. Verify indexation/robots/sitemap, OG image, redirects, broken links and 404 handling in production.
8. Record deployment SHA, validation date, reviewer, unresolved issues and explicit GO/NO-GO decision.

## Scope limits

- Source may differ from GitHub main; checks operate on local files in the current working directory.
- Static href scanning only catches literal paths; cannot verify runtime dynamic links.
- HTML GET checks cannot prove that React hydration or interactive forms work.
- This package does not automatically promote/deploy code.
