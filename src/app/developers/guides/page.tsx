import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Braces, GitBranch, Landmark, ShieldCheck } from "lucide-react";
import { guides } from "@/lib/developer-guides/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Engineering Guides | O24 Developer Hub",
  description: "Learn workflow orchestration, CQRS, API gateway design and core banking integration through practical architecture guides.",
  path: "/developers/guides",
});
const icons = [GitBranch, Braces, ShieldCheck, Landmark];
export default function GuidesIndex() {
  return <main className="min-h-screen bg-background">
    <section className="border-b bg-[#0b1628] py-14 text-white sm:py-20"><div className="container mx-auto max-w-6xl px-4">
      <Link href="/developers" className="text-sm text-slate-300 hover:text-amber-400">← Developer Hub</Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-amber-400">O24 / Developer documentation</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Build on solid architecture.</h1>
      <p className="mt-5 max-w-2xl leading-8 text-slate-300">Focused technical guides on service boundaries, workflow control, API security and banking integration. Conceptual examples, not published O24 API contracts.</p>
      <Link href="/developers/api-explorer" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Open API Explorer <ArrowRight size={16}/></Link>
    </div></section>
    <section className="container mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <div className="mb-8 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/><h2 className="text-2xl font-bold">Architecture learning paths</h2></div>
      <div className="grid gap-5 md:grid-cols-2">{guides.map((g,i)=>{const Icon=icons[i];return <Link key={g.slug} href={`/developers/guides/${g.slug}`} className="group rounded-2xl border bg-card p-6 transition hover:border-primary/45 hover:shadow-lg sm:p-7">
        <div className="flex items-start justify-between"><span className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="h-6 w-6"/></span><span className="text-xs text-muted-foreground">{g.readingMinutes} min guide</span></div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-primary">{g.eyebrow}</p><h3 className="mt-2 text-xl font-bold sm:text-2xl">{g.title}</h3><p className="mt-3 min-h-20 text-sm leading-7 text-muted-foreground">{g.summary}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Read guide <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></span>
      </Link>})}</div>
      <p className="mt-9 text-xs leading-6 text-muted-foreground">These are educational reference patterns. Confirm all security controls, data contracts and implementation details with your actual deployment.</p>
    </section>
  </main>;
}
