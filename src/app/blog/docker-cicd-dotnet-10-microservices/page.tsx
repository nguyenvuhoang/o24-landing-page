import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Container, GitBranch, RefreshCcw, ShieldCheck, Workflow } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/structuredData";
import { getArticleLastModified, getPublishedArticle } from "@/data/blog";

const slug = "docker-cicd-dotnet-10-microservices";
const path = `/blog/${slug}`;
const url = `https://vknight.io.vn${path}`;
const title = "Docker CI/CD for .NET 10 Microservices: Build, Promote, and Roll Back Safely";
const description = "Containerize .NET 10 services, build with GitHub Actions, promote immutable image digests, and implement health-aware deployment and rollback.";
const article = getPublishedArticle(slug);

export const metadata: Metadata = createPageMetadata({
  title: `${title} | vKnight Engineering`,
  description,
  path,
  type: "article",
  ogTitle: title,
  publishedTime: article?.publishedAt,
  modifiedTime: article ? getArticleLastModified(article) : undefined,
});

const sections = [
  { id: "goals", label: "Deployment invariants" },
  { id: "architecture", label: "Build-to-deploy architecture" },
  { id: "dockerfile", label: "Multi-stage Dockerfile" },
  { id: "health", label: "Health and graceful shutdown" },
  { id: "github-actions", label: "CI pipeline with GitHub Actions" },
  { id: "digest", label: "Immutable digest promotion" },
  { id: "rollback", label: "Health-aware rollout & rollback" },
  { id: "security", label: "Supply chain and secrets" },
  { id: "checklist", label: "Release checklist" },
];

const dockerfile = `# Example layout: services/Payments.Api/Payments.Api.csproj
# Build context is the repository root.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY services/Payments.Api/Payments.Api.csproj services/Payments.Api/
RUN dotnet restore services/Payments.Api/Payments.Api.csproj
COPY services/Payments.Api/ services/Payments.Api/
RUN dotnet publish services/Payments.Api/Payments.Api.csproj \\
    -c Release -o /out --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /out .
ENV ASPNETCORE_HTTP_PORTS=8080
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "Payments.Api.dll"]`;

const ignore = `**/bin/
**/obj/
.git/
.vscode/
.env*
**/*.user
**/*.suo
**/TestResults/
README.md`;

const api = `// Program.cs — illustrative Minimal API
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();
var app = builder.Build();
app.MapHealthChecks("/health/live");
app.MapHealthChecks("/health/ready"); // Add dependency-aware checks in production.
app.MapGet("/api/payments/version", () => Results.Ok(new {
    Service = "Payments.Api",
    Version = typeof(Program).Assembly.GetName().Version?.ToString()
}));
app.Run();`;

const workflow = `name: Build and publish Payments API
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
permissions:
  contents: read
  packages: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - name: Restore and test
        run: |
          dotnet restore
          dotnet test --no-restore -c Release
      - uses: docker/setup-buildx-action@v3
      - name: Login to GHCR
        if: github.event_name == 'push'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        id: image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: services/Payments.Api/Dockerfile
          push: \${{ github.event_name == 'push' }}
          tags: ghcr.io/YOUR_ORG/payments-api:sha-\${{ github.sha }}
          # Production pipelines should pin actions to reviewed commit SHAs.
      - name: Print immutable image reference
        if: github.event_name == 'push'
        env:
          DIGEST: \${{ steps.image.outputs.digest }}
        run: echo "ghcr.io/YOUR_ORG/payments-api@$DIGEST"
# Adapt repository layout, action versions, and GHCR package permissions.
# This example builds and publishes. It does NOT automatically deploy.`;

const compose = `services:
  payments-api:
    image: \${PAYMENTS_IMAGE:?Set full image digest}
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      ASPNETCORE_HTTP_PORTS: "8080"
    healthcheck:
      test: ["CMD", "/bin/sh", "-c", "exit 0"] # REPLACE!
      # Official ASP.NET runtime images do not guarantee curl/wget.
      # Use a suitable probe binary, health agent, or orchestrator probe.
      interval: 15s
      timeout: 3s
      retries: 4
      start_period: 20s
# The dummy healthcheck above is explicitly NOT production-ready.`;

const commands = `# Use digest from the successful CI build/push result.
export PAYMENTS_IMAGE='ghcr.io/YOUR_ORG/payments-api@sha256:REPLACE_WITH_DIGEST'
docker compose pull payments-api
# A simple compose restart may interrupt traffic. Use blue/green,
# orchestration rolling updates, or a controlled maintenance window.
docker compose up -d --no-deps payments-api
# Verify endpoint and business telemetry before considering success.
# If verification fails, restore the PREVIOUS digest, not a mutable tag.
export PAYMENTS_IMAGE='ghcr.io/YOUR_ORG/payments-api@sha256:PREVIOUS_VERIFIED_DIGEST'
docker compose up -d --no-deps payments-api`;

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="scroll-mt-28 pt-8 text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>;
}
function CodePanel({ label, code }: { label: string; code: string }) {
  return <div className="my-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100"><div className="border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-orange-300">{label}</div><pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm"><code>{code}</code></pre></div>;
}
function Callout({ children }: { children: ReactNode }) {
  return <div className="my-6 rounded-xl border-l-4 border-primary bg-primary/5 p-5 text-sm leading-7">{children}</div>;
}

export default function DockerCicdArticlePage() {
  const structuredData = buildArticleJsonLd({
    slug, title, description, url,
    isAccessibleForFree: true,
    keywords: "Docker, .NET 10, GitHub Actions, CI/CD, microservices, immutable digest, rollback",
  });
  return <main className="min-h-screen bg-background">
    <JsonLd data={structuredData} />
    <section className="border-b bg-gradient-to-br from-orange-50/70 via-background to-background py-14 dark:from-primary/10 dark:via-background lg:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to Engineering</Link>
        <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><Container className="h-4 w-4" /> DEVOPS · 16 MIN READ</p>
        <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Docker CI/CD for <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">.NET 10 Microservices</span></h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Build once, test before release, promote immutable container images, and roll back safely without confusing image delivery with a healthy production system.</p>
        <div className="mt-8 flex flex-wrap gap-2">{["Docker", "GitHub Actions", "ASP.NET Core 10", "Image Digest", "Rollback"].map(tag => <span key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium">{tag}</span>)}</div>
      </div>
    </section>
    <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
      <aside className="self-start lg:sticky lg:top-28"><div className="rounded-2xl border bg-card p-5"><p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><BookOpen className="h-4 w-4" /> On this page</p><nav aria-label="Article contents" className="flex flex-col gap-3">{sections.map(section => <a key={section.id} className="text-sm text-muted-foreground hover:text-primary" href={`#${section.id}`}>{section.label}</a>)}</nav></div></aside>
      <article className="min-w-0 space-y-5 text-base leading-8 text-foreground/90">
        <p className="text-lg">CI/CD for financial or enterprise systems should deliver the same verified software artifact across environments. Rebuilding an image when moving from development to production makes it difficult to prove exactly which binary was promoted. This guide favors image-by-digest promotion and health-aware operations.</p>
        <Callout><strong>Scope:</strong> A reference setup for a single ASP.NET Core 10 microservice with GitHub Actions and a container registry. Configuration snippets are illustrative; adapt project structure, secret management, runtime probes, migration process, and deployment orchestration before production.</Callout>
        <Heading id="goals">1. Define your release invariants</Heading>
        <ul className="space-y-3">{[
          "Build the image once and promote the same registry digest through DEV → UAT → PROD.",
          "Treat successful tests, image publication, and a healthy deployment as three separate outcomes.",
          "Store the previous known-good digest for rollback; never rely on mutable latest tags.",
          "Require controlled approvals, auditable promotions, and no secrets in image layers.",
          "Keep database schema changes backward-compatible across rollout and rollback windows.",
        ].map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul>
        <Heading id="architecture">2. Build-to-deploy architecture</Heading>
        <div className="rounded-2xl border bg-muted/30 p-5 text-center text-sm font-semibold sm:p-7" role="img" aria-label="Source commit leads to CI test and Docker build, pushed image digest, approval stages DEV to UAT to PROD, health check and rollback to previous digest if needed.">
          <div className="mx-auto max-w-lg space-y-2"><div className="rounded-xl border bg-background p-4"><GitBranch className="mx-auto mb-1 h-5 w-5 text-primary" /> Source commit + PR review</div><div className="text-primary">↓</div><div className="rounded-xl border bg-background p-4"><Workflow className="mx-auto mb-1 h-5 w-5 text-primary" /> Tests → Docker Build → Registry digest</div><div className="text-primary">↓ promote unchanged image</div><div className="grid grid-cols-3 gap-2">{["DEV", "UAT", "PROD"].map(env => <div key={env} className="rounded-xl border border-primary/30 bg-primary/5 p-3">{env}</div>)}</div><div className="text-primary">↓ verify readiness, traffic, and service KPIs</div><div className="rounded-xl border bg-background p-4"><RefreshCcw className="mx-auto mb-1 h-5 w-5 text-primary" /> Keep or revert to previous verified digest</div></div>
        </div>
        <p>Services can deploy independently, but a rollout must consider shared contracts, message schemas and database dependencies. Keep an explicit compatibility policy between versions.</p>
        <Heading id="dockerfile">3. Multi-stage Dockerfile for ASP.NET Core 10</Heading>
        <p>Use the .NET SDK only during compilation. The runtime stage should contain published output and the ASP.NET Core runtime, not build tools. The sample assumes a standalone <code>Payments.Api</code> project with no sibling project references; adjust copied project files for a multi-project solution.</p>
        <CodePanel label="services/Payments.Api/Dockerfile" code={dockerfile} />
        <p>Exclude source control, build outputs and local secrets from the build context. When there are project references, copy their project files before restore as well.</p>
        <CodePanel label=".dockerignore" code={ignore} />
        <Callout><strong>Production note:</strong> The runtime image uses the built-in non-root <code>APP_UID</code> identity. Verify file permissions and make sure the service listens on port 8080. Pin and regularly update base image digests as part of a vulnerability management process.</Callout>
        <Heading id="health">4. Health endpoints and graceful shutdown</Heading>
        <p>Expose liveness and readiness separately. Liveness checks whether the process can recover; readiness should reflect whether the instance can accept relevant traffic. Do not make liveness depend on every downstream service or transient outages could trigger restart loops.</p>
        <CodePanel label="ASP.NET Core Minimal API health endpoint" code={api} />
        <p>Implement dependency-specific readiness checks and allow in-flight requests to finish on SIGTERM. Container startup and process health alone do not prove that a payment workflow is correct; observe application-level outcomes, queue lag and dependency failures.</p>
        <Heading id="github-actions">5. Test, build, and publish with GitHub Actions</Heading>
        <p>Separate PR validation from publishing. Test code before releasing images and publish only on trusted branch events. The following starter pipeline targets GitHub Container Registry (GHCR). Adjust repository names and references to match your organization, and pin third-party actions to reviewed commit SHAs for a hardened supply chain.</p>
        <CodePanel label=".github/workflows/payments-image.yml — starter workflow" code={workflow} />
        <p>The build action exposes an image digest after push. Store that result in a release record with commit SHA, test evidence, approver and environment history. A build tag is useful for discovery; it is not the deployment identity.</p>
        <Heading id="digest">6. Promote immutable image digests, not tags</Heading>
        <p>Tags such as <code>main</code> and <code>latest</code> can point to different images over time. A digest such as <code>ghcr.io/org/payments-api@sha256:…</code> identifies specific image content. Promote the same digest from DEV to UAT and PROD rather than compiling again for each stage.</p>
        <div className="grid gap-3 sm:grid-cols-3">{[
          { title: "Build", detail: "Commit SHA → registry digest" },
          { title: "Approve", detail: "Record checks and promotion decision" },
          { title: "Deploy", detail: "Pull the exact digest in each environment" },
        ].map(item => <div key={item.title} className="rounded-xl border bg-card p-4"><p className="font-semibold text-primary">{item.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p></div>)}</div>
        <p>For multi-architecture images, understand whether your recorded digest identifies an image index or a platform-specific manifest. The runtime platform must match what the registry artifact contains.</p>
        <Heading id="rollback">7. Health-aware rollout and rollback</Heading>
        <p>A <code>docker compose up -d</code> command by itself is not a zero-downtime release strategy. For traffic-bearing systems, use blue/green deployment or an orchestrator with readiness-based rolling updates. Preserve the old instance or digest until the replacement passes checks.</p>
        <CodePanel label="Conceptual Compose service definition (health probe must be replaced)" code={compose} />
        <CodePanel label="Manual digest-based promotion and rollback — example" code={commands} />
        <Callout><strong>Important:</strong> The Compose snippet intentionally contains a placeholder healthcheck; it would always pass and is <strong>not safe to copy into production unchanged</strong>. Use a real probe mechanism supported by the chosen image and deployment platform, and fail the release when readiness or critical business checks fail.</Callout>
        <p>Rollback restores application binaries, not database state. Prefer expand-and-contract migrations so old and new versions can overlap, and document special handling for irreversible migrations and externally emitted events.</p>
        <Heading id="security">8. Secrets, provenance, and least privilege</Heading>
        <ul className="space-y-3">{[
          "Use short-lived identity or scoped registry credentials; never place tokens in Dockerfile ARG or ENV.",
          "Make production deployment a separately authorized action with environment protection rules.",
          "Generate SBOM/provenance attestations where supported and scan images for vulnerabilities.",
          "Run the application as non-root and minimize network, filesystem and Docker socket permissions.",
          "Protect deployment agents; access to the Docker socket can grant host-level privileges.",
          "Log build digest, deployment digest, operator, time, status and rollback reason without sensitive values.",
        ].map(item => <li key={item} className="flex gap-3"><ShieldCheck className="mt-1.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul>
        <Heading id="checklist">9. Release readiness checklist</Heading>
        <p>Before promoting to production, verify tests pass, the image digest is recorded, vulnerability thresholds are reviewed, health probes are real, schema compatibility is checked, rollback references are retained, and business KPIs remain within agreed limits after deployment.</p>
        <Callout><strong>Practical rule:</strong> “Image published” is a CI success; “deployment succeeded” requires a verified running revision, healthy service, correct traffic routing, and acceptable business behavior.</Callout>
        <div className="mt-10 rounded-2xl border bg-muted/30 p-6"><h2 className="text-xl font-bold">Official references &amp; related engineering guides</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm">
          <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images" target="_blank" rel="noopener noreferrer">Microsoft: Build ASP.NET Core Docker Images</a></li>
          <li><a className="text-primary underline underline-offset-4" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener noreferrer">Docker: Multi-stage Builds</a></li>
          <li><a className="text-primary underline underline-offset-4" href="https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images" target="_blank" rel="noopener noreferrer">GitHub: Publish Docker Images</a></li>
          <li><Link className="text-primary underline underline-offset-4" href="/blog/rabbitmq-event-driven-transactions-dotnet-10">RabbitMQ &amp; Event-Driven Transaction Processing</Link></li>
          <li><Link className="text-primary underline underline-offset-4" href="/blog/core-banking-integration-architecture">Core Banking Integration Architecture</Link></li>
          <li><Link className="text-primary underline underline-offset-4" href="/blog/building-api-gateway-aspnet-core">Building an API Gateway with ASP.NET Core</Link></li>
        </ul></div>
        <div className="mt-10 rounded-2xl bg-slate-950 p-7 text-white sm:p-9"><p className="text-xs font-semibold uppercase tracking-widest text-orange-300">Explore O24</p><h2 className="mt-3 text-2xl font-bold">Shipping enterprise services safely?</h2><p className="mt-3 text-sm leading-7 text-slate-300">Explore vKnight&apos;s approach to enterprise integration and deployment orchestration, or discuss your release governance requirements with the team.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/solutions/developers" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Developer solutions <ArrowRight className="h-4 w-4" /></Link><Link href="/enterprise" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">Enterprise solutions</Link></div></div>
      </article>
    </div>
  </main>;
}
