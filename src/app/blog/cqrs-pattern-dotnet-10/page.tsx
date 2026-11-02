import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Code2, Database, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";

const slug = "/blog/cqrs-pattern-dotnet-10";
const url = `https://vknight.io.vn${slug}`;
const title = "CQRS Pattern in .NET 10: A Practical Guide";
const description = "Learn CQRS with an ASP.NET Core .NET 10 Minimal API example, separate command and query handlers, dependency injection, and production trade-offs.";

export const metadata: Metadata = createPageMetadata({
  title: `${title} | vKnight Engineering`,
  description,
  path: slug,
  type: "article",
  ogTitle: title,
});

// This is an illustrative, fully local example—not an O24 SDK or banking integration.
const setup = `dotnet new web -n CqrsDemo -f net10.0
cd CqrsDemo
dotnet run`;

const program = `using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<AccountStore>();
builder.Services.AddScoped<OpenAccountHandler>();
builder.Services.AddScoped<GetAccountHandler>();

var app = builder.Build();

app.MapPost("/accounts", (OpenAccount request, OpenAccountHandler handler) =>
{
    var result = handler.Handle(request);
    return result is null
        ? Results.BadRequest(new { error = "Invalid account name" })
        : Results.Created($"/accounts/{result.Id}", result);
});

app.MapGet("/accounts/{id:guid}", (Guid id, GetAccountHandler handler) =>
{
    var account = handler.Handle(new GetAccount(id));
    return account is null ? Results.NotFound() : Results.Ok(account);
});

app.Run();

// Write side: request represents a business intention.
record OpenAccount(string OwnerName);
record AccountOpened(Guid Id, string OwnerName);

sealed class OpenAccountHandler(AccountStore store)
{
    public AccountOpened? Handle(OpenAccount command)
    {
        if (string.IsNullOrWhiteSpace(command.OwnerName)) return null;
        var id = Guid.NewGuid();
        var name = command.OwnerName.Trim();
        store.Save(id, name);
        return new AccountOpened(id, name);
    }
}

// Read side: returns a projection, without changing state.
record GetAccount(Guid Id);
record AccountView(Guid Id, string OwnerName);

sealed class GetAccountHandler(AccountStore store)
{
    public AccountView? Handle(GetAccount query) =>
        store.Find(query.Id) is { } name
            ? new AccountView(query.Id, name)
            : null;
}

// Demo only: a concurrent, non-durable in-memory store.
sealed class AccountStore
{
    private readonly ConcurrentDictionary<Guid, string> _accounts = new();

    public void Save(Guid id, string ownerName) => _accounts[id] = ownerName;
    public string? Find(Guid id) =>
        _accounts.TryGetValue(id, out var name) ? name : null;
}`;

const requests = `# Create an account (PowerShell or bash with curl)
curl -X POST http://localhost:5000/accounts \\
  -H "Content-Type: application/json" \\
  -d '{"ownerName":"Ada"}'

# Replace ACCOUNT_ID with the Id returned by POST
curl http://localhost:5000/accounts/ACCOUNT_ID`;

function CodePanel({ title: heading, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1324] text-slate-100">
      <div className="border-b border-slate-700 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-amber-300">{heading}</div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-6 sm:p-6 sm:text-[13px]"><code>{code}</code></pre>
    </div>
  );
}

const takeaways = [
  { icon: Code2, title: "Commands", body: "Express a business action that may change state. Validate intent and protect invariants." },
  { icon: BookOpen, title: "Queries", body: "Return read-friendly data without performing business writes." },
  { icon: Database, title: "Persistence", body: "Begin with one data store. Separate read/write storage only when the use case justifies it." },
];

export default function CqrsGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url,
    inLanguage: "en",
    author: { "@type": "Organization", name: "vKnight", url: "https://vknight.io.vn" },
    publisher: { "@type": "Organization", name: "vKnight", url: "https://vknight.io.vn" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={articleSchema} />
      <article>
        <header className="border-b bg-gradient-to-br from-orange-50/80 via-background to-background py-16 dark:from-primary/10 dark:via-background lg:py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Engineering Blog</Link>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary"><Code2 className="h-4 w-4" /> .NET architecture · Practical guide</p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">CQRS Pattern in <span className="text-primary">.NET 10</span>: A Practical Guide</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
            <p className="mt-5 text-sm text-muted-foreground">vKnight Engineering · Approx. 10 min read</p>
          </div>
        </header>

        <div className="container mx-auto max-w-4xl space-y-12 px-4 py-16 leading-8">
          <section aria-labelledby="what-is-cqrs" className="space-y-4">
            <h2 id="what-is-cqrs" className="text-2xl font-bold">What CQRS actually means</h2>
            <p>Command Query Responsibility Segregation (CQRS) separates operations that change state (commands) from operations that read state (queries). It does <strong>not</strong> require two databases, a message broker, event sourcing, or a mediator library. Those may be useful in larger systems, but they are independent design decisions.</p>
            <div className="grid gap-4 md:grid-cols-3">{takeaways.map(({ icon: Icon, title: itemTitle, body }) => <div key={itemTitle} className="rounded-xl border bg-card p-5"><Icon className="mb-3 h-6 w-6 text-primary" /><h3 className="font-bold">{itemTitle}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>)}</div>
          </section>

          <section aria-labelledby="example" className="space-y-4">
            <h2 id="example" className="text-2xl font-bold">A small .NET 10 example</h2>
            <p>We will create an ASP.NET Core Minimal API for opening and retrieving an account record. To make the responsibilities easy to see, it uses separate command and query handlers and a shared in-memory store. This is an <strong>educational account-directory example</strong>, not financial account opening or a production banking workflow.</p>
            <p>The example uses only the .NET 10 SDK and ASP.NET Core—no MediatR, database package, or O24 dependency.</p>
            <CodePanel title="1 · Create a web project" code={setup} />
            <p>Replace the generated <code className="rounded bg-muted px-1">Program.cs</code> with the following code, then run <code className="rounded bg-muted px-1">dotnet run</code> again. Check the printed HTTP address: its port may differ from the sample below.</p>
            <CodePanel title="2 · Program.cs — complete example" code={program} />
            <p>With the default development launch URL adjusted to match your console output, test these endpoints:</p>
            <CodePanel title="3 · HTTP requests (illustrative port)" code={requests} />
          </section>

          <section aria-labelledby="why-it-works" className="space-y-4">
            <h2 id="why-it-works" className="text-2xl font-bold">Why this is CQRS</h2>
            <p><code className="rounded bg-muted px-1">OpenAccountHandler</code> accepts a command and changes state. <code className="rounded bg-muted px-1">GetAccountHandler</code> accepts a query and returns a projection. The handlers have separate responsibilities, even though both use the same singleton store.</p>
            <p>The example is intentionally synchronous. Async handlers and separate databases are not prerequisites for CQRS. In production, use async I/O for database calls and protect business invariants at the persistence boundary.</p>
          </section>

          <section aria-labelledby="tradeoffs" className="space-y-4">
            <h2 id="tradeoffs" className="text-2xl font-bold">Production considerations</h2>
            <ul className="list-disc space-y-3 pl-6">
              <li><strong>Durability:</strong> This sample loses all records on restart. Use a persistent database and appropriate migrations in production.</li>
              <li><strong>Validation and authorization:</strong> The demo validates one field only. Real commands need authentication, authorization, input limits, and business rules.</li>
              <li><strong>Idempotency:</strong> Financial or payment commands need retry-safe semantics and idempotency keys where appropriate.</li>
              <li><strong>Transactions:</strong> Persist related writes atomically. When publishing integration events, consider a transactional outbox and idempotent consumers.</li>
              <li><strong>Read consistency:</strong> Separate read stores introduce synchronization delays. Define acceptable staleness before adopting that design.</li>
              <li><strong>Observability:</strong> Add traces, metrics, structured logs, and correlation IDs; avoid placing sensitive information in logs.</li>
            </ul>
          </section>

          <section aria-labelledby="when-to-use" className="space-y-4">
            <h2 id="when-to-use" className="text-2xl font-bold">When to use CQRS—and when not to</h2>
            <p>CQRS is useful for systems with complex write rules and different read requirements, including workflows, approvals and integration-heavy domains. For a straightforward CRUD application, introducing extra handlers and projections may add more complexity than value.</p>
          </section>

          <section aria-labelledby="references" className="space-y-3">
            <h2 id="references" className="text-2xl font-bold">Further reading</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm">
              <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs" target="_blank" rel="noopener noreferrer">Microsoft Azure Architecture Center — CQRS pattern</a></li>
              <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-10.0" target="_blank" rel="noopener noreferrer">Microsoft Learn — ASP.NET Core Minimal APIs (.NET 10)</a></li>
            </ul>
          </section>

          <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <div className="mb-2 flex items-center gap-2 text-primary"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-widest">Next steps</span></div>
            <h2 className="text-xl font-bold">Apply architecture patterns in integration systems</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Explore how API management, workflows, and domain services fit together—or discuss your integration requirements with the vKnight team.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link href="/solutions/developers" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Developer resources <ArrowRight className="h-4 w-4" /></Link><Link href="/solutions/enterprise" className="inline-flex items-center rounded-xl border bg-background px-5 py-3 text-sm font-semibold">Enterprise solutions</Link></div>
          </aside>
        </div>
      </article>
    </main>
  );
}
