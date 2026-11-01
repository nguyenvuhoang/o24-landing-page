import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Database,
  GitBranch, RefreshCcw, Server, ShieldCheck, Workflow,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

const slug = "rabbitmq-event-driven-transactions-dotnet-10";
const path = `/blog/${slug}`;
const url = `https://vknight.io.vn${path}`;
const title = "RabbitMQ & Event-Driven Transaction Processing in .NET 10";
const description =
  "A practical guide to transactional outbox, retries, RabbitMQ dead-letter queues, idempotent consumers, and financial transaction reconciliation in .NET 10.";

export const metadata: Metadata = {
  title: `${title} | vKnight Engineering`,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

const sections = [
  { id: "delivery", label: "Delivery is not settlement" },
  { id: "architecture", label: "Reference architecture" },
  { id: "outbox", label: "Transactional outbox" },
  { id: "publisher", label: "Publisher confirms" },
  { id: "consumer", label: "Idempotent consumers" },
  { id: "retry", label: "Retries & dead letters" },
  { id: "reconciliation", label: "Reconciliation" },
  { id: "security", label: "Security & operations" },
  { id: "testing", label: "Failure testing" },
];

const outboxCode = `// Illustrative EF Core entities; define indexes with your migrations.
public sealed class TransferIntent
{
    public Guid Id { get; set; }
    public string RequestId { get; set; } = ""; // UNIQUE
    public string Status { get; set; } = "PENDING";
}

public sealed class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "";
    public string Payload { get; set; } = "";
    public DateTimeOffset OccurredAtUtc { get; set; }
    public DateTimeOffset? PublishedAtUtc { get; set; }
}

public async Task<Guid> AcceptTransferAsync(
    AppDbContext db, string requestId, CancellationToken ct)
{
    // The database must enforce UNIQUE(RequestId). Handle conflicts by
    // loading the existing request and validating its original payload.
    var intent = new TransferIntent {
        Id = Guid.NewGuid(), RequestId = requestId
    };
    db.TransferIntents.Add(intent);
    db.OutboxMessages.Add(new OutboxMessage {
        Id = Guid.NewGuid(), Type = "TransferRequestedV1",
        OccurredAtUtc = DateTimeOffset.UtcNow,
        Payload = JsonSerializer.Serialize(new {
            TransferId = intent.Id, RequestId = requestId
        })
    });
    // One SaveChanges call is atomic on supported relational providers.
    // For multiple saves, use an explicit database transaction.
    await db.SaveChangesAsync(ct);
    return intent.Id;
}`;

const publisherCode = `// Pseudocode: HostedService / BackgroundService outbox publisher.
// 1. Claim a batch of unpublished rows using a lease/lock so workers
//    do not publish the same row concurrently unnecessarily.
// 2. Publish a persistent message to a durable exchange/queue setup.
// 3. Require publisher confirms AND handle unroutable messages.
// 4. Only after confirmation: mark Outbox.PublishedAtUtc.
// 5. If the worker crashes after publish but before DB update,
//    the message can be published again. Consumers must deduplicate.
// 6. Retry transient broker failures with backoff and alert on lag.
// Never equate a publisher confirm with a core-ledger posting.`;

const consumerCode = `public record TransferRequestedV1(
    Guid EventId, Guid TransferId, string RequestId);

// Architectural sketch, NOT an atomic transaction with the core ledger.
public async Task ProcessAsync(TransferRequestedV1 message, CancellationToken ct)
{
    // Inbox has UNIQUE(ConsumerName, EventId). Use database locking or
    // a per-transfer state transition to prevent concurrent duplicates.
    // If already durably processed, acknowledge without repeating work.
    if (await _inbox.IsCompleteAsync("TransferWorker", message.EventId, ct))
        return;

    // Never automatically repeat an unknown financial posting.
    // Ask the core about the stable RequestId/core reference first.
    var status = await _core.InquireAsync(message.RequestId, ct);
    if (status == CoreStatus.Unknown)
        throw new OutcomeUnknownException(message.RequestId);

    // If absent, posting is allowed only if the core contract supports
    // safe idempotency; otherwise route to manual reconciliation.
    if (status == CoreStatus.NotFound)
        status = await _core.PostIdempotentlyAsync(message.RequestId, ct);

    // Persist status + inbox completion in ONE local DB transaction.
    await _repository.CompleteWithInboxAsync(
        message, status, "TransferWorker", ct);
    // Caller sends RabbitMQ basic.ack AFTER this method commits.
}

// Abstract dependencies are intentionally omitted: adapt to your core API.`;

const dlqCode = `# RabbitMQ definitions (example topology; configure via policy/IaC).
# Exchange: banking.events (topic, durable)
# Primary queue: banking.transfer.work (quorum, durable)
# Dead-letter exchange: banking.dead (direct, durable)
# Dead-letter queue: banking.transfer.dead (durable)
# Primary queue arguments/policy:
#   dead-letter-exchange = banking.dead
#   dead-letter-routing-key = transfer.failed
#   delivery-limit = 5   # quorum delivery-limit; tune to workload
# Prefer a managed delayed-retry path with exponential backoff
# and jitter; avoid basic.nack(requeue=true) tight loops.
# On business-invalid messages: reject without requeue and inspect DLQ.
# On UNKNOWN core outcome: hold for inquiry/reconciliation, not
# immediate payment replay.
# For stronger DL transfer guarantees on quorum queues, evaluate
# at-least-once dead-letter strategy and its prerequisites.`;

const reconciliationCode = `// Reconcile application records against the AUTHORITATIVE core.
// Run periodically, and on demand for aged PROCESSING/UNKNOWN rows.
foreach (var transfer in await repository.GetUnresolvedAsync(ct))
{
    var core = await coreAdapter.InquireAsync(transfer.RequestId, ct);
    switch (core)
    {
        case CoreStatus.Posted:
            await repository.MarkPostedIfCurrentAsync(transfer.Id, ct);
            break;
        case CoreStatus.Rejected:
            await repository.MarkRejectedIfCurrentAsync(transfer.Id, ct);
            break;
        case CoreStatus.NotFound:
        case CoreStatus.Unknown:
            await repository.FlagForInvestigationAsync(transfer.Id, ct);
            break;
    }
}
// Never silently mark unknown transfers FAILED or replay debits.
// Record core references, audit decisions, and reconciliation runs.`;

function CodePanel({ label, code }: { label: string; code: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold">
        <span className="text-orange-300">{label}</span>
        <span className="text-slate-400">Illustrative implementation</span>
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

export default function RabbitMqTransactionsGuide() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: title, description, url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Organization", name: "vKnight" },
        publisher: { "@type": "Organization", name: "vKnight", url: "https://vknight.io.vn" },
        inLanguage: "en", proficiencyLevel: "Advanced",
        keywords: ["RabbitMQ", "Event-Driven Architecture", ".NET 10", "Transactional Outbox", "Idempotency", "Dead Letter Queue", "Reconciliation"],
      }} />
      <section className="border-b bg-gradient-to-br from-orange-50/70 via-background to-background dark:from-primary/10 dark:via-background">
        <div className="container mx-auto max-w-6xl px-4 py-14 lg:py-20">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4"/> Back to Engineering</Link>
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-primary">
            <Server className="h-4 w-4"/> .NET Architecture <span className="text-muted-foreground">· 18 min read</span>
          </div>
          <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            RabbitMQ &amp; <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">Event-Driven</span> Transaction Processing in .NET 10
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">A production-minded guide to durable event publication, duplicate-safe consumers, bounded retries, dead letters, and reconciliation when financial outcomes are uncertain.</p>
          <div className="mt-8 flex flex-wrap gap-2">{["RabbitMQ", "Transactional Outbox", "Retries & DLQ", "Idempotency", "Reconciliation"].map(tag => <span key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium">{tag}</span>)}</div>
        </div>
      </section>
      <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="self-start lg:sticky lg:top-28">
          <div className="rounded-2xl border bg-card p-5">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><BookOpen className="h-4 w-4"/> On this page</p>
            <nav aria-label="Article contents" className="flex flex-col gap-3">{sections.map(section => <a key={section.id} className="text-sm text-muted-foreground hover:text-primary" href={`#${section.id}`}>{section.label}</a>)}</nav>
          </div>
        </aside>
        <article className="min-w-0 space-y-5 text-base leading-8 text-foreground/90">
          <p className="text-lg">An event-driven architecture can decouple a financial application from downstream workloads. But reliable messaging is not the same thing as reliable money movement. Separate the API acceptance result, message delivery result, and authoritative ledger outcome.</p>
          <Callout><strong>Scope:</strong> This is a reference design with partial C# sketches, not a complete runnable payment processor or a claim about specific O24 capabilities. Adapt transactional boundaries, RabbitMQ client APIs, core interfaces, and regulatory controls to your environment.</Callout>

          <Heading id="delivery">1. Delivery is not financial settlement</Heading>
          <p>When a transfer request is received, HTTP <code>202 Accepted</code> means the system accepted work, not that a debit posted. A RabbitMQ publisher confirm means the broker accepted the publication under its configured durability semantics; a consumer acknowledgement means the broker may discard that delivery. Neither is proof that the core ledger posted the transfer.</p>
          <div className="grid gap-3 sm:grid-cols-3">{[
            { title: "Accepted", detail: "A request was validated and durably recorded" },
            { title: "Delivered", detail: "An event reached and was handled by a consumer" },
            { title: "Posted", detail: "The core ledger confirms the financial transaction" },
          ].map(x => <div key={x.title} className="rounded-xl border bg-card p-4"><p className="font-semibold text-primary">{x.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{x.detail}</p></div>)}</div>
          <p>For the full synchronous/asynchronous boundary, see <Link href="/blog/core-banking-integration-architecture" className="font-medium text-primary underline underline-offset-4">Core Banking Integration Architecture</Link>.</p>

          <Heading id="architecture">2. Reference transaction processing architecture</Heading>
          <p>A command handler persists the intent and an outbox record atomically. An outbox publisher sends the event to RabbitMQ. The consumer deduplicates, invokes permitted business processing, and commits its local state before acknowledging. Reconciliation resolves ambiguous ledger results independently.</p>
          <div className="my-7 rounded-2xl border bg-muted/30 p-4 sm:p-7" role="img" aria-label="Flow: API and CQRS handler writes Transaction plus Outbox to database, background publisher publishes to RabbitMQ, worker validates inbox and processes via Core Adapter, reconciliation checks ledger independently.">
            <div className="mx-auto max-w-xl space-y-2 text-center text-sm font-semibold">
              <div className="rounded-xl border bg-background p-4"><GitBranch className="mx-auto mb-2 h-5 w-5 text-primary"/> API → CQRS command handler</div>
              <div className="text-primary">↓ atomic database commit</div>
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-4"><Database className="mx-auto mb-2 h-5 w-5 text-primary"/> Transaction state + Outbox</div>
              <div className="text-primary">↓ outbox publisher · confirms</div>
              <div className="rounded-xl border bg-background p-4"><Workflow className="mx-auto mb-2 h-5 w-5 text-primary"/> RabbitMQ exchange → durable work queue</div>
              <div className="text-primary">↓ manual acknowledgement after commit</div>
              <div className="rounded-xl border bg-background p-4"><ShieldCheck className="mx-auto mb-2 h-5 w-5 text-primary"/> Worker · Inbox deduplication · Core Adapter</div>
              <div className="grid grid-cols-2 gap-3 pt-2"><div className="rounded-xl border bg-background p-4">Bounded retry / DLQ</div><div className="rounded-xl border bg-background p-4">Core ledger inquiry</div></div>
              <div className="text-primary">↓ independent verification</div>
              <div className="rounded-xl border border-primary/30 bg-background p-4"><RefreshCcw className="mx-auto mb-2 h-5 w-5 text-primary"/> Reconciliation + audit trail</div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">Conceptual architecture; posting may be synchronous or asynchronous depending on business rules. Retries must respect the core system’s idempotency contract.</p>
          </div>

          <Heading id="outbox">3. Transactional Outbox: solve the dual-write gap</Heading>
          <p>Without an outbox, an application might commit a transfer intent but crash before publishing its event. Reversing the order creates the opposite risk: a message is sent for data that never committed. Persist the business record and event in the same relational transaction.</p>
          <CodePanel label="TransferIntent + OutboxMessage — illustrative EF Core" code={outboxCode}/>
          <p>Require a unique <code>RequestId</code> constraint and compare request payloads on duplicate IDs. Index pending outbox rows for efficient polling. Multiple publisher instances should claim rows via leases or database locking; do not assume a basic query prevents concurrent publication.</p>

          <Heading id="publisher">4. Outbox publisher and publisher confirms</Heading>
          <p>The publisher retries only publication, not financial posting. Configure durable topology, message persistence, mandatory/unroutable handling as appropriate, and publisher confirms. A crash between receiving confirmation and setting <code>PublishedAtUtc</code> can cause duplicate publication: design for at-least-once delivery, not exactly-once messaging.</p>
          <CodePanel label="Outbox publishing sequence — pseudocode" code={publisherCode}/>
          <p>Microsoft’s <Link href="/blog/cqrs-pattern-dotnet-10" className="font-medium text-primary underline underline-offset-4">CQRS guide</Link> explains the separate command/query responsibility; the outbox adds reliable asynchronous publication at the persistence boundary.</p>

          <Heading id="consumer">5. Idempotent consumers and the Inbox pattern</Heading>
          <p>A consumer may receive the same event twice after reconnection, acknowledgement loss, or republishing. Deduplicate using a stable event ID and a unique inbox constraint such as <code>(ConsumerName, EventId)</code>. The check and local state update must be concurrency-safe and committed together; a standalone “check then insert” is not sufficient.</p>
          <CodePanel label="TransferRequested consumer — architecture sketch" code={consumerCode}/>
          <Callout><strong>Critical:</strong> An inbox transaction protects local database state, not a call to an external core. If a core posting times out, the result is <code>UNKNOWN</code> until inquiry or reconciliation resolves it. Never blindly retry a debit with a different reference.</Callout>

          <Heading id="retry">6. Bounded retries, poison messages, and dead-letter queues</Heading>
          <p>Classify failures before retrying. Network interruptions and temporarily unavailable consumers may warrant exponential backoff with jitter. Invalid schemas, unsupported event versions, or permanent business rejection should not loop indefinitely. Configure a bounded retry policy and dead-letter handling, with alerting and controlled redrive procedures.</p>
          <CodePanel label="RabbitMQ topology — policy/IaC outline" code={dlqCode}/>
          <div className="grid gap-3 sm:grid-cols-2">{[
            { title: "Transient failure", detail: "Backoff and retry with a bounded budget; observe queue age" },
            { title: "Poison event", detail: "Dead-letter, inspect, fix, and manually redrive using the original event ID" },
            { title: "Unknown core result", detail: "Pause financial replay; inquire and reconcile the original reference" },
            { title: "Consumer crash", detail: "Unacknowledged delivery can return; deduplicate on reprocessing" },
          ].map(x => <div key={x.title} className="rounded-xl border bg-card p-5"><h3 className="font-semibold">{x.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{x.detail}</p></div>)}</div>
          <p>RabbitMQ quorum queues provide delivery-limit and dead-letter features; review the documentation and version-specific defaults. Simply requeueing immediately can create a hot loop. The dead-letter strategy and topology determine how reliably messages reach the DLQ.</p>

          <Heading id="reconciliation">7. Reconciliation is the final safety net</Heading>
          <p>Reconciliation compares internal transaction state against the authoritative core, using stable references and documented inquiry semantics. It is necessary when a service crashes after a core posting, a timeout hides the response, or downstream events are lost. Missing evidence is not proof of failure.</p>
          <CodePanel label="Reconciliation worker — illustrative pseudocode" code={reconciliationCode}/>
          <p>Operationally, distinguish <code>PENDING</code>, <code>PROCESSING</code>, <code>POSTED</code>, <code>REJECTED</code>, and <code>UNKNOWN</code>. Record every transition, the core reference, operator decisions, and how exceptions were resolved. Reconciliation schedules should match transaction risk and agreed operating windows.</p>

          <Heading id="security">8. Security, governance, and observability</Heading>
          <ul className="space-y-3">{[
            "Use dedicated RabbitMQ users, vhosts, minimal publish/consume permissions, and TLS for broker connections.",
            "Protect credentials in a secrets manager; rotate them and avoid secrets or sensitive account data in events.",
            "Set prefetch, concurrency limits, queue-length alerts, DLQ alerts, and end-to-end correlation IDs.",
            "Audit manual replay, reconciliation overrides, schema changes, and privileged service actions.",
            "Version event contracts and validate untrusted payloads; do not assume a broker message is authorized financial intent.",
          ].map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-primary"/><span>{item}</span></li>)}</ul>

          <Heading id="testing">9. Production failure-injection checklist</Heading>
          <p>Test more than the happy path: crash before commit, after commit and before publish, after publish and before marking the outbox, before consumer acknowledgement, and after core posting but before local status update. Then test duplicate events, out-of-order delivery, stale core inquiries, DLQ redrive, broker partition, and reconciliation lag.</p>
          <Callout><strong>Acceptance criterion:</strong> Every case must converge to an auditable state without issuing unintended duplicate financial postings. Exact behavior depends on the core adapter’s idempotency/inquiry guarantees and cannot be claimed from messaging infrastructure alone.</Callout>

          <div className="mt-10 rounded-2xl border bg-muted/30 p-6">
            <h2 className="text-xl font-bold">Official references and related guides</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm">
              <li><a className="text-primary underline underline-offset-4" href="https://www.rabbitmq.com/docs/confirms" target="_blank" rel="noopener noreferrer">RabbitMQ: Publisher Confirms and Consumer Acknowledgements</a></li>
              <li><a className="text-primary underline underline-offset-4" href="https://www.rabbitmq.com/docs/quorum-queues" target="_blank" rel="noopener noreferrer">RabbitMQ: Quorum Queues and Dead Lettering</a></li>
              <li><a className="text-primary underline underline-offset-4" href="https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling" target="_blank" rel="noopener noreferrer">Microsoft: Queue-Based Load Leveling</a></li>
              <li><Link className="text-primary underline underline-offset-4" href="/blog/core-banking-integration-architecture">vKnight: Core Banking Integration Architecture</Link></li>
              <li><Link className="text-primary underline underline-offset-4" href="/blog/cqrs-pattern-dotnet-10">vKnight: CQRS Pattern in .NET 10</Link></li>
              <li><Link className="text-primary underline underline-offset-4" href="/blog/building-api-gateway-aspnet-core">vKnight: Building an API Gateway with ASP.NET Core</Link></li>
            </ul>
          </div>
          <div className="mt-10 rounded-2xl bg-slate-950 p-7 text-white sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">Explore O24</p>
            <h2 className="mt-3 text-2xl font-bold">Designing resilient banking workflows?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Explore vKnight’s banking integration approach and discuss transaction reliability, event-driven services, and deployment constraints with the team.</p>
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
