# IPS Go-Live Readiness Dashboard V1.2 — Final Executive Polish

## Scope
Only replace the presentational component:
`src/components/projects/ips/IPSReadinessDashboard.tsx`

Preserves the Next.js route `/projects/ips`, underlying `src/data/projects/ips-status.ts`, existing UAT state model, print option, and all integrations. No API, database, package installation or migration needed.

## What's changed
- Typography: 15px+ core body copy, improved line height, larger workstream titles and legible helper text.
- Layout: max-width 1480px, wider desktop padding and more breathing room in the header/cards. Mobile stack unchanged.
- Reporting: a dedicated **UAT report priority** section above workstreams, populated from the existing `ipsProject.testTeams` values. Counter and labels update when a report changes to `received`. This is a receipt status, **not** a UAT sign-off.
- The 30 Nov 2026 go-live date remains a target pending Production, migration, UAT acceptance and Go/No-Go approval.

## Install (Windows PowerShell)
1. Extract this ZIP.
2. Copy `src/components/projects/ips/IPSReadinessDashboard.tsx` to the same path in `C:\O24\o24-landing-page` (overwrite V1.1 component only).
3. Run:

```powershell
cd C:\O24\o24-landing-page
pnpm exec eslint src/components/projects/ips/IPSReadinessDashboard.tsx
pnpm exec tsc --noEmit
pnpm build
```

Open `http://localhost:3000/projects/ips` and inspect at 375px, 768px and 1440px. Also test the two tabs, expandable workstream checklists, dark/light modes and Print/PDF.

## Update UAT reports
Update **only** `src/data/projects/ips-status.ts` when approved source information is available. For each team, change `report: "awaiting"` to `report: "received"` and update the team note. Receipt doesn't mean UAT pass; update decision gates only when formally approved.

## Verification
The package is checked for ZIP integrity, TSX syntax using the TypeScript compiler parser, and V1.1 contract import continuity. Full Next.js build and visual verification require your local app environment.
