# IPS Go-Live Readiness Dashboard — v1

Public reporting page for vKnight O24 Landing Page (Next.js App Router).

## Install

Copy the **contents** of this ZIP folder (`ips-golive-v1/`) to the root of `C:\O24\o24-landing-page`, preserving relative paths. This package only adds files; it does not overwrite Header, Footer, DemoForm, CRM or existing routes.

```powershell
cd C:\O24\o24-landing-page
node scripts/ips-public-status-audit.mjs
pnpm exec eslint src/app/projects/ips/page.tsx src/components/projects/ips/IPSReadinessDashboard.tsx src/data/projects/ips-status.ts
pnpm exec tsc --noEmit
pnpm test
pnpm build
pnpm dev
```

Open: `http://localhost:3000/projects/ips`.

After deployment: `https://vknight.io.vn/projects/ips`.

## How to update the report

Edit **only** `src/data/projects/ips-status.ts` for everyday updates:

- `updatedAt`: last reviewed date (`YYYY-MM-DD`).
- `phase`, `overview`: the current verified phase and executive summary.
- `workstreams`: each task's status (`in_progress`, `awaiting`, `not_complete`, `complete`), owner and next action.
- `testTeams`: change `report` to `received` **only after the actual report arrives**; update `note`. The UI will show "Đã nhận" and update the aggregate count.
- `decisionGates`: change `status` to `ready`, `pending`, or `blocked` as appropriate. UI displays the corresponding status and pending count. Set `ready` only after evidence and owner approval.
- `risks`, `milestones`: public-safe descriptions only.

**Important:** The release decision remains pending until an authorized sign-off, even if all readiness checks are marked ready. The current three workstreams remain open and both team reports are pending based on the supplied facts.

No fictitious percentages, milestone completion dates, issue counts, or specific owner assignments are published.

## Access and SEO

- Route is publicly accessible, **no login**.
- Metadata contains `robots: { index: false, follow: false }` to prevent intentional search indexing of the operational update. `noindex` does **not** restrict public access.
- No main navigation/footer insertion or sitemap entry, to avoid mixing project status with marketing content.
- If intentional indexing is desired, remove the robots field and explicitly add the route to sitemap.

## Safety and release notes

- Do not place credentials, private hostnames, customer information, database details, actual backup artifacts or sensitive defect reports in the public data file.
- Go-live on 30/11/2026 is a **target**, not a guaranteed launch date. Go/No-Go is pending until authorized sign-off.
- Browser print / Save as PDF uses the browser native print dialog.
- Countdown uses the user's device clock (may be inaccurate if that clock is wrong).
- No API, database, authentication, or third-party tracking dependency introduced.
- Run browser checks at 375, 768, 1440 px and in light/dark themes after deploying.
