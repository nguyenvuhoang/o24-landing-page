export type GuideSlug = "workflow-orchestration" | "cqrs" | "api-gateway" | "core-banking-integration";
export type Guide = {
  slug: GuideSlug;
  title: string;
  eyebrow: string;
  summary: string;
  readingMinutes: number;
  concepts: string[];
  stages: { title: string; detail: string }[];
  sections: { id: string; title: string; paragraphs: string[]; points?: string[]; code?: { language: string; title: string; source: string } }[];
  relatedArticle?: { label: string; url: string };
};

export const guides: Guide[] = [
  {
    slug: "workflow-orchestration", title: "Workflow Orchestration", eyebrow: "01 / Integration patterns", readingMinutes: 12,
    summary: "Coordinate API validation, business decisions, service calls and failure handling without hiding side effects inside controllers.",
    concepts: ["Orchestrator", "Idempotency", "Retries", "Compensation", "Observability"],
    stages: [
      {title:"Request",detail:"Validate input and context"},
      {title:"Orchestrate",detail:"Choose steps and policies"},
      {title:"Integrate",detail:"Call service adapters"},
      {title:"Respond",detail:"Return an explicit result"},
    ],
    sections: [
      {id:"overview",title:"What a workflow owns", paragraphs:["A workflow coordinates a business operation across one or more services. The gateway handles transport concerns; the workflow owns ordering, branching and explicit failure behavior.","A workflow should be identifiable and observable. Carry a correlation ID through each step and persist execution state when the operation must survive process restarts."],points:["Keep orchestration separate from API input parsing and persistence details.","Use a stable business idempotency key for retried commands.","Record step outcomes, including failures and compensating actions."]},
      {id:"example",title:"Illustrative workflow definition",paragraphs:["The following JSON demonstrates a conceptual account lookup. It is not a published O24 workflow schema or an endpoint contract."],code:{language:"json",title:"account-lookup.workflow.example.json",source:`{
  "workflow": "ACCOUNT_LOOKUP_EXAMPLE",
  "version": 1,
  "steps": [
    { "id": "validate", "type": "validate", "next": "authorize" },
    { "id": "authorize", "type": "policy", "next": "read-account" },
    { "id": "read-account", "type": "adapter", "target": "core-account-read", "next": "respond" },
    { "id": "respond", "type": "result", "status": "COMPLETED" }
  ]
}`}},
      {id:"failures",title:"Failure and recovery",paragraphs:["Transient failures can be retried with bounded backoff; business rejection must not be retried as if it were a transport error.","For money-moving workflows, use a durable state machine and compensating actions when distributed atomicity cannot be guaranteed. Do not assume a successful HTTP response proves ledger settlement."],points:["Separate retriable, terminal and indeterminate outcomes.","Persist idempotency decisions before irreversible side effects.","Use a dead-letter or reconciliation process for unresolved executions."]},
      {id:"production",title:"Production checklist",paragraphs:["Define step-level timeouts, cancellation behavior, trace propagation and retention before enabling a production workflow."],points:["Authentication and authorization at every trust boundary","Idempotent command handling","Audit-safe logs without credentials or sensitive payloads","Operational alarms for stuck or indeterminate states"]},
    ],relatedArticle:{label:"RabbitMQ & Event-Driven Transaction Processing",url:"/blog/rabbitmq-event-driven-transactions-dotnet-10"}
  },
  {
    slug:"cqrs",title:"CQRS & Command Handling",eyebrow:"02 / Application design",readingMinutes:11,
    summary:"Separate state-changing commands from read queries while keeping validation, transactions and handlers explicit.",
    concepts:["Commands","Queries","Validators","Transaction boundary","Projections"],
    stages:[{title:"Command",detail:"Receive intent"},{title:"Validate",detail:"Apply business rules"},{title:"Execute",detail:"Commit state change"},{title:"Publish",detail:"Project or notify"}],
    sections:[
      {id:"overview",title:"When CQRS helps",paragraphs:["CQRS is a separation of responsibilities, not necessarily two databases. Commands express intent and enforce invariants; queries return read-oriented data without side effects.","Start with one database and separate handlers. Introduce asynchronous projections only when actual scaling, ownership or latency requirements justify eventual consistency."],points:["Commands should not silently act as read APIs.","Queries must not mutate business state.","Authorization and validation are required on both paths."]},
      {id:"example",title:"Illustrative .NET command",paragraphs:["This example is framework-neutral C# and intentionally simplified. It does not imply an official O24 CQRS interface or namespace."],code:{language:"csharp",title:"RegisterAccountCommand.cs",source:`public sealed record RegisterAccountCommand(string CustomerId, string Currency);

public sealed class RegisterAccountHandler
{
    private readonly IAccountRepository _accounts;

    public RegisterAccountHandler(IAccountRepository accounts)
        => _accounts = accounts;

    public async Task<Guid> HandleAsync(
        RegisterAccountCommand command, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(command.CustomerId))
            throw new ArgumentException("CustomerId is required");

        // Domain checks and a durable transaction belong here.
        var account = Account.Create(command.CustomerId, command.Currency);
        await _accounts.SaveAsync(account, cancellationToken);
        return account.Id;
    }
}`}},
      {id:"consistency",title:"Transactions and consistency",paragraphs:["A command should commit its business state atomically within its ownership boundary. Use an outbox when messages must be published reliably after a database transaction.","Read projections may lag behind writes. Expose explicit state and avoid promising immediate consistency when the architecture is eventually consistent."],points:["Optimistic concurrency on mutable aggregates","Transactional outbox for external events","Idempotency keys for externally retried commands"]},
      {id:"production",title:"Production checklist",paragraphs:["CQRS adds value when handlers make behavior easier to audit and test, not merely when every class gets a new suffix."],points:["Unit tests for validators and domain rules","Integration tests for transactions","Authorization enforced server-side","Measured projection lag and retry policies"]},
    ],relatedArticle:{label:"CQRS Pattern in .NET 10",url:"/blog/cqrs-pattern-dotnet-10"}
  },
  {
    slug:"api-gateway",title:"API Gateway & Security",eyebrow:"03 / Access architecture",readingMinutes:13,
    summary:"Centralize edge concerns such as authentication, routing, policy enforcement and correlation without moving domain rules to the perimeter.",
    concepts:["Routing","OAuth 2.0","JWT","Rate limiting","Correlation"],
    stages:[{title:"Client",detail:"Send HTTPS request"},{title:"Authenticate",detail:"Validate token and scope"},{title:"Route",detail:"Apply policy and forward"},{title:"Service",detail:"Authorize business action"}],
    sections:[
      {id:"overview",title:"The gateway boundary",paragraphs:["An API gateway can provide a consistent public entry point for many services. It authenticates requests, applies quotas, attaches correlation context and routes traffic to the right upstream.","A gateway does not replace service authorization or domain validation. Downstream services must still verify the permissions necessary for the requested business operation."],points:["Prefer explicit routes and deny-by-default policies.","Validate JWT issuer, audience, expiry and signature.","Never forward untrusted identity headers from the public internet."]},
      {id:"example",title:"Illustrative HTTP request",paragraphs:["The example below uses the reserved .invalid domain and a placeholder token. It is documentation only and cannot contact a production O24 gateway."],code:{language:"bash",title:"sample-request.sh",source:`curl --request GET \\
  --url https://api.example.invalid/v1/accounts/ACC-DEMO-001 \\
  --header 'Authorization: Bearer <demo-token>' \\
  --header 'X-Correlation-Id: sample-request-001' \\
  --header 'Accept: application/json'`}},
      {id:"policies",title:"Policy and reliability",paragraphs:["Use appropriate timeouts, request size limits and rate limits at the gateway. Correlation IDs should pass through services to make a failed transaction diagnosable.","Avoid automatic retries for non-idempotent operations unless an idempotency contract is established end-to-end."],points:["TLS end-to-end where required","Bounded upstream timeouts","Rate limits by authenticated identity or API key","Structured errors without credential leakage"]},
      {id:"production",title:"Production checklist",paragraphs:["Configure health checks and rollout policies alongside security. A secure gateway that cannot route or recover reliably is still a production risk."],points:["Validate audience, issuer, scopes and token rotation","Harden CORS and forwarded headers","Version and audit route policy changes","Instrument latency, saturation and error budgets"]},
    ],relatedArticle:{label:"Building an API Gateway with ASP.NET Core and YARP",url:"/blog/building-api-gateway-aspnet-core"}
  },
  {
    slug:"core-banking-integration",title:"Core Banking Integration",eyebrow:"04 / Enterprise connectivity",readingMinutes:15,
    summary:"Bridge modern APIs and legacy core systems with strict contracts, adapter boundaries, transaction states and reconciliation.",
    concepts:["Adapter","Anti-corruption layer","Transaction state","Reconciliation","Audit trail"],
    stages:[{title:"Channel",detail:"Initiate a banking request"},{title:"Orchestrator",detail:"Validate intent and context"},{title:"Core adapter",detail:"Translate core contract"},{title:"Reconcile",detail:"Verify final outcome"}],
    sections:[
      {id:"overview",title:"Keep core contracts isolated",paragraphs:["Core banking systems often use proprietary message formats, status codes and long-lived account identifiers. Put those details behind an adapter so external APIs do not depend directly on legacy contracts.","Define canonical request and response models only where they reduce coupling. Avoid a one-size-fits-all contract that hides domain-specific banking behavior."],points:["Use an anti-corruption layer between public APIs and core messages.","Preserve reference IDs across every system boundary.","Avoid logging credentials, personally identifying data and full financial payloads."]},
      {id:"example",title:"Illustrative integration response",paragraphs:["This synthetic example shows an explicit pending outcome. Real status codes and payload fields depend on the bank and configured integration."],code:{language:"json",title:"banking-integration.example.json",source:`{
  "reference_id": "DEMO-2026-0001",
  "operation": "ACCOUNT_ENQUIRY",
  "state": "COMPLETED",
  "core_reference": "MOCK-REF-001",
  "data": {
    "account": "ACC-DEMO-001",
    "currency": "LAK",
    "status": "ACTIVE"
  },
  "source": "ILLUSTRATIVE_ONLY"
}`}},
      {id:"transactions",title:"Transaction and reconciliation",paragraphs:["A transport timeout does not prove that a banking operation failed. Preserve an indeterminate state and reconcile against the authoritative core reference before issuing any corrective action.","For money movement, distinguish validation, acceptance, posting and settlement. The final response and its audit record should communicate which state is actually known."],points:["Never blindly replay a debit after a timeout.","Reconcile pending and ambiguous outcomes.","Separate reversal from compensation and keep immutable history."]},
      {id:"production",title:"Production checklist",paragraphs:["Banking integrations require explicit operational ownership as well as clean API design."],points:["mTLS, network segmentation and least privilege","Core session expiry and access policy","Audit records and immutable transaction IDs","Reconciliation jobs, alerts and manual escalation paths"]},
    ],relatedArticle:{label:"Core Banking Integration Architecture",url:"/blog/core-banking-integration-architecture"}
  }
];

export function getGuide(slug: string): Guide | undefined { return guides.find(g=>g.slug===slug); }
