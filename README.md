# Step 31.8 — Browser evidence & UI consistency patch

## Verified observations
Connected browser tab at localhost:3000 showed the revised English navigation and footer, but Vietnamese labels for sign-in/theme toggling, and a Vietnamese Terms page with a last-updated 2023 date. The website's public domain could not be fetched by the web reader, and no visual screenshot/viewport simulation was available in this browser connection. No visual/production PASS is claimed.

## Source concerns requiring manual decisions
1. `src/app/privacy/page.tsx`: currently says TLS 1.3, AES-256, MFA, regular penetration testing and specific data processing claims. Confirm technical and legal accuracy; do not publish unsupported assertions.
2. `src/app/terms/page.tsx`: dated 15/10/2023, Vietnamese-only, and contains contractual/legal assertions. Counsel/owner should approve text and effective date; do not auto-rewrite.
3. `src/app/careers/page.tsx`: publishes three supposedly open positions. Confirm with hiring owner, or remove vacancy cards until confirmed. Current Contact page is not a job application workflow.
4. Home/developer/product visual consistency, viewport breakpoints and Lighthouse still require actual screenshots/tests.

## Apply targeted, reversible UI edits
Copy `scripts/step31-8-fix.mjs` into repository `scripts/`, then:

```powershell
node scripts/step31-8-fix.mjs
pnpm exec eslint src/components/layout/Header.tsx src/components/layout/ThemeToggle.tsx src/app/solutions/developers/DevelopersClient.tsx
pnpm exec tsc --noEmit
pnpm build
git diff --check
git diff -- src/components/layout/Header.tsx src/components/layout/ThemeToggle.tsx src/app/solutions/developers/DevelopersClient.tsx
```

The script edits only existing exact source text (Sign in, accessible theme/menu labels, old `/#solutions` link). It creates a `.step31-8.bak` sibling for each modified source file (do not commit backups). Run a second time safely; if your local file differs, a REVIEW line is emitted. Avoid committing until you inspect the diff.

## Browser acceptance matrix
Test at 375, 768 and 1440 px, in light/dark modes, with keyboard-only navigation. Routes: `/`, `/features`, `/solutions`, `/solutions/bank-fintech`, `/solutions/enterprise`, `/developers`, `/security`, `/enterprise/deployment`, `/enterprise/security-review`, `/pricing`, `/about`, `/contact`, `/demo`, `/privacy`, `/terms`, `/careers`.

- Header and Footer: no overflow, active route, open/close mobile menu, skip tab traps, CTA reachable.
- Pricing: no unsupported pricing entitlement claims; buttons land on correct route.
- Contact: no phantom form or false submission; demo CTA is understandable.
- Security/Enterprise: claims grounded; architecture understandable on mobile.
- Privacy/Terms: owner-approved policy and correct effective date.
- Demo: verify validation, pending, error and success with staging backend.
- Inspect console errors, 404 links, focus indicators, title/canonical, images, layout shifts.
- Record actual Lighthouse scores rather than assuming a target was met.
