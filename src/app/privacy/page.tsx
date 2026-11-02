import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, Eye, FileText, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Information | O24 by vKnight",
  description: "Learn what information the O24 website requests through its inquiry forms and how to contact the team about privacy questions.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Information | O24 by vKnight", description: "How O24 website inquiries and analytics are handled.", url: "/privacy", type: "website" },
};

const topics = [
  { icon: Database, title: "Information you submit", detail: "The technical demo form requests your name, work email, company, role, areas of interest, deployment preference and a description of your requirements. Optional fields may include implementation timeline and other preferences. The enterprise consultation form requests additional project details." },
  { icon: Mail, title: "Responding to inquiries", detail: "The demo request workflow stores the information provided in its lead record and sends an email notification to the team. The enterprise consultation workflow sends the submitted inquiry by email. Only submit information you are comfortable sharing for that purpose." },
  { icon: Eye, title: "Website measurement", detail: "The website may use aggregated page and navigation analytics to understand which public resources are useful. Custom marketing events are designed not to include form contents, names or email addresses. Hosting and analytics providers may independently process technical request information under their respective terms." },
  { icon: LockKeyhole, title: "Security and deployment scope", detail: "Access controls, data handling, storage configuration and security requirements depend on the service and deployment environment. This page does not certify a particular encryption standard, compliance status or testing cadence. Enterprise-specific controls should be confirmed during security review." },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b bg-[#0b1527] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="container relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Website transparency</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy information</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">An overview of information collected when you contact the O24 team through this website and how to raise privacy questions.</p>
        </div>
      </section>
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 text-sm leading-7">
          <FileText className="mt-1 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <p><strong>Publication review:</strong> This plain-language page describes currently identified website workflows. The organization should confirm its full privacy notice, controller details, retention periods, service providers, international transfers and applicable data-subject rights before treating it as a final legal privacy policy.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => <section key={topic.title} className="rounded-2xl border bg-card p-6 shadow-sm">
            <topic.icon className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">{topic.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{topic.detail}</p>
          </section>)}
        </div>
        <section className="mt-10 rounded-2xl border bg-muted/30 p-6 sm:p-8">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-6 w-6 text-primary" aria-hidden="true" /><div>
            <h2 className="text-xl font-bold">Privacy questions and requests</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">For questions about information you have submitted, or to ask about access, correction or deletion, please contact the team. Requests will be assessed based on applicable law and operational requirements.</p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline">Contact vKnight <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div></div>
        </section>
      </div>
    </main>
  );
}
