"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowDown, ArrowRight, ArrowUpRight,
  CheckCircle2, ChevronLeft, ChevronRight, Database, GitBranch,
  Globe2, LockKeyhole, Network, RotateCcw, ServerCog,
  ShieldCheck, Smartphone, Workflow,
} from "lucide-react";

const layers = [
  {
    id: "channels", number: "01", title: "Client channels", short: "Request origin",
    icon: Smartphone, subtitle: "Applications and partners initiate requests.",
    explanation: "Web, mobile, partner and back-office applications can call the platform using governed interfaces. The example request originates from a mobile banking client.",
    tags: ["Web apps", "Mobile apps", "Partner APIs", "Admin portals"],
    example: { source: "Mobile application", method: "GET", path: "/v1/accounts/ACC-DEMO-001", channel: "MOBILE" },
  },
  {
    id: "gateway", number: "02", title: "O24 API Gateway", short: "Policy & routing",
    icon: LockKeyhole, subtitle: "Manage access at a central API entry point.",
    explanation: "The gateway is a conceptual entry point for authentication, request policies and routing to the appropriate service. The exact controls depend on the deployment configuration.",
    tags: ["Authentication", "Routing", "Access policies", "API governance"],
    example: { route: "/v1/accounts/:accountId", policy: "Authenticated channel", destination: "Account workflow", outcome: "Route selected" },
  },
  {
    id: "workflow", number: "03", title: "Services & workflows", short: "Orchestration",
    icon: Workflow, subtitle: "Coordinate business rules and service calls.",
    explanation: "O24 service workflows can validate inputs, coordinate integrations and transform their outputs into a consistent application response.",
    tags: ["Account services", "Transaction services", "Payment services", "Orchestration"],
    example: { workflow: "Account lookup", steps: ["Validate request", "Resolve core adapter", "Normalize account data"], status: "Illustrative processing" },
  },
  {
    id: "integrations", number: "04", title: "Enterprise integrations", short: "System adapters",
    icon: Database, subtitle: "Connect to existing enterprise infrastructure.",
    explanation: "Configured adapters connect services to enterprise systems such as core banking, databases, message queues or external APIs. This walkthrough does not contact those systems.",
    tags: ["Core banking", "Databases", "Message queues", "External APIs"],
    example: { adapter: "Example core account adapter", operation: "Retrieve account", result: { accountId: "ACC-DEMO-001", currency: "LAK", status: "ACTIVE" } },
  },
  {
    id: "observability", number: "05", title: "Operational visibility", short: "Trace & diagnostics",
    icon: Activity, subtitle: "Understand the request lifecycle.",
    explanation: "Logging, monitoring and diagnostic capabilities can help operators trace requests across configured services. Actual trace capture depends on deployment and instrumentation.",
    tags: ["Request tracing", "Application logs", "Diagnostics", "Monitoring"],
    example: { trace: "DEMO-TRACE-001", stages: ["Gateway", "Workflow", "Adapter", "Response"], result: "Example response composed", telemetry: "Simulated — no live metrics" },
  },
] as const;

type LayerIndex = 0 | 1 | 2 | 3 | 4;
const related = [
  { name: "Web / mobile", icon: Globe2 },
  { name: "Gateway", icon: ShieldCheck },
  { name: "Workflows", icon: GitBranch },
  { name: "Core adapter", icon: ServerCog },
  { name: "Diagnostics", icon: Activity },
];
const stepCount = layers.length;

export function Architecture() {
  const [selected, setSelected] = useState<LayerIndex>(0);
  const layer = layers[selected];
  const Icon = layer.icon;
  function next() { setSelected((value) => Math.min(value + 1, stepCount - 1) as LayerIndex); }
  function previous() { setSelected((value) => Math.max(value - 1, 0) as LayerIndex); }

  return (
    <section id="architecture" aria-labelledby="architecture-title" className="relative min-w-0 overflow-hidden border-y bg-muted/20 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Network size={14} aria-hidden="true" /> Interactive platform architecture
          </span>
          <h2 id="architecture-title" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Connect your systems. <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">Keep control.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Follow an example request from a client application through O24 services and enterprise integrations, then explore the operational view.
          </p>
        </div>

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-background shadow-xl shadow-primary/5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Network size={19} /></span>
              <div>
                <p className="text-sm font-bold">O24 Integration Architecture</p>
                <p className="text-xs text-muted-foreground">Select any layer to inspect its role</p>
              </div>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">INTERACTIVE CONCEPT</span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(330px,0.8fr)]">
            <div className="min-w-0 border-b p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">Example request path</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tap any layer to explore the architecture.</p>
                </div>
                <button type="button" onClick={() => setSelected(0)} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  <RotateCcw size={13} /> Restart
                </button>
              </div>

              <div className="space-y-0" aria-label="Architecture layers">
                {layers.map((item, index) => {
                  const ItemIcon = item.icon;
                  const active = index === selected;
                  const visited = index < selected;
                  return (
                    <div key={item.id}>
                      {index > 0 && (
                        <div className="relative ml-[34px] flex h-8 items-center" aria-hidden="true">
                          <span className={`absolute left-0 h-full border-l-2 border-dashed transition-colors motion-reduce:transition-none ${index <= selected ? "border-primary/70" : "border-border"}`} />
                          <ArrowDown size={15} className={`absolute bottom-0 -left-[6px] ${index <= selected ? "text-primary" : "text-muted-foreground/40"}`} />
                        </div>
                      )}
                      <button type="button" onClick={() => setSelected(index as LayerIndex)} aria-pressed={active}
                        className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3.5 text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 ${active ? "border-primary/55 bg-primary/[.075] shadow-sm shadow-primary/10" : visited ? "border-primary/20 bg-primary/[.025] hover:bg-primary/[.06]" : "border-border bg-card hover:border-primary/35 hover:bg-muted/40"}`}>
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><ItemIcon size={21} /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.number} / {item.short}</span>
                          <span className="mt-1 block text-sm font-bold sm:text-base">{item.title}</span>
                        </span>
                        {visited ? <CheckCircle2 size={17} className="shrink-0 text-primary" aria-label="Explored" /> : active ? <span className="rounded-md border border-primary/25 bg-background px-2 py-1 text-[10px] font-semibold text-primary">Selected</span> : <ChevronRight size={16} className="shrink-0 text-muted-foreground/50" />}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-primary/20 bg-muted/25 px-3 py-3 text-xs text-muted-foreground">
                <ArrowRight size={15} className="shrink-0 text-primary" />
                <span>Response returns to the calling client through the configured service path.</span>
              </div>
            </div>

            <div className="min-w-0 bg-muted/[.12] p-5 sm:p-7 lg:p-8">
              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Selected architecture layer: {layer.title}</p>
              <div className="mb-5 flex items-start justify-between gap-2">
                <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-primary">Layer {layer.number} / 05</span>
                <span className="text-xs text-muted-foreground">Conceptual walkthrough</span>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><Icon size={24} /></span>
              <h3 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">{layer.title}</h3>
              <p className="mt-2 text-sm font-semibold text-primary">{layer.subtitle}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{layer.explanation}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {layer.tags.map((tag) => <span key={tag} className="rounded-lg border bg-background px-2.5 py-1.5 text-[11px] font-medium text-foreground">{tag}</span>)}
              </div>
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-700 bg-[#0b1425] text-slate-100 shadow-sm">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#121e30] px-4 py-3">
                  <span className="font-mono text-[11px] font-semibold text-slate-300">o24 / {layer.id}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">Example data</span>
                </div>
                <pre className="max-h-[240px] max-w-full overflow-auto p-4 font-mono text-[11px] leading-6 text-emerald-300 sm:text-xs"><code>{JSON.stringify(layer.example, null, 2)}</code></pre>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <button type="button" disabled={selected === 0} onClick={previous} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} /> Previous</button>
                <button type="button" disabled={selected === stepCount - 1} onClick={next} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">Next layer <ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          <div className="border-t bg-muted/20 px-5 py-5 sm:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Architecture at a glance</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {related.map(({name,icon:MiniIcon},index) => <button key={name} type="button" onClick={() => setSelected(index as LayerIndex)} aria-label={`Explore ${name}`} aria-pressed={index === selected} className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === selected ? "border-primary/50 bg-primary/10 text-primary" : "bg-background text-muted-foreground hover:text-foreground"}`}><MiniIcon size={15} />{name}</button>)}
            </div>
            <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
              <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">Illustrative reference architecture and sample JSON only. No live core banking connection, customer information, transaction, or telemetry is used. Actual components vary by configuration.</p>
              <Link href="/solutions/enterprise" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Enterprise integration <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
