import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers3 } from "lucide-react";

const title = "API Gateway vs. Reverse Proxy: What Changes in an Enterprise Architecture?";
const description = "A practical comparison of reverse proxies and API gateways: traffic routing, identity, policies, observability, and choosing the right architecture.";

export const metadata: Metadata = {
  title: `${title} | vKnight Engineering`,
  description,
  alternates: { canonical: "/blog/api-gateway-vs-reverse-proxy" },
  openGraph: { title, description, url: "/blog/api-gateway-vs-reverse-proxy", type: "article" },
};

const comparison = [
  { dimension: "Primary purpose", proxy: "Forward traffic to upstream services", gateway: "Expose and govern an API surface" },
  { dimension: "Routing", proxy: "Host, path and upstream routing", gateway: "Routing plus API-specific policies" },
  { dimension: "Identity", proxy: "Possible through modules/integrations", gateway: "Often a central API concern" },
  { dimension: "Traffic controls", proxy: "Possible with configuration", gateway: "Typically configured per API or consumer" },
  { dimension: "Observability", proxy: "Infrastructure request metrics and logs", gateway: "API-, consumer-, or policy-oriented visibility" },
];

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-background">
      <article>
        <header className="border-b bg-gradient-to-br from-orange-50/70 via-background to-background py-16 dark:from-primary/10 dark:via-background lg:py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Engineering Blog</Link>
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary"><Layers3 className="h-5 w-5" aria-hidden="true" /> API Architecture · 7 min read</div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{description}</p>
            <p className="mt-5 text-xs text-muted-foreground">vKnight Engineering · Technical guide</p>
          </div>
        </header>

        <div className="container mx-auto max-w-4xl space-y-12 px-4 py-16 text-base leading-8">
          <section aria-labelledby="context"><h2 id="context" className="mb-4 text-2xl font-bold">Why this distinction matters</h2>
            <p>Many teams begin by placing a reverse proxy in front of applications. That is a sensible first step for routing requests, handling TLS termination, and keeping upstream services behind a single entry point. As more APIs become externally accessible, teams often need decisions about authentication, consumer access, request limits, and monitoring to be applied consistently. This is where an API gateway can become useful.</p>
            <p className="mt-4">A gateway is not automatically a replacement for a reverse proxy. Many implementations use reverse-proxy technology internally, and a gateway can sit alongside existing ingress and load-balancing layers.</p>
          </section>
          <section aria-labelledby="comparison"><h2 id="comparison" className="mb-4 text-2xl font-bold">Responsibilities at a glance</h2>
            <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead className="bg-muted/60"><tr><th className="p-4 font-semibold">Concern</th><th className="p-4 font-semibold">Reverse proxy</th><th className="p-4 font-semibold">API gateway</th></tr></thead><tbody>{comparison.map(row => <tr key={row.dimension} className="border-t"><th scope="row" className="p-4 align-top font-semibold">{row.dimension}</th><td className="p-4 align-top text-muted-foreground">{row.proxy}</td><td className="p-4 align-top text-muted-foreground">{row.gateway}</td></tr>)}</tbody></table></div>
            <p className="mt-4 text-sm text-muted-foreground">These are common patterns, not rigid product boundaries. Specific capabilities depend on the software and configuration selected.</p>
          </section>
          <section aria-labelledby="scenarios"><h2 id="scenarios" className="mb-4 text-2xl font-bold">When a reverse proxy may be enough</h2><p>A small set of internal applications with straightforward routing and uniform access control may not require a separate API governance layer. A well-configured reverse proxy can handle traffic distribution, TLS and foundational availability concerns while avoiding unnecessary operational complexity.</p></section>
          <section aria-labelledby="gateway"><h2 id="gateway" className="mb-4 text-2xl font-bold">When an API gateway becomes valuable</h2><p>Consider a gateway when APIs have multiple consumers, different authentication or rate-limiting requirements, and distinct lifecycle responsibilities. It becomes particularly relevant for partner-facing APIs or organizations consolidating services across business units. The tradeoff is a new operational dependency that must itself be monitored, secured, and made resilient.</p></section>
          <section aria-labelledby="banking"><h2 id="banking" className="mb-4 text-2xl font-bold">A banking integration example</h2><p>Imagine a mobile banking app, a partner service and an internal operations portal that need different access to account or payment APIs. The integration layer can provide centralized request policies while domain services maintain business validation and transaction integrity. Security must still be enforced within downstream services; the gateway should not become the sole trust boundary.</p><p className="mt-4">For core banking integration, also assess idempotency, timeouts, retry safety, audit requirements and operational ownership. These concerns cannot be solved by gateway routing alone.</p></section>
          <section aria-labelledby="decision"><h2 id="decision" className="mb-4 text-2xl font-bold">A practical decision checklist</h2><ul className="list-disc space-y-2 pl-6"><li>Identify API consumers and authentication boundaries.</li><li>Map which policies belong at the edge versus in domain services.</li><li>Define measurable availability and latency requirements before choosing a topology.</li><li>Test failure paths, rate limits, retries and observability end to end.</li><li>Prefer the simplest architecture that meets the verified requirements.</li></ul></section>
          <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8"><h2 className="text-xl font-bold">Explore integration architecture with O24</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">Learn about O24 capabilities or discuss how an API entry layer can fit your existing systems.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/features" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Explore capabilities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="/contact" className="rounded-lg border bg-background px-5 py-3 text-sm font-semibold">Talk to our team</Link></div></aside>
        </div>
      </article>
    </main>
  );
}
