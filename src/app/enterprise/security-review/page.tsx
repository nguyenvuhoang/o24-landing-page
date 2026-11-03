import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, ClipboardCheck, ShieldCheck } from "lucide-react";
import SecurityReviewClient from "./SecurityReviewClient";
import { createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = createPageMetadata({
  title: "Enterprise Security Review & FAQ | O24 by vKnight",
  description: "Plan an O24 enterprise security assessment: review identity, data, network, audit, operations and deployment responsibilities, with practical FAQs for technology teams.",
  path: "/enterprise/security-review",
  ogDescription: "Security review questions, evidence checklist, and enterprise integration FAQs for O24 evaluation.",
});

// Mirrors this page's own visible breadcrumb (Home > Enterprise > Security Review).
const breadcrumbData = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Enterprise", path: "/enterprise" },
  { name: "Security Review", path: "/enterprise/security-review" },
]);

export default function EnterpriseSecurityReviewPage() {
  return <main className="min-h-screen overflow-x-clip bg-background text-foreground">
    <JsonLd data={breadcrumbData} />
    <section className="relative overflow-hidden border-b bg-[#0b1527] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="container relative mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:py-24">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white">O24 Platform</Link><ChevronRight size={13} aria-hidden="true" />
          <Link href="/enterprise" className="hover:text-white">Enterprise</Link><ChevronRight size={13} aria-hidden="true" />
          <span className="text-amber-400">Security Review</span>
        </nav>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300"><ShieldCheck size={16}/> Security & Enterprise Readiness</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Review the risks. <span className="text-amber-400">Define the controls.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">A practical assessment workspace for CTOs, security teams and IT operations. Explore questions to resolve before connecting O24 to enterprise or banking systems.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#review-checklist" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Start review <ArrowRight size={16}/></a>
              <Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">Discuss with our team <ArrowRight size={16}/></Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/[.04] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5"><ClipboardCheck className="text-amber-400"/><div><p className="font-bold">Enterprise evaluation workspace</p><p className="mt-1 text-xs text-slate-400">Illustrative planning framework</p></div></div>
            <div className="mt-6 space-y-4">{[
              ["01", "Identify data and trust boundaries"], ["02", "Agree on access and security controls"], ["03", "Collect deployment-specific evidence"], ["04", "Define operational ownership"],
            ].map(([number, label]) => <div key={number} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#15243a] p-4"><span className="font-mono text-sm text-amber-400">{number}</span><span className="text-sm font-medium text-slate-200">{label}</span></div>)}</div>
            <p className="mt-6 text-xs leading-6 text-slate-400">This page is not a certification, audit report or guarantee of security controls. Evidence and scope must be verified for each deployment.</p>
          </div>
        </div>
      </div>
    </section>
    <SecurityReviewClient />
    <section className="container mx-auto max-w-[1320px] px-4 pb-20 sm:px-6 lg:pb-28">
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-7 sm:p-10 lg:flex-row lg:items-center">
        <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Next step</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Discuss your security requirements.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">Share your environment, integrations and assessment process with the vKnight team. Any proposed controls and service commitments require formal confirmation.</p></div>
        <div className="flex flex-wrap gap-3"><Link href="/security" className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-semibold">Trust Center <ArrowRight size={16}/></Link><Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Request Demo <ArrowRight size={16}/></Link></div>
      </div>
    </section>
  </main>;
}
