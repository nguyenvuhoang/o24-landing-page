"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight,
  Circle, Code2, Copy, ExternalLink, GitBranch, Laptop2, LockKeyhole,
  Play, RotateCcw, Server, ShieldCheck, Terminal, Workflow,
} from "lucide-react";

type Step = {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof BookOpen;
  items: readonly string[];
  primary: { href: string; label: string };
};

const steps: readonly Step[] = [
  {
    title: "Understand the platform",
    subtitle: "Architecture foundations",
    description: "Start with the conceptual path from client applications through an API gateway, business workflows, and enterprise adapters. These guides describe architectural patterns rather than an externally available O24 API contract.",
    icon: BookOpen,
    items: ["Review the five layers of the integration architecture", "Understand request boundaries and service responsibilities", "Identify where security, audit, and observability belong"],
    primary: { href: "/developers/guides", label: "Explore architecture guides" },
  },
  {
    title: "Prepare your workstation",
    subtitle: "Local learning environment",
    description: "For the learning examples, you only need a modern browser. If you want to write your own sample .NET implementation, install a supported .NET SDK, an editor, and Git. No O24 access key, SDK or banking sandbox is required for this educational path.",
    icon: Laptop2,
    items: ["Open the API Explorer in a current browser", "Optional: install a .NET SDK and VS Code or your preferred IDE", "Keep secrets and real customer data out of sample requests"],
    primary: { href: "/developers/api-explorer", label: "Open the browser lab" },
  },
  {
    title: "Inspect an API request",
    subtitle: "Headers, methods & JSON",
    description: "Review how clients construct requests with HTTP methods, headers, validation rules and structured JSON. The endpoint shown below uses the reserved .invalid domain; it cannot be used to access a live O24 server.",
    icon: Code2,
    items: ["Distinguish GET and POST requests", "Understand JSON payloads and typical validation errors", "Inspect a local sample without sending any network request"],
    primary: { href: "/developers/api-explorer", label: "Try sample API requests" },
  },
  {
    title: "Follow a workflow",
    subtitle: "Request → orchestration → response",
    description: "Trace a conceptual API request from gateway validation through orchestration and an enterprise adapter. Pay particular attention to errors, retries, idempotency, and unknown transaction outcomes.",
    icon: Workflow,
    items: ["Walk through gateway, workflow, adapter, and response", "Inspect a sample execution trace", "Read the guidance on idempotency and compensation"],
    primary: { href: "/developers/guides/workflow-orchestration", label: "Read workflow guide" },
  },
  {
    title: "Plan a real integration",
    subtitle: "Security & deployment readiness",
    description: "A production integration requires agreed service contracts, authentication, network boundaries, test environments, operational policies, and an explicit onboarding process. None of those are provisioned by this public tutorial.",
    icon: ShieldCheck,
    items: ["Define authentication, authorization and data classification", "Confirm contract, environment and adapter requirements with the O24 team", "Request a technical consultation before sending real traffic"],
    primary: { href: "/demo", label: "Request a technical demo" },
  },
];

const curlSample = `curl --request POST \\
  --url https://api.example.invalid/v1/workflows/execute \\
  --header 'Content-Type: application/json' \\
  --header 'X-Demo-Mode: true' \\
  --data '{"workflow":"ACCOUNT_ENQUIRY","input":{"account_number":"ACC-DEMO-001"}}'`;
const jsonSample = `{
  "workflow": "ACCOUNT_ENQUIRY",
  "input": {
    "account_number": "ACC-DEMO-001"
  }
}`;
const responseSample = `{
  "success": true,
  "demo": true,
  "workflow": "ACCOUNT_ENQUIRY",
  "state": "COMPLETED",
  "data": {
    "account_number": "ACC-DEMO-001",
    "currency": "LAK",
    "status": "ACTIVE"
  }
}`;
const trace = [
  { stage: "Gateway", event: "Validate illustrative request headers" },
  { stage: "Workflow", event: "Select ACCOUNT_ENQUIRY example" },
  { stage: "Adapter", event: "Read local mock account record" },
  { stage: "Response", event: "Return sample JSON (200 OK)" },
];

function CopyableCode({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  }
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-700/90 bg-[#0a1425] text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#121e32] px-4 py-3">
        <span className="font-mono text-xs text-slate-300">{label}</span>
        <button type="button" onClick={copy} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-white/15 px-3 text-xs hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400" aria-label={`Copy ${label}`}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-72 overflow-auto p-4 text-xs leading-6"><code>{value}</code></pre>
      {copyFailed && <p role="status" className="px-4 pb-3 text-xs text-amber-300">Clipboard unavailable. Select and copy the code manually.</p>}
    </div>
  );
}

export function GettingStarted() {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));
  const [sample, setSample] = useState<"curl" | "json">("curl");
  const [simulation, setSimulation] = useState(false);
  const current = steps[active];
  const count = done.filter(Boolean).length;
  const Icon = current.icon;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-[#0b1628] py-12 text-white sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/developers" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-amber-400"><ArrowLeft size={15} /> Developer Hub</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">O24 / Developer onboarding</p>
          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Start building with <span className="text-amber-400">confidence.</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">A guided introduction to O24 integration concepts. Learn the architecture, inspect example requests and prepare for an enterprise integration discussion.</p>
            </div>
            <Link href="/developers/api-explorer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">Open API Explorer <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-7 flex items-start gap-3 rounded-xl border border-amber-300/50 bg-amber-500/5 p-4 text-sm leading-6">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p><strong>Educational walkthrough only.</strong> The examples run in your browser, use fictional account identifiers and do not provision credentials, issue requests to O24 services, or interact with real banking data. All API paths below are conceptual.</p>
        </div>
        <div className="grid items-start gap-7 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-10">
          <aside aria-label="Getting started steps" className="min-w-0 lg:sticky lg:top-24">
            <div className="rounded-2xl border bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2"><p className="font-bold">Your learning path</p><span className="text-xs font-semibold text-primary">{count}/{steps.length} completed</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" aria-label={`${count} of ${steps.length} steps completed`} role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={count}><div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{width:`${(count/steps.length)*100}%`}}/></div>
              <nav className="mt-5 space-y-1" aria-label="Onboarding sections">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return <button type="button" key={step.title} aria-current={active === index ? "step" : undefined} onClick={()=>setActive(index)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${active===index?"bg-primary/10 text-foreground":"text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active===index?"bg-primary/15 text-primary":"bg-muted text-muted-foreground"}`}>{done[index]?<CheckCircle2 size={18} className="text-emerald-600"/>:<StepIcon size={17}/>}</span>
                    <span className="min-w-0 flex-1"><span className="block text-[10px] uppercase tracking-wider opacity-70">Step {index+1}</span><span className="block text-xs font-semibold sm:text-sm">{step.title}</span></span>
                  </button>;
                })}
              </nav>
              <button type="button" onClick={()=>{setActive(0);setDone(steps.map(()=>false));setSimulation(false)}} className="mt-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground hover:text-primary"><RotateCcw size={14}/> Restart checklist</button>
            </div>
            <div className="mt-4 rounded-xl border bg-muted/30 p-4 text-sm"><p className="font-semibold">Need a deeper explanation?</p><Link href="/developers/guides" className="mt-2 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">Technical guides <ExternalLink size={14}/></Link></div>
          </aside>
          <div className="min-w-0 space-y-6">
            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="getting-started-step-title">
              <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Step {String(active+1).padStart(2,"0")} / {String(steps.length).padStart(2,"0")}</p><span className="rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{current.subtitle}</span></div>
              <div className="mt-5 flex items-start gap-3"><span className="rounded-xl bg-primary/10 p-3 text-primary"><Icon size={24}/></span><div className="min-w-0"><h2 id="getting-started-step-title" className="text-2xl font-extrabold tracking-tight sm:text-3xl">{current.title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{current.description}</p></div></div>
              <ul className="mt-7 space-y-3">{current.items.map(item=><li key={item} className="flex items-start gap-3 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-primary"/>{item}</li>)}</ul>
              <div className="mt-7 flex flex-wrap gap-3"><Link href={current.primary.href} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/35 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/10">{current.primary.label} <ArrowRight size={16}/></Link><button type="button" aria-pressed={done[active]} onClick={()=>setDone(previous=>previous.map((value,index)=>index===active?!value:value))} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${done[active]?"border border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300":"bg-primary text-primary-foreground hover:bg-primary/90"}`}>{done[active]?<CheckCircle2 size={17}/>:<Circle size={17}/>} {done[active]?"Completed — undo":"Mark as completed"}</button></div>
              <div className="mt-8 flex items-center justify-between border-t pt-5"><button type="button" disabled={active===0} onClick={()=>setActive(x=>x-1)} className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">← Previous</button><span className="text-xs text-muted-foreground">{active+1} of {steps.length}</span><button type="button" disabled={active===steps.length-1} onClick={()=>setActive(x=>x+1)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40">Next step <ChevronRight size={16}/></button></div>
            </section>
            <section className="rounded-2xl border bg-card p-5 sm:p-7" aria-labelledby="onboarding-example-heading">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Hands-on preview</p><h2 id="onboarding-example-heading" className="mt-2 text-xl font-bold sm:text-2xl">Explore a request lifecycle</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Inspect a fictional workflow request and run a local illustration of its response.</p></div><span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">No network calls</span></div>
              <div role="group" aria-label="Code example format" className="mt-6 flex flex-wrap gap-2"><button type="button" aria-pressed={sample==="curl"} onClick={()=>setSample("curl")} className={`rounded-lg border px-4 py-2 text-xs font-bold ${sample==="curl"?"border-primary bg-primary/10 text-primary":"text-muted-foreground"}`}><Terminal size={14} className="mr-1 inline"/> cURL</button><button type="button" aria-pressed={sample==="json"} onClick={()=>setSample("json")} className={`rounded-lg border px-4 py-2 text-xs font-bold ${sample==="json"?"border-primary bg-primary/10 text-primary":"text-muted-foreground"}`}><Code2 size={14} className="mr-1 inline"/> JSON</button></div>
              <div className="mt-3"><CopyableCode label={sample==="curl"?"Example request · cURL":"Example request · JSON"} value={sample==="curl"?curlSample:jsonSample}/></div>
              <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={()=>setSimulation(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"><Play size={16}/> Run local example</button><button type="button" onClick={()=>setSimulation(false)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted"><RotateCcw size={15}/> Reset output</button><span className="text-xs text-muted-foreground">Browser-only illustration · no HTTP request</span></div>
              {simulation && <div className="mt-6 space-y-4" aria-live="polite"><div className="rounded-xl border border-emerald-300/50 bg-emerald-500/5 p-4"><p className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={17}/> Sample result: 200 OK (illustrative)</p><p className="mt-1 text-xs leading-6 text-muted-foreground">All four stages below are local simulation results, not measured execution or live integration status.</p></div><div className="grid gap-2 sm:grid-cols-2">{trace.map((event,i)=><div key={event.stage} className="rounded-xl border bg-muted/30 p-4"><div className="flex items-center gap-2"><GitBranch size={14} className="text-primary"/><p className="text-xs font-bold">{i+1}. {event.stage}</p></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{event.event}</p></div>)}</div><CopyableCode label="Example response · JSON" value={responseSample}/></div>}
            </section>
            <section className="rounded-2xl border border-primary/20 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-5 sm:p-7"><div className="flex gap-3"><Server className="mt-1 h-6 w-6 shrink-0 text-primary"/><div><h2 className="text-lg font-bold">Ready for a real deployment?</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">Actual integration requires verified contracts, credentials, environment provisioning, deployment policies and an approved security model. Contact the O24 team to scope your use case.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/demo" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">Request a technical demo <ArrowRight size={16}/></Link><Link href="/developers/guides" className="inline-flex items-center gap-2 rounded-xl border bg-background px-5 py-3 text-sm font-semibold hover:border-primary/40">Read technical guides <BookOpen size={16}/></Link></div></div></div></section>
          </div>
        </div>
      </div>
    </main>
  );
}
