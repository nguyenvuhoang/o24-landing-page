import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, KeyRound, LockKeyhole, Network, ShieldCheck, ServerCog } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";

const slug = "api-security-dotnet-10-jwt-oauth2-mtls-zero-trust";
const path = `/blog/${slug}`;
const url = `https://vknight.io.vn${path}`;
const title = "API Security in .NET 10: JWT, OAuth 2.0, mTLS & Zero Trust";
const description = "A practical guide to validating JWT access tokens, enforcing OAuth 2.0 scopes, protecting service-to-service calls with mTLS, and implementing Zero Trust in ASP.NET Core 10.";

export const metadata: Metadata = createPageMetadata({
  title: `${title} | vKnight Engineering`,
  description,
  path,
  type: "article",
  ogTitle: title,
});

const sections = [
  { id: "threat-model", label: "Threat model & boundaries" },
  { id: "architecture", label: "Defense-in-depth architecture" },
  { id: "jwt", label: "JWT validation in ASP.NET Core" },
  { id: "oauth", label: "OAuth 2.0 grants & scopes" },
  { id: "authorization", label: "Endpoint authorization" },
  { id: "mtls", label: "Mutual TLS between services" },
  { id: "zero-trust", label: "Zero Trust controls" },
  { id: "banking", label: "Banking transaction safeguards" },
  { id: "testing", label: "Security test checklist" },
  { id: "references", label: "Official references" },
];

const install = `dotnet new web -n SecurePayments.Api --framework net10.0
cd SecurePayments.Api
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 10.*
# Configure Auth:Authority and Auth:Audience through environment or secret management.
# Do not issue your own production tokens in this sample API.`;

const jwtCode = `using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var authority = builder.Configuration["Auth:Authority"]
    ?? throw new InvalidOperationException("Missing Auth:Authority");
var audience = builder.Configuration["Auth:Audience"]
    ?? throw new InvalidOperationException("Missing Auth:Audience");

// Authority must be a trusted HTTPS OIDC provider exposing signing keys.
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = authority;
        options.Audience = audience;
        options.RequireHttpsMetadata = true;
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();
var app = builder.Build();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/api/me", (System.Security.Claims.ClaimsPrincipal user) =>
    Results.Ok(new { subject = user.FindFirst("sub")?.Value }))
    .RequireAuthorization();
app.Run();`;

const scopesCode = `using System.Security.Claims;

// Register before builder.Build().
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("payments.read", policy =>
        policy.RequireAuthenticatedUser().RequireAssertion(context =>
            context.User.FindAll("scope")
                .SelectMany(c => c.Value.Split(' ', StringSplitOptions.RemoveEmptyEntries))
                .Concat(context.User.FindAll("scp").SelectMany(c =>
                    c.Value.Split(' ', StringSplitOptions.RemoveEmptyEntries)))
                .Contains("payments.read", StringComparer.Ordinal)));
});

// Map after app.UseAuthorization().
app.MapGet("/api/payments/{id}", (string id) => Results.Ok(new { id }))
   .RequireAuthorization("payments.read");

// This checks a scope only. In a real banking API ALSO validate that
// the caller is entitled to access the specific account/payment object.`;

const certificateCode = `// On a direct TLS endpoint, configure Kestrel to request/require
// client certificates at the TLS handshake, before ASP.NET Core routing.
// Example: isolated internal service endpoint, not public API traffic.
builder.WebHost.ConfigureKestrel(server =>
{
    server.ListenAnyIP(8443, listen =>
    {
        listen.UseHttps(https =>
        {
            https.ServerCertificate = LoadServerCertificateFromSecureStore();
            https.ClientCertificateMode =
                Microsoft.AspNetCore.Server.Kestrel.Https.ClientCertificateMode.RequireCertificate;
            // Define certificate-chain trust + revocation checks per PKI policy.
        });
    });
});

// LoadServerCertificateFromSecureStore() is an application-specific
// placeholder: use managed certificates or an HSM-backed secret store.
// Client certificates are NOT authorized merely because they exist.`;

const certAuthCode = `// Optional ASP.NET Core certificate identity mapping.
// Requires Microsoft.AspNetCore.Authentication.Certificate.
builder.Services
    .AddAuthentication("Certificate")
    .AddCertificate("Certificate", options =>
    {
        options.Events.OnCertificateValidated = context =>
        {
            // Match a trusted certificate identity to a provisioned service.
            // Check expected issuer/subject/SAN, chain policy and revocation.
            // DO NOT accept arbitrary client certificates.
            context.Fail("Certificate must be mapped to an approved service");
            return Task.CompletedTask;
        };
    });

// The handler above deliberately fails closed until real identity mapping
// is implemented; do not paste it into the bearer-auth sample unchanged.`;

const tokenFlow = `PUBLIC CLIENT (mobile / SPA)
    -> Authorization Code + PKCE -> Identity Provider
    <- access token for Payments API (audience + scopes)
    -> TLS -> API Gateway -> ASP.NET Core API
                        -> validates iss / aud / signature / exp
                        -> enforces scope + object-level entitlement

SERVICE-TO-SERVICE
    -> workload identity + short-lived access token
    -> optional mTLS at trusted network boundary
    -> adapter / transaction service / core banking
    -> audit and authorization at EACH hop`;

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="scroll-mt-28 pt-8 text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>;
}
function CodePanel({ label, code }: { label: string; code: string }) {
  return <div className="my-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100"><div className="border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-orange-300">{label}</div><pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm"><code>{code}</code></pre></div>;
}
function Callout({ children }: { children: ReactNode }) {
  return <div className="my-6 rounded-xl border-l-4 border-primary bg-primary/5 p-5 text-sm leading-7">{children}</div>;
}
const checks = [
  "Reject missing, expired, tampered, wrong-issuer and wrong-audience bearer tokens.",
  "Reject tokens with a valid signature but insufficient scope or object-level entitlement.",
  "Test authorization on each account/payment identifier (BOLA / IDOR).",
  "Reject client certificates that are untrusted, expired, revoked or not mapped to an approved workload.",
  "Ensure untrusted proxies cannot inject client-certificate or user-identity headers.",
  "Disable insecure token acquisition flows and disallow access tokens in URLs and application logs.",
  "Verify rate limits, abuse protection, audit trails, key rotation and incident revocation procedures.",
  "Require idempotency, transaction limits, approvals and authoritative posting-state verification for financial operations.",
];

export default function ApiSecurityGuidePage() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "TechArticle",
    headline: title, description, mainEntityOfPage: url, url,
    author: { "@type": "Organization", name: "vKnight", url: "https://vknight.io.vn" },
    publisher: { "@type": "Organization", name: "vKnight", url: "https://vknight.io.vn" },
    inLanguage: "en", isAccessibleForFree: true,
    keywords: "ASP.NET Core 10, JWT bearer, OAuth 2.0, PKCE, mTLS, Zero Trust, banking API security",
  };
  return <main className="min-h-screen bg-background">
    <JsonLd data={structuredData}/>
    <section className="border-b bg-gradient-to-br from-orange-50/70 via-background to-background py-14 dark:from-primary/10 dark:via-background lg:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4"/> Back to Engineering</Link>
        <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><ShieldCheck className="h-4 w-4"/> SECURITY · 17 MIN READ</p>
        <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">API Security in <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">.NET 10</span></h1>
        <p className="mt-4 max-w-4xl text-2xl font-semibold">JWT, OAuth 2.0, mTLS &amp; Zero Trust</p>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Build a layered API security model for enterprise and banking workloads, from access-token validation to service identity, object-level access control, and auditable financial transactions.</p>
        <div className="mt-8 flex flex-wrap gap-2">{["ASP.NET Core 10", "JWT", "OAuth 2.0", "mTLS", "Zero Trust"].map(tag => <span key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium">{tag}</span>)}</div>
      </div>
    </section>
    <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
      <aside className="self-start lg:sticky lg:top-28"><div className="rounded-2xl border bg-card p-5"><p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><BookOpen className="h-4 w-4"/> On this page</p><nav aria-label="Article contents" className="flex flex-col gap-3">{sections.map(section => <a key={section.id} className="text-sm text-muted-foreground hover:text-primary" href={`#${section.id}`}>{section.label}</a>)}</nav></div></aside>
      <article className="min-w-0 space-y-5 text-base leading-8 text-foreground/90">
        <p className="text-lg">A payment API is not secure merely because a request contains a signed JWT or arrives over HTTPS. The platform must authenticate the calling workload, authorize the requested operation against the actual resource, protect transport between services, and preserve a reliable audit trail. This guide separates those concerns and shows where ASP.NET Core 10 fits.</p>
        <Callout><strong>Scope:</strong> Reference implementation patterns, not a production-ready banking authentication server. Use a trusted identity provider, managed certificates, real authorization data, and independent security testing. Code samples are intentionally isolated examples; do not concatenate every snippet into one <code>Program.cs</code>.</Callout>
        <Heading id="threat-model">1. Start with identities, assets and trust boundaries</Heading>
        <p>List the assets at risk: account ownership, transfer instructions, balances, personal information, signing keys, and core-banking credentials. Then enumerate actors: mobile users, partner applications, background jobs, support operators, API gateways, and internal adapters. Every network crossing is a possible trust-boundary crossing.</p>
        <div className="grid gap-3 sm:grid-cols-3">{[
          { icon: KeyRound, title: "Authentication", text: "Who or what is calling? Validate cryptographic identity and token provenance." },
          { icon: LockKeyhole, title: "Authorization", text: "May this caller perform this action on this specific account or payment?" },
          { icon: Network, title: "Transport", text: "Protect traffic and verify workloads, including on internal hops." },
        ].map(item => <div key={item.title} className="rounded-xl border bg-card p-4"><item.icon className="mb-3 h-6 w-6 text-primary"/><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></div>)}</div>
        <Heading id="architecture">2. A layered security architecture</Heading>
        <p>Keep the identity provider, gateway and domain services separate. The gateway can reject obvious abuse and invalid requests, but a transaction service must still enforce business permissions. Neither a trusted private network nor a successful authentication removes the need for per-resource checks.</p>
        <CodePanel label="Reference trust-boundary diagram" code={tokenFlow}/>
        <p>For browser/mobile sign-in, OIDC identifies the user and OAuth 2.0 obtains delegated access. For machine-to-machine integrations without an end user, use client credentials with narrowly scoped access. Access tokens are intended for resource APIs; an ID token is not a substitute for an API access token.</p>
        <Heading id="jwt">3. Validate JWT access tokens in ASP.NET Core 10</Heading>
        <p>The API should validate signature, trusted issuer, intended audience and expiry using a trusted identity provider&apos;s metadata and signing keys. Do not accept an arbitrary JWT merely because it decodes successfully, and do not disable signature or lifetime validation to make integration tests pass.</p>
        <CodePanel label="Create a sample API" code={install}/>
        <CodePanel label="Program.cs — JWT bearer API (standalone baseline)" code={jwtCode}/>
        <Callout><strong>Important:</strong> Configure <code>Auth__Authority</code> and <code>Auth__Audience</code> from your environment or secrets system. This example assumes a conforming HTTPS OIDC discovery endpoint and an issuer that provides JWT access tokens. Some providers use opaque tokens and require a different validation approach.</Callout>
        <p>Where supported by the issuer and deployment architecture, consider token replay defenses, short expiry, appropriate revocation design and sender-constrained access tokens. Avoid logging complete Authorization headers or personally identifiable claims.</p>
        <Heading id="oauth">4. OAuth 2.0 is authorization; JWT is a token format</Heading>
        <p>OAuth 2.0 defines how clients obtain delegated or application authorization. A JWT is one possible token representation. OIDC builds on OAuth 2.0 for sign-in. Confusing these concepts leads to common errors, including accepting ID tokens at a resource API or handing long-lived secrets to public clients.</p>
        <ul className="list-disc space-y-2 pl-6"><li><strong>Mobile and SPA:</strong> Authorization Code with PKCE; use established platform and identity-provider SDKs.</li><li><strong>Server-side web application:</strong> Authorization Code with OIDC; carefully protect server sessions, redirect URIs and cookies.</li><li><strong>Service-to-service:</strong> Client Credentials using a confidential workload identity; prefer asymmetric credentials or workload federation where supported.</li><li><strong>Scopes:</strong> Limit what an access token is permitted to request, but never replace account ownership or transaction entitlement checks.</li></ul>
        <Heading id="authorization">5. Enforce scopes and resource-level authorization</Heading>
        <p>Scope checks provide a first boundary, not complete business authorization. For example, a token with <code>payments.read</code> must still be prevented from reading another customer&apos;s payment. Validate customer/tenant ownership server-side, based on trusted records rather than a caller-provided account identifier alone.</p>
        <CodePanel label="Scoped policy and endpoint — add to the JWT API example" code={scopesCode}/>
        <p>The policy checks both common space-delimited <code>scope</code> and <code>scp</code> claims. Claim shape is issuer-specific; inspect your issuer&apos;s documented token contract. Enforce object-level checks in a handler/service after loading the target resource. Return suitable 401/403/404 responses without leaking resource existence.</p>
        <Heading id="mtls">6. mTLS for internal and partner connections</Heading>
        <p>Mutual TLS authenticates both peers during the TLS handshake when correctly configured. It is particularly useful for regulated partner interfaces and workload-to-workload boundaries. A client certificate proves possession of a key tied to a certificate; it does not inherently grant rights to perform a transfer.</p>
        <CodePanel label="Kestrel endpoint — illustrative TLS configuration, not standalone" code={certificateCode}/>
        <CodePanel label="Additional certificate-to-service authorization hook (fail-closed placeholder)" code={certAuthCode}/>
        <Callout><strong>Proxy warning:</strong> If TLS is terminated at a reverse proxy, ASP.NET Core cannot directly see the original TLS handshake. Forwarded certificate headers are trustworthy only when an authenticated, allowlisted proxy strips user-supplied copies and securely forwards verified identity. Certificate forwarding is not a replacement for mTLS on the ingress hop.</Callout>
        <p>Use managed PKI lifecycle operations: issuance, short validity, renewal, revocation, inventory and key protection. For high-risk core banking adapters, map certificate identities to explicitly allowed workloads and enforce least-privilege service permissions.</p>
        <Heading id="zero-trust">7. Apply Zero Trust, not “trust the internal network”</Heading>
        <div className="space-y-3">{[
          ["Verify explicitly", "Use validated user/workload identity, device or workload context where available, and policy-based authorization."],
          ["Use least privilege", "Minimize scopes, endpoint permissions, service credentials, database roles and administrative access."],
          ["Assume breach", "Segment services, monitor unusual behavior, minimize blast radius and rehearse credential revocation."],
          ["Secure every hop", "Protect gateway-to-service and service-to-core connections; do not accept unauthenticated internal API requests."],
        ].map(([name, detail]) => <div key={name} className="flex gap-3 rounded-xl border bg-card p-4"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary"/><div><p className="font-semibold">{name}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p></div></div>)}</div>
        <Heading id="banking">8. Controls that JWT, OAuth and mTLS cannot replace</Heading>
        <p>A correctly authenticated caller can still send a duplicate, fraudulent or unauthorized payment instruction. Put financial controls inside the domain and transaction processing layers rather than assuming perimeter controls are sufficient.</p>
        <ul className="list-disc space-y-2 pl-6"><li><strong>Idempotency:</strong> Persist request identifiers and safely handle retries without duplicate financial posting.</li><li><strong>Maker/checker &amp; limits:</strong> Apply relevant approvals, velocity rules, transaction thresholds and beneficiary protections.</li><li><strong>State ownership:</strong> Treat core ledger posting status as authoritative; message delivery acknowledgements are not settlement confirmations.</li><li><strong>Audit:</strong> Record actor, workload, authorization decision, correlation ID and business outcome while redacting secrets and sensitive fields.</li><li><strong>Reconciliation:</strong> Detect and resolve ambiguous timeouts, stuck transactions and divergence from core banking.</li></ul>
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5"><div className="mb-3 flex items-center gap-2 font-semibold"><ServerCog className="h-5 w-5 text-primary"/> Read the complete architecture</div><p className="text-sm leading-7 text-muted-foreground">Authentication is only one layer in secure transaction processing. Pair it with gateway design, CQRS command validation, a core adapter and asynchronous messaging safeguards.</p><Link href="/blog/core-banking-integration-architecture" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">Core Banking Integration Architecture <ArrowRight className="h-4 w-4"/></Link></div>
        <Heading id="testing">9. Security verification checklist</Heading>
        <ul className="space-y-3">{checks.map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-primary"/><span>{item}</span></li>)}</ul>
        <Callout><strong>Production rule:</strong> Security-sensitive samples must be adapted and reviewed before deployment. Add automated integration tests with an issuer test environment, authenticated TLS infrastructure, negative authorization tests and a documented incident-response procedure.</Callout>
        <Heading id="references">10. Official references and further reading</Heading>
        <ul className="list-disc space-y-3 pl-6 text-sm">
          <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication?view=aspnetcore-10.0" target="_blank" rel="noopener noreferrer">Microsoft: Configure JWT Bearer Authentication</a></li>
          <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/security/authentication/certauth?view=aspnetcore-10.0" target="_blank" rel="noopener noreferrer">Microsoft: Certificate Authentication in ASP.NET Core</a></li>
          <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-10.0" target="_blank" rel="noopener noreferrer">Microsoft: Policy-based Authorization</a></li>
          <li><a className="text-primary underline underline-offset-4" href="https://datatracker.ietf.org/doc/html/rfc9700" target="_blank" rel="noopener noreferrer">IETF RFC 9700: OAuth 2.0 Security Best Current Practice</a></li>
          <li><a className="text-primary underline underline-offset-4" href="https://csrc.nist.gov/pubs/sp/800/207/final" target="_blank" rel="noopener noreferrer">NIST SP 800-207: Zero Trust Architecture</a></li>
          <li><a className="text-primary underline underline-offset-4" href="https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/" target="_blank" rel="noopener noreferrer">OWASP: Broken Object Level Authorization</a></li>
        </ul>
        <div className="mt-10 rounded-2xl border bg-muted/30 p-6"><h2 className="mb-4 text-xl font-bold">Continue learning</h2><div className="grid gap-3 sm:grid-cols-2">{[
          ["API Gateway with ASP.NET Core", "/blog/building-api-gateway-aspnet-core"],
          ["RabbitMQ Transaction Processing", "/blog/rabbitmq-event-driven-transactions-dotnet-10"],
          ["CQRS Pattern in .NET 10", "/blog/cqrs-pattern-dotnet-10"],
          ["Banking & Fintech Solutions", "/solutions/bank-fintech"],
        ].map(([name, href]) => <Link key={href} href={href} className="flex items-center justify-between rounded-xl border bg-background p-4 text-sm font-semibold hover:border-primary/40">{name}<ArrowRight className="h-4 w-4 shrink-0 text-primary"/></Link>)}</div></div>
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-7 text-white"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/80">ENTERPRISE API ARCHITECTURE</p><h2 className="text-2xl font-bold">Design a secure integration platform</h2><p className="mt-3 max-w-xl text-sm leading-7 text-white/90">Explore how vKnight approaches API architecture and banking integration. Assess your identity boundaries, transaction controls and operational requirements before implementation.</p><Link href="/contact" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-50">Discuss your architecture <ArrowRight className="h-4 w-4"/></Link></div>
      </article>
    </div>
  </main>;
}
