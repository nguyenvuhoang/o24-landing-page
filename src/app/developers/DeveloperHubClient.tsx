"use client";

import { TrackedLink } from "@/components/analytics/TrackedLink";
import type { BlogArticle, BlogCategory, BlogIcon } from "@/data/blog";
import {
  ArrowRight, BookOpen, Braces, CheckCircle2, ChevronRight, Code2,
  Compass, ExternalLink, GitBranch, Landmark, Layers3,
  Menu, Search, ServerCog, ShieldCheck, Sparkles, X, Rocket,
  BookOpenText,
  Terminal,
} from "lucide-react";

import Link from "next/link";
import { useMemo, useState } from "react";

type Article = Pick<BlogArticle, "slug" | "title" | "description" | "category" | "readTimeMinutes" | "icon">;
type Track = "All resources" | "Architecture" | "API Security" | "Banking" | "DevOps";
const tracks: readonly Track[] = ["All resources", "Architecture", "API Security", "Banking", "DevOps"];
const categoryTrack: Record<BlogCategory, Exclude<Track, "All resources">> = {
  ".NET Architecture": "Architecture", "API Architecture": "Architecture",
  "Banking Integration": "Banking", "Security": "API Security", "DevOps": "DevOps",
};
const icons = { code: Code2, layers: Layers3, landmark: Landmark, shield: ShieldCheck, server: ServerCog } satisfies Record<BlogIcon, typeof Code2>;
const subjects = [
  { name: "Architecture" as const, icon: GitBranch, about: "CQRS, service boundaries and messaging" },
  { name: "API Security" as const, icon: ShieldCheck, about: "JWT, authorization and Zero Trust" },
  { name: "Banking" as const, icon: Landmark, about: "Core adapters and transaction reliability" },
  { name: "DevOps" as const, icon: ServerCog, about: "Containers, delivery and operations" },
];
const links = [
  {
    title: "Getting Started",
    description: "Start building with O24",
    href: "/developers/getting-started",
    icon: Rocket,
  },
  {
    title: "Interactive API Explorer",
    description: "Try simulated API requests",
    href: "/developers/api-explorer",
    icon: Terminal,
  },
  {
    title: "Technical Documentation",
    description: "Architecture & workflow guides",
    href: "/developers/guides",
    icon: BookOpenText,
  },
  {
    title: "Explore the platform",
    description: "O24 capabilities & architecture",
    href: "/features",
    icon: Layers3,
  },
  {
    title: "Developer solutions",
    description: "Integration paths for engineering teams",
    href: "/solutions/developers",
    icon: Braces,
  },
  {
    title: "Request a technical demo",
    description: "Discuss integration requirements",
    href: "/demo",
    icon: Compass,
  },
];
export default function DeveloperHubClient({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track>("All resources");
  const [mobileNav, setMobileNav] = useState(false);
  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return articles.filter((article) =>
      (track === "All resources" || categoryTrack[article.category] === track) &&
      (!term || `${article.title} ${article.description} ${article.category}`.toLocaleLowerCase().includes(term))
    );
  }, [articles, track, query]);
  const featured = articles.slice(0, 3);
  const selectTrack = (value: Track) => {
    setTrack(value);
    setMobileNav(false);
    document.getElementById("developer-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground" id="developer-hub">
      <div className="border-b bg-[#0c1729] text-white">
        <div className="container mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400"><Link href="/" className="hover:text-white">O24 Platform</Link><ChevronRight size={13} /><span className="text-amber-400">Developer Hub</span></div>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_360px] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-300"><Sparkles size={13} /> Engineering resources</div>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.6rem] lg:leading-tight">Build reliable systems.<span className="block text-amber-400">Learn the architecture.</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">Explore practical guides for .NET, API architecture, security, core banking integration and DevOps. Understand the trade-offs before you ship.</p>
              <div className="mt-7 flex flex-wrap gap-3"><a href="#developer-library" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Browse guides <ArrowRight size={16} /></a><TrackedLink href="/solutions/developers" eventName="engineering_hub_to_solution" source="developer_hub" destination="/solutions/developers" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Explore O24 <ExternalLink size={15} /></TrackedLink></div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/[.045] p-5 shadow-2xl shadow-black/20" aria-label="Developer resources overview">
              <div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="font-mono text-xs text-slate-300">developer / overview</span><span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">PUBLIC GUIDES</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/10 bg-[#15243a] p-4"><p className="text-3xl font-bold text-white">{articles.length}</p><p className="mt-1 text-xs text-slate-400">Published guides</p></div><div className="rounded-xl border border-white/10 bg-[#15243a] p-4"><p className="text-3xl font-bold text-white">4</p><p className="mt-1 text-xs text-slate-400">Learning tracks</p></div></div>
              <div className="mt-4 space-y-3">{["Production-oriented patterns", "Security and integration trade-offs", "Practical engineering walkthroughs"].map(t => <div key={t} className="flex items-center gap-2.5 text-xs text-slate-300"><CheckCircle2 size={15} className="text-amber-400" />{t}</div>)}</div>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">Engineering articles and conceptual platform information. API endpoint reference and live sandbox access are not represented here.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="grid gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)] lg:overflow-y-auto" aria-label="Developer navigation">
            <button type="button" aria-expanded={mobileNav} aria-controls="developer-sidebar" onClick={() => setMobileNav(v => !v)} className="flex min-h-11 w-full items-center justify-between rounded-xl border bg-card px-4 text-sm font-semibold lg:hidden"><span className="flex items-center gap-2"><Menu size={16} /> Browse topics</span><ChevronRight size={16} className={mobileNav ? "rotate-90 transition-transform" : "transition-transform"} /></button>
            <div id="developer-sidebar" className={`${mobileNav ? "block" : "hidden"} mt-3 rounded-xl border bg-card p-3 lg:mt-0 lg:block lg:border-0 lg:bg-transparent lg:p-0`}>
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.17em] text-muted-foreground">Resource library</p>
              <nav className="space-y-1" aria-label="Learning tracks">{tracks.map(t => <button key={t} type="button" aria-current={track === t ? "true" : undefined} onClick={() => selectTrack(t)} className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${track === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><span>{t}</span><span className="text-xs tabular-nums">{t === "All resources" ? articles.length : articles.filter(a => categoryTrack[a.category] === t).length}</span></button>)}</nav>
              <div className="my-5 border-t" /><p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.17em] text-muted-foreground">O24 Platform</p>
              <nav className="space-y-1" aria-label="Platform links">{links.map(l => <Link key={l.href} href={l.href} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><l.icon size={15} />{l.title}</Link>)}</nav>
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4"><BookOpen size={19} className="text-primary" /><p className="mt-3 text-sm font-bold">Need integration guidance?</p><p className="mt-2 text-xs leading-6 text-muted-foreground">Explore engineering articles, or discuss architecture with the O24 team.</p><Link href="/demo" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Request demo <ArrowRight size={14} /></Link></div>
            </div>
          </aside>



          <div className="min-w-0 space-y-12">
            <section aria-labelledby="quick-access-title">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Developer workspace
                </p>
                <h2 id="quick-access-title" className="mt-2 text-2xl font-bold">
                  Start building with O24
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {links.slice(0, 3).map(({ title, description, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group rounded-2xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 font-bold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
            <section aria-labelledby="start-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Start here</p><h2 id="start-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Choose your engineering path</h2></div><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">All engineering articles <ArrowRight size={15} /></Link></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{subjects.map(t => { const Icon = t.icon; return <button type="button" key={t.name} onClick={() => selectTrack(t.name)} className="group flex min-h-28 items-start gap-4 rounded-2xl border bg-card p-5 text-left transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"><span className="rounded-xl bg-primary/10 p-3 text-primary"><Icon size={21} /></span><span className="min-w-0 flex-1"><span className="block font-bold">{t.name}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t.about}</span><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Explore {articles.filter(a => categoryTrack[a.category] === t.name).length} guides <ArrowRight size={13} /></span></span></button> })}</div></section>

            <section aria-labelledby="featured-title"><div className="flex items-center gap-2"><Sparkles size={17} className="text-primary" /><h2 id="featured-title" className="text-xl font-extrabold">Featured engineering guides</h2></div><div className="mt-5 grid gap-4 md:grid-cols-3">{featured.map((a, i) => { const Icon = icons[a.icon]; return <article key={a.slug} className="flex flex-col rounded-2xl border bg-card p-5"><div className="flex items-center justify-between"><Icon size={21} className="text-primary" /><span className="text-xs text-muted-foreground">0{i + 1}</span></div><p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-primary">{a.category}</p><h3 className="mt-2 text-base font-bold leading-snug"><Link href={`/blog/${a.slug}`} className="hover:text-primary">{a.title}</Link></h3><p className="mt-3 flex-1 text-xs leading-6 text-muted-foreground">{a.description}</p><Link href={`/blog/${a.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read guide <ArrowRight size={14} /></Link></article> })}</div></section>

            <section id="developer-library" className="scroll-mt-24" aria-labelledby="library-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Documentation & learning</p><h2 id="library-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Engineering library</h2></div><span className="rounded-full border bg-muted px-3 py-1.5 text-xs text-muted-foreground">{articles.length} published articles</span></div>
              <div className="mt-6 rounded-2xl border bg-card p-4 sm:p-5"><div className="relative"><Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="search" aria-label="Search engineering guides" placeholder="Search CQRS, API gateways, RabbitMQ, security…" value={query} onChange={e => setQuery(e.target.value)} className="min-h-12 w-full rounded-xl border bg-background py-3 pl-11 pr-11 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 hover:bg-muted"><X size={16} /></button>}</div><div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter articles by topic">{tracks.map(t => <button type="button" key={t} aria-pressed={track === t} onClick={() => setTrack(t)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${track === t ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>{t}</button>)}</div></div>
              <p role="status" className="mt-4 text-sm text-muted-foreground">Showing {results.length} of {articles.length} published guides</p>
              <div className="mt-5 space-y-3">{results.length ? results.map(a => { const Icon = icons[a.icon]; return <article key={a.slug} className="group rounded-2xl border bg-card p-5 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-sm sm:p-6"><div className="flex items-start gap-4"><span className="hidden rounded-xl bg-primary/10 p-3 text-primary sm:inline-flex"><Icon size={22} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-primary"><span>{a.category}</span><span className="text-muted-foreground">{a.readTimeMinutes} min read</span></div><h3 className="mt-2 text-lg font-bold leading-snug"><Link href={`/blog/${a.slug}`} className="hover:text-primary">{a.title}</Link></h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{a.description}</p><Link href={`/blog/${a.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Read article <ArrowRight size={15} /></Link></div></div></article> }) : <div className="rounded-xl border border-dashed p-8 text-center"><p className="font-semibold">No matching resources</p><p className="mt-2 text-sm text-muted-foreground">Try a different keyword or reset your filters.</p><button onClick={() => { setQuery(""); setTrack("All resources"); }} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Reset filters</button></div>}</div>
            </section>
            <section className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[.09] to-background p-6 sm:p-8" aria-labelledby="next-title"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">From learning to implementation</p><h2 id="next-title" className="mt-2 text-2xl font-bold">Ready to explore O24?</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">Review the platform capabilities and integration patterns, or request a technical walkthrough tailored to your architecture.</p><div className="mt-6 flex flex-wrap gap-3"><TrackedLink href="/solutions/developers" eventName="engineering_hub_to_solution" source="developer_hub" destination="/solutions/developers" className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-semibold hover:border-primary/40">Developer solutions <ArrowRight size={16} /></TrackedLink><TrackedLink href="/demo" eventName="engineering_hub_to_demo" source="developer_hub" destination="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">Request demo <ArrowRight size={16} /></TrackedLink></div></section>
          </div>
        </div>
      </div>
    </main>
  );
}
