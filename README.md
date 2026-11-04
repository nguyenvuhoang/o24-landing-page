# IPS Dashboard V1.1 — Executive UI Refinement

## Install (safe, no database)

1. Extract this ZIP. Copy **only** `src/components/projects/ips/IPSReadinessDashboard.tsx` into your Next.js project at `C:\O24\o24-landing-page`, replacing the V1 component. The current `src/data/projects/ips-status.ts` and route `src/app/projects/ips/page.tsx` are preserved.
2. Run:

```powershell
pnpm exec eslint src/components/projects/ips/IPSReadinessDashboard.tsx
pnpm exec tsc --noEmit
pnpm build
```

3. Open `http://localhost:3000/projects/ips` and test both **Tổng quan** and **Go-Live checklist** views at mobile and desktop widths.

## Changes

- Main layout widened to `max-w-[1360px]`, larger KPI and reading text.
- Executive banner clearly states Go-Live is not yet approved.
- Dedicated two-column UAT team reporting, each with report state, next action, and note.
- Milestones in four responsive cards.
- More explicit Go/No-Go status, and fix for TS2367 workstream comparison.
- Go-live date is drawn from `ipsProject.targetGoLiveLabel` instead of hard-coded hero content.
- Existing UI behaviors, route, data schema, and forms remain intact.

## Updating UAT

Modify your **existing** `src/data/projects/ips-status.ts` testTeams list. Change `report` from `awaiting` to `received` only when the formal UAT report has actually arrived. Update the corresponding note. Receiving a report does not mean UAT has passed or is signed off.

The included `ips-status.example.ts` is a **reference only**, not meant to overwrite your live project state.

## Safety & scope

No new dependencies, API, database, authentication, migration or analytics. This dashboard is public; never include credentials, customer records, server IPs, or confidential defects in its notes. All screenshots and reviews should use the actual deployed app for signoff.
