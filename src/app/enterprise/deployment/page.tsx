import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, ClipboardList, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { DeploymentExplorer } from "./DeploymentExplorer";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Enterprise Deployment & Operations | O24 by vKnight",
  description: "Explore conceptual O24 deployment patterns, operational ownership, security review, observability and production-readiness planning for enterprise integrations.",
  path: "/enterprise/deployment",
  ogDescription: "Compare on-premises, private cloud and hybrid deployment considerations for enterprise integration.",
});

const phases = [
  { number: "01", title: "Discover", text: "Identify service owners, system boundaries, data classifications and regulatory requirements." },
  { number: "02", title: "Design", text: "Review network paths, trust boundaries, identity, availability and disaster recovery expectations." },
  { number: "03", title: "Validate", text: "Agree on environment-specific acceptance criteria, failure modes, logging and recovery procedures." },
  { number: "04", title: "Operate", text: "Define incident ownership, change controls, monitoring, runbooks and periodic access reviews." },
] as const;

const reviewAreas = [
  { icon: LockKeyhole, title: "Identity & access", text: "Confirm authentication flows, roles, privileged access, secret rotation and separation of duties." },
  { icon: Network, title: "Network & integration", text: "Map ingress, egress, private connectivity and dependencies on existing business systems." },
  { icon: ShieldCheck, title: "Data & audit", text: "Agree on data handling, retention, encryption requirements and audit evidence with your security team." },
  { icon: ClipboardList, title: "Operations & continuity", text: "Plan observability, restore testing, incident response, rollback and change approval." },
] as const;

export default function EnterpriseDeploymentPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0b1527] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="container relative mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link href="/solutions" className="hover:text-white">Solutions</Link><ChevronRight size={14} aria-hidden="true" />
            <Link href="/solutions/enterprise" className="hover:text-white">Enterprise Integration</Link><ChevronRight size={14} aria-hidden="true" />
            <span className="text-amber-400">Deployment & Operations</span>
          </nav>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300">Enterprise readiness</p>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Deployment choices. <span className="text-amber-400">Operational clarity.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">Plan an O24 integration around your infrastructure, security obligations and operating model. Explore reference deployment patterns and the decisions required before production rollout.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Request technical review <ArrowRight size={17} /></Link>
                <Link href="/security" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Security & Trust <ArrowRight size={17} /></Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[.045] p-6 sm:p-8">
              <p className="font-mono text-xs text-slate-400">deployment / review checklist</p>
              <div className="mt-6 space-y-4">
                {[
                  "Infrastructure & data boundaries",
                  "Access control & secrets ownership",
                  "Monitoring & incident response",
                  "Backup, restore & recovery objectives",
                  "Change approval & rollback plan",
                ].map((item, index) => <div key={item} className="flex items-start gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-amber-400" /><span className="text-sm leading-6 text-slate-200">{String(index + 1).padStart(2, "0")} · {item}</span></div>)}
              </div>
              <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-slate-400">Planning checklist only. This page does not assert certifications, contracted SLAs or an installed production topology.</p>
            </div>
          </div>
        </div>
      </section>

      <DeploymentExplorer />

      <section className="border-y bg-muted/30 py-20 lg:py-24" aria-labelledby="operational-review-heading">
        <div className="container mx-auto max-w-[1320px] px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[.17em] text-primary">Operations & governance</p>
          <h2 id="operational-review-heading" className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">Ownership is part of the architecture.</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">Deployment decisions should be evaluated alongside controls and day-two operations. The actual responsibilities depend on the agreed environment and service scope.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reviewAreas.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border bg-card p-6"><span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary"><Icon size={23} /></span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24" aria-labelledby="readiness-heading">
        <div className="container mx-auto max-w-[1320px] px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[.17em] text-primary">Delivery planning</p>
          <h2 id="readiness-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">From assessment to production readiness.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {phases.map(phase => <article key={phase.number} className="rounded-2xl border bg-card p-6"><span className="font-mono text-sm font-bold text-primary">{phase.number}</span><h3 className="mt-5 text-xl font-bold">{phase.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{phase.text}</p></article>)}
          </div>
          <div className="mt-12 rounded-3xl bg-[#0b1527] p-8 text-white sm:p-12">
            <h2 className="max-w-2xl text-3xl font-bold">Review your deployment requirements with vKnight.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">Bring your network, compliance, environment and integration constraints to a technical discussion. Proposed scope and service levels are confirmed during evaluation.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Request a demo <ArrowRight size={17}/></Link>
              <Link href="/solutions/enterprise" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Enterprise solutions</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
