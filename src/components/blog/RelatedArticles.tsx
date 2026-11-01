"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, Building2 } from "lucide-react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import type { BlogArticle } from "@/data/blog";

type Article = Pick<BlogArticle, "slug" | "title" | "description" | "category">;

function getRelated(articles: Article[], current: Article): Article[] {
  const tokens = new Set(`${current.title} ${current.description}`.toLowerCase().match(/[a-z0-9]+/g) ?? []);
  return articles.filter(article => article.slug !== current.slug).map(article => {
    const other = new Set(`${article.title} ${article.description}`.toLowerCase().match(/[a-z0-9]+/g) ?? []);
    let score = article.category === current.category ? 12 : 0;
    for (const token of other) if (token.length > 3 && tokens.has(token)) score += 1;
    return { article, score };
  }).sort((a,b) => b.score - a.score || a.article.slug.localeCompare(b.article.slug))
    .slice(0,3).map(item => item.article);
}

/** Mounted by blog layout: excludes /blog and unknown, unpublished paths. */
export function RelatedArticles({ articles }: { articles: Article[] }) {
  const pathname = usePathname();
  const slug = pathname?.replace(/\/+$/, "").match(/^\/blog\/([^/]+)$/)?.[1];
  const current = articles.find(a => a.slug === slug);
  if (!current) return null;
  const related = getRelated(articles, current);
  return <section aria-labelledby="more-guides-heading" className="border-t bg-muted/20 py-14 lg:py-20">
    <div className="container mx-auto px-4">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Continue learning</p>
          <h2 id="more-guides-heading" className="mt-2 text-2xl font-bold sm:text-3xl">Related engineering guides</h2></div>
        <TrackedLink href="/developers" eventName="engineering_article_to_hub" source={current.slug} destination="/developers" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explore Developer Hub <ArrowRight className="h-4 w-4" /></TrackedLink>
      </div>
      <div className="grid gap-4 md:grid-cols-3">{related.map(article =>
        <article key={article.slug} className="rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{article.category}</p>
          <h3 className="mt-3 text-lg font-bold">{article.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.description}</p>
          <TrackedLink href={`/blog/${article.slug}`} eventName="engineering_related_article" source={current.slug} destination={article.slug} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Read guide <ArrowRight className="h-4 w-4" /></TrackedLink>
        </article>
      )}</div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <div><p className="flex items-center gap-2 font-bold"><Building2 className="h-5 w-5 text-primary" /> Building an enterprise platform?</p><p className="mt-2 text-sm text-muted-foreground">Explore O24 architecture and discuss integration requirements with our team.</p></div>
        <TrackedLink href="/demo" eventName="engineering_hub_to_demo" source={`article:${current.slug}`} destination="/demo" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Request a demo</TrackedLink>
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><BookOpen className="h-4 w-4" /> Guides are educational references, not claims of deployed O24 functionality.</p>
    </div>
  </section>;
}
