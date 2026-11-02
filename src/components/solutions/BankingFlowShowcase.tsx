"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, Check, CheckCircle2, ChevronRight, CircleAlert,
  Clock3, Copy, Database, Landmark, Play, RotateCcw, ShieldCheck,
  Smartphone, Workflow, XCircle,
} from "lucide-react";

type Outcome = "success" | "rejected" | "timeout";
type Phase = "idle" | "running" | "done";
type NodeState = "pending" | "running" | "complete" | "rejected" | "unknown";
const nodes = [
  { title: "Digital channel", detail: "Mobile / Internet Banking", icon: Smartphone },
  { title: "API Gateway", detail: "Identity, access & routing", icon: ShieldCheck },
  { title: "Workflow engine", detail: "Validation, orchestration", icon: Workflow },
  { title: "Core adapter", detail: "Banking system boundary", icon: Database },
  { title: "Client response", detail: "Result & correlation ID", icon: Activity },
] as const;
const outcomeText: Record<Outcome, { label: string; description: string }> = {
  success: { label: "Approved", description: "Core adapter confirms a successful response." },
  rejected: { label: "Declined", description: "Business validation rejects the request before posting." },
  timeout: { label: "Unknown outcome", description: "Core response times out. Reconciliation is required; do not blindly retry a money movement." },
};
const sampleRequest = {
  request_id: "REQ-DEMO-2026-001",
  operation: "PAYMENT_VALIDATION",
  amount: 250000,
  currency: "LAK",
  beneficiary_account: "ACC-DEMO-002",
  channel: "MOBILE",
};
function makeResponse(outcome: Outcome) {
  const common = { request_id: sampleRequest.request_id, correlation_id: "TRACE-DEMO-001", simulation: true };
  if (outcome === "success") return { ...common, status: "APPROVED", code: "SIM_APPROVED", message: "Illustrative approval only; no funds moved." };
  if (outcome === "rejected") return { ...common, status: "REJECTED", code: "SIM_RULE_REJECTED", message: "Illustrative validation rule rejected the request." };
  return { ...common, status: "UNKNOWN", code: "SIM_CORE_TIMEOUT", message: "Core response not confirmed. Query transaction state or reconcile before retrying." };
}
const logByOutcome: Record<Outcome, string[]> = {
  success: ["Channel: composed demonstration request", "Gateway: illustrative access policy accepted", "Workflow: simulated validation passed", "Adapter: sample core response confirmed", "Response: illustrative APPROVED result"],
  rejected: ["Channel: composed demonstration request", "Gateway: illustrative access policy accepted", "Workflow: illustrative rule rejected request", "Adapter: not invoked", "Response: illustrative REJECTED result"],
  timeout: ["Channel: composed demonstration request", "Gateway: illustrative access policy accepted", "Workflow: simulated validation passed", "Adapter: timeout; outcome cannot be confirmed", "Response: UNKNOWN; reconciliation required"],
};

export function BankingFlowShowcase() {
  const [outcome, setOutcome] = useState<Outcome>("success");
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimers = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);
    timer.current = null;
    finishTimer.current = null;
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = () => { clearTimers(); setIndex(-1); setPhase("idle"); setCopied(false); };
  const chooseOutcome = (next: Outcome) => { reset(); setOutcome(next); };
  const step = () => {
    clearTimers();
    if (index >= nodes.length - 1) { setIndex(-1); setPhase("idle"); return; }
    const next = index + 1;
    setIndex(next);
    setPhase(next === nodes.length - 1 ? "done" : "running");
  };
  const run = () => {
    clearTimers();
    setCopied(false);
    setIndex(0);
    setPhase("running");
  };
  useEffect(() => {
    if (phase !== "running" || index < 0) return;
    timer.current = setTimeout(() => {
      const next = index + 1;
      if (next >= nodes.length - 1) { setIndex(nodes.length - 1); setPhase("done"); }
      else setIndex(next);
    }, 900);
    return () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  }, [phase, index]);

  const status = (n: number): NodeState => {
    if (n > index || index < 0) return "pending";
    if (phase === "running" && n === index) return "running";
    if (phase === "done" && n === nodes.length - 1) return outcome === "success" ? "complete" : outcome === "rejected" ? "rejected" : "unknown";
    if (phase === "done" && n === 3 && outcome === "timeout") return "unknown";
    if (phase === "done" && n === 2 && outcome === "rejected") return "rejected";
    if (phase === "done" && n === 3 && outcome === "rejected") return "pending";
    return "complete";
  };
  const response = makeResponse(outcome);
  const shownLog = index < 0 ? [] : logByOutcome[outcome].slice(0, index + 1);
  const responseText = JSON.stringify(response, null, 2);
  const copy = async () => {
    try { await navigator.clipboard.writeText(responseText); setCopied(true); finishTimer.current = setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  };

  return (
    <section id="banking-in-action" aria-labelledby="banking-in-action-title" className="relative overflow-hidden border-y border-border bg-muted/20 py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[.15em] text-primary"><Landmark size={14}/> Banking integration in action</span>
          <h2 id="banking-in-action-title" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">From digital request to <span className="text-primary">controlled outcome.</span></h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">Follow a conceptual banking workflow through gateway checks, service orchestration and a core adapter. Switch outcomes to see why rejected and uncertain transactions need different handling.</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-[#24334b] bg-[#091426] text-slate-100 shadow-xl shadow-slate-900/10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#111e32] px-5 py-4 sm:px-7">
            <div className="flex items-center gap-2 text-sm font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400"><Workflow size={17}/></span> O24 Transaction Lifecycle <span className="hidden text-xs font-normal text-slate-400 sm:inline">/ Conceptual simulation</span></div>
            <span className="rounded-full border border-amber-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">No live banking connection</span>
          </div>
          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="min-w-0 border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-amber-400">Choose an outcome</p><p className="mt-1 text-xs text-slate-400">The entire flow is local and illustrative.</p></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300">{phase === "idle" ? "Ready to run" : phase === "running" ? "Processing example" : outcomeText[outcome].label}</span></div>
              <div role="group" aria-label="Simulation outcome" className="mb-7 grid gap-2 sm:grid-cols-3">
                {(["success", "rejected", "timeout"] as const).map((item) => <button key={item} type="button" aria-pressed={outcome === item} onClick={() => chooseOutcome(item)} className={`min-h-11 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${outcome === item ? "border-amber-400/70 bg-amber-400/10 text-amber-300" : "border-white/10 bg-white/[.035] text-slate-300 hover:border-white/30"}`}>{outcomeText[item].label}</button>)}
              </div>
              <ol className="grid gap-2 sm:grid-cols-5 sm:gap-1" aria-label="Request processing stages">
                {nodes.map((node, i) => { const Icon = node.icon; const s = status(i); return <li key={node.title} className="relative min-w-0">
                  <div className={`flex min-h-28 items-center gap-3 rounded-xl border p-3 transition-colors sm:min-h-40 sm:flex-col sm:items-start sm:gap-2 ${s === "running" ? "border-amber-400 bg-amber-400/10" : s === "rejected" ? "border-rose-400/50 bg-rose-400/10" : s === "unknown" ? "border-yellow-400/50 bg-yellow-400/10" : s === "complete" ? "border-emerald-400/35 bg-emerald-400/[.06]" : "border-white/10 bg-[#162238]"}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-amber-300"><Icon size={19}/></span>
                    <span className="min-w-0"><span className="block text-[11px] font-bold text-white">{node.title}</span><span className="mt-1 block text-[10px] leading-4 text-slate-400">{node.detail}</span></span>
                    <span className="ml-auto shrink-0 text-[10px] text-slate-400 sm:ml-0">{s === "pending" ? "Pending" : s === "running" ? "Running" : s === "complete" ? "Done" : s === "rejected" ? "Rejected" : "Unknown"}</span>
                  </div>
                  {i < nodes.length - 1 && <ChevronRight aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-amber-400 sm:block"/>}
                </li>; })}
              </ol>
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={run} type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400"><Play size={15}/> {phase === "idle" ? "Run simulation" : "Run again"}</button>
                <button type="button" onClick={step} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/10">Step <ArrowRight size={15}/></button>
                <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"><RotateCcw size={15}/> Reset</button>
              </div>
              <p className="mt-4 text-xs text-slate-400">No real accounts, credentials, network requests, funds movement or production telemetry.</p>
              <div className="mt-7 rounded-xl border border-white/10 bg-[#0d1b2e] p-4"><div className="flex items-center justify-between"><h3 className="text-xs font-bold text-slate-200">Execution trace</h3><span className="text-[10px] text-slate-500">{shownLog.length} events</span></div><ol className="mt-3 space-y-3" aria-live="polite" aria-atomic="false">{shownLog.length ? shownLog.map((msg, i) => <li key={i} className="flex gap-2 text-xs leading-5 text-slate-300"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-amber-400"/>{msg}</li>) : <li className="text-xs text-slate-500">Run or step the example to see the trace.</li>}</ol></div>
            </div>
            <div className="min-w-0 space-y-5 p-5 sm:p-7">
              <div><h3 className="text-sm font-bold">Illustrative payment request</h3><pre className="mt-3 max-w-full overflow-x-auto rounded-xl border border-white/10 bg-[#050e1b] p-4 text-[11px] leading-5 text-cyan-200"><code>{JSON.stringify(sampleRequest, null, 2)}</code></pre></div>
              <div><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold">Simulated response</h3><button type="button" disabled={phase !== "done"} onClick={() => void copy()} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Copy simulated response JSON">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "Copied" : "Copy JSON"}</button></div>
                <pre className="mt-3 min-h-36 max-w-full overflow-x-auto rounded-xl border border-white/10 bg-[#050e1b] p-4 text-[11px] leading-5 text-emerald-200"><code>{phase === "done" ? responseText : "// Run simulation to generate a sample response"}</code></pre>
              </div>
              <div className={`rounded-xl border p-4 text-xs leading-6 ${phase === "done" && outcome === "timeout" ? "border-yellow-400/30 bg-yellow-400/[.06] text-yellow-200" : "border-white/10 bg-white/[.035] text-slate-300"}`}><div className="flex items-center gap-2 font-bold">{phase === "done" ? outcome === "success" ? <CheckCircle2 size={16}/> : outcome === "rejected" ? <XCircle size={16}/> : <CircleAlert size={16}/> : <Clock3 size={16}/>} {phase === "done" ? outcomeText[outcome].label : "Awaiting simulation"}</div><p className="mt-1">{phase === "done" ? outcomeText[outcome].description : "Illustrative flow only. Final state will appear after execution."}</p></div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0e192b] px-5 py-4 text-xs text-slate-400 sm:px-7"><span>Reference architecture · Outcome is not a real transaction receipt.</span><Link href="/demo" className="inline-flex items-center gap-2 font-semibold text-amber-300 hover:text-amber-200">Discuss a banking integration <ArrowRight size={15}/></Link></div>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {[
            { title: "Channel connectivity", content: "Connect client applications through governed API boundaries and explicit service contracts.", icon: Smartphone },
            { title: "Transaction consistency", content: "Distinguish definitive rejection from unknown outcome; design for idempotency and reconciliation.", icon: Workflow },
            { title: "Deployment & oversight", content: "Plan audit trails, access controls and environment-specific operational ownership.", icon: ShieldCheck },
          ].map(({title,content,icon:Icon}) => <article className="rounded-2xl border bg-card p-6" key={title}><Icon className="h-6 w-6 text-primary"/><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{content}</p></article>)}
        </div>
      </div>
    </section>
  );
}
