# IPS Dashboard V1.3 — Production Infrastructure Readiness

Works with IPS V1.2 and your existing `ips-status.ts`. No database, authentication or API changes.

## Install

Extract the contents of `ips-live-v1-3` into `C:\O24\o24-landing-page` and run:

```powershell
node scripts/ips-v1-3-integrate.mjs
pnpm exec eslint src/components/projects/ips/IPSReadinessDashboard.tsx src/components/projects/ips/IPSProductionOverview.tsx src/data/projects/ips-production.ts src/data/projects/ips-status.ts
pnpm exec tsc --noEmit
pnpm build
```

Open `http://localhost:3000/projects/ips` and verify overview and Go / No-Go tabs.

**Production status semantics:** installation of services is `complete`, but the independent Go-Live Production readiness decision gate remains `pending` until smoke tests, monitoring, backup/restore and stakeholder sign-off. Open workstreams now expected to be 2 (Migration and UAT) after the patch.

**Public data:** high-level snapshot only (OS, 8 vCPU, 31 GiB RAM, aggregate disks, 19/19 running containers, PostgreSQL and observability). Does not expose internal image names, service URLs, Docker daemon, administration endpoints, IPs or secrets. Public numbers are manually captured on 05/11/2026, not realtime health data.

**Unconfirmed:** Production API endpoint (BO URL supplied for both BO and API), DB size, restore verification, application endpoint health, functional smoke tests and UAT reports. No ungrounded claims in UI.

The integration script makes `.ips-v13.bak` backups. Delete or ignore these backup files before committing.
