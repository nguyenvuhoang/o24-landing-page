import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Database,
  GitBranch, Landmark, LockKeyhole, Network, ShieldCheck, Workflow,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

const slug = "core-banking-integration-architecture";
const path = `/blog/${slug}`;
const url = `https://vknight.io.vn${path}`;
const title = "Core Banking Integration Architecture: A Developer’s Guide";
const description =
  "Explore a resilient core banking integration architecture using API gateways, adapters, CQRS, transaction processing, RabbitMQ, and layered security.";

export const metadata: Metadata = {
  title: `${title} | vKnight Engineering`,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

const sections = [
  { id: "problem", label: "Integration challenges" },
  { id: "architecture", label: "Reference architecture" },
  { id: "gateway", label: "API gateway" },
  { id: "adapter", label: "Core banking adapter" },
  { id: "cqrs", label: "CQRS boundaries" },
  { id: "transactions", label: "Transaction processing" },
  { id: "messaging", label: "RabbitMQ & outbox" },
  { id: "security", label: "Security & governance" },
  { id: "operations", label: "Production checklist" },
];

const adapterCode = `// Illustrative boundary: adapt the contract to your actual core system.
public record CoreAccount(string Number, string Currency, decimal Available);

public interface ICoreBankingAdapter
{
    Task<CoreAccount?> GetAccountAsync(
        string accountNumber, CancellationToken cancellationToken);
    Task<CorePostingResult> PostTransferAsync(
        CoreTransferRequest request, CancellationToken cancellationToken);
}

public record CoreTransferRequest(
    string Reference, string DebitAccount, string CreditAccount,
    decimal Amount, string Currency);

public record CorePostingResult(
    string Reference, string CoreReference, string Status);

// Implementations can translate REST, SOAP, ISO 8583, host messages,
// or vendor-specific interfaces into the same application contract.
// Do not log account identifiers or credentials in plaintext.`;

const commandCode = `public record TransferCommand(
    string RequestId, string DebitAccount, string CreditAccount,
    decimal Amount, string Currency);

public record TransferAccepted(string RequestId, string Status);

public sealed class TransferCommandHandler
{
    private readonly ITransferRepository _transfers;
    public TransferCommandHandler(ITransferRepository transfers)
        => _transfers = transfers;

    public async Task<TransferAccepted> Handle(
        TransferCommand command, CancellationToken ct)
    {
        if (command.Amount <= 0) throw new ArgumentOutOfRangeException(
            nameof(command.Amount));

        // A unique RequestId constraint makes repeated submissions safe.
        // The repository must atomically persist the transfer intent AND
        // an outbox event in one database transaction.
        await _transfers.CreatePendingWithOutboxAsync(command, ct);
        return new(command.RequestId, "PENDING");
    }
}

// A separate query model can expose pending/posted/failed status.
// These types are an architectural sketch, not a standalone app.`;

const eventCode = `// Example integration event (not a payment instruction to trust blindly).
public record TransferRequestedV1(
    Guid EventId, string RequestId, DateTimeOffset OccurredAtUtc);

// Transactionally save:
//   Transfers(RequestId UNIQUE, Status = PENDING)
//   Outbox(EventId UNIQUE, Payload, PublishedAt = NULL)
// Then an independent publisher sends pending outbox records.
//
// RabbitMQ consumer workflow:
// 1. Check Inbox(EventId UNIQUE) and persisted transfer state.
// 2. Call the adapter using a stable core posting reference.
// 3. Persist the confirmed core result and Inbox record.
// 4. Acknowledge the message only after durable processing.
//
// Crash/retry ambiguity requires a core-status lookup or reconciliation.
// Never retry a non-idempotent debit blindly.`;

function CodePanel({ label, code }: { label: string; code: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold">
        <span className="text-orange-300">{label}</span>
        <span className="text-slate-400">Illustrative C#</span>
      </div>
      <pre className="overflow-x-auto p-5 text-xs leading-6 text-slate-100 sm:text-sm"><code>{code}</code></pre>
    </div>
  );
}

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="scroll-mt-28 pt-10 text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>;
}

function Callout({ children }: { children: ReactNode }) {
  return <div className="my-6 rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4 text-sm leading-7">{children}</div>;
}

export default function CoreBankingIntegrationArticle() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: title,
        description,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Organization", name: "vKnight" },
        publisher: { "@type": "Organization", name: "vKnight", url: "https://vknight.io.vn" },
        inLanguage: "en",
        proficiencyLevel: "Advanced",
        keywords: ["Core Banking", "API Gateway", "CQRS", "RabbitMQ", "Banking Integration", "Security"],
      }} />
      <section className="border-b bg-gradient-to-br from-orange-50/70 via-background to-background dark:from-primary/10 dark:via-background">
        <div className="container mx-auto max-w-6xl px-4 py-14 lg:py-20">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4"/> Back to Engineering</Link>
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-primary">
            <Landmark className="h-4 w-4"/> Banking Integration <span className="text-muted-foreground">· 15 min read</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Core Banking Integration <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">Architecture</span>: A Developer’s Guide</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">A practical reference for connecting digital channels to legacy and modern core banking systems without confusing network delivery with financial finality.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {(["API Gateway", "Adapters", "CQRS", "Transaction Processing", "RabbitMQ", "Security"] as const).map(tag => <span key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium">{tag}</span>)}
          </div>
        </div>
      </section>

      <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="self-start lg:sticky lg:top-28">
          <div className="rounded-2xl border bg-card p-5">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><BookOpen className="h-4 w-4"/> On this page</p>
            <nav aria-label="Article contents" className="flex flex-col gap-3">
              {sections.map(section => <a key={section.id} className="text-sm text-muted-foreground hover:text-primary" href={`#${section.id}`}>{section.label}</a>)}
            </nav>
          </div>
        </aside>
        <article className="min-w-0 space-y-5 text-base leading-8 text-foreground/90">
          <p className="text-lg">Core banking integration is more than exposing a legacy operation as an HTTP endpoint. A dependable design must translate protocols, preserve transaction meaning, control retries, and expose auditable status when downstream systems are unavailable.</p>
          <Callout><strong>Scope:</strong> This is a reference architecture and illustrative code, not a claim about every O24 deployment or a drop-in banking payment system. Validate each component against your institution’s core interface, security requirements, and operational rules.</Callout>

          <Heading id="problem">1. Why banking integration is different</Heading>
          <p>A browser request can time out even when the core has already posted a financial transaction. If the API retries the debit as though nothing happened, funds could be moved twice. The design must handle three separate questions: was the request accepted, was it delivered, and was the posting confirmed by the authoritative ledger?</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "Channel", detail: "User identity, request validation, and response contracts" },
              { title: "Integration", detail: "Protocol mapping, orchestration, and failure handling" },
              { title: "Core", detail: "Authoritative balances, posting results, and reconciliation" },
            ].map(item => <div key={item.title} className="rounded-xl border bg-card p-4"><p className="font-semibold text-primary">{item.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p></div>)}
          </div>

          <Heading id="architecture">2. Reference architecture</Heading>
          <p>Keep the request path deliberately narrow. The gateway governs entry. The application layer handles intent and state. The adapter speaks the core’s native protocol. RabbitMQ supports asynchronous integration work; it is not the financial ledger.</p>
          <div className="my-7 rounded-2xl border bg-muted/30 p-4 sm:p-7" role="img" aria-label="Reference integration path: digital channels, API gateway, command/query services, core adapter, authoritative core banking system. RabbitMQ and outbox handle asynchronous events alongside transaction services.">
            <div className="mx-auto max-w-xl space-y-2 text-center text-sm font-semibold">
              <div className="rounded-xl border bg-background p-4"><Network className="mx-auto mb-2 h-5 w-5 text-primary"/> Mobile · Web · Partner APIs</div>
              <div className="text-primary">↓</div>
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-4"><ShieldCheck className="mx-auto mb-2 h-5 w-5 text-primary"/> API Gateway<br/><span className="text-xs font-normal text-muted-foreground">TLS · Authentication · Authorization · Rate limits</span></div>
              <div className="text-primary">↓</div>
              <div className="rounded-xl border bg-background p-4"><GitBranch className="mx-auto mb-2 h-5 w-5 text-primary"/> CQRS Application Services<br/><span className="text-xs font-normal text-muted-foreground">Commands · Queries · Transaction State</span></div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border bg-background p-4"><Workflow className="mx-auto mb-2 h-5 w-5 text-primary"/> Outbox → RabbitMQ<br/><span className="text-xs font-normal text-muted-foreground">Events · Notifications · Integration jobs</span></div>
                <div className="rounded-xl border bg-background p-4"><Database className="mx-auto mb-2 h-5 w-5 text-primary"/> Core Banking Adapter<br/><span className="text-xs font-normal text-muted-foreground">Protocol translation · Core references</span></div>
              </div>
              <div className="ml-auto w-[48%] text-center text-primary">↓</div>
              <div className="ml-auto w-[48%] rounded-xl border border-primary/30 bg-background p-4">Core Banking Ledger<br/><span className="text-xs font-normal text-muted-foreground">Authoritative posting status</span></div>
            </div>
            <p className="mt-5 text-center text-xs text-muted-foreground">Conceptual architecture. Synchronous posting and asynchronous workflows are alternatives chosen per use case, not a mandatory sequential pipeline.</p>
          </div>

          <Heading id="gateway">3. API Gateway: enforce the edge contract</Heading>
          <p>An API Gateway can terminate TLS, validate bearer tokens, apply routing policies, limit abusive traffic, and attach correlation identifiers. In ASP.NET Core, YARP can proxy requests, but authentication and authorization policies must be explicitly configured: routing alone does not authenticate users.</p>
          <p>Never treat successful gateway authorization as sufficient permission to debit an account. The transaction service must enforce business authorization, account ownership, limits, and segregation-of-duties policies.</p>
          <p>For a focused implementation walkthrough, read <Link className="font-medium text-primary underline underline-offset-4" href="/blog/building-api-gateway-aspnet-core">Building an API Gateway with ASP.NET Core and YARP</Link>.</p>

          <Heading id="adapter">4. Core Banking Adapter: protect the domain model</Heading>
          <p>Legacy cores might expose SOAP, proprietary messages, host procedures, or vendor-specific JSON. An anti-corruption adapter translates these contracts into typed application interfaces, while preserving core transaction references and error categories. Keep authentication credentials and vendor response formats inside the integration boundary.</p>
          <CodePanel label="ICoreBankingAdapter.cs" code={adapterCode}/>
          <p>Map errors into actionable classes such as <code>VALIDATION_REJECTED</code>, <code>RETRYABLE_UNAVAILABLE</code>, and <code>OUTCOME_UNKNOWN</code>. An ambiguous timeout must not be treated as a definite failure. Confirm the result with a core inquiry API or a reconciliation process before reissuing a posting.</p>

          <Heading id="cqrs">5. CQRS: distinguish write intent from read models</Heading>
          <p>Commands such as <code>InitiateTransfer</code> request a state change; queries such as <code>GetTransferStatus</code> return the observed state. Keeping handlers separate makes business rules more explicit without requiring separate physical databases or event sourcing.</p>
          <CodePanel label="TransferCommandHandler.cs — architecture sketch" code={commandCode}/>
          <p>The persistence interface above is intentionally illustrative. A production implementation needs durable storage, a unique idempotency key, validation, consistent transaction boundaries, and a read model that distinguishes accepted requests from posted transactions.</p>
          <p>For a smaller runnable introduction, see <Link className="font-medium text-primary underline underline-offset-4" href="/blog/cqrs-pattern-dotnet-10">CQRS Pattern in .NET 10</Link>.</p>

          <Heading id="transactions">6. Transaction processing and financial finality</Heading>
          <p>A useful state machine is <code>PENDING → PROCESSING → POSTED</code>, or <code>PENDING/PROCESSING → REJECTED</code>. Add <code>UNKNOWN</code> when the core outcome cannot be determined, and resolve it through inquiry/reconciliation. The exact statuses must follow your banking ledger semantics.</p>
          <div className="rounded-xl border bg-card p-5">
            <p className="mb-3 font-semibold">Suggested safeguards</p>
            <ul className="space-y-3 text-sm leading-7">
              {[
                "Use a stable request/idempotency key and persist it with a unique constraint.",
                "Persist core transaction reference, timestamp, currency, amount, and status transitions.",
                "Never interpret HTTP 202 or a RabbitMQ acknowledgement as a completed debit.",
                "On timeout, inquire about the original posting before deciding whether to retry.",
                "Reconcile with the core ledger; design compensating actions only where business rules permit.",
              ].map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary"/><span>{item}</span></li>)}
            </ul>
          </div>

          <Heading id="messaging">7. RabbitMQ, outbox and at-least-once processing</Heading>
          <p>Use RabbitMQ for non-ledger side effects, integration events, notifications, and workflows that tolerate asynchronous delivery. In an outbox pattern, persist business state and an event in one local database transaction. A separate publisher sends pending events to RabbitMQ with publisher confirms; consumers acknowledge only after durable processing.</p>
          <CodePanel label="Outbox and consumer protocol — pseudocode" code={eventCode}/>
          <Callout><strong>Important:</strong> Publisher confirms and consumer acknowledgements address different delivery boundaries. Neither gives end-to-end exactly-once financial execution. Durable queues, retry budgets, dead-letter handling, inbox deduplication, and reconciliation are complementary controls.</Callout>

          <Heading id="security">8. Security and governance across layers</Heading>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: LockKeyhole, title: "Identity & access", detail: "OIDC/OAuth2 where appropriate, short-lived tokens, scoped service identities, transaction-level authorization." },
              { icon: ShieldCheck, title: "Transport & secrets", detail: "TLS everywhere, mTLS for service links where required, managed secrets with rotation." },
              { icon: BookOpen, title: "Auditability", detail: "Immutable audit trails, correlation IDs, masked account identifiers, protected logs." },
              { icon: Database, title: "Data protection", detail: "Least privilege, encryption at rest, retention controls, and sensitive data minimization." },
            ].map(item => <div key={item.title} className="rounded-xl border bg-card p-5"><item.icon className="mb-3 h-5 w-5 text-primary"/><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p></div>)}
          </div>
          <p>Compliance is a system- and jurisdiction-specific assessment. Implementing JWT, mTLS, or encryption does not automatically certify a product as PCI DSS, ISO 27001, or compliant with central-bank regulation.</p>

          <Heading id="operations">9. Production readiness checklist</Heading>
          <ul className="space-y-3">
            {[
              "Run load and soak tests against realistic, authorized test environments.",
              "Document timeout budgets, circuit-breaking, retry policies, and fallback behavior per core operation.",
              "Alert on stuck PENDING/UNKNOWN transactions, queue backlog, DLQs, and reconciliation differences.",
              "Establish audit trails, least-privilege credentials, secret rotation, and incident runbooks.",
              "Test duplicate requests, reordered messages, broker outages, core timeouts, and partial failures.",
              "Record the authoritative settlement/ledger status separately from API acceptance status.",
            ].map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-primary"/><span>{item}</span></li>)}
          </ul>

          <div className="mt-10 rounded-2xl border bg-muted/30 p-6">
            <h2 className="text-xl font-bold">Further reading</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/authn-authz?view=aspnetcore-10.0" target="_blank" rel="noopener noreferrer">Microsoft: YARP authentication and authorization</a></li>
              <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs" target="_blank" rel="noopener noreferrer">Microsoft: CQRS pattern</a></li>
              <li><a className="text-primary underline underline-offset-4" href="https://www.rabbitmq.com/docs/confirms" target="_blank" rel="noopener noreferrer">RabbitMQ: consumer acknowledgements and publisher confirms</a></li>
            </ul>
          </div>
          <div className="mt-10 rounded-2xl bg-slate-950 p-7 text-white sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">Explore O24</p>
            <h2 className="mt-3 text-2xl font-bold">Planning a banking integration project?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Explore vKnight’s integration approach or discuss your architecture and delivery constraints. Availability of specific connectors and deployment options is confirmed during technical discovery.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/solutions/bank-fintech" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Banking solutions <ArrowRight className="h-4 w-4"/></Link>
              <Link href="/enterprise" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">Talk to the team</Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
