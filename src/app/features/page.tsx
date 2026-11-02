import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, Braces, Check, ChevronRight,
  CircleDot, Database, GitBranch, LockKeyhole,
  ShieldCheck, Smartphone, Workflow,
} from "lucide-react";
import { features } from "@/data/features";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "O24 Platform Capabilities | API Management, Workflows & Integration",
  description:
    "Explore O24 API management, workflow orchestration, banking integration, security, observability and multi-channel architecture. Discover practical integration approaches.",
  path: "/features",
  ogTitle: "O24 Platform Capabilities | vKnight",
  ogDescription: "Build, orchestrate and connect services with O24's API-led enterprise integration approach.",
});

const architecture = [
  { name: "Client channels", detail: "Web · Mobile · Partners", icon: Smartphone },
  { name: "API Gateway", detail: "Access · Routing · Policies", icon: LockKeyhole },
  { name: "Workflow services", detail: "Commands · Orchestration", icon: Workflow },
  { name: "Enterprise systems", detail: "Core · Data · External APIs", icon: Database },
] as const;

const showcases = [
  {
    eyebrow: "01 / CONNECT",
    title: "Bring your APIs into one integration architecture.",
    description: "Define a clear entry point for channels and partners, then route requests to services through controlled interfaces.",
    labels: ["Request routing", "Access policies", "API boundaries"],
    icon: Braces,
    code: `GET /v1/accounts/ACC-DEMO-001\nX-Channel: WEB\nAuthorization: Bearer <token>\n\n// Illustrative request only`,
  },
  {
    eyebrow: "02 / ORCHESTRATE",
    title: "Make multi-service operations easier to reason about.",
    description: "Coordinate validation, business decisions, service calls and error-handling strategies through explicit workflow boundaries.",
    labels: ["CQRS patterns", "Workflow steps", "Failure handling"],
    icon: GitBranch,
    code: `REQUEST → VALIDATE → ROUTE\n        → WORKFLOW\n        → CORE ADAPTER\n        → RESPONSE\n\n// Conceptual integration flow`,
  },
  {
    eyebrow: "03 / OPERATE",
    title: "Design for control and operational visibility.",
    description: "Include authorization, execution history and diagnostics as part of the integration design, not as an afterthought.",
    labels: ["Access control", "Auditability", "Diagnostics"],
    icon: Activity,
    code: `trace_id: "DEMO-TRACE-001"\nstage: "workflow_execution"\nstate: "COMPLETED"\nchannel: "WEB"\n\n// Illustrative trace, not live data`,
  },
] as const;

const steps = [
  { title: "Discover", description: "Map your channels, services and integration requirements." },
  { title: "Design", description: "Agree on contracts, workflow boundaries and security controls." },
  { title: "Validate", description: "Review example requests and failure-handling strategies." },
  { title: "Deploy", description: "Plan DEV, UAT and production operations for your environment." },
] as const;

export default function FeaturesPage() {
  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <section className="relative overflow-hidden border-b bg-[#0b1527] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(to bottom,#000,transparent)" }} />
        <div className="container relative mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.15em] text-amber-300"><CircleDot size={14} /> O24 Product Capabilities</div>
              <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">One platform to <span className="text-amber-400">connect, orchestrate and operate.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">Explore how O24 brings API management, integration workflows and operational controls into a structured architecture for modern services.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">Request a technical demo <ArrowRight size={16}/></Link>
                <Link href="/developers/api-explorer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Explore API examples <ArrowUpRight size={16}/></Link>
              </div>
              <p className="mt-5 text-xs text-slate-400">Explore product concepts and implementation approaches. Detailed scope depends on your deployment.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#101f34] p-4 shadow-[0_24px_70px_-18px_rgba(0,0,0,.55)] sm:p-6" aria-label="Illustrative O24 integration flow">
              <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-4"><span className="font-mono text-xs text-slate-300">o24 / platform overview</span><span className="rounded-md border border-amber-500/25 px-2 py-1 text-[10px] font-semibold text-amber-300">CONCEPT PREVIEW</span></div>
              <div className="space-y-2">
                {architecture.map((node, i) => { const Icon = node.icon; return <div key={node.name}><div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 py-3"><span className="rounded-lg bg-amber-500/10 p-2 text-amber-400"><Icon size={20}/></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{node.name}</p><p className="text-xs text-slate-400">{node.detail}</p></div><Check size={16} className="text-amber-400"/></div>{i<architecture.length-1&&<div className="ml-7 h-3 border-l border-dashed border-amber-400/60" aria-hidden="true"/>}</div>; })}
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400"><ShieldCheck className="text-amber-400" size={16}/> Illustrative architecture · no live customer data</div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Platform capabilities</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Everything you need to build connected services.</h2><p className="mt-5 text-base leading-8 text-muted-foreground">Six capability areas support API-first integration initiatives. Available configurations are assessed with your implementation needs.</p></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, i) => { const Icon=feature.icon; return <article key={feature.title} className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-lg sm:p-7"><div className="flex items-start justify-between"><span className="rounded-xl bg-primary/10 p-3 text-primary"><Icon size={23}/></span><span className="text-xs font-semibold text-muted-foreground">{String(i+1).padStart(2,"0")}</span></div><p className="mt-6 text-[11px] font-bold uppercase tracking-[.15em] text-primary">{feature.category}</p><h3 className="mt-2 text-xl font-bold">{feature.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{feature.description}</p><div className="mt-6 flex flex-wrap gap-2">{feature.highlights.map(label=><span key={label} className="rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">{label}</span>)}</div><p className="mt-6 border-t pt-4 text-xs text-muted-foreground">{feature.audience}</p></article>; })}
        </div>
      </section>

      <section className="border-y bg-muted/20 py-20 lg:py-24" aria-labelledby="showcase-title">
        <div className="container mx-auto max-w-[1320px] px-4 sm:px-6"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">O24 Product Showcase</p><h2 id="showcase-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">From architecture to implementation.</h2><p className="mt-5 text-muted-foreground">Three practical perspectives on building and operating API-led integration systems.</p></div>
          <div className="mt-12 space-y-7">{showcases.map((item,i)=>{const Icon=item.icon;return <article key={item.eyebrow} className="grid overflow-hidden rounded-3xl border bg-card shadow-sm lg:grid-cols-2"><div className={`p-6 sm:p-9 lg:p-12 ${i%2?"lg:order-2":""}`}><div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary"><Icon size={18}/>{item.eyebrow}</div><h3 className="mt-5 max-w-xl text-2xl font-extrabold tracking-tight sm:text-3xl">{item.title}</h3><p className="mt-4 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">{item.description}</p><div className="mt-6 flex flex-wrap gap-2">{item.labels.map(label=><span key={label} className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs"><Check size={13} className="text-primary"/>{label}</span>)}</div><Link href={i===0?"/developers/api-explorer":"/developers/guides"} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">{i===0?"Explore API simulation":"Explore technical guides"}<ArrowRight size={16}/></Link></div><div className={`flex min-w-0 items-center bg-[#0c1729] p-5 text-slate-200 sm:p-8 lg:p-10 ${i%2?"lg:order-1":""}`}><div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#101f34]"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><span className="font-mono text-xs text-slate-400">o24 / illustrative example</span><span className="text-[10px] text-amber-400">EXAMPLE</span></div><pre className="overflow-x-auto p-5 font-mono text-xs leading-7 text-emerald-200 sm:text-sm"><code>{item.code}</code></pre></div></div></article>;})}</div>
        </div>
      </section>

      <section className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:py-24"><div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Implementation approach</p><h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">A structured path from discovery to deployment.</h2><p className="mt-5 leading-8 text-muted-foreground">An integration roadmap should reflect your security requirements, system landscape, operating model and delivery constraints.</p><Link href="/solutions" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">Explore solutions <ArrowRight size={16}/></Link></div><div className="grid gap-3 sm:grid-cols-2">{steps.map((step,i)=><div key={step.title} className="rounded-2xl border bg-card p-5"><span className="text-xs font-bold text-primary">0{i+1}</span><h3 className="mt-3 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p></div>)}</div></div></section>

      <section className="container mx-auto max-w-[1320px] px-4 pb-20 sm:px-6 lg:pb-24"><div className="overflow-hidden rounded-3xl bg-[#0d1829] px-6 py-12 text-center text-white sm:px-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Take the next step</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Explore what O24 could connect for your team.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">Discuss your system landscape, required integrations and deployment constraints in a technical walkthrough.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Request a demo <ArrowRight size={16}/></Link><Link href="/developers/getting-started" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Developer getting started <ChevronRight size={16}/></Link></div></div></section>
    </main>
  );
}
