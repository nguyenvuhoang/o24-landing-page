/** Public, manually verified snapshot. No credentials, administration endpoints or internal network detail. */
export const ipsProduction = {
  observedOn: "2026-11-05",
  deployment: "installed" as const,
  validation: "pending" as const,
  server: {
    os: "Ubuntu 26.04.1 LTS",
    cpu: "8 vCPU",
    cpuFamily: "Intel Xeon (Skylake)",
    ramTotalGiB: 31,
    ramAvailableGiB: 27,
    systemDisk: { totalGB: 96, availableGB: 77, usagePercent: 20 },
    dataDisk: { totalGB: 147, availableGB: 139, usagePercent: 1 },
    swap: "Not configured",
  },
  runtime: {
    docker: "29.9.3",
    compose: "5.7.0",
    containersRunning: 19,
    containersTotal: 19,
    database: "PostgreSQL 16 — container healthy",
    platform: "O24 application services deployed",
    dependencies: "Redis and RabbitMQ running",
    monitoring: "Prometheus, Grafana, Loki and Promtail running",
    operations: "Container administration tooling running",
  },
  endpoints: {
    bo: { label: "Back Office (BO)", url: "https://bo.ipscorp.vn/", confirmation: "Deployment URL provided" },
    api: { label: "Backend API", url: null as string | null, confirmation: "Endpoint to be confirmed" },
  },
  checks: [
    { label: "Application smoke test", status: "pending" },
    { label: "API endpoint / integration verification", status: "pending" },
    { label: "Monitoring and alert verification", status: "pending" },
    { label: "Production backup and restore test", status: "pending" },
  ] as const,
} as const;
