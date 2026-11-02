"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, Building2, Check, ChevronRight, Cloud,
  Copy, Database, GitBranch, LockKeyhole, Network, Server, ShieldCheck,
  Workflow,
} from "lucide-react";

type Model = "on-premises" | "private-cloud" | "hybrid";
type Layer = "channels" | "gateway" | "workflow" | "adapters" | "operations";

const models = [
  {
    id: "on-premises" as const, name: "On-premises", Icon: Server,
    brief: "Organization-managed infrastructure",
    detail: "Place the integration layer within organization-managed infrastructure. Network zones, identity, operations and capacity planning are owned or governed by the customer.",
    perimeter: "Internal network / customer data center",
    checklist: ["Network segmentation and ingress", "Secrets and certificate ownership", "Backup, monitoring and patching"],
  },
  {
    id: "private-cloud" as const, name: "Private cloud", Icon: Cloud,
    brief: "Isolated cloud deployment design",
    detail: "Evaluate an isolated cloud environment for the integration workloads. Define private connectivity to systems of record and agree operational responsibility boundaries.",
    perimeter: "Private network / isolated cloud environment",
    checklist: ["Private connectivity and DNS", "Identity and access boundaries", "Availability and restore requirements"],
  },
  {
    id: "hybrid" as const, name: "Hybrid", Icon: GitBranch,
    brief: "Connect infrastructure across boundaries",
    detail: "Keep existing core systems in their current environment while placing selected services elsewhere. Design for network latency, failure isolation and traceability across boundaries.",
    perimeter: "Customer network ↔ private service environment",
    checklist: ["Connection security and routing", "Timeouts, retries and unknown outcomes", "Distributed tracing and reconciliation"],
  },
];

const layers = [
  { id: "channels" as const, title: "Client & partner channels", Icon: Building2, subtitle: "Web · Mobile · Partners", detail: "Consumer applications submit requests through documented service interfaces. Channel-specific behavior stays separate from core-system contracts.", checks: ["Client identity", "Contract versioning", "Request correlation"] },
  { id: "gateway" as const, title: "API access layer", Icon: LockKeyhole, subtitle: "Access · Routing · Policies", detail: "A central API entry point can apply authentication and authorization policies and route requests to appropriate services.", checks: ["Authentication / authorization", "Rate-limit planning", "Gateway logging"] },
  { id: "workflow" as const, title: "Workflow orchestration", Icon: Workflow, subtitle: "Validation · Coordination", detail: "Service operations are coordinated through explicit business steps. Failure paths, idempotency and compensation require case-by-case design.", checks: ["Validation and state", "Idempotency strategy", "Failure recovery"] },
  { id: "adapters" as const, title: "Enterprise adapters", Icon: Database, subtitle: "Core · Databases · APIs", detail: "Adapters isolate legacy protocols, data formats and connectivity concerns from APIs used by digital channels.", checks: ["Data mapping", "Timeout boundaries", "Reconciliation contract"] },
  { id: "operations" as const, title: "Operational visibility", Icon: Activity, subtitle: "Trace · Audit · Diagnostics", detail: "Operational logs and correlation identifiers help teams investigate executions across service boundaries. Audit scope and retention depend on the project.", checks: ["Correlation IDs", "Audit retention policy", "Monitoring ownership"] },
];

const designDocument = (model: Model, layer: Layer) => {
  const deployment = models.find((item) => item.id === model)!;
  const selected = layers.find((item) => item.id === layer)!;
  return JSON.stringify({
    example: true,
    note: "Illustrative architecture, not a deployed environment or O24 API contract",
    deployment_model: model,
    network_boundary: deployment.perimeter,
    selected_layer: layer,
    integration_path: layers.map((step) => step.id),
    review_topics: selected.checks,
  }, null, 2);
};

export function EnterpriseIntegrationShowcase() {
  const [model, setModel] = useState<Model>("hybrid");
  const [layer, setLayer] = useState<Layer>("gateway");
  const [copied, setCopied] = useState(false);
  const deployment = models.find((item) => item.id === model)!;
  const activeIndex = layers.findIndex((item) => item.id === layer);
  const selected = layers[activeIndex];

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(designDocument(model, layer));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function changeModel(next: Model) {
    setModel(next);
    setCopied(false);
  }
  function changeLayer(next: Layer) {
    setLayer(next);
    setCopied(false);
  }

  return (
    <section id="enterprise-integration-showcase" aria-labelledby="enterprise-showcase-heading" className="scroll-mt-24 border-y border-border/60 bg-muted/20 py-20 lg:py-28">
      <div className="container mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[.15em] text-primary"><Network size={15} /> Enterprise integration showcase</span>
          <h2 id="enterprise-showcase-heading" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Explore the architecture. <span className="text-primary">Plan with confidence.</span></h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">Compare deployment patterns and inspect each layer of an API-led enterprise integration. Select a model and then choose a component to explore its responsibilities.</p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3" role="group" aria-label="Deployment model">
          {models.map(({ id, name, Icon, brief }) => (
            <button key={id} type="button" onClick={() => changeModel(id)} aria-pressed={model === id} className={`flex min-h-[92px] items-start gap-3 rounded-2xl border p-4 text-left transition-[border-color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5 ${model === id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"}`}>
              <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Icon size={21} aria-hidden="true" /></span>
              <span><span className="block font-bold">{name}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{brief}</span></span>
              {model === id && <Check className="ml-auto h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className="mt-6 grid min-w-0 overflow-hidden rounded-3xl border border-[#263751] bg-[#0b1528] text-slate-100 shadow-2xl shadow-slate-950/10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)]">
          <div className="min-w-0 border-b border-white/10 p-4 sm:p-7 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-amber-400">Architecture map</p><h3 className="mt-1 text-xl font-bold">{deployment.name} integration</h3></div>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[10px] font-semibold text-amber-300">INTERACTIVE CONCEPT</span>
            </div>
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[.025] p-3 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-[11px] text-slate-400"><ShieldCheck size={14} className="text-amber-400" /> {deployment.perimeter}</div>
              {layers.map((step, index) => {
                const Icon = step.Icon;
                const isActive = step.id === layer;
                return (
                  <div key={step.id}>
                    {index > 0 && <div className="flex h-7 items-center justify-center" aria-hidden="true"><div className="h-full w-px bg-amber-500/50" /></div>}
                    <button type="button" onClick={() => changeLayer(step.id)} aria-pressed={isActive} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:p-4 ${isActive ? "border-amber-400/70 bg-[#26334a] shadow-[0_0_0_1px_rgba(251,191,36,.1)]" : "border-white/10 bg-[#14223a] hover:border-amber-400/30"}`}>
                      <span className={`rounded-lg p-2.5 ${isActive ? "bg-amber-400/15 text-amber-300" : "bg-white/5 text-slate-300"}`}><Icon size={19} aria-hidden="true" /></span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">{step.title}</span><span className="mt-1 block text-xs text-slate-400">{step.subtitle}</span></span>
                      <span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                      <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-600"}`} aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">Reference model only. Actual network placement, components and responsibilities vary by customer requirements.</p>
          </div>

          <div className="min-w-0 p-4 sm:p-7" aria-live="polite" aria-atomic="true">
            <span className="text-[10px] font-bold uppercase tracking-[.17em] text-amber-400">Layer {String(activeIndex + 1).padStart(2, "0")} / 05</span>
            <h3 className="mt-2 text-2xl font-bold text-white">{selected.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{selected.detail}</p>
            <div className="mt-7 rounded-xl border border-white/10 bg-[#111f35] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">Architecture review topics</p>
              <ul className="space-y-3">{selected.checks.map((topic) => <li key={topic} className="flex items-start gap-2.5 text-sm text-slate-300"><Check size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />{topic}</li>)}</ul>
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-[#111f35] p-4">
              <h4 className="text-sm font-semibold text-white">{deployment.name}: planning considerations</h4>
              <p className="mt-2 text-xs leading-6 text-slate-400">{deployment.detail}</p>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs leading-5 text-slate-300">{deployment.checklist.map((topic) => <li key={topic}>{topic}</li>)}</ul>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Explore layer {activeIndex + 1} of {layers.length}</span>
              <div className="flex gap-2">
                <button type="button" disabled={activeIndex === 0} onClick={() => changeLayer(layers[activeIndex - 1].id)} className="min-h-10 rounded-lg border border-white/15 px-3 text-xs font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <button type="button" disabled={activeIndex === layers.length - 1} onClick={() => changeLayer(layers[activeIndex + 1].id)} className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40">Next <ArrowRight size={14} /></button>
              </div>
            </div>
            <button type="button" onClick={copyPlan} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-xs font-semibold text-white hover:bg-white/10"><Copy size={14} /> {copied ? "Architecture example copied" : "Copy example architecture JSON"}</button>
            <p className="mt-3 text-[11px] leading-5 text-slate-500">The copied JSON is an illustrative planning example, not a live configuration file.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
          <div><h3 className="text-lg font-bold">Discuss your deployment architecture</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Review integration boundaries, security, operations and deployment requirements with the O24 team.</p></div>
          <Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">Request a technical demo <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
