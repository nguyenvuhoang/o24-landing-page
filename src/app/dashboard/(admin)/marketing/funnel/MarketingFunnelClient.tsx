"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { ArrowDownRight, BarChart3, FileUp, Info, MousePointerClick, RotateCcw } from "lucide-react";
import { parseFunnelCSV, summarizeFunnel, type FunnelRow } from "@/lib/analytics/funnel";

const format=(n:number)=>new Intl.NumberFormat("en-US").format(n);
const headings:Record<string,string>={awareness:"Awareness",evaluation:"Evaluation",trust:"Trust",conversion:"Conversion-page views"};

export function MarketingFunnelClient(){
 const [rows,setRows]=useState<FunnelRow[]>([]);
 const [fileName,setFileName]=useState("");const [error,setError]=useState("");
 const [from,setFrom]=useState("");const [to,setTo]=useState("");
 const report=useMemo(()=>summarizeFunnel(rows,from,to),[rows,from,to]);
 const max=Math.max(1,...report.stages.map(x=>x.views));
 const timelineMax=Math.max(1,...report.days.map(x=>x.views));
 const onFile=async(e:ChangeEvent<HTMLInputElement>)=>{
   const file=e.target.files?.[0];if(!file)return;
   setError("");
   try{if(file.size>2_000_000)throw new Error("CSV exceeds 2 MB");
     const parsed=parseFunnelCSV(await file.text());setRows(parsed);setFileName(file.name);setFrom("");setTo("");
   }catch(err){setError(err instanceof Error?err.message:"Unable to parse CSV");setRows([]);setFileName("");}
   e.target.value="";
 };
 return <div className="space-y-6">
   <section className="rounded-2xl border bg-card p-5 sm:p-6">
     <div className="flex flex-wrap items-start justify-between gap-4">
       <div><h2 className="flex items-center gap-2 font-bold"><FileUp size={19} className="text-primary"/> Import aggregated events</h2>
         <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Upload a CSV with columns <code>date,event,source,destination,count</code>. Values must be aggregated daily event counts; do not upload contacts, emails, IP addresses, tracking IDs or raw event logs.</p></div>
       <label className="inline-flex cursor-pointer items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">Choose CSV<input type="file" className="sr-only" accept=".csv,text/csv" onChange={onFile}/></label>
     </div>
     <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
       <span>{fileName?`Loaded ${format(rows.length)} rows from ${fileName}`:"No data loaded — all metrics remain empty until you import a file."}</span>
       {rows.length>0&&<button type="button" className="inline-flex items-center gap-1 font-semibold text-primary" onClick={()=>{setRows([]);setFileName("");setFrom("");setTo("");setError("");}}><RotateCcw size={13}/> Clear data</button>}
     </div>
     {error&&<p role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600">{error}</p>}
     <details className="mt-4 text-sm text-muted-foreground"><summary className="cursor-pointer font-semibold">CSV schema and event mapping</summary><div className="mt-2 space-y-2 leading-6"><p><code>journey_page_view</code> uses the route in <code>destination</code> to classify stages. <code>journey_navigation</code> uses <code>source</code> and <code>destination</code> as route names. <code>solutions_cta_click</code>, <code>demo_request_success</code> and <code>enterprise_request_success</code> count aggregate events.</p><p>This is an explicit normalized import format, not a guarantee of compatibility with the current Vercel Analytics export format. Transform external exports to match before importing.</p></div></details>
   </section>
   <section className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-5">
     <div><label className="block text-xs font-semibold text-muted-foreground" htmlFor="funnel-from">From (UTC)</label><input id="funnel-from" className="mt-1 rounded-lg border bg-background px-3 py-2 text-sm" type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
     <div><label className="block text-xs font-semibold text-muted-foreground" htmlFor="funnel-to">To (UTC)</label><input id="funnel-to" className="mt-1 rounded-lg border bg-background px-3 py-2 text-sm" type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
     <span className="text-xs text-muted-foreground">Filters use event date, inclusive. No server upload.</span>
   </section>
   <div className="grid gap-4 sm:grid-cols-3">
     {[{label:"CTA clicks",n:report.ctaClicks,icon:MousePointerClick},{label:"Demo requests confirmed",n:report.demoSuccess,icon:BarChart3},{label:"Enterprise requests reported",n:report.enterpriseSuccess,icon:ArrowDownRight}].map(x=><div key={x.label} className="rounded-2xl border bg-card p-5"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>{x.label}</span><x.icon size={18}/></div><div className="mt-3 text-3xl font-bold tabular-nums">{rows.length?format(x.n):"—"}</div></div>)}
   </div>
   <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="text-xl font-bold">Stage activity</h2><p className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Info size={15} className="mt-0.5 shrink-0"/>Bars show page-view event volumes, not unique users. Different stages can be revisited; ratios between stage views are not cohort conversion rates.</p>
     <div className="mt-6 space-y-5">{report.stages.map((x,i)=><div key={x.stage} className="grid gap-2 sm:grid-cols-[170px_1fr_85px] sm:items-center"><span className="text-sm font-semibold">{i+1}. {headings[x.stage]}</span><div className="h-5 overflow-hidden rounded-md bg-muted"><div className="h-full rounded-md bg-primary transition-[width]" style={{width:`${x.views/max*100}%`}}/></div><span className="text-right font-mono text-sm tabular-nums">{rows.length?format(x.views):"—"}</span></div>)}</div>
   </section>
   <div className="grid gap-5 xl:grid-cols-2">
     <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="text-lg font-bold">Daily page views</h2><p className="mt-1 text-xs text-muted-foreground">UTC event dates · {format(report.days.length)} days represented</p>
       {report.days.length===0?<p className="mt-8 text-sm text-muted-foreground">No data in this date range.</p>:<div className="mt-6 flex h-36 items-end gap-1" role="img" aria-label="Daily page view event counts">{report.days.slice(-60).map(d=><div key={d.day} title={`${d.day}: ${format(d.views)} views`} className="min-w-0 flex-1 rounded-t bg-primary/80" style={{height:`${Math.max(2,d.views/timelineMax*100)}%`}}/>)}</div>}
     </section>
     <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="text-lg font-bold">Top navigation paths</h2><p className="mt-1 text-xs text-muted-foreground">Aggregated navigation event counts</p><div className="mt-4 space-y-3">{report.navigation.length===0?<p className="text-sm text-muted-foreground">No navigation records.</p>:report.navigation.map((r,i)=><div key={`${r.source}/${r.destination}/${i}`} className="flex justify-between gap-3 border-b pb-2 text-xs"><span className="min-w-0 break-all">{r.source} → {r.destination}</span><strong className="shrink-0 tabular-nums">{format(r.count)}</strong></div>)}</div></section>
   </div>
   <p className="text-xs leading-6 text-muted-foreground">This page does not query Vercel Analytics or the CRM. Event counts are imported explicitly and held in browser memory only. Confirmation events and stage activity may use different collection/consent conditions; do not interpret event ratios as verified lead attribution.</p>
 </div>;
}
