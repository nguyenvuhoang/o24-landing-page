"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity, ArrowDown, ArrowRight, Braces, Check, CheckCheck, CircleDot, Copy,
  Code2, Database, Pause, Play, RotateCcw, ShieldCheck, StepForward,
  Workflow, Zap,
} from "lucide-react";

type ScenarioId = "accounts" | "payments";
type Scenario = {
  title: string;
  description: string;
  method: "GET" | "POST";
  endpoint: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  stages: readonly [string, string, string, string];
  logs: readonly [string, string, string, string];
};

const scenarios: Record<ScenarioId, Scenario> = {
  accounts: {
    title: "Account lookup",
    description: "An app fetches a customer account through a coordinated API workflow.",
    method: "GET",
    endpoint: "/v1/accounts/ACC-DEMO-001",
    request: { method: "GET", path: "/v1/accounts/ACC-DEMO-001", headers: { "x-channel": "WEB" } },
    response: { status: "success", code: "00", data: { accountId: "ACC-DEMO-001", currency: "LAK", accountStatus: "ACTIVE" } },
    stages: ["Validate request & access", "Resolve account lookup workflow", "Retrieve account from core adapter", "Normalize and return JSON"],
    logs: ["Gateway: request shape and channel validated", "Orchestrator: account lookup workflow selected", "Adapter: example core-account record resolved", "Response: normalized account payload prepared"],
  },
  payments: {
    title: "Payment validation",
    description: "An app validates a payment request before a downstream transaction is submitted.",
    method: "POST",
    endpoint: "/v1/payments/validate",
    request: { method: "POST", path: "/v1/payments/validate", body: { reference: "PAY-DEMO-001", amount: 150000, currency: "LAK" } },
    response: { status: "validated", code: "00", data: { reference: "PAY-DEMO-001", currency: "LAK", eligible: true, nextAction: "AWAIT_CONFIRMATION" } },
    stages: ["Validate payload & access", "Execute payment validation rules", "Check example account adapter", "Return validation outcome"],
    logs: ["Gateway: schema and channel checks passed", "Orchestrator: payment validation rules evaluated", "Adapter: illustrative account eligibility checked", "Response: validation result assembled; no transfer created"],
  },
};

const stages = [
  { label: "API Request", detail: "Client → Gateway", icon: Braces },
  { label: "Workflow Execution", detail: "Orchestrate rules", icon: Workflow },
  { label: "Core Integration", detail: "Service adapter", icon: Database },
  { label: "Response", detail: "Gateway → Client", icon: Code2 },
] as const;

const delayMs = 1100;
// Reduced-motion users get a non-animated, single-action completion option.
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function O24InAction() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("accounts");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [copiedJson, setCopiedJson] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const scenario = scenarios[scenarioId];
  const complete = step === stages.length - 1;

  useEffect(() => {
    if (!running || complete) return;
    const handle = window.setTimeout(() => {
      setStep((previous) => Math.min(previous + 1, stages.length - 1));
      if (step >= stages.length - 2) setRunning(false);
    }, prefersReducedMotion() ? 0 : delayMs);
    return () => window.clearTimeout(handle);
  }, [running, step, complete]);

  const selectScenario = (id: ScenarioId) => {
    setScenarioId(id);
    setStep(-1);
    setRunning(false);
    setCopiedJson(null);
    setCopyError(false);
  };
  const reset = () => {
    setRunning(false);
    setStep(-1);
    setCopiedJson(null);
    setCopyError(false);
  };
  const advance = () => {
    setRunning(false);
    setStep((previous) => Math.min(previous + 1, stages.length - 1));
  };
  const currentPayload = step === 3
    ? scenario.response
    : step === 2
      ? { adapter: "example-core-adapter", result: "READY", record: scenarioId === "accounts" ? "ACC-DEMO-001" : "PAY-DEMO-001" }
      : step === 1
        ? { workflow: scenarioId === "accounts" ? "ACCOUNT_LOOKUP" : "PAYMENT_VALIDATION", state: "EVALUATING", steps: 4 }
        : scenario.request;
  const payloadLabel = step === 3 ? "Response JSON" : step === 2 ? "Adapter output" : step === 1 ? "Workflow context" : "Request JSON";
  const payloadJson = JSON.stringify(currentPayload, null, 2);
  const copied = copiedJson === payloadJson;
  async function copyPayload() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(payloadJson);
      setCopiedJson(payloadJson);
      setCopyError(false);
    } catch {
      setCopiedJson(null);
      setCopyError(true);
    }
  }
  const statusLabel = complete ? "200 OK · Simulation complete" : running ? `Running · ${step < 0 ? "starting" : `stage ${step + 1} of 4`}` : step < 0 ? "Ready to run" : `Paused · stage ${step + 1} of 4`;

  return (
    <section id="o24-in-action" aria-labelledby="o24-in-action-title" className="relative min-w-0 overflow-hidden border-y border-border/60 bg-[#f8fafc] py-20 dark:bg-[#090f1d] sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20" style={{ backgroundImage: "radial-gradient(rgba(236,130,37,.17) 1px,transparent 1px)", backgroundSize: "26px 26px", maskImage: "linear-gradient(to bottom,transparent,black 20%,black 70%,transparent)" }} />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-primary"><Zap size={14} /> O24 in action</span>
          <h2 id="o24-in-action-title" className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">From API request to <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">real integration logic.</span></h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">Explore how a client request can pass through API management, workflow orchestration and a core adapter before receiving a structured response.</p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-3xl border border-[#293850] bg-[#0b1425] text-white shadow-[0_32px_85px_-35px_rgba(10,22,41,.55)] lg:mt-14">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#111e32] px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400"/><span className="h-2.5 w-2.5 rounded-full bg-amber-400"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-400"/></div>
              <span className="font-mono text-xs text-slate-300">o24 / integration walkthrough</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300"><CircleDot size={11}/> Interactive simulation</span>
          </div>
          <div className="border-b border-white/10 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.16em] text-amber-400">Choose a use case</p><p className="mt-1 text-sm text-slate-300">{scenario.description}</p></div>
              <div role="group" aria-label="Example scenarios" className="inline-flex w-full flex-wrap gap-2 sm:w-auto">
                {(["accounts", "payments"] as const).map((id) => <button key={id} type="button" aria-pressed={scenarioId===id} onClick={() => selectScenario(id)} className={`min-h-10 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${scenarioId===id?"border-amber-400/60 bg-amber-500/15 text-amber-200":"border-white/15 bg-white/[.04] text-slate-300 hover:bg-white/10"}`}>{scenarios[id].title}</button>)}
              </div>
            </div>
          </div>
          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.13fr)_minmax(0,.87fr)]">
            <div className="min-w-0 border-b border-white/10 px-4 py-6 sm:px-7 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-100">Request lifecycle</h3>
                <span role="status" aria-live="polite" aria-atomic="true" className={`rounded-full px-3 py-1 text-[11px] font-semibold ${complete?"bg-emerald-400/10 text-emerald-300":running?"bg-amber-400/10 text-amber-300":"bg-white/[.07] text-slate-300"}`}>{statusLabel}</span>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Simulation progress" aria-valuemin={0} aria-valuemax={4} aria-valuenow={step + 1}>
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((step + 1) / 4) * 100}%` }} />
              </div>
              <div className="mt-6 space-y-0">
                {stages.map(({label,detail,icon:Icon}, index) => {
                  const active = step === index;
                  const done = step >= index;
                  const stateLabel = !done ? "Pending" : active && running ? "Running" : "Completed";
                  return <div key={label}>
                    <button type="button" onClick={() => {setRunning(false);setStep(index);setCopyError(false);}} aria-current={active?"step":undefined} aria-label={`Inspect ${label}, ${stateLabel}`} className={`group relative w-full min-w-0 rounded-xl border p-3.5 text-left transition-[border-color,background-color] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:p-4 ${active?"border-amber-400/70 bg-amber-500/[.13]":done?"border-emerald-500/25 bg-emerald-500/[.05]":"border-white/10 bg-[#15223a] hover:border-white/25"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active?"bg-amber-400/15 text-amber-300":done?"bg-emerald-400/10 text-emerald-300":"bg-white/[.06] text-slate-400"}`}><Icon size={19}/></span>
                        <div className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">0{index+1} / {detail}</span><span className="mt-1 block text-sm font-semibold text-white">{label}</span><p className="mt-1 text-xs leading-5 text-slate-400">{scenario.stages[index]}</p></div>
                        <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${!done?"bg-white/[.06] text-slate-400":active&&running?"bg-amber-400/10 text-amber-300":"bg-emerald-400/10 text-emerald-300"}`}>
                          {done && !(active&&running) ? <Check size={12} aria-hidden="true"/> : active&&running ? <Activity size={12} aria-hidden="true"/> : <CircleDot size={12} aria-hidden="true"/>}{stateLabel}
                        </span>
                      </div>
                    </button>
                    {index < stages.length - 1 && <div className="relative ml-5 flex h-6 items-center" aria-hidden="true"><span className={`h-full w-px ${step > index ? "bg-emerald-400/70" : "bg-white/20"}`}/><span className={`absolute -bottom-1 -left-[7px] ${step > index ? "text-emerald-400" : "text-slate-500"}`}><ArrowDown size={15}/></span></div>}
                  </div>;
                })}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => {setCopyError(false);if (complete){setStep(-1);setRunning(true);}else setRunning(!running);}} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-[#171009] transition-colors hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">{running&&!complete?<Pause size={16}/>:<Play size={16}/>} {complete?"Run again":running?"Pause":"Run simulation"}</button>
                <button type="button" onClick={advance} disabled={complete} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/[.06] disabled:cursor-not-allowed disabled:opacity-40"><StepForward size={15}/> Step</button>
                <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/[.06]"><RotateCcw size={15}/> Reset</button>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-slate-500">Select any stage to inspect it. The animation uses example data and runs locally in your browser.</p>
            </div>
            <div className="min-w-0 bg-[#0d192b] px-4 py-6 sm:px-7">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-amber-400">Example request</p><h3 className="mt-1 text-base font-semibold">{scenario.title}</h3></div><span className={`shrink-0 rounded-md border px-2 py-1 font-mono text-[11px] font-bold ${scenario.method==="GET"?"border-emerald-500/30 text-emerald-300":"border-amber-500/30 text-amber-300"}`}>{scenario.method}</span></div>
              <p className="mt-3 break-all rounded-lg border border-white/10 bg-[#111f33] px-3 py-2.5 font-mono text-xs text-slate-300">{scenario.endpoint}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold text-slate-300">{payloadLabel}</p><div className="flex items-center gap-2"><span className="text-[10px] text-slate-500">JSON · illustrative</span><button type="button" onClick={copyPayload} aria-label={`Copy ${payloadLabel}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[.04] px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">{copied?<CheckCheck size={13}/>:<Copy size={13}/>} {copied?"Copied":"Copy JSON"}</button></div></div>
              {copyError && <p role="alert" className="mt-2 text-xs text-amber-300">Clipboard access is unavailable. Select and copy the JSON manually.</p>}
              {complete && <div role="status" className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[.07] px-3 py-2 text-xs font-semibold text-emerald-300"><Check size={14}/> 200 OK · Illustrative response · No transaction executed</div>}
              <pre aria-label={payloadLabel} className="mt-2 min-h-[206px] max-h-[330px] max-w-full overflow-auto rounded-xl border border-white/10 bg-[#08111e] p-4 text-[11px] leading-[1.7] text-emerald-200 sm:text-xs"><code>{payloadJson}</code></pre>
              <div className="mt-5 flex items-center justify-between"><p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300"><Activity size={15} className="text-amber-400"/> Execution trace</p><span className="text-[10px] text-slate-500">{Math.max(0,step+1)} events</span></div>
              <ol className="mt-3 min-h-[104px] space-y-2 border-l border-white/10 pl-3">
                {step<0?<li className="text-xs text-slate-500">Run the simulation to see each processing stage.</li>:scenario.logs.slice(0,step+1).map((log,index)=><li key={log} className="flex gap-2 text-[11px] leading-5 text-slate-300"><Check size={13} className="mt-1 shrink-0 text-emerald-400"/><span><span className="font-mono text-slate-500">0{index+1}</span> {log}</span></li>)}
              </ol>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-white/10 bg-[#101c30] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><span className="inline-flex items-start gap-2 text-[11px] leading-5 text-slate-400"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-amber-400"/> Conceptual demonstration only · no live services, customer data, or transactions.</span><Link href="/demo" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 focus-visible:underline">Request a technical demo <ArrowRight size={16}/></Link></div>
        </div>
        <div className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs font-medium text-muted-foreground"><span className="inline-flex items-center gap-2"><Braces size={15} className="text-primary"/> API-first integration</span><span className="inline-flex items-center gap-2"><Workflow size={15} className="text-primary"/> Reusable workflows</span><span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-primary"/> Governed execution</span></div>
      </div>
    </section>
  );
}
