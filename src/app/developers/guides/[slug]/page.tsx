import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import { CodeExample } from "@/components/developers/CodeExample";
import { getGuide, guides } from "@/lib/developer-guides/content";
import { createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return guides.map(guide => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const guide = getGuide(slug); if (!guide) return { title: "Guide not found" };
  return createPageMetadata({
    title: `${guide.title} | O24 Developer Guides`,
    description: guide.summary,
    path: `/developers/guides/${guide.slug}`,
    type: "article",
    ogTitle: guide.title,
  });
}
export default async function GuidePage({ params }: Props) {
  const { slug } = await params; const guide = getGuide(slug); if (!guide) notFound();
  const index = guides.findIndex(g => g.slug === guide.slug);
  const next = guides[(index + 1) % guides.length];
  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Developer Hub", path: "/developers" },
    { name: "Guides", path: "/developers/guides" },
    { name: guide.title, path: `/developers/guides/${guide.slug}` },
  ]);
  return <main className="min-h-screen bg-background">
    <JsonLd data={breadcrumbData} />
    <div className="border-b bg-muted/25"><div className="container mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-xs text-muted-foreground"><Link href="/developers" className="hover:text-primary">Developer Hub</Link><ChevronRight size={13} /><Link href="/developers/guides" className="hover:text-primary">Guides</Link><ChevronRight size={13} /><span className="truncate font-semibold text-foreground">{guide.title}</span></div></div>
    <div className="container mx-auto grid max-w-7xl items-start gap-9 px-4 py-10 lg:grid-cols-[225px_minmax(0,1fr)_190px] lg:gap-10 lg:py-14">
      <aside className="lg:sticky lg:top-24"><div className="rounded-2xl border bg-card p-4"><p className="mb-4 text-[11px] font-bold uppercase tracking-[.16em] text-muted-foreground">Architecture guides</p><nav aria-label="Engineering guides" className="space-y-1">{guides.map(g => <Link key={g.slug} href={`/developers/guides/${g.slug}`} aria-current={g.slug === guide.slug ? "page" : undefined} className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${g.slug === guide.slug ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{g.title}</Link>)}</nav><div className="mt-4 border-t pt-4"><Link href="/developers/api-explorer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Try API Explorer <ExternalLink size={13} /></Link></div></div></aside>
      <article className="min-w-0"><header><p className="text-xs font-bold uppercase tracking-[.17em] text-primary">{guide.eyebrow}</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem]">{guide.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{guide.summary}</p><div className="mt-5 flex flex-wrap gap-2">{guide.concepts.map(c => <span key={c} className="rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground">{c}</span>)}</div><p className="mt-5 text-xs text-muted-foreground">{guide.readingMinutes} min read · Architectural reference · No live banking connection</p></header>
        <section className="mt-10 rounded-2xl border bg-card p-5 sm:p-7" aria-labelledby="flow-title"><h2 id="flow-title" className="text-lg font-bold">Conceptual request lifecycle</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{guide.stages.map((s, i) => <div key={s.title} className="rounded-xl border border-primary/20 bg-primary/[.04] p-4"><p className="text-xs font-bold text-primary">0{i + 1}</p><p className="mt-2 text-sm font-bold">{s.title}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{s.detail}</p></div>)}</div></section>
        <div className="mt-12 space-y-12">{guide.sections.map(section => <section key={section.id} id={section.id} className="scroll-mt-28"><h2 className="text-2xl font-extrabold tracking-tight">{section.title}</h2><div className="mt-4 space-y-4">{section.paragraphs.map((p, i) => <p key={i} className="text-[15px] leading-8 text-muted-foreground">{p}</p>)}</div>{section.points && <ul className="mt-5 space-y-3">{section.points.map(p => <li key={p} className="flex gap-3 text-sm leading-7"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{p}</li>)}</ul>}{section.code && <CodeExample {...section.code} />}</section>)}</div>
        <div className="mt-12 rounded-2xl border border-primary/25 bg-primary/[.05] p-6"><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /><h2 className="font-bold">Continue learning</h2></div>{guide.relatedArticle && <Link href={guide.relatedArticle.url} className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Related engineering article: {guide.relatedArticle.label}<ArrowRight size={15} /></Link>}<Link href="/developers/api-explorer" className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Try illustrative requests in API Explorer <ArrowRight size={15} /></Link><Link href={`/developers/guides/${next.slug}`} className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Next guide: {next.title}<ArrowRight size={15} /></Link></div>
      </article>
      <aside className="hidden lg:sticky lg:top-24 lg:block"><div className="border-l pl-4"><p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">On this page</p><nav aria-label="On this page" className="space-y-3">{guide.sections.map(s => <a key={s.id} href={`#${s.id}`} className="block text-xs leading-5 text-muted-foreground hover:text-primary">{s.title}</a>)}</nav></div></aside>
    </div>
  </main>;
}
