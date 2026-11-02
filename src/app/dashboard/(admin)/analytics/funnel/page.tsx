import { analyticsRanges, analyticsWindow, type FunnelMetrics } from "@/lib/leads/analytics-range";
import { requireAdmin } from "@/lib/leads/auth";
import { ArrowLeft, Download, Filter, TrendingDown } from "lucide-react";
import Link from "next/link";

const stageLabel: Record<string,string> = {
  NEW: "New inquiries", CONTACTED: "Contacted", QUALIFIED: "Qualified",
  DEMO_SCHEDULED: "Demo scheduled", WON: "Won",
};
const pct = (n: number, d: number) => d ? `${(n / d * 100).toFixed(1)}%` : "—";
export default async function SalesFunnel({searchParams}: {
  searchParams: Promise<{days?:string}>;
}) {
  const {db} = await requireAdmin();
  const {days,start,end} = analyticsWindow((await searchParams).days);
  const {data,error} = await db.rpc("crm_conversion_funnel", {p_start:start,p_end:end});
  if (error || !data) throw new Error("Unable to load sales funnel. Apply migration 007.");
  const funnel = data as FunnelMetrics;
  const stages = funnel.stages ?? [];
  return <div className="crm-page space-y-6">
    <header className="crm-page-header">
      <div>
        <Link href={`/dashboard/analytics?days=${days}`} className="inline-flex items-center gap-2 text-sm underline mb-4"><ArrowLeft size={15}/> Conversion analytics</Link>
        <p className="crm-small crm-muted">SALES WORKSPACE / CONVERSION</p>
        <h1>Sales conversion funnel</h1>
        <p>How far each submitted lead has progressed through the sales pipeline.</p>
        <p className="crm-small crm-muted">{start.slice(0,10)} to {new Date(Date.parse(end)-86400000).toISOString().slice(0,10)} · UTC submission cohort</p>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Funnel date range">
        {analyticsRanges.map(n=><Link key={n} className={`crm-button ${days===n?"crm-button-primary":"crm-button-secondary"}`} aria-current={days===n?"page":undefined} href={`/dashboard/analytics/funnel?days=${n}`}>{n} days</Link>)}
      </nav>
    </header>
    <div className="flex flex-wrap gap-2">
      <a className="crm-button crm-button-secondary inline-flex items-center gap-2" href={`/api/dashboard/analytics/export?days=${days}&report=funnel`}><Download size={16}/> Export funnel CSV</a>
      <a className="crm-button crm-button-secondary inline-flex items-center gap-2" href={`/api/dashboard/analytics/export?days=${days}&report=summary`}><Download size={16}/> Export KPI CSV</a>
      <a className="crm-button crm-button-secondary inline-flex items-center gap-2" href={`/api/dashboard/analytics/export?days=${days}&report=daily`}><Download size={16}/> Export daily CSV</a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <section className="crm-panel p-5"><p className="text-sm text-muted-foreground">Submitted leads</p><p className="text-3xl font-semibold mt-2">{funnel.total}</p></section>
      <section className="crm-panel p-5"><p className="text-sm text-muted-foreground">Won / submitted</p><p className="text-3xl font-semibold mt-2">{pct(stages.at(-1)?.count ?? 0,funnel.total)}</p></section>
      <section className="crm-panel p-5"><p className="text-sm text-muted-foreground">Current LOST outcomes</p><p className="text-3xl font-semibold mt-2">{funnel.lost}</p></section>
    </div>
    <section className="crm-panel p-6">
      <h2 className="flex items-center gap-2 font-semibold"><Filter size={19}/> Cumulative stage reach</h2>
      <p className="text-sm text-muted-foreground mt-2">Counts include leads that reached a stage and subsequently advanced or became LOST.</p>
      <div className="space-y-6 mt-8">
        {stages.map((s,i)=>{
          const previous = i===0 ? funnel.total : stages[i-1].count;
          const drop = i===0 ? null : Math.max(0,previous-s.count);
          return <div key={s.status}>
            <div className="flex flex-wrap justify-between items-end gap-3 mb-2">
              <div><h3 className="font-medium">{stageLabel[s.status] ?? s.status}</h3>
                <p className="text-xs text-muted-foreground">{pct(s.count,funnel.total)} of all leads{drop===null?"":` · ${drop} did not reach from prior stage`}</p>
              </div>
              <div className="text-right"><strong className="text-xl">{s.count}</strong>
                {i>0&&<p className="text-xs text-muted-foreground">{pct(s.count,previous)} step conversion</p>}
              </div>
            </div>
            <div className="w-full bg-muted h-5 rounded-md overflow-hidden"><div className="h-full rounded-md bg-primary" style={{width:`${funnel.total?s.count/funnel.total*100:0}%`}}/></div>
          </div>;
        })}
      </div>
    </section>
    <section className="crm-panel p-6 text-sm">
      <h2 className="font-semibold flex items-center gap-2"><TrendingDown size={18}/> Reading the funnel</h2>
      <p className="mt-2 text-muted-foreground leading-relaxed">This is a <strong>cumulative reach funnel</strong>, not a snapshot of current statuses. The maximum non-LOST stage is inferred from audited status transitions and the current status. Because stage transitions are sequential, reaching a later stage implies reaching earlier stages. LOST is a separate outcome and is not treated as an intermediate stage. Historical records created before audit tracking, if any, may undercount prior stages for LOST leads. A task marked DEMO does not automatically advance the CRM lead to DEMO_SCHEDULED.</p>
    </section>
  </div>;
}
