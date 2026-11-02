"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, ClipboardCopy, RotateCcw, Search, ShieldCheck } from "lucide-react";

const domains = [
  { id: "identity", label: "Identity & Access", checks: ["Identify human, service and partner identities", "Define least-privilege roles and approval ownership", "Review token issuance, expiry and revocation", "Document access review and offboarding procedures"] },
  { id: "data", label: "Data Protection", checks: ["Classify personal, payment and sensitive data", "Confirm storage locations and retention requirements", "Review encryption, secrets and key-management requirements", "Define masking and safe logging rules"] },
  { id: "network", label: "Network & Integration", checks: ["Map network trust boundaries and permitted traffic", "Document API gateway and core adapter connectivity", "Separate development, testing and production environments", "Review third-party dependencies and security responsibilities"] },
  { id: "operations", label: "Operations & Recovery", checks: ["Assign monitoring, alerting and incident response owners", "Define backup, restore and recovery verification requirements", "Agree on change management and rollback procedures", "Review audit evidence, retention and access controls"] },
] as const;

const faq = [
  { category: "Data", q: "Where will enterprise data be stored?", a: "Storage location depends on the approved deployment architecture, hosting provider and selected integrations. Confirm data residency, databases, backups and retention with the project team before implementation." },
  { category: "Identity", q: "How are users and APIs authenticated?", a: "Assess identity providers, authentication methods, token validation and service-to-service trust for your environment. Specific mechanisms and integrations must be confirmed during technical scoping." },
  { category: "Deployment", q: "Can O24 be deployed on-premises or in a private cloud?", a: "On-premises, private-cloud and hybrid topologies can be assessed as deployment options. Feasibility, infrastructure prerequisites and operational responsibilities require an architecture review." },
  { category: "Data", q: "Does the platform meet our regulatory or compliance requirements?", a: "No certification or regulatory compliance is asserted by this page. Your legal, risk and security teams should map applicable requirements to verified configuration, policies, tests and documentary evidence." },
  { category: "Operations", q: "Who owns monitoring, backup and disaster recovery?", a: "Responsibility is determined by the operating model and contract. Document the owners, escalation contacts, backup schedule, recovery objectives and evidence of restore testing before go-live." },
  { category: "Integration", q: "How does O24 connect to existing core banking systems?", a: "An integration architecture can use APIs, adapters and workflow boundaries. Exact protocols, interface contracts, data mapping, transaction consistency and failure handling depend on the connected core system." },
  { category: "Operations", q: "What happens if a payment request times out?", a: "A timeout may leave the outcome unknown. The integration design should support correlation, status verification and reconciliation rather than blindly retrying a financial operation. Behavior must be specified and tested per workflow." },
  { category: "Identity", q: "Is SSO, LDAP or Active Directory supported?", a: "Do not assume any particular identity provider is enabled by default. Share your SSO and directory requirements for a compatibility and integration assessment." },
  { category: "Operations", q: "Is an uptime SLA or 24/7 support included?", a: "Availability targets, support windows, response times and remedies are commercial commitments only when explicitly agreed in signed service terms. This page does not promise a default SLA." },
  { category: "Integration", q: "Can we review API contracts and integration examples?", a: "The public Developer Portal includes architectural guides and illustrative API simulations. Real endpoints, authentication details and implementation contracts are provided only through an authorized integration process." },
] as const;

type CheckState = Record<string, boolean>;

export default function SecurityReviewClient() {
  const [active, setActive] = useState<string>(domains[0].id);
  const [done, setDone] = useState<CheckState>({});
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(faq[0].q);
  const [copied, setCopied] = useState(false);
  const selected = domains.find(d => d.id === active) ?? domains[0];
  const total = domains.reduce((sum, d) => sum + d.checks.length, 0);
  const completed = Object.values(done).filter(Boolean).length;
  const categories = ["All", ...new Set(faq.map(f => f.category))];
  const matches = useMemo(() => faq.filter(f => (filter === "All" || f.category === filter) && `${f.q} ${f.a}`.toLowerCase().includes(query.toLowerCase().trim())), [filter, query]);
  const toggle = (key: string) => setDone(previous => ({ ...previous, [key]: !previous[key] }));
  const copySummary = async () => {
    const summary = { title: "O24 enterprise security review — planning checklist", notice: "Self-assessment only; not evidence of implemented controls.", generated_at: new Date().toISOString(), progress: { completed, total }, domains: domains.map(d => ({ domain: d.label, items: d.checks.map(c => ({ question: c, reviewed: Boolean(done[`${d.id}:${c}`]) })) })) };
    try { await navigator.clipboard.writeText(JSON.stringify(summary, null, 2)); setCopied(true); } catch { setCopied(false); }
  };
  return <>
    <section id="review-checklist" aria-labelledby="review-heading" className="scroll-mt-24 py-20 lg:py-24">
      <div className="container mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-primary">Security assessment</p><h2 id="review-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Review the essentials before go-live.</h2><p className="mt-4 leading-7 text-muted-foreground">Use this planning checklist to structure conversations between engineering, security and operations. Checking a box indicates it was reviewed, not that a control was verified or certified.</p></div>
        <div className="mt-9 rounded-2xl border bg-card p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><ShieldCheck className="text-primary"/><span className="font-bold">Assessment progress</span></div><span className="text-sm font-semibold tabular-nums" aria-live="polite">{completed} / {total} reviewed</span></div>
          <div role="progressbar" aria-label="Security review progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed} className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-amber-500 transition-[width]" style={{ width: `${(completed / total) * 100}%` }}/></div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[250px_1fr]">
            <div role="tablist" aria-label="Security review domains" className="flex gap-2 overflow-x-auto lg:flex-col">{domains.map(d => <button key={d.id} type="button" role="tab" aria-selected={active === d.id} onClick={() => setActive(d.id)} className={`min-w-max rounded-xl border px-4 py-3 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-primary ${active === d.id ? "border-primary/50 bg-primary/10 text-primary" : "hover:bg-muted"}`}>{d.label}<span className="ml-3 text-xs text-muted-foreground">{d.checks.filter(c => done[`${d.id}:${c}`]).length}/{d.checks.length}</span></button>)}</div>
            <div role="tabpanel" className="rounded-xl border bg-background p-4 sm:p-6"><h3 className="text-xl font-bold">{selected.label}</h3><p className="mt-2 text-sm text-muted-foreground">Mark each topic after it has been discussed with the relevant owner.</p><div className="mt-5 space-y-3">{selected.checks.map(c => { const key = `${selected.id}:${c}`; return <label key={key} className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:border-primary/35"><input type="checkbox" checked={Boolean(done[key])} onChange={() => toggle(key)} className="mt-1 h-4 w-4 shrink-0 accent-orange-500"/><span className="text-sm leading-6">{c}</span></label>; })}</div></div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5"><p className="text-xs text-muted-foreground">State is local to this page and is not sent to a server.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setDone({}); setCopied(false); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"><RotateCcw size={15}/> Reset</button><button type="button" onClick={copySummary} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"><ClipboardCopy size={15}/> {copied ? "Copied summary" : "Copy review summary"}</button></div></div>
        </div>
      </div>
    </section>
    <section id="enterprise-faq" aria-labelledby="faq-heading" className="scroll-mt-24 border-y bg-muted/25 py-20 lg:py-24">
      <div className="container mx-auto max-w-[1100px] px-4 sm:px-6"><p className="text-xs font-bold uppercase tracking-widest text-primary">Enterprise FAQ</p><h2 id="faq-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Common questions from technology and risk teams.</h2><p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Answers describe topics to verify during enterprise evaluation. They are not guarantees of a specific implementation or legal compliance.</p>
        <div className="mt-8 rounded-2xl border bg-card p-4 sm:p-5"><div className="relative"><Search size={17} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e => setQuery(e.target.value)} type="search" aria-label="Search enterprise questions" placeholder="Search data residency, SSO, backups, SLA…" className="min-h-12 w-full rounded-xl border bg-background py-3 pl-11 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"/></div><div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="FAQ category">{categories.map(c => <button key={c} type="button" aria-pressed={filter===c} onClick={() => setFilter(c)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${filter === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/40"}`}>{c}</button>)}</div></div>
        <p className="mt-5 text-sm text-muted-foreground" role="status">{matches.length} questions</p>
        <div className="mt-4 space-y-3">{matches.map(item => { const open = expanded === item.q; return <div key={item.q} className="overflow-hidden rounded-xl border bg-card"><button type="button" aria-expanded={open} onClick={() => setExpanded(open ? null : item.q)} className="flex min-h-16 w-full items-center justify-between gap-5 p-5 text-left"><span className="text-sm font-bold sm:text-base">{item.q}</span><ChevronDown aria-hidden="true" size={18} className={`shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}/></button>{open && <div className="border-t px-5 pb-5 pt-4"><p className="text-sm leading-7 text-muted-foreground">{item.a}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary"><Check size={14}/> Requires project-specific verification</span></div>}</div>; })}{matches.length===0 && <div className="rounded-xl border border-dashed p-8 text-center"><p className="font-semibold">No matching questions.</p><button type="button" className="mt-3 text-sm font-semibold text-primary hover:underline" onClick={() => { setQuery(""); setFilter("All"); }}>Clear filters <ArrowRight size={14} className="inline"/></button></div>}</div>
      </div>
    </section>
  </>;
}
