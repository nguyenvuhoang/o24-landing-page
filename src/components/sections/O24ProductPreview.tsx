"use client";

import { useState, type KeyboardEvent } from "react";
import {
  Activity, ArrowUpRight, Blocks, Braces, Check, ChevronRight,
  CircleDot, GitBranch, Layers3, LockKeyhole, Play, Radio, Server,
  ShieldCheck, Workflow,
} from "lucide-react";

type View = "api" | "workflow" | "monitor";
const tabs: { id: View; label: string; icon: typeof Braces }[] = [
  { id: "api", label: "API Management", icon: Braces },
  { id: "workflow", label: "Workflows", icon: Workflow },
  { id: "monitor", label: "Observability", icon: Activity },
];

function ApiView() {
  const apis = [
    { method: "GET", route: "/v1/accounts", info: "Account services", icon: Layers3 },
    { method: "POST", route: "/v1/payments", info: "Payment orchestration", icon: ArrowUpRight },
    { method: "GET", route: "/v1/customers", info: "Customer information", icon: Server },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["API catalog", "24", "Configured routes"],
          ["Policies", "08", "Access & routing"],
          ["Environments", "03", "DEV / UAT / PROD"],
        ].map(([title, number, detail]) => (
          <div key={title} className="min-w-0 rounded-xl border border-white/10 bg-white/[.035] px-3 py-3.5">
            <p className="truncate text-[10px] text-slate-400">{title}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{number}</p>
            <p className="mt-1 truncate text-[9px] text-slate-500">{detail}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-[#111d30]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <span className="text-xs font-semibold text-slate-200">API routes</span>
          <span className="text-[10px] text-slate-500">Illustrative catalog</span>
        </div>
        <div className="divide-y divide-white/[.07]">
          {apis.map((api) => {
            const Icon = api.icon;
            return (
              <div key={api.route} className="flex items-center gap-2.5 px-3 py-3 sm:gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[.05] text-slate-400"><Icon size={15}/></span>
                <span className={`w-[43px] shrink-0 text-[10px] font-bold ${api.method === "GET" ? "text-emerald-400" : "text-amber-400"}`}>{api.method}</span>
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-100 sm:text-xs">{api.route}</span>
                <span className="hidden text-[10px] text-slate-500 sm:block">{api.info}</span>
                <ChevronRight size={13} className="shrink-0 text-slate-600" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkflowView() {
  const steps = [
    { name: "API request", detail: "Validate input", icon: Braces },
    { name: "Workflow engine", detail: "Apply business rules", icon: Workflow },
    { name: "Core integration", detail: "Connect services", icon: Server },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-[#111d30] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-2">
        <div><p className="text-sm font-semibold text-white">Payment processing flow</p><p className="mt-1 text-[11px] text-slate-400">Visual orchestration example</p></div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-300">Example</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.name} className="contents">
              <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-[#182841] px-3 py-4 sm:flex-col sm:items-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400"><Icon size={18}/></span>
                <div className="min-w-0"><p className="text-xs font-semibold text-white">{step.name}</p><p className="mt-1 text-[10px] text-slate-400">{step.detail}</p></div>
              </div>
              {i < steps.length - 1 && <div aria-hidden="true" className="flex justify-center text-amber-500/70 sm:rotate-0"><ChevronRight size={19} className="rotate-90 sm:rotate-0"/></div>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[.06] px-3 py-3 text-[11px] text-emerald-300"><Check size={15}/> Designed for reusable, auditable integrations</div>
    </div>
  );
}

function MonitorView() {
  const items = [
    { name: "Request validation", detail: "Request pipeline", icon: ShieldCheck },
    { name: "Workflow execution", detail: "Service orchestration", icon: Workflow },
    { name: "Integration tracing", detail: "Operations visibility", icon: GitBranch },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-[#111d30] p-4 sm:p-5">
        <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Request lifecycle</p><p className="mt-1 text-[11px] text-slate-400">Conceptual trace view</p></div><Radio size={18} className="text-amber-400"/></div>
        <div className="relative mt-5 flex h-20 items-center justify-between gap-2 overflow-hidden rounded-lg border border-white/[.06] bg-[#0d192b] px-4">
          <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" style={{ backgroundImage: "linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",backgroundSize:"30px 100%"}}/>
          {[24, 45, 31, 66, 53, 76, 46, 82, 55, 69, 48, 74, 61, 85, 60].map((n,i)=><span key={i} className="relative z-10 w-1.5 rounded-sm bg-amber-500/70" style={{height:`${n}%`}} />)}
        </div>
        <p className="mt-3 text-[10px] text-slate-500">Illustrative activity pattern · not live metrics</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {items.map(item=>{const Icon=item.icon;return <div key={item.name} className="rounded-xl border border-white/10 bg-white/[.035] p-3"><Icon size={17} className="text-amber-400"/><p className="mt-2 text-[11px] font-semibold text-white">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.detail}</p></div>})}
      </div>
    </div>
  );
}

export function O24ProductPreview() {
  const [view, setView] = useState<View>("api");
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    const id = tabs[next].id;
    setView(id);
    document.getElementById(`o24-tab-${id}`)?.focus();
  }
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[720px]" aria-label="Interactive illustrated O24 product workspace">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-sky-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-[#23334c] bg-[#0b1425] text-left shadow-[0_32px_90px_-26px_rgba(6,17,36,.65)]">
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#111e32] px-4 py-3 sm:px-5">
          <div className="flex gap-1.5" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-[#ff655e]"/><span className="h-2.5 w-2.5 rounded-full bg-[#ffbe45]"/><span className="h-2.5 w-2.5 rounded-full bg-[#38c996]"/></div>
          <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-400 sm:text-[11px]">o24 / enterprise workspace</span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-slate-300"><CircleDot size={10} className="text-amber-400"/> Preview</span>
        </div>
        <div className="grid grid-cols-[44px_minmax(0,1fr)] sm:grid-cols-[58px_minmax(0,1fr)]">
          <aside aria-hidden="true" className="flex flex-col items-center gap-5 border-r border-white/10 bg-[#0e1a2d] py-6 text-slate-500"><Blocks size={21} className="text-amber-400"/><Braces size={17}/><GitBranch size={17}/><Activity size={17}/><LockKeyhole size={17}/></aside>
          <div className="min-w-0 p-3 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><p className="text-[10px] font-semibold uppercase tracking-[.17em] text-amber-400">O24 platform</p><h3 className="mt-1 text-base font-semibold tracking-tight text-white sm:text-lg">Integration control center</h3><p className="mt-1 text-[11px] text-slate-400">Build, orchestrate and observe integrations.</p></div>
              <div className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[.035] px-2.5 py-2 text-[10px] text-slate-300 sm:flex"><Play size={11} className="text-amber-400"/> Interactive preview</div>
            </div>
            <div role="tablist" aria-label="Product preview sections" className="mb-4 mt-5 flex gap-1 overflow-x-auto overscroll-x-contain rounded-xl border border-white/10 bg-[#101b2e] p-1">
              {tabs.map(({id,label,icon:Icon}, index)=><button key={id} type="button" role="tab" id={`o24-tab-${id}`} aria-controls={`o24-panel-${id}`} aria-selected={view===id} tabIndex={view===id?0:-1} onKeyDown={(event)=>onTabKeyDown(event,index)} onClick={()=>setView(id)} className={`flex min-h-11 min-w-[116px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2.5 text-[10px] font-semibold transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-400 sm:text-xs ${view===id?"bg-[#273750] text-white shadow-sm":"text-slate-400 hover:bg-white/[.05] hover:text-slate-200"}`}><Icon size={13}/>{label}</button>)}
            </div>
            <div role="tabpanel" id={`o24-panel-${view}`} aria-labelledby={`o24-tab-${view}`} tabIndex={0} className="min-h-[262px] min-w-0 sm:min-h-[266px]">{view==="api"?<ApiView/>:view==="workflow"?<WorkflowView/>:<MonitorView/>}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#0e192b] px-4 py-3 text-[10px] text-slate-400 sm:px-5"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-amber-400"/> Architecture-focused product walkthrough</span><span>Illustrative UI · no live data</span></div>
      </div>
    </div>
  );
}
