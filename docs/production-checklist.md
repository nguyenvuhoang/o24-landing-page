# O24 Step 29.4 — Production acceptance checklist

## 1. Navigation & conversion
- [ ] Homepage → `/features` → `/solutions` → `/solutions/enterprise` → `/demo`
- [ ] `/security` → `/enterprise/security-review` → `/demo`
- [ ] `/enterprise` → `/enterprise/deployment` → `/enterprise/security-review`
- [ ] Deep links load directly (not just client-side navigation)
- [ ] CTA click tracking is distinguishable from successfully submitted DemoForm / EnterpriseForm leads
- [ ] Submit one authorized test lead on staging and confirm storage + notification exactly once
- [ ] Do not put contact details, access tokens or sensitive form content in analytics events

## 2. Security / commercial claims (owner approval required)
- [ ] All uptime, SLA, response-time and support statements reflect signed terms
- [ ] Encryption versions, identity controls and compliance claims have technical evidence
- [ ] Deployment choices are expressed as evaluated options, not a blanket guarantee
- [ ] Security review checklist is clearly advisory and not a compliance certificate
- [ ] Illustrative diagrams and examples are labeled, with no real customer data
- [ ] Public security contact inbox is owned and monitored

## 3. SEO / accessibility
- [ ] View `/sitemap.xml`: all 29.x routes listed, no 404 URLs
- [ ] View `/robots.txt`: public routes indexed; private areas excluded
- [ ] Canonical and Open Graph tags use correct domain and per-page URLs
- [ ] OG images and favicon load (200, correct aspect ratio)
- [ ] One H1 per route, meaningful headings and accessible link labels
- [ ] Keyboard navigation, visible focus, accordions and interactive selectors work
- [ ] No horizontal overflow at 375px and 768px
- [ ] Dark/light theme has sufficient contrast

## 4. Performance / operations
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm exec eslint ...` passes
- [ ] `pnpm test` passes or failures are separately triaged
- [ ] `pnpm build` passes
- [ ] Run Lighthouse in clean Incognito/CI on deployed Preview, then Production
- [ ] Capture performance, accessibility, best practices, SEO and CWV separately
- [ ] Test lead workflow, Resend delivery, rate limiting, abuse protection and error messages
- [ ] Confirm environment variables and secret exposure are correct on Vercel
- [ ] Check site logs for 404, 500 and unexpected client errors after deployment

## Release decision
Only mark production-ready after real build, staging functional checks, explicit claim approval and recorded Lighthouse results. This checklist itself is not a certification.
