import { NextResponse } from "next/server";
import { adminSession } from "@/lib/leads/auth";
import { analyticsWindow, analyticsRanges, type ConversionMetrics, type FunnelMetrics } from "@/lib/leads/analytics-range";

export const dynamic = "force-dynamic";
function csvCell(value: unknown): string {
  const raw = value == null ? "" : String(value);
  // Prevent spreadsheet formula injection, including whitespace-prefixed formula prefixes.
  const safe = /^[\s\u0000-\u001f]*[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replaceAll('"','""')}"`;
}
function csv(rows: unknown[][]) {return "\uFEFF" + rows.map(row=>row.map(csvCell).join(",")).join("\r\n")+"\r\n";}
const unauthorized = (status: number) => NextResponse.json(
  {error:status===401?"Authentication required":"Admin access required"},
  {status,headers:{"Cache-Control":"private, no-store"}}
);
export async function GET(request: Request) {
  const {db,status} = await adminSession();
  if (status!==200) return unauthorized(status);
  const url=new URL(request.url);
  const rawDays=url.searchParams.get("days")??"30";
  const report=url.searchParams.get("report")??"funnel";
  if (!analyticsRanges.some(n=>String(n)===rawDays) || !["funnel","summary","daily"].includes(report)) {
    return NextResponse.json({error:"Invalid report parameters"},{status:400,headers:{"Cache-Control":"private, no-store"}});
  }
  const {days,start,end}=analyticsWindow(rawDays);
  const {data,error}=await db.rpc(report==="funnel" ? "crm_conversion_funnel":"crm_conversion_metrics", {
    p_start:start,p_end:end,
  });
  if (error||!data) return NextResponse.json({error:"Unable to generate report"},{status:503,headers:{"Cache-Control":"private, no-store"}});
  const meta:unknown[][]=[["Report",report],["Submission cohort start (UTC inclusive)",start],["Submission cohort end (UTC exclusive)",end],["Days",days],[]];
  let rows:unknown[][];
  if (report==="funnel") {
    const m=data as FunnelMetrics;
    rows=[...meta,["Stage","Reached leads","Percent of cohort","Step conversion percent"],
      ...m.stages.map((s,i)=>[s.status,s.count,m.total?(s.count/m.total*100).toFixed(1):"",
        (i===0?m.total:m.stages[i-1].count)?(s.count/(i===0?m.total:m.stages[i-1].count)*100).toFixed(1):""]),
      [],["Current LOST outcomes",m.lost]];
  } else {
    const m=data as ConversionMetrics;
    if (report==="daily") {
      rows=[...meta,["UTC date","Leads submitted","Currently won","Currently lost"],
        ...m.daily.map(d=>[d.date,d.total,d.won,d.lost])];
    } else {
      rows=[...meta,["KPI","Value"],["Total leads",m.total],["Won",m.won],
        ["Lost",m.lost],["Lead to won percent",m.lead_to_won_percent],
        ["Win rate percent",m.win_rate_percent],["Qualified or beyond percent",m.qualification_percent],
        ["Demo tasks",m.demo_tasks],["Completed demos",m.completed_demos],
        ["Overdue open tasks",m.overdue_tasks],["Upcoming open tasks",m.upcoming_tasks]];
    }
  }
  const content=csv(rows);
  return new NextResponse(content,{status:200,headers:{
    "Content-Type":"text/csv; charset=utf-8",
    "Content-Disposition":`attachment; filename="o24-${report}-${days}d-${end.slice(0,10)}.csv"`,
    "Cache-Control":"private, no-store, max-age=0",
    "X-Content-Type-Options":"nosniff",
  }});
}
