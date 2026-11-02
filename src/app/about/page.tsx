import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Network, ShieldCheck, Workflow } from "lucide-react";

export const metadata: Metadata = {
  title: "About vKnight | API Architecture & Enterprise Integration",
  description: "Learn how vKnight approaches API management, banking integration, workflow orchestration and practical enterprise architecture with O24.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About vKnight | O24", description: "Engineering-led thinking for connected enterprise systems.", url: "/about", type: "website" },
};
const principles = [
  { title: "Design for integration", description: "Make boundaries and service contracts explicit before adding complexity.", icon: Network },
  { title: "Build for maintainability", description: "Use modular workflows and clear responsibilities to support evolving systems.", icon: Workflow },
  { title: "Consider security early", description: "Review identity, data handling and operational controls with each deployment.", icon: ShieldCheck },
  { title: "Keep developers productive", description: "Provide guides, architecture examples and a practical starting point for evaluation.", icon: Code2 },
] as const;
export default function AboutPage() {
  return <main className="min-h-screen bg-background">
    <section className="border-b bg-[#0b1527] text-white"><div className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:py-28">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-400">About vKnight</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Engineering connections between <span className="text-amber-400">systems and teams.</span></h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">vKnight develops and presents O24 as an approach to API management, workflow orchestration and enterprise integration. We focus on understanding existing systems and designing practical paths forward.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/solutions" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Explore solutions <ArrowRight size={16}/></Link><Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Contact us</Link></div>
    </div></section>
    <section className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6"><p className="text-xs font-bold uppercase tracking-widest text-primary">Our approach</p><h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">Start with architecture. Build with purpose.</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{principles.map(p => { const Icon=p.icon;return <article key={p.title} className="rounded-2xl border bg-card p-6"><Icon size={25} className="text-primary"/><h3 className="mt-5 text-lg font-bold">{p.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{p.description}</p></article>; })}</div></section>
    <section className="border-y bg-muted/25"><div className="container mx-auto max-w-[1320px] px-4 py-16 sm:px-6"><h2 className="text-2xl font-bold">Evaluate O24 with your team</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Explore public technical materials, review deployment questions, and discuss your requirements with the team. Product availability and commercial commitments are assessed for each project.</p><div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold text-primary"><Link href="/developers" className="hover:underline">Developer Hub →</Link><Link href="/security" className="hover:underline">Security & Trust →</Link><Link href="/demo" className="hover:underline">Request Demo →</Link></div></div></section>
  </main>;
}
