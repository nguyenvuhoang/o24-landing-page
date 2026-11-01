"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import {
  ArrowRight, BookOpen, CheckCircle2, Code2, GitBranch, Landmark,
  Layers3, LockKeyhole, Search, ServerCog, ShieldCheck, X,
} from "lucide-react";
import type { BlogArticle, BlogCategory, BlogIcon } from "@/data/blog";

type Article = Pick<BlogArticle, "slug" | "title" | "description" | "category" | "readTimeMinutes" | "icon">;
type Track = "All" | "Architecture" | "API Security" | "Banking" | "DevOps";
const tracks: readonly Track[] = ["All", "Architecture", "API Security", "Banking", "DevOps"];
const categoryTrack: Record<BlogCategory, Exclude<Track, "All">> = {
  ".NET Architecture": "Architecture",
  "API Architecture": "Architecture",
  "Banking Integration": "Banking",
  "Security": "API Security",
  "DevOps": "DevOps",
};
const icons = { code: Code2, layers: Layers3, landmark: Landmark, shield: ShieldCheck, server: ServerCog } satisfies Record<BlogIcon, typeof Code2>;
const trackDetails = [
  { name: "Architecture" as const, icon: GitBranch, summary: "CQRS, API gateways, service boundaries and asynchronous messaging", href: "/features" },
  { name: "API Security" as const, icon: ShieldCheck, summary: "Access tokens, authorization, mTLS and Zero Trust", href: "/security" },
  { name: "Banking" as const, icon: Landmark, summary: "Core adapters, transaction consistency and integration safeguards", href: "/solutions/bank-fintech" },
  { name: "DevOps" as const, icon: ServerCog, summary: "Containers, release automation and production operations", href: "/features" },
];

export default function DeveloperHubClient({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track>("All");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return articles.filter(article => {
      const matchesTrack = track === "All" || categoryTrack[article.category] === track;
      const matchesText = !term || `${article.title} ${article.description} ${article.category}`.toLocaleLowerCase().includes(term);
      return matchesTrack && matchesText;
    });
  }, [articles, query, track]);
  const active = selectedSlug ? articles.find(article => article.slug === selectedSlug) : null;
  const related = active ? articles.filter(article => article.slug !== active.slug && (article.category === active.category || categoryTrack[article.category] === categoryTrack[active.category])).slice(0, 3) : [];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-amber-50/90 via-background to-orange-50/50 py-16 dark:from-primary/10 dark:via-background dark:to-background lg:py-24">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="container relative mx-auto px-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-primary"><BookOpen className="h-4 w-4" /> vKnight Developer Hub</div>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Engineering knowledge for <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">reliable systems.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Practical engineering guides for modern APIs, financial integrations, secure services, and production operations. Discover patterns, learn trade-offs, and explore O24 solutions.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#resources" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Explore resources <ArrowRight className="h-4 w-4" /></Link>
            <TrackedLink href="/solutions/developers" eventName="engineering_hub_to_solution" source="developer_hub" destination="/solutions/developers" className="inline-flex min-h-11 items-center rounded-xl border bg-background px-6 py-3 font-semibold hover:border-primary/40">Explore O24 platform</TrackedLink>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {articles.length} published guides</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 4 learning tracks</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Practical .NET examples</span></div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 lg:py-20" aria-labelledby="tracks-heading">
        <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Choose your path</p><h2 id="tracks-heading" className="mt-2 text-3xl font-bold">Learning tracks</h2></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trackDetails.map(item => {
            const Icon = item.icon;
            const count = articles.filter(a => categoryTrack[a.category] === item.name).length;
            return <button type="button" key={item.name} onClick={() => { setTrack(item.name); setSelectedSlug(null); document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" }); }} className="group rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-bold">{item.name}</h3><p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">{item.summary}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">{count} {count === 1 ? "guide" : "guides"} <ArrowRight className="h-4 w-4" /></span>
            </button>;
          })}
        </div>
      </section>

      <section id="resources" className="scroll-mt-24 border-y bg-muted/20 py-14 lg:py-20" aria-labelledby="resources-heading">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Engineering library</p><h2 id="resources-heading" className="mt-2 text-3xl font-bold">Browse practical guides</h2></div><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Engineering Blog <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="rounded-2xl border bg-card p-4 sm:p-5">
            <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search developer guides" value={query} onChange={e => { setQuery(e.target.value); setSelectedSlug(null); }} placeholder="Search CQRS, RabbitMQ, JWT, API Gateway..." className="h-12 w-full rounded-xl border bg-background pl-12 pr-12 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60" type="search" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-muted"><X className="h-4 w-4" /></button>}</div>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter guides by topic">{tracks.map(value => <button type="button" key={value} aria-pressed={track === value} onClick={() => { setTrack(value); setSelectedSlug(null); }} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${track === value ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>{value}</button>)}</div>
          </div>
          <p className="my-5 text-sm text-muted-foreground" role="status">Showing {filtered.length} of {articles.length} published guides</p>
          {filtered.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map(article => { const Icon = icons[article.icon]; return <article key={article.slug} className="flex flex-col rounded-2xl border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div><p className="text-xs font-bold uppercase tracking-widest text-primary">{article.category} · {article.readTimeMinutes} min read</p><h3 className="mt-3 text-xl font-bold leading-snug"><Link className="hover:text-primary" href={`/blog/${article.slug}`}>{article.title}</Link></h3><p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{article.description}</p><div className="mt-6 flex flex-wrap items-center justify-between gap-2"><Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Read guide <ArrowRight className="h-4 w-4" /></Link><button type="button" onClick={() => setSelectedSlug(selectedSlug === article.slug ? null : article.slug)} aria-expanded={selectedSlug === article.slug} className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:border-primary/40">Related guides</button></div></article>; })}</div> : <div className="rounded-2xl border bg-card p-10 text-center"><p className="font-semibold">No matching guides</p><p className="mt-2 text-sm text-muted-foreground">Try another keyword or choose All tracks.</p><button type="button" onClick={() => { setQuery(""); setTrack("All"); }} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Clear filters</button></div>}
          {active && <aside className="mt-7 rounded-2xl border border-primary/25 bg-primary/5 p-6" aria-labelledby="related-heading"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Continue learning</p><h3 id="related-heading" className="mt-2 text-xl font-bold">Related to {active.title}</h3></div><button type="button" onClick={() => setSelectedSlug(null)} aria-label="Close related guides" className="rounded-lg p-2 hover:bg-background"><X className="h-5 w-5" /></button></div>{related.length ? <div className="mt-4 grid gap-3 md:grid-cols-3">{related.map(item => <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"><p className="text-xs font-bold uppercase text-primary">{item.category}</p><p className="mt-2 font-semibold">{item.title}</p><span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">Read next <ArrowRight className="h-4 w-4" /></span></Link>)}</div> : <p className="mt-3 text-sm text-muted-foreground">No closely related guides yet. Browse the full library for more topics.</p>}</aside>}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:py-20" aria-labelledby="paths-heading"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">From learning to implementation</p><h2 id="paths-heading" className="mt-2 text-3xl font-bold">Take the next step with O24</h2><p className="mt-4 text-muted-foreground">Use the guides to evaluate architecture approaches, then explore how O24 may fit your integration requirements.</p></div><div className="mt-8 grid gap-5 md:grid-cols-3">
        <TrackedLink href="/solutions/developers" eventName="engineering_hub_to_solution" source="developer_hub" destination="/solutions/developers" className="group rounded-2xl border bg-card p-6 hover:border-primary/40"><Code2 className="mb-4 h-7 w-7 text-primary" /><h3 className="text-lg font-bold">For developers</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Discover the platform architecture and developer-oriented resources.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Explore O24 <ArrowRight className="h-4 w-4" /></span></TrackedLink>
        <TrackedLink href="/solutions/bank-fintech" eventName="engineering_hub_to_solution" source="developer_hub" destination="/solutions/bank-fintech" className="group rounded-2xl border bg-card p-6 hover:border-primary/40"><Landmark className="mb-4 h-7 w-7 text-primary" /><h3 className="text-lg font-bold">Banking & fintech</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Review banking integration use cases and platform considerations.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Explore solutions <ArrowRight className="h-4 w-4" /></span></TrackedLink>
        <TrackedLink href="/demo" eventName="engineering_hub_to_demo" source="developer_hub" destination="/demo" className="group rounded-2xl border bg-card p-6 hover:border-primary/40"><LockKeyhole className="mb-4 h-7 w-7 text-primary" /><h3 className="text-lg font-bold">Enterprise consultation</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Discuss security, integration boundaries and a suitable implementation path with the team.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Request a demo <ArrowRight className="h-4 w-4" /></span></TrackedLink>
      </div></section>
    </main>
  );
}
