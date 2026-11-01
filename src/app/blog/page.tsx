import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Landmark, Layers3, ShieldCheck, Server } from "lucide-react";
import { getPublishedArticles, type BlogIcon } from "@/data/blog";

export const metadata: Metadata = {
  title: "Engineering Blog | API Architecture & Banking Integration | vKnight",
  description:
    "Practical engineering guides on API architecture, integration patterns, security, and banking technology from vKnight.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "vKnight Engineering Blog",
    description: "Engineering notes on APIs, integration, and building reliable systems.",
    url: "/blog",
    type: "website",
  },
};

const articles = getPublishedArticles();

const articleIcons: Record<BlogIcon, typeof Code2> = {
  code: Code2,
  layers: Layers3,
  landmark: Landmark,
  shield: ShieldCheck,
  server: Server,
};

const topics = [
  { title: "API Architecture", description: "Gateways, contracts, routing and governance", icon: Code2, href: "/features" },
  { title: "Banking Integration", description: "Patterns for connecting digital channels and core systems", icon: Landmark, href: "/solutions/bank-fintech" },
  { title: "Security by Design", description: "Access control and integration risk considerations", icon: ShieldCheck, href: "/security" },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-orange-50/70 via-background to-background py-20 dark:from-primary/10 dark:via-background lg:py-28">
        <div className="container relative mx-auto px-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <BookOpen className="h-4 w-4" aria-hidden="true" /> vKnight engineering
          </div>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Ideas, patterns, and <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">practical engineering.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Explore API architecture, enterprise integration, and the engineering decisions behind reliable digital platforms.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#articles" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Read articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/solutions/developers" className="inline-flex min-h-11 items-center rounded-xl border bg-background px-5 py-3 text-sm font-semibold hover:border-primary/40">
              Developer resources
            </Link>
          </div>
        </div>
      </section>

      <section id="articles" className="container mx-auto scroll-mt-24 px-4 py-16 lg:py-24" aria-labelledby="articles-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Engineering insights</p>
            <h2 id="articles-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Published guides</h2>
          </div>
          <p className="text-sm text-muted-foreground">More technical guides will be added as they are reviewed.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const Icon = articleIcons[article.icon];
            return (
              <article key={article.slug} className="group relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">{article.category} · {article.readTimeMinutes} min read</p>
                <h3 className="mt-3 text-xl font-bold leading-snug">
                  <Link className="outline-none after:absolute after:inset-0 focus-visible:underline" href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{article.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Explore by interest</h2>
          <p className="mt-2 text-muted-foreground">Start with the parts of the platform most relevant to your work.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link key={topic.title} href={topic.href} className="group rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-primary">
                  <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Explore <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
