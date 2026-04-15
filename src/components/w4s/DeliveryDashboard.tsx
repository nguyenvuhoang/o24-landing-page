"use client";

import { useState } from "react";
import {
  Server,
  Database,
  Network,
  Shield,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  CheckCircle2,
  Circle,
  ChevronRight,
  Globe,
  Lock,
  Box,
  Activity,
  Layers,
  Terminal,
  Cloud,
  Package,
  AlertCircle,
  Info,
  LogOut,
} from "lucide-react";

const META = {
  project: "O24 API System",
  environment: "PROD",
  status: "Proposed",
  lastUpdated: "2026-04-15",
  version: "v1.0",
};

// ─── Checklist State ──────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  "Hardware prepared",
  "OS installed",
  "Database installed",
  "Runtime installed",
  "Redis & RabbitMQ configured",
  "Reverse proxy configured",
  "SSL configured",
  "Firewall configured",
  "Deployment package delivered",
  "UAT environment validated",
  "Production readiness confirmed",
];

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, variant = "default" }: { label: string; variant?: "orange" | "green" | "blue" | "slate" | "default" }) {
  const styles: Record<string, string> = {
    orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    blue: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    slate: "bg-slate-700/50 text-slate-300 border-slate-600/50",
    default: "bg-slate-800 text-slate-400 border-slate-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${styles[variant]}`}>
      {label}
    </span>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4.5 h-4.5 text-orange-500" size={18} />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-100 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg ${className}`}>
      {children}
    </div>
  );
}

// ─── Spec Row ────────────────────────────────────────────────────────────────
function SpecRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70 last:border-0">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className={`text-xs font-semibold ${highlight ? "text-orange-400" : "text-slate-200"}`}>{value}</span>
    </div>
  );
}

// ─── Config Card ─────────────────────────────────────────────────────────────
function ConfigCard({
  title,
  badge,
  badgeVariant,
  specs,
}: {
  title: string;
  badge: string;
  badgeVariant: "orange" | "green" | "blue" | "slate" | "default";
  specs: { label: string; value: string; highlight?: boolean }[];
}) {
  return (
    <div className="bg-slate-950/60 rounded-lg border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-slate-200">{title}</span>
        <Badge label={badge} variant={badgeVariant} />
      </div>
      <div>
        {specs.map((s) => (
          <SpecRow key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

// ─── Software Row ────────────────────────────────────────────────────────────
function SoftwareRow({ icon: Icon, category, value, note }: { icon: React.ElementType; category: string; value: string; note?: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-800/60 last:border-0">
      <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-300">{category}</p>
        {note && <p className="text-[10px] text-slate-500 mt-0.5">{note}</p>}
      </div>
      <span className="text-xs font-bold text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

// ─── Environment Card ────────────────────────────────────────────────────────
function EnvCard({
  env,
  purpose,
  servers,
  endpoint,
  color,
}: {
  env: string;
  purpose: string;
  servers: string;
  endpoint?: string;
  color: "blue" | "orange" | "green";
}) {
  const colors = {
    blue: { bg: "bg-sky-500/5 border-sky-500/20", badge: "bg-sky-500/15 text-sky-400" },
    orange: { bg: "bg-orange-500/5 border-orange-500/20", badge: "bg-orange-500/15 text-orange-400" },
    green: { bg: "bg-emerald-500/5 border-emerald-500/20", badge: "bg-emerald-500/15 text-emerald-400" },
  };
  const c = colors[color];
  return (
    <div className={`rounded-xl border p-4 ${c.bg}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${c.badge}`}>{env}</span>
      </div>
      <p className="text-xs font-semibold text-slate-200 mb-3">{purpose}</p>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Server size={12} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <span className="text-[11px] text-slate-400">{servers}</span>
        </div>
        {endpoint && (
          <div className="flex items-start gap-2">
            <Globe size={12} className="text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="text-[11px] text-slate-400 font-mono">{endpoint}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Port Row ────────────────────────────────────────────────────────────────
function PortRow({ service, port, protocol, access }: { service: string; port: string; protocol: string; access: string }) {
  return (
    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
      <td className="py-2.5 px-3 text-xs text-slate-300 font-medium">{service}</td>
      <td className="py-2.5 px-3 text-xs font-mono text-orange-400 font-bold">{port}</td>
      <td className="py-2.5 px-3">
        <Badge label={protocol} variant="slate" />
      </td>
      <td className="py-2.5 px-3 text-xs text-slate-400">{access}</td>
    </tr>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DeliveryDashboard({ onLogout }: { onLogout?: () => void }) {
  const [checklist, setChecklist] = useState<boolean[]>(Array(CHECKLIST_ITEMS.length).fill(false));

  const toggleCheck = (i: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const completedCount = checklist.filter(Boolean).length;
  const progressPct = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  const envBadgeVariant = META.environment === "PROD" ? "green" : META.environment === "UAT" ? "orange" : "blue";
  const statusBadgeVariant =
    META.status === "Confirmed" ? "green" : META.status === "Proposed" ? "orange" : "slate";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center">
              <Box size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-100 tracking-tight">O24 API</span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-xs text-slate-400">Delivery Spec</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge label={META.environment} variant={envBadgeVariant as any} />
            <Badge label={META.status} variant={statusBadgeVariant as any} />
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition-colors px-2 py-1.5 rounded-md hover:bg-slate-800"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Exit</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── HEADER ── */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Deployment Specification</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
                  Software &amp; Hardware<br />
                  <span className="text-orange-500">Delivery</span>
                </h1>
                <p className="text-sm text-slate-400 mt-2">Deployment specification for O24 API environment</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-3 flex-shrink-0">
                {[
                  { label: "Project", value: META.project },
                  { label: "Version", value: META.version },
                  { label: "Updated", value: META.lastUpdated },
                  { label: "Status", value: META.status },
                ].map((m) => (
                  <div key={m.label} className="bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2.5 min-w-[130px]">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{m.label}</p>
                    <p className="text-sm font-bold text-slate-100 mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        <Card>
          <SectionTitle icon={Info} title="Overview" />
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-2.5">
            {[
              "Trang này mô tả các yêu cầu phần cứng và phần mềm để triển khai O24 API.",
              "Bao gồm: server, OS, database, cache, queue, network và security.",
              "Mục tiêu đảm bảo hệ thống sẵn sàng trước khi go-live.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <ChevronRight size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── HARDWARE ── */}
        <Card>
          <SectionTitle icon={Server} title="Hardware Requirements" subtitle="Server sizing for O24 API deployment" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ConfigCard
              title="Minimum Configuration"
              badge="DEV / UAT"
              badgeVariant="blue"
              specs={[
                { label: "CPU", value: "8 vCPU (Intel Xeon / AMD EPYC)", highlight: true },
                { label: "RAM", value: "16 GB+" },
                { label: "Storage", value: "SSD 256 GB+" },
                { label: "Network", value: "1 Gbps" },
                { label: "Backup", value: "Daily backup recommended" },
              ]}
            />
            <ConfigCard
              title="Recommended Configuration"
              badge="PRODUCTION"
              badgeVariant="orange"
              specs={[
                { label: "CPU", value: "16 vCPU+", highlight: true },
                { label: "RAM", value: "32 GB+" },
                { label: "Storage", value: "SSD / NVMe 512 GB+" },
                { label: "Network", value: "1 Gbps+" },
                { label: "High Availability", value: "Recommended" },
                { label: "Backup", value: "Auto + retention 7–30 days" },
              ]}
            />
          </div>

          {/* Server Architecture */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Server Architecture (Recommended)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { icon: Server, label: "Application Server", sub: "O24 API" },
                { icon: Database, label: "Database Server", sub: "SQL Server" },
                { icon: Activity, label: "Cache Server", sub: "Redis" },
                { icon: Layers, label: "Message Queue", sub: "RabbitMQ" },
                { icon: Cloud, label: "File Storage", sub: "Optional" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <s.icon size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-200">{s.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/15 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={13} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">
                  <span className="text-orange-400 font-semibold">DEV/UAT</span> có thể dùng chung server. &nbsp;
                  <span className="text-orange-400 font-semibold">PROD</span> nên tách riêng để đảm bảo hiệu năng và scalability.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── SOFTWARE ── */}
        <Card>
          <SectionTitle icon={Terminal} title="Software Requirements" subtitle="Stack and dependencies for O24 API" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div>
              <SoftwareRow icon={Layers} category="Operating System" value="Ubuntu 24.04 LTS" note="Recommended" />
              <SoftwareRow icon={Box} category="Runtime" value=".NET 10" note=".NET Core / .NET 10" />
              <SoftwareRow icon={Database} category="Database" value="SQL Server 2022" />
              <SoftwareRow icon={Activity} category="Cache" value="Redis 7.x" />
              <SoftwareRow icon={Layers} category="Message Queue" value="RabbitMQ Latest" note="Latest stable version" />
            </div>
            <div>
              <SoftwareRow icon={Globe} category="Web Server" value="Nginx" note="Recommended / IIS" />
              <SoftwareRow icon={Cloud} category="Container" value="Docker / K8s" note="Optional" />
              <SoftwareRow icon={Lock} category="Security" value="SSL/TLS + Firewall" note="IP whitelist required" />
              <SoftwareRow icon={Activity} category="Monitoring" value="Grafana + Prometheus" note="ELK / Seq also supported" />
            </div>
          </div>
        </Card>

        {/* ── ENVIRONMENTS ── */}
        <Card>
          <SectionTitle icon={Layers} title="Environment Structure" subtitle="Deployment targets and their purpose" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnvCard
              env="DEV"
              purpose="Development & Internal Testing"
              servers="Shared server acceptable. Minimal HA."
              endpoint="dev-api.o24.app"
              color="blue"
            />
            <EnvCard
              env="UAT"
              purpose="User Acceptance Testing"
              servers="Shared with DEV or separate. Mimic PROD config."
              endpoint="uat-api.o24.app"
              color="orange"
            />
            <EnvCard
              env="PROD"
              purpose="Production Environment"
              servers="Dedicated servers. HA recommended. Auto-backup on."
              endpoint="api.o24.app"
              color="green"
            />
          </div>
        </Card>

        {/* ── NETWORK & SECURITY ── */}
        <Card>
          <SectionTitle icon={Network} title="Network & Security" subtitle="Ports, firewall rules, and access control" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Ports Table */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Open Ports</p>
              <div className="rounded-lg border border-slate-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-700">
                      <th className="py-2 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service</th>
                      <th className="py-2 px-3 text-left text-[10px] font-bold text-slate-400 uppercase">Port</th>
                      <th className="py-2 px-3 text-left text-[10px] font-bold text-slate-400 uppercase">Proto</th>
                      <th className="py-2 px-3 text-left text-[10px] font-bold text-slate-400 uppercase">Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    <PortRow service="HTTPS (API)" port="443" protocol="TCP" access="Public" />
                    <PortRow service="HTTP (redirect)" port="80" protocol="TCP" access="Public" />
                    <PortRow service="SQL Server" port="1433" protocol="TCP" access="Internal only" />
                    <PortRow service="Redis" port="6379" protocol="TCP" access="Internal only" />
                    <PortRow service="RabbitMQ" port="5672" protocol="AMQP" access="Internal only" />
                    <PortRow service="RabbitMQ UI" port="15672" protocol="TCP" access="VPN / Admin" />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Rules */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Security Rules</p>
              {[
                { icon: Globe, title: "Domain / Subdomain", desc: "Configure DNS A/CNAME for API endpoints" },
                { icon: Lock, title: "HTTPS Required", desc: "All traffic must use SSL/TLS. HTTP redirects to HTTPS." },
                { icon: Shield, title: "IP Whitelist", desc: "Internal services (DB, Redis, Queue) restricted to private IP ranges" },
                { icon: Network, title: "Firewall Config", desc: "Block all unused ports. Allow only listed services." },
                { icon: Lock, title: "VPN / Internal Network", desc: "Admin interfaces (RabbitMQ UI, monitoring) via VPN only" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                  <item.icon size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── DELIVERY CHECKLIST ── */}
        <Card>
          <SectionTitle icon={CheckCircle2} title="Delivery Checklist" subtitle="Track deployment readiness" />
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">{completedCount} / {CHECKLIST_ITEMS.length} completed</span>
              <span className="text-xs font-bold text-orange-400">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all text-left cursor-pointer group"
                style={{
                  borderColor: checklist[i] ? "rgba(249,115,22,0.3)" : "rgba(51,65,85,0.5)",
                  backgroundColor: checklist[i] ? "rgba(249,115,22,0.05)" : "rgba(15,23,42,0.4)",
                }}
              >
                {checklist[i] ? (
                  <CheckCircle2 size={16} className="text-orange-500 flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-600 flex-shrink-0 group-hover:text-slate-400 transition-colors" />
                )}
                <span className={`text-xs font-medium transition-colors ${checklist[i] ? "text-orange-300 line-through" : "text-slate-300"}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* ── NOTES / ASSUMPTIONS ── */}
        <Card>
          <SectionTitle icon={AlertCircle} title="Notes / Assumptions" />
          <div className="space-y-2">
            {[
              "Final sizing depends on transaction volume and concurrent users.",
              "Production sizing may need adjustment after load testing and estimation.",
              "High Availability (HA) / Disaster Recovery (DR) depends on customer infrastructure policy.",
              "System supports horizontal scaling; additional nodes can be added as needed.",
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                <span className="text-orange-500 font-bold text-xs flex-shrink-0 w-4">{i + 1}.</span>
                <p className="text-xs text-slate-300">{note}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── QUICK SUMMARY ── */}
        <div className="relative rounded-2xl overflow-hidden border border-orange-500/25 bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-900 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Quick Reference</p>
            <h2 className="text-lg font-extrabold text-slate-50 mb-5">Deployment Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Cpu, label: "CPU", value: "8 Core+", sub: "16 Core recommended" },
                { icon: MemoryStick, label: "RAM", value: "16 GB+", sub: "32 GB recommended" },
                { icon: HardDrive, label: "Storage", value: "SSD 256 GB+", sub: "NVMe preferred" },
                { icon: Layers, label: "OS", value: "Ubuntu 24.04", sub: "LTS" },
                { icon: Box, label: "Runtime", value: ".NET 10", sub: ".NET Core" },
                { icon: Database, label: "Database", value: "SQL Server 2022", sub: "" },
                { icon: Activity, label: "Cache", value: "Redis 7", sub: "Latest stable" },
                { icon: Layers, label: "Queue", value: "RabbitMQ", sub: "Latest stable" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-950/60 border border-slate-800 hover:border-orange-500/30 rounded-xl p-3 text-center transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-500/20 transition-colors">
                    <item.icon size={14} className="text-orange-400" />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-xs font-bold text-slate-100 mt-0.5">{item.value}</p>
                  {item.sub && <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center py-4 border-t border-slate-800">
          <p className="text-xs text-slate-600">
            O24 API — Software &amp; Hardware Delivery Specification &nbsp;·&nbsp; {META.lastUpdated} &nbsp;·&nbsp; {META.version}
          </p>
        </div>

      </div>
    </div>
  );
}
