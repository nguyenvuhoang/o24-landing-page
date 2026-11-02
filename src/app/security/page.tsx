import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, BookOpen, CheckCircle2,
  ClipboardCheck, Database, Fingerprint, GitBranch, KeyRound,
  LockKeyhole, Network, Server, ShieldCheck, Workflow,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Trust Center | O24 by vKnight",
  description:
    "Explore security architecture considerations for O24 integrations, including identity, access, sensitive data, deployment boundaries, auditability and enterprise security reviews.",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security & Trust Center | O24 by vKnight",
    description: "Review the security considerations and governance questions for enterprise integration with O24.",
    url: "/security",
    type: "website",
  },
};

const pillars = [
  {
    icon: Fingerprint,
    eyebrow: "IDENTITY & ACCESS",
    title: "Control who can access services",
    description: "Evaluate authentication, authorization and service identity in the context of your applications and partner connections.",
    checks: ["Identity provider and token validation", "Role and privilege boundaries", "Service-to-service trust"],
  },
  {
    icon: LockKeyhole,
    eyebrow: "DATA PROTECTION",
    title: "Design for sensitive information",
    description: "Identify data classifications, transport protection, storage controls and how secrets should be managed in your environment.",
    checks: ["Sensitive-data inventory", "Transport and storage requirements", "Secret and credential lifecycle"],
  },
  {
    icon: Network,
    eyebrow: "INFRASTRUCTURE",
    title: "Understand deployment boundaries",
    description: "Review network segmentation, runtime isolation and connectivity between client channels, O24 services and existing systems.",
    checks: ["Network trust boundaries", "Environment and workload isolation", "Allowed integrations and endpoints"],
  },
  {
    icon: Activity,
    eyebrow: "AUDIT & OPERATIONS",
    title: "Prepare for investigation and recovery",
    description: "Define what should be logged, how alerts are handled, and who owns incident response and restoration processes.",
    checks: ["Audit event requirements", "Monitoring and alert ownership", "Incident and recovery procedures"],
  },
] as const;

const review = [
  { icon: ClipboardCheck, title: "1. Scope", body: "Identify systems, users, channels, data classes and regulatory obligations relevant to your deployment." },
  { icon: GitBranch, title: "2. Architecture", body: "Review authentication boundaries, network paths, adapters, workflows and third-party dependencies." },
  { icon: ShieldCheck, title: "3. Verification", body: "Agree on the evidence, testing, policies and configuration checks needed before production approval." },
  { icon: Server, title: "4. Operations", body: "Document responsibility for monitoring, change control, backup, response and ongoing review." },
] as const;

export default function SecurityPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <section className="relative overflow-hidden border-b bg-[#0b1527] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-28 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="container relative mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:py-24">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white">O24 Platform</Link><span aria-hidden="true">/</span>
            <span className="text-amber-400">Security & Trust</span>
          </nav>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                <ShieldCheck size={16} aria-hidden="true" /> Security & Trust Center
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Security starts with <span className="text-amber-400">clear architecture and accountability.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Explore the security and governance considerations involved in integrating O24 with your enterprise systems. Assess controls, responsibilities and evidence against your actual deployment requirements.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400">Request security walkthrough <ArrowRight size={16} /></Link>
                <Link href="/developers/guides" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Explore developer guides <ArrowUpRight size={16} /></Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-[#121f33] p-5 shadow-2xl shadow-black/20 sm:p-7" aria-label="Conceptual security boundaries">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4"><span className="font-mono text-xs text-slate-300">o24 / security boundaries</span><span className="text-[10px] font-bold text-amber-300">CONCEPTUAL</span></div>
              <div className="mt-5 space-y-3">
                {[
                  {icon: KeyRound, name: "Identity & access", hint: "Users · Services · Policies"},
                  {icon: Workflow, name: "API & workflow controls", hint: "Requests · Business rules"},
                  {icon: Database, name: "Sensitive data boundaries", hint: "Storage · External systems"},
                  {icon: Activity, name: "Audit & response", hint: "Events · Monitoring · Ownership"},
                ].map(({icon:Icon,name,hint}) => <div key={name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] p-4"><span className="rounded-lg bg-amber-500/10 p-2 text-amber-300"><Icon size={20} /></span><div className="flex-1"><p className="text-sm font-semibold">{name}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div><CheckCircle2 size={16} className="text-slate-500" aria-hidden="true" /></div>)}
              </div>
              <p className="mt-5 text-xs leading-6 text-slate-400">Architecture illustration only. This diagram does not certify a particular security implementation, control or compliance status.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:py-24" aria-labelledby="pillars-title">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-primary">Security review areas</p><h2 id="pillars-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Four areas to evaluate before deployment.</h2><p className="mt-4 leading-7 text-muted-foreground">Security controls must be reviewed against the systems, threat model and regulatory environment of each implementation.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {pillars.map(({icon:Icon,eyebrow,title,description,checks})=><article key={title} className="rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40 sm:p-8"><span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary"><Icon size={24}/></span><p className="mt-6 text-xs font-bold tracking-widest text-primary">{eyebrow}</p><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p><ul className="mt-6 space-y-3 border-t pt-5">{checks.map(c=><li key={c} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true"/>{c}</li>)}</ul></article>)}
        </div>
      </section>

      <section className="border-y bg-muted/30 py-20 lg:py-24" aria-labelledby="review-title"><div className="container mx-auto max-w-[1320px] px-4 sm:px-6"><p className="text-xs font-bold uppercase tracking-widest text-primary">Enterprise security assessment</p><h2 id="review-title" className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">Move from an architecture discussion to an evidence-based review.</h2><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{review.map(({icon:Icon,title,body})=><article key={title} className="rounded-2xl border bg-card p-6"><Icon size={26} className="text-primary"/><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p></article>)}</div></div></section>

      <section className="container mx-auto grid max-w-[1320px] gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Security questions</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Planning an enterprise integration?</h2><p className="mt-5 leading-8 text-muted-foreground">The appropriate control set, testing evidence, operational commitments and responsibilities depend on your agreed project scope. Share the requirements you would like to evaluate with the O24 team.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/solutions/enterprise" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Enterprise solutions <ArrowRight size={16}/></Link><Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold hover:border-primary/40">Contact us <ArrowRight size={16}/></Link></div></div><div className="rounded-2xl border bg-card p-6 sm:p-8"><h3 className="text-lg font-bold">Continue your evaluation</h3><div className="mt-5 space-y-4">{[{href:"/developers/guides",icon:BookOpen,name:"Technical guides",desc:"Review architecture and integration patterns"},{href:"/solutions/enterprise",icon:Server,name:"Enterprise integration",desc:"Explore deployment and governance planning"},{href:"/developers/api-explorer",icon:Network,name:"API Explorer",desc:"Try illustrative requests in a browser simulation"}].map(({href,icon:Icon,name,desc})=><Link key={href} href={href} className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40"><Icon className="shrink-0 text-primary" size={21}/><span className="flex-1"><span className="block text-sm font-bold">{name}</span><span className="mt-1 block text-xs text-muted-foreground">{desc}</span></span><ArrowRight size={16} className="text-primary"/></Link>)}</div></div></section>
    </main>
  );
}
