import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, Boxes, CheckCircle2,
  ExternalLink, GitBranch, LockKeyhole, Server, ShieldCheck,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/structuredData";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getArticleLastModified, getPublishedArticle } from "@/data/blog";

const slug = "building-api-gateway-aspnet-core";
const path = `/blog/${slug}`;
const url = `https://vknight.io.vn${path}`;
const title = "Building an API Gateway with ASP.NET Core and YARP";
const description =
  "Build a practical .NET 10 API gateway with YARP routing, ASP.NET Core rate limiting, local backends, and production security considerations.";
const article = getPublishedArticle(slug);
const breadcrumbId = `${url}#breadcrumb`;

export const metadata: Metadata = createPageMetadata({
  title: `${title} | vKnight Engineering`,
  description,
  path,
  type: "article",
  ogTitle: title,
  publishedTime: article?.publishedAt,
  modifiedTime: article ? getArticleLastModified(article) : undefined,
});

const setup = `# Requires .NET 10 SDK
# Create a local backend
dotnet new web -n CatalogApi -f net10.0
# Create the reverse proxy
dotnet new web -n ApiGateway -f net10.0
cd ApiGateway
dotnet add package Yarp.ReverseProxy`;

const backend = `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/api/catalog/products", () => new[]
{
    new { Id = 1, Name = "Sample product" },
    new { Id = 2, Name = "Another product" }
});
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));
app.Run();`;

const gateway = `using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddRateLimiter(options =>
{
    // Demo-wide limit. Use identity-aware partitioning in production.
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(
        _ => RateLimitPartition.GetFixedWindowLimiter(
            "demo-global",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 20,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }));
});

var app = builder.Build();
app.UseRateLimiter();
app.MapGet("/health", () => Results.Ok(new { status = "ready" }));
app.MapReverseProxy();
app.Run();`;

const settings = `{
  "ReverseProxy": {
    "Routes": {
      "catalog-route": {
        "ClusterId": "catalog-cluster",
        "Match": { "Path": "/api/catalog/{**catch-all}" }
      }
    },
    "Clusters": {
      "catalog-cluster": {
        "Destinations": {
          "catalog-1": { "Address": "http://localhost:5101/" }
        }
      }
    }
  }
}`;

const run = `# Terminal 1: run from CatalogApi directory
dotnet run --urls http://localhost:5101

# Terminal 2: run from ApiGateway directory
dotnet run --urls http://localhost:5100

# Terminal 3: route through the gateway
curl http://localhost:5100/api/catalog/products

# Expect HTTP 200 and JSON product array
# Repeat >20 requests within a minute to observe HTTP 429`;

function CodePanel({ name, code }: { name: string; code: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold text-orange-300">
        <span>{name}</span><span className="text-slate-500">Example</span>
      </div>
      <pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm"><code>{code}</code></pre>
    </div>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="scroll-mt-28 pt-8 text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>;
}

export default function ApiGatewayArticlePage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={buildArticleJsonLd({
        slug, title, description, url, breadcrumbId,
        proficiencyLevel: "Intermediate",
        keywords: ["ASP.NET Core", "YARP", ".NET 10", "API Gateway", "Rate Limiting"],
      })} />
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Engineering Blog", path: "/blog" },
        { name: title, path },
      ], { id: breadcrumbId })} />
      <div className="border-b bg-gradient-to-br from-orange-50/70 via-background to-background dark:from-primary/10 dark:via-background">
        <div className="container mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4"/> Back to Engineering</Link>
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-primary"><span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5">API Architecture</span> .NET 10 · 12 min read</div>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Building an <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">API Gateway</span> with ASP.NET Core and YARP</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">A hands-on walkthrough for routing requests to a backend API, applying a basic rate limit, and understanding what must change before going to production.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="rounded-lg border px-3 py-2">ASP.NET Core</span><span className="rounded-lg border px-3 py-2">YARP</span><span className="rounded-lg border px-3 py-2">Reverse Proxy</span></div>
        </div>
      </div>

      <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-14">
        <article className="min-w-0 space-y-5 text-[15px] leading-8 text-foreground/90 sm:text-base">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-7"><strong>What you will build:</strong> a gateway listening on port 5100 that forwards <code>/api/catalog/*</code> to a catalog service on port 5101, with a simple gateway-wide rate limiter. Both services are local and use sample data; this is not an O24 SDK or production configuration.</div>

          <SectionTitle id="why">1. Why put an API gateway in front of services?</SectionTitle>
          <p>In a microservices system, clients often need a stable entry point while individual backend services evolve. A reverse proxy forwards HTTP requests to upstream applications. An API gateway usually adds cross-cutting policies such as authentication, rate limiting, routing, and observability. These capabilities do not eliminate the need for authorization inside downstream services.</p>
          <div className="my-7 grid gap-3 rounded-2xl border bg-muted/30 p-5 text-center text-sm font-semibold sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-5"><BookOpen className="mx-auto mb-2 h-5 w-5 text-primary"/> Client applications</div>
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-5"><GitBranch className="mx-auto mb-2 h-5 w-5 text-primary"/> ASP.NET Core + YARP</div>
            <div className="rounded-xl border bg-card p-5"><Server className="mx-auto mb-2 h-5 w-5 text-primary"/> Catalog API</div>
          </div>

          <SectionTitle id="setup">2. Create the projects</SectionTitle>
          <p>Install the .NET 10 SDK, then create two minimal web applications. Add YARP only to the gateway project.</p>
          <CodePanel name="Terminal" code={setup}/>
          <p>The gateway and catalog service are intentionally separate processes. This lets us test routing without an external cloud dependency.</p>

          <SectionTitle id="backend">3. Implement the backend API</SectionTitle>
          <p>Replace <code>CatalogApi/Program.cs</code> with a small endpoint that returns JSON and a health endpoint:</p>
          <CodePanel name="CatalogApi/Program.cs" code={backend}/>

          <SectionTitle id="proxy">4. Configure the gateway and rate limiting</SectionTitle>
          <p>Replace <code>ApiGateway/Program.cs</code> with the following code. YARP reads route and destination settings from configuration. The rate limiter here is global so that the example does not accidentally trust a client-supplied identity or IP header.</p>
          <CodePanel name="ApiGateway/Program.cs" code={gateway}/>
          <p>Replace <code>ApiGateway/appsettings.json</code> with the following local development configuration. The path match is forwarded unchanged, so the catalog API uses the same path.</p>
          <CodePanel name="ApiGateway/appsettings.json" code={settings}/>
          <p><strong>Why 429?</strong> Once the gateway uses up 20 permits in the current one-minute window, excess requests receive <code>429 Too Many Requests</code>. This limiter is process-local; multiple gateway replicas require careful policy design to avoid inconsistent effective limits.</p>

          <SectionTitle id="test">5. Run and test</SectionTitle>
          <p>Start each project in a separate terminal from its own directory, and send the request through the gateway.</p>
          <CodePanel name="Terminal — run and test" code={run}/>
          <p>Try calling the backend directly at <code>http://localhost:5101/api/catalog/products</code> to compare the response. The proxy should return the same JSON body before the rate limit is reached.</p>

          <SectionTitle id="production">6. What changes before production?</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: LockKeyhole, title: "Authentication & authorization", body: "Validate tokens using a trusted authority and protect downstream APIs independently. Never forward untrusted identity headers as proof of authorization." },
              { icon: ShieldCheck, title: "TLS & upstream protection", body: "Use HTTPS for public ingress and secure backend transport. Restrict which upstream destinations and forwarded headers are trusted." },
              { icon: Boxes, title: "Deployment & resilience", body: "Configure timeouts, retries only where safe, health checks and load balancing for multiple service instances." },
              { icon: CheckCircle2, title: "Operations & observability", body: "Instrument request latency, trace propagation, structured logging, alerting, and identity-aware traffic policies." },
            ].map((item) => <div key={item.title} className="rounded-2xl border bg-card p-5"><item.icon className="mb-3 h-6 w-6 text-primary"/><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p></div>)}
          </div>
          <p>For banking and enterprise workloads, also review audit needs, request/response data handling, secrets management, regulatory requirements, and failure behavior with the target system owners. A sample reverse proxy is not a certified banking gateway.</p>

          <SectionTitle id="when">7. When not to build your own gateway</SectionTitle>
          <p>If you only need basic HTTP routing, a conventional reverse proxy might be enough. If you require API lifecycle governance, developer onboarding, multi-tenant policy management, or a broader integration platform, evaluate an API management product rather than continually extending custom middleware. See our <Link href="/blog/api-gateway-vs-reverse-proxy" className="font-semibold text-primary underline underline-offset-4">API Gateway vs. Reverse Proxy</Link> guide for that distinction.</p>

          <SectionTitle id="references">Further reading</SectionTitle>
          <div className="space-y-2 text-sm">
            <a className="flex items-center gap-2 text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/config-files" target="_blank" rel="noopener noreferrer">YARP configuration files — Microsoft Learn <ExternalLink className="h-4 w-4"/></a>
            <a className="flex items-center gap-2 text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit?view=aspnetcore-10.0" target="_blank" rel="noopener noreferrer">ASP.NET Core rate limiting — Microsoft Learn <ExternalLink className="h-4 w-4"/></a>
            <a className="flex items-center gap-2 text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/middleware?view=aspnetcore-10.0" target="_blank" rel="noopener noreferrer">YARP middleware — Microsoft Learn <ExternalLink className="h-4 w-4"/></a>
          </div>

          <div className="mt-12 rounded-3xl border border-primary/25 bg-primary/5 p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Next step with O24</p><h2 className="mt-3 text-2xl font-bold">From a local gateway to enterprise integration</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Explore the O24 architecture and integration approaches, or discuss the needs of your team. This tutorial is an independent ASP.NET Core example, not an O24 installation guide.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/solutions/developers" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Developer resources <ArrowRight className="ml-1 inline h-4 w-4"/></Link><Link href="/enterprise" className="rounded-xl border border-primary/30 bg-background px-5 py-3 text-sm font-semibold">Enterprise consultation</Link></div></div>
        </article>

        <aside className="hidden lg:block"><nav aria-label="Article contents" className="sticky top-24 rounded-2xl border bg-card p-5 text-sm"><p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">On this page</p><ol className="space-y-3 text-muted-foreground">{[
          ["why", "Why an API gateway?"], ["setup", "Create the projects"], ["backend", "Backend API"], ["proxy", "Gateway & rate limiting"], ["test", "Run and test"], ["production", "Production checklist"], ["when", "Alternatives"], ["references", "References"],
        ].map(([id, label]) => <li key={id}><a href={`#${id}`} className="hover:text-primary">{label}</a></li>)}</ol></nav></aside>
      </div>
    </main>
  );
}
