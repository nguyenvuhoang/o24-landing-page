# Step 30.1 — Conversion Tracking Foundation

## Scope
Aggregate marketing journey events through existing `@vercel/analytics`; no database changes. Does not change DemoForm, EnterpriseForm, API endpoints, CRM, existing `ConversionLink`, or `TrackedLink`.

Events:
- `journey_page_view`: fixed `page`, `stage` properties when arriving at a known marketing route.
- `journey_navigation`: fixed `from`, `to`, `from_stage`, `to_stage` when clicking a link between known marketing routes.

Events represent anonymous aggregate traffic and click intent, not an individual lead's origin. The existing `demo_request_success` event remains the only observed client-side successful demo form signal, and is subject to delivery and analytics sampling/blocking. No PII is sent by the new component.

## Install
1. Unzip at `C:\O24\o24-landing-page` preserving folder structure.
2. Run `node scripts/step30-1-integrate.mjs` (idempotent).
3. Run `pnpm exec eslint src/components/analytics/JourneyAnalytics.tsx src/lib/analytics/journey.ts src/app/layout.tsx`.
4. Run `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build`.
5. Check the source/target pairs in Vercel Analytics, e.g. `features → solutions`, `security → demo`.

## Limitations
- Does not persist visitor session identity or map click events to CRM leads.
- A blocked analytics client or ad blocker may suppress events; do not assume 100% coverage.
- `journey_page_view` is custom instrumentation in addition to Vercel's automatic page views; don't sum them together.
- Only browser navigation through clicked `<a>` links is tracked by `journey_navigation`.
- Check analytics consent/privacy requirements before production roll-out.
- Dashboard, auth, API URLs and other unknown paths intentionally excluded.

## Rollback
Delete `<JourneyAnalytics />` and its import from `src/app/layout.tsx`. No migrations or user data to revert.
