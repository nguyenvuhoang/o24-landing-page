"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight,
  Copy, FileJson, Play, RotateCcw, ShieldCheck, Terminal, Workflow, XCircle,
} from "lucide-react";

type ScenarioId = "account" | "payment" | "workflow";
type Method = "GET" | "POST";
type ApiScenario = {
  id: ScenarioId;
  name: string;
  caption: string;
  method: Method;
  path: string;
  request: Record<string, unknown>;
  steps: readonly string[];
};
type SimulationResult = { status: number; statusText: string; body: unknown; trace: string[] };

const scenarios: readonly ApiScenario[] = [
  {
    id: "account", name: "Account lookup", caption: "Retrieve an illustrative account summary", method: "GET",
    path: "/v1/accounts/ACC-DEMO-001", request: {},
    steps: ["Gateway: check request headers", "Workflow: route account query", "Adapter: read mock account", "Gateway: normalize response"],
  },
  {
    id: "payment", name: "Payment validation", caption: "Validate a sample payment before processing", method: "POST",
    path: "/v1/payments/validate", request: { amount: 250000, currency: "LAK", beneficiary_account: "ACC-DEMO-002", reference: "DEMO-REF-001" },
    steps: ["Gateway: validate request", "Workflow: evaluate amount and currency", "Adapter: resolve mock beneficiary", "Gateway: return validation result"],
  },
  {
    id: "workflow", name: "Workflow execution", caption: "Orchestrate a simple sample workflow", method: "POST",
    path: "/v1/workflows/execute", request: { workflow: "ACCOUNT_ENQUIRY", input: { account_number: "ACC-DEMO-001" } },
    steps: ["Gateway: receive execution request", "Workflow: validate workflow and input", "Adapter: run mock account lookup", "Gateway: return workflow output"],
  },
];

const fixedHeaders = { "Content-Type": "application/json", "X-Demo-Mode": "true" } as const;
const pretty = (value: unknown) => JSON.stringify(value, null, 2);
const defaults = (s: ApiScenario) => pretty(s.request);
const safeCurl = (method: Method, path: string, headers: Record<string, string>, body: string) => {
  const quote = (text: string) => `'${text.replace(/'/g, `'\\''`)}'`;
  return [
    `curl --request ${method} ${quote(`https://api.example.invalid${path}`)}`,
    ...Object.entries(headers).map(([k, v]) => `  --header ${quote(`${k}: ${v}`)}`),
    ...(method === "POST" ? [`  --data-raw ${quote(body)}`] : []),
  ].join(" \\\n");
};

function simulate(s: ApiScenario, body: unknown, headers: Record<string, string>): SimulationResult {
  const trace = [...s.steps];
  if (headers["X-Demo-Mode"] !== "true") {
    return { status: 403, statusText: "Forbidden", body: { error: { code: "DEMO_MODE_REQUIRED", message: "X-Demo-Mode must be true for this example." } }, trace: ["Gateway: rejected demo-mode header"] };
  }
  if (s.id === "account") {
    return { status: 200, statusText: "OK", body: { success: true, data: { account_number: "ACC-DEMO-001", currency: "LAK", status: "ACTIVE", available_balance: 1250000 }, meta: { environment: "BROWSER_SIMULATION", source: "illustrative" } }, trace };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { status: 400, statusText: "Bad Request", body: { error: { code: "INVALID_BODY", message: "A JSON object is required." } }, trace: [trace[0], "Gateway: request body validation failed"] };
  }
  const payload = body as Record<string, unknown>;
  if (s.id === "payment") {
    if (typeof payload.amount !== "number" || !Number.isFinite(payload.amount) || payload.amount <= 0 || payload.currency !== "LAK" || typeof payload.beneficiary_account !== "string" || !payload.beneficiary_account.trim()) {
      return { status: 422, statusText: "Unprocessable Content", body: { error: { code: "VALIDATION_ERROR", message: "Provide a positive numeric amount, currency LAK, and beneficiary_account." } }, trace: trace.slice(0, 2).concat("Workflow: validation rejected") };
    }
    return { status: 200, statusText: "OK", body: { success: true, data: { valid: true, amount: payload.amount, currency: "LAK", beneficiary_account: payload.beneficiary_account, reference: typeof payload.reference === "string" ? payload.reference : null, next_action: "READY_FOR_REVIEW" }, meta: { environment: "BROWSER_SIMULATION", transaction_created: false } }, trace };
  }
  if (payload.workflow !== "ACCOUNT_ENQUIRY" || !payload.input || typeof payload.input !== "object" || Array.isArray(payload.input) || typeof (payload.input as Record<string, unknown>).account_number !== "string") {
    return { status: 422, statusText: "Unprocessable Content", body: { error: { code: "INVALID_WORKFLOW", message: "Use workflow ACCOUNT_ENQUIRY with input.account_number." } }, trace: trace.slice(0, 2).concat("Workflow: rejected invalid configuration") };
  }
  return { status: 200, statusText: "OK", body: { success: true, data: { workflow: "ACCOUNT_ENQUIRY", state: "COMPLETED", output: { account_number: (payload.input as Record<string, unknown>).account_number, currency: "LAK", status: "ACTIVE" } }, meta: { environment: "BROWSER_SIMULATION", execution_id: "DEMO-EXEC-001" } }, trace };
}

export function ApiExplorer() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("account");
  const scenario = scenarios.find(s => s.id === scenarioId)!;
  const [body, setBody] = useState(defaults(scenarios[0]));
  const [headers, setHeaders] = useState(pretty(fixedHeaders));
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [elapsedSteps, setElapsedSteps] = useState(0);
  const [copied, setCopied] = useState<"request" | "response" | "curl" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runVersion = useRef(0);

  function stop() {
    runVersion.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    setBusy(false);
  }
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  function changeScenario(id: ScenarioId) {
    stop();
    setScenarioId(id);
    setBody(defaults(scenarios.find(s => s.id === id)!));
    setHeaders(pretty(fixedHeaders));
    setResult(null);
    setElapsedSteps(0);
    setCopied(null);
  }
  function reset() {
    stop(); setBody(defaults(scenario)); setHeaders(pretty(fixedHeaders));
    setResult(null); setElapsedSteps(0); setCopied(null);
  }
  function run() {
    stop(); setResult(null); setElapsedSteps(0); setCopied(null);
    let parsedBody: unknown;
    let parsedHeaders: unknown;
    try { parsedBody = JSON.parse(body); } catch {
      setResult({ status: 400, statusText: "Invalid JSON", body: { error: { code: "INVALID_JSON", message: "Request body must contain valid JSON." } }, trace: ["Client: invalid request JSON"] }); return;
    }
    try { parsedHeaders = JSON.parse(headers); } catch {
      setResult({ status: 400, statusText: "Invalid headers", body: { error: { code: "INVALID_HEADERS", message: "Headers must contain valid JSON." } }, trace: ["Client: invalid headers JSON"] }); return;
    }
    if (!parsedHeaders || typeof parsedHeaders !== "object" || Array.isArray(parsedHeaders) || Object.entries(parsedHeaders).some(([, v]) => typeof v !== "string")) {
      setResult({ status: 400, statusText: "Invalid headers", body: { error: { code: "INVALID_HEADERS", message: "Headers must be a JSON object with string values." } }, trace: ["Client: invalid header values"] }); return;
    }
    const output = simulate(scenario, parsedBody, parsedHeaders as Record<string, string>);
    setBusy(true);
    const version = runVersion.current;
    let cursor = 0;
    const advance = () => {
      if (runVersion.current !== version) return;
      cursor += 1;
      setElapsedSteps(cursor);
      if (cursor >= output.trace.length) { setBusy(false); setResult(output); timer.current = null; return; }
      timer.current = setTimeout(advance, 280);
    };
    timer.current = setTimeout(advance, 280);
  }
  async function copy(kind: "request" | "response" | "curl") {
    let content: string;
    if (kind === "request") content = body;
    else if (kind === "response") content = pretty(result?.body ?? {});
    else {
      let h: Record<string, string> = { ...fixedHeaders };
      try { const parsed = JSON.parse(headers); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) h = Object.fromEntries(Object.entries(parsed).filter(([, v]) => typeof v === "string")) as Record<string, string>; } catch { /* copy uses default header on invalid input */ }
      content = safeCurl(scenario.method, scenario.path, h, body);
    }
    try { await navigator.clipboard.writeText(content); setCopied(kind); } catch { setCopied(null); }
  }
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950 dark:bg-[#080e1b] dark:text-slate-100">
      <section className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1425]">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <Link href="/developers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 dark:text-slate-300"><ArrowLeft size={16} /> Developer Hub</Link>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300"><Terminal size={14} /> Developer Lab / Step 27.2</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Interactive <span className="text-orange-600 dark:text-orange-400">API Explorer.</span></h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">Inspect example requests, edit JSON, simulate validation and explore response traces. Everything runs locally in your browser.</p>
            </div>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700">Request a technical demo <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      <section className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100" role="note">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <div><strong>Sandbox simulation only.</strong> These are illustrative APIs, not published O24 endpoints. No requests leave the browser, no real account data is queried, and no payment or workflow is executed on a server. The cURL examples use the reserved <code>.invalid</code> domain.</div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
          <aside className="self-start rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#101c2e] lg:sticky lg:top-24">
            <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[.15em] text-slate-500 dark:text-slate-400">Example endpoints</p>
            <nav aria-label="Choose API example" className="space-y-2">
              {scenarios.map(s => <button key={s.id} type="button" onClick={() => changeScenario(s.id)} aria-current={scenarioId === s.id ? "true" : undefined} className={`w-full rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 ${scenarioId === s.id ? "border-orange-300 bg-orange-50 text-orange-950 dark:border-orange-500/40 dark:bg-orange-500/15 dark:text-white" : "border-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"}`}>
                <span className="flex items-center gap-2 text-sm font-bold"><span className={`text-[10px] ${s.method === "GET" ? "text-emerald-700 dark:text-emerald-400" : "text-orange-700 dark:text-orange-400"}`}>{s.method}</span>{s.name}</span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{s.caption}</span>
              </button>)}
            </nav>
            <div className="mt-5 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">Illustrative request flow <ChevronRight className="inline h-3 w-3" /> Gateway <ChevronRight className="inline h-3 w-3" /> Workflow <ChevronRight className="inline h-3 w-3" /> Adapter</div>
          </aside>
          <div className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101c2e]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-white/10 sm:px-6">
                <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Request builder</p><h2 className="mt-1 text-xl font-bold">{scenario.name}</h2></div>
                <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-white/20 dark:hover:bg-white/5"><RotateCcw size={14} /> Reset</button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex min-w-0 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-white/10 dark:bg-[#0b1425] sm:text-sm"><span className={scenario.method === "GET" ? "font-bold text-emerald-700 dark:text-emerald-400" : "font-bold text-orange-700 dark:text-orange-400"}>{scenario.method}</span><code className="min-w-0 break-all text-slate-800 dark:text-slate-100">{scenario.path}</code></div>
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="min-w-0"><label htmlFor="example-headers" className="text-sm font-bold">Headers (JSON)</label><textarea id="example-headers" spellCheck={false} value={headers} onChange={e => setHeaders(e.target.value)} className="mt-2 h-40 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-3 font-mono text-xs leading-6 text-slate-900 outline-offset-2 focus-visible:outline-orange-500 dark:border-white/15 dark:bg-[#0b1425] dark:text-emerald-300" /></div>
                  <div className="min-w-0"><div className="flex items-center justify-between"><label htmlFor="example-body" className="text-sm font-bold">Request body (JSON)</label><button onClick={() => void copy("request")} type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 dark:text-orange-400">{copied === "request" ? <Check size={13} /> : <Copy size={13} />} {copied === "request" ? "Copied" : "Copy"}</button></div><textarea id="example-body" spellCheck={false} value={body} onChange={e => setBody(e.target.value)} className="mt-2 h-40 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-3 font-mono text-xs leading-6 text-slate-900 outline-offset-2 focus-visible:outline-orange-500 dark:border-white/15 dark:bg-[#0b1425] dark:text-emerald-300" /></div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" disabled={busy} onClick={run} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"><Play size={16} /> {busy ? "Simulating..." : "Send simulated request"}</button><button type="button" onClick={() => void copy("curl")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-white/20 dark:hover:bg-white/5"><Terminal size={16} />{copied === "curl" ? "Copied cURL" : "Copy cURL"}</button><span className="text-xs text-slate-500 dark:text-slate-400">No network request</span></div>
              </div>
            </div>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
              <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-[#0b1425] text-slate-100 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5"><h2 className="inline-flex items-center gap-2 font-bold"><FileJson size={17} className="text-orange-400" /> Response JSON</h2><div className="flex items-center gap-3">{result && <span className={`rounded-md px-2 py-1 font-mono text-xs font-bold ${result.status < 400 ? "bg-emerald-400/15 text-emerald-300" : "bg-red-400/15 text-red-300"}`}>{result.status} {result.statusText}</span>}<button type="button" disabled={!result} onClick={() => void copy("response")} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 disabled:opacity-40">{copied === "response" ? <Check size={13} /> : <Copy size={13} />} {copied === "response" ? "Copied" : "Copy"}</button></div></div>
                <pre aria-live="polite" className="min-h-64 max-h-[480px] overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-xs leading-6 text-emerald-300">{result ? pretty(result.body) : busy ? "Processing example request..." : "// Send a simulated request to view the JSON response."}</pre>
              </div>
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101c2e]"><h2 className="inline-flex items-center gap-2 font-bold"><Workflow size={18} className="text-orange-600" /> Execution trace</h2><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Illustrative processing stages; no measured latency.</p><ol className="mt-6 space-y-4">{scenario.steps.map((stage, i) => { const done = i < elapsedSteps; const failed = result !== null && result.status >= 400 && i === Math.min(result.trace.length - 1, scenario.steps.length - 1); return <li key={stage} className="flex items-start gap-3"><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${failed && done ? "bg-red-100 text-red-700" : done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>{done ? failed ? <XCircle size={15} /> : <CheckCircle2 size={15} /> : <span className="text-xs">{i + 1}</span>}</span><div className="min-w-0"><p className="text-sm font-semibold">{stage}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{done ? (result?.trace[i] ?? stage) : "Waiting"}</p></div></li>; })}</ol>{result && <p role="status" className="mt-6 rounded-lg bg-slate-100 p-3 text-xs font-semibold text-slate-800 dark:bg-white/10 dark:text-slate-100">{result.status < 400 ? "Example completed successfully" : "Example rejected by validation"}</p>}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/10"><p className="max-w-xl text-sm text-orange-950 dark:text-amber-100"><strong>Ready for a real integration walkthrough?</strong> Request a technical demo to discuss your own APIs, security requirements and deployment architecture.</p><Link href="/demo" className="inline-flex items-center gap-2 text-sm font-bold text-orange-800 dark:text-orange-300">Book demo <ArrowRight size={16} /></Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
