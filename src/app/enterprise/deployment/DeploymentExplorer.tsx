"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, ClipboardCopy, Cloud, GitBranch, Server, ShieldCheck, Workflow, Database, MonitorDot } from "lucide-react";

type Model = "on-premises" | "private-cloud" | "hybrid";

const models = [
  { id: "on-premises", name: "On-premises", subtitle: "Organization-managed infrastructure", icon: Server, detail: "Plan infrastructure and operational ownership within your organization's environments.", boundaries: ["Internal channels", "Organization network", "O24 integration services", "Existing business systems"], checks: ["Infrastructure capacity and lifecycle", "Segmentation and access governance", "Backup and restore ownership"] },
  { id: "private-cloud", name: "Private Cloud", subtitle: "Dedicated cloud deployment context", icon: Cloud, detail: "Review isolated cloud network, shared responsibility and connections to existing systems.", boundaries: ["Digital & partner channels", "Private cloud network", "O24 integration services", "Business systems and APIs"], checks: ["Identity and secrets boundaries", "Network ingress, egress and logging", "Cloud resilience and recovery requirements"] },
  { id: "hybrid", name: "Hybrid", subtitle: "Connected infrastructure boundaries", icon: GitBranch, detail: "Consider connectivity and failure domains when integrations span on-premises and cloud environments.", boundaries: ["Web, mobile & partners", "Access and network boundary", "Integration services", "On-prem and cloud systems"], checks: ["Private connectivity and trust boundaries", "Cross-environment dependency mapping", "Timeouts, recovery and change control"] },
] as const;

const layers = [
  { title: "Channel & Identity", icon: ShieldCheck, tag: "ACCESS", description: "Define who can call services, authentication boundaries, channel identity and access review ownership." },
  { title: "API Gateway", icon: GitBranch, tag: "ROUTING", description: "Plan service routing, policy enforcement, request metadata and interface versioning." },
  { title: "Workflow Services", icon: Workflow, tag: "PROCESS", description: "Consider validation, orchestration, idempotency, failure paths and execution traceability." },
  { title: "Core & Data Adapters", icon: Database, tag: "INTEGRATION", description: "Map legacy contracts, data classification, network access and dependency failure modes." },
  { title: "Operations & Visibility", icon: MonitorDot, tag: "OPERATIONS", description: "Agree on logs, metrics, alert ownership, incident response and recovery objectives." },
] as const;

export function DeploymentExplorer() {
  const [selected, setSelected] = useState<Model>("hybrid");
  const [activeLayer, setActiveLayer] = useState(0);
  const [copied, setCopied] = useState(false);
  const model = models.find(entry => entry.id === selected)!;
  const layer = layers[activeLayer];

  const copyPlan = async () => {
    const payload = {
      note: "Illustrative deployment planning reference; not a production configuration",
      model: model.id,
      scope: model.subtitle,
      topology: model.boundaries,
      review_items: model.checks,
      integration_layers: layers.map(item => item.title),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="deployment-explorer" className="scroll-mt-24 py-20 lg:py-28" aria-labelledby="deployment-explorer-heading">
      <div className="container mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.17em] text-primary">Interactive architecture</p>
          <h2 id="deployment-explorer-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Explore a deployment model.</h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">Compare infrastructure boundaries and select an integration layer to see what needs to be considered during a technical assessment.</p>
        </div>
        <div className="mt-9 grid gap-3 md:grid-cols-3" role="group" aria-label="Deployment model">
          {models.map(entry => {
            const Icon = entry.icon;
            return <button key={entry.id} type="button" aria-pressed={selected === entry.id} onClick={() => { setSelected(entry.id); setCopied(false); }} className={`rounded-2xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected === entry.id ? "border-primary bg-primary/10" : "bg-card hover:border-primary/40"}`}>
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="mt-4 block text-base font-bold">{entry.name}</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{entry.subtitle}</span>
            </button>;
          })}
        </div>
        <div className="mt-6 grid gap-6 rounded-3xl border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-mono text-xs uppercase tracking-wider text-primary">Reference topology</p><h3 className="mt-2 text-2xl font-bold">{model.name} integration</h3></div>
              <span className="rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">CONCEPTUAL</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">{model.detail}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {model.boundaries.map((boundary, index) => <div key={boundary} className="flex min-h-20 items-center gap-3 rounded-xl border bg-muted/30 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">0{index + 1}</span><span className="text-sm font-semibold">{boundary}</span></div>)}
            </div>
            <p className="mt-5 text-xs text-muted-foreground">Logical zones only; arrows, network dependencies and hosting are defined during solution design.</p>
            <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-bold">Deployment review items</p>
              <ul className="mt-3 space-y-3">{model.checks.map(item => <li key={item} className="flex items-start gap-2 text-sm leading-6"><Check size={17} className="mt-1 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}</ul>
            </div>
            <button type="button" onClick={copyPlan} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-primary"><ClipboardCopy size={17} />{copied ? "Copied planning JSON" : "Copy planning JSON"}</button>
          </div>
          <div className="min-w-0 rounded-2xl border bg-muted/20 p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Integration responsibility map</p>
            <p className="mt-2 text-sm text-muted-foreground">Select a layer for implementation considerations.</p>
            <div className="mt-6 space-y-2">{layers.map((entry, index) => { const Icon = entry.icon; return <button key={entry.title} type="button" aria-pressed={activeLayer === index} onClick={() => setActiveLayer(index)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary ${activeLayer === index ? "border-primary/50 bg-primary/10" : "bg-background hover:border-primary/30"}`}><Icon size={19} className="shrink-0 text-primary" /><span className="min-w-0 flex-1 text-sm font-semibold">{entry.title}</span><ArrowRight size={16} className="shrink-0 text-muted-foreground" /></button>; })}</div>
            <div className="mt-5 rounded-xl border bg-background p-5" aria-live="polite">
              <p className="font-mono text-[11px] font-bold tracking-widest text-primary">{layer.tag} · {activeLayer + 1}/5</p>
              <h4 className="mt-2 font-bold">{layer.title}</h4>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{layer.description}</p>
              <div className="mt-5 flex justify-between gap-2">
                <button type="button" disabled={activeLayer === 0} onClick={() => setActiveLayer(i => i - 1)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-40"><ChevronLeft size={15}/>Previous</button>
                <button type="button" disabled={activeLayer === layers.length - 1} onClick={() => setActiveLayer(i => i + 1)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-40">Next<ChevronRight size={15}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
