import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, FileText, Scale, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Terms Information | O24 by vKnight",
  description: "Important information about public O24 website resources, demonstrations and enterprise agreements.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Website Terms Information | O24 by vKnight", description: "Information about O24 website content and commercial terms.", url: "/terms", type: "website" },
};

const sections = [
  { icon: BookOpen, title: "Public website resources", body: "Pages, demonstrations, code examples and architectural illustrations are provided to explain O24 concepts. Examples may not represent a deployed integration or every available product capability." },
  { icon: ClipboardCheck, title: "Product scope and service arrangements", body: "Availability, licensing, service scope, onboarding, support responsibilities, deployment requirements and pricing are discussed with the team and should be documented in an applicable written agreement before reliance." },
  { icon: ShieldCheck, title: "Technical and security review", body: "Public technical content is informational. Security obligations, operational responsibilities and applicable controls must be assessed for the specific system and deployment environment." },
  { icon: Scale, title: "Legal terms requiring confirmation", body: "The organization must separately review and approve any legally binding terms covering account use, intellectual property, payment, warranties, limitations of liability, termination, dispute resolution and governing law. Those terms are not established by this informational summary." },
];

export default function TermsPage() {
  return <main className="min-h-screen bg-background text-foreground">
    <section className="border-b bg-[#0b1527] text-white"><div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Website information</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Terms &amp; usage information</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">Understand the distinction between public website resources and the terms that govern a specific commercial engagement.</p>
    </div></section>
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 text-sm leading-7"><FileText className="mt-1 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" /><p><strong>Legal review required:</strong> This page is a non-contractual information summary, not a finalized Terms of Service or a replacement for a legal agreement. Do not publish it as approved contractual terms without legal review.</p></div>
      <div className="grid gap-4 md:grid-cols-2">{sections.map(section => <section className="rounded-2xl border bg-card p-6 shadow-sm" key={section.title}>
        <section.icon className="h-7 w-7 text-primary" aria-hidden="true" /><h2 className="mt-4 text-xl font-bold">{section.title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
      </section>)}</div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">Ask about terms <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <Link href="/security" className="inline-flex min-h-11 items-center rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-accent">Security &amp; Trust</Link>
      </div>
    </div>
  </main>;
}
