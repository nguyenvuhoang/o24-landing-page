import { ConversionLink } from "@/components/analytics/ConversionLink";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Layers3, Network, ShieldCheck, Workflow } from "lucide-react";
import { solutions } from "@/data/solutions";
import { createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = createPageMetadata({
  title: "O24 Solutions | Banking, Enterprise & Developer Integration",
  description: "Discover O24 integration approaches for banking and fintech, enterprise system modernization, and developer teams. Explore architecture considerations and plan a technical demo.",
  path: "/solutions",
  ogTitle: "O24 Solutions | vKnight",
  ogDescription: "Explore API-led integration solutions for banking, enterprises, and engineering teams.",
});

const considerations = [
  { icon: Network, title: "Connect", description: "Map legacy applications, digital channels and partner integration boundaries." },
  { icon: Workflow, title: "Orchestrate", description: "Coordinate service workflows with explicit decisions and failure handling." },
  { icon: ShieldCheck, title: "Govern", description: "Define identity, access controls, observability and operational ownership." },
] as const;

const breadcrumbData = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Solutions", path: "/solutions" },
]);

export default function SolutionsOverviewPage() {
  return <main className="overflow-x-clip bg-background">
    <JsonLd data={breadcrumbData} />
    <section className="border-b bg-[#0b1527] text-white"><div className="container mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:py-24"><div className="flex items-center gap-2 text-xs text-slate-400"><Link href="/" className="hover:text-white">O24 Platform</Link><ChevronRight size={13}/><span className="text-amber-400">Solutions</span></div><div className="mt-8 max-w-4xl"><span className="text-xs font-bold uppercase tracking-widest text-amber-400">O24 Solutions</span><h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Integration paths for <span className="text-amber-400">different teams, one architecture.</span></h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">Whether you are connecting financial services, modernizing enterprise systems, or building APIs, explore a practical starting point for your requirements.</p><div className="mt-8 flex flex-wrap gap-3"><ConversionLink href="/demo" source="solutions" placement="hero" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Discuss your project <ArrowRight size={16}/></ConversionLink><Link href="/features" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Platform capabilities <ArrowUpRight size={16}/></Link></div></div></div></section>
    <section className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:py-24"><p className="text-xs font-bold uppercase tracking-widest text-primary">Find your starting point</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Solutions built around your goals.</h2><div className="mt-10 grid gap-5 lg:grid-cols-3">{solutions.map((s,i)=>{const Icon=s.icon;return <article key={s.id} className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-lg sm:p-8"><div className="flex items-start justify-between"><span className="rounded-xl bg-primary/10 p-3 text-primary"><Icon size={25}/></span><span className="text-xs font-semibold text-muted-foreground">0{i+1}</span></div><p className="mt-7 text-xs font-bold uppercase tracking-widest text-primary">{s.audience}</p><h3 className="mt-2 text-2xl font-bold">{s.title}</h3><p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{s.description}</p><ul className="mt-6 space-y-3 border-t pt-6">{s.features.map(f=><li key={f} className="flex items-start gap-2 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-primary"/>{f}</li>)}</ul><Link href={s.href} className="mt-8 inline-flex min-h-11 items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-primary hover:border-primary/50 hover:bg-primary/10">{s.cta}<ArrowRight size={17}/></Link></article>})}</div></section>
    <section className="border-y bg-muted/20 py-20 lg:py-24"><div className="container mx-auto max-w-[1320px] px-4 sm:px-6"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-widest text-primary">Shared foundation</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Connect. Orchestrate. Govern.</h2><p className="mt-4 text-muted-foreground">The exact integration design depends on your existing systems, governance requirements and deployment environment.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{considerations.map(c=>{const Icon=c.icon;return <div key={c.title} className="rounded-2xl border bg-card p-6"><Icon size={24} className="text-primary"/><h3 className="mt-4 text-lg font-bold">{c.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{c.description}</p></div>})}</div></div></section>
    <section className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6"><div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-7 sm:p-10 lg:flex-row lg:items-center"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"><Layers3 size={16}/> Technical evaluation</div><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Need a closer look at O24?</h2><p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">Explore public technical guides and illustrative API requests, or arrange a tailored demonstration.</p></div><div className="flex flex-wrap gap-3"><Link href="/developers" className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-bold hover:border-primary/40">Developer Hub <ArrowRight size={16}/></Link><ConversionLink href="/demo" source="solutions" placement="bottom" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">Request Demo <ArrowRight size={16}/></ConversionLink></div></div></section>
  </main>;
}
