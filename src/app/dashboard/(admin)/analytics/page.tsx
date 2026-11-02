import Link from "next/link";
import { requireAdmin } from "@/lib/leads/auth";
import { BarChart3, CalendarClock, CheckCircle2, Clock3, Target, Trophy, TrendingUp, Users, XCircle } from "lucide-react";

const ranges = [30, 90, 180, 365] as const;
const stageNames = ["NEW", "CONTACTED", "QUALIFIED", "DEMO_SCHEDULED", "WON", "LOST"] as const;
type Daily = { date: string; total: number; won: number; lost: number };
type Metrics = {
  total: number;
  statuses: Record<string, number>;
  won: number;
  lost: number;
  closed: number;
  progressed: number;
  win_rate_percent: number | null;
  lead_to_won_percent: number | null;
  qualification_percent: number | null;
  avg_first_contact_hours: number | null;
  avg_won_days: number | null;
  avg_lost_days: number | null;
  demo_tasks: number;
  completed_demos: number;
  overdue_tasks: number;
  upcoming_tasks: number;
  daily: Daily[];
};
const pretty = (v: number | null, unit = "") => v === null ? "—" : `${v}${unit}`;
const name = (s: string) => s.replaceAll("_", " ").toLowerCase().replace(/^./, c => c.toUpperCase());

export default async function ConversionAnalytics({ searchParams }: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { db } = await requireAdmin();
  const q = await searchParams;
  const days = ranges.find(n => String(n) === q.days) ?? 30;
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCDate(end.getUTCDate() + 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  const { data, error } = await db.rpc("crm_conversion_metrics", {
    p_start: start.toISOString(), p_end: end.toISOString(),
  });
  if (error || !data) throw new Error("Unable to load conversion analytics. Verify migration 006.");
  const m = data as Metrics;
  const cards = [
    { label: "Total leads", value: String(m.total), icon: Users, help: "Requests submitted within the selected UTC period" },
    { label: "Lead → Won", value: pretty(m.lead_to_won_percent, "%"), icon: Target, help: "WON / all submitted leads" },
    { label: "Win rate", value: pretty(m.win_rate_percent, "%"), icon: Trophy, help: "WON / (WON + LOST)" },
    { label: "Qualified or beyond", value: pretty(m.qualification_percent, "%"), icon: TrendingUp, help: "QUALIFIED + DEMO SCHEDULED + WON / all leads" },
    { label: "Completed demos", value: String(m.completed_demos), icon: CheckCircle2, help: `${m.demo_tasks} demo tasks associated with cohort leads` },
    { label: "Overdue tasks", value: String(m.overdue_tasks), icon: Clock3, help: "Open tasks with due date before now" },
    { label: "Recorded contact lag", value: pretty(m.avg_first_contact_hours, " h"), icon: CalendarClock, help: "Submission → current last-contact timestamp (not first response time)" },
    { label: "Average time to WON", value: pretty(m.avg_won_days, " days"), icon: Trophy, help: "Submission → first audited WON transition; excludes missing history" },
  ];
  const max = Math.max(1, ...m.daily.map(d => d.total));
  const distribution = stageNames.map(s => ({ key: s, count: m.statuses[s] || 0 }));
  return (
    <div className="crm-page">
      <header className="crm-page-header">
        <div>
          <p className="crm-small crm-muted">SALES WORKSPACE / PERFORMANCE</p>
          <h1>Conversion analytics</h1>
          <p>Track lead outcomes, sales activity and the time needed to close opportunities.</p>
          <p className="crm-small crm-muted">{start.toISOString().slice(0, 10)} to {new Date(end.getTime() - 86400000).toISOString().slice(0, 10)} · UTC submission cohort</p>
        </div>
        <nav aria-label="Analytics date range" className="flex flex-wrap gap-2">
          {ranges.map(n => <Link key={n} href={`/dashboard/analytics?days=${n}`}
            aria-current={n === days ? "page" : undefined}
            className={`crm-button ${n === days ? "crm-button-primary" : "crm-button-secondary"}`}>
              {n} days
            </Link>)}
        </nav>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(c => <section key={c.label} className="crm-panel p-5" aria-label={c.label}>
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>{c.label}</span><c.icon size={18} aria-hidden="true" />
          </div>
          <p className="text-3xl font-semibold mt-3 tabular-nums">{c.value}</p>
          <p className="text-xs mt-3 text-muted-foreground leading-relaxed">{c.help}</p>
        </section>)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="crm-panel p-6">
          <h2 className="font-semibold flex items-center gap-2"><BarChart3 size={19} /> Lead arrivals</h2>
          <p className="text-xs text-muted-foreground mt-2">Each bar is a UTC submission day; final lead status is reflected in the summary.</p>
          <div className="flex h-44 items-end gap-px mt-8" role="img"
            aria-label={m.daily.map(d => `${d.date}: ${d.total} submissions`).join("; ") || "No submissions"}>
            {m.daily.map(d => <div key={d.date} className="h-full flex-1 flex flex-col justify-end" title={`${d.date}: ${d.total}`}>
              <div className="rounded-t bg-primary/85 min-h-[1px]" style={{height:`${d.total / max * 100}%`}} />
            </div>)}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-3">
            <span>{m.daily[0]?.date}</span><span>{m.daily.at(-1)?.date}</span>
          </div>
          <details className="mt-4 text-sm"><summary className="cursor-pointer underline">View daily data</summary>
            <div className="overflow-auto max-h-64 mt-3"><table className="w-full text-sm">
              <thead><tr><th className="text-left">Date</th><th className="text-right">Submitted</th><th className="text-right">Now won</th></tr></thead>
              <tbody>{m.daily.map(d => <tr key={d.date}><td>{d.date}</td><td className="text-right">{d.total}</td><td className="text-right">{d.won}</td></tr>)}</tbody>
            </table></div>
          </details>
        </section>
        <section className="crm-panel p-6">
          <h2 className="font-semibold">Current status distribution</h2>
          <p className="text-xs text-muted-foreground mt-2">Each lead appears in exactly one stage, based on its current status.</p>
          <div className="space-y-4 mt-6">
            {distribution.map(s => <div key={s.key}>
              <div className="flex justify-between text-sm mb-2"><span>{name(s.key)}</span><span>{s.count} · {m.total ? (s.count / m.total * 100).toFixed(1) : "0"}%</span></div>
              <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{width:`${m.total ? s.count / m.total * 100 : 0}%`}} /></div>
            </div>)}
          </div>
        </section>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="crm-panel p-6">
          <h2 className="font-semibold flex gap-2 items-center"><Trophy size={18} /> Closed outcomes</h2>
          <p className="mt-4 text-3xl font-semibold">{m.closed}</p>
          <p className="text-xs text-muted-foreground mt-2">{m.won} won / {m.lost} lost</p>
          <div className="flex h-2 rounded-full overflow-hidden bg-muted mt-4">
            <div className="bg-green-600" style={{width:`${m.closed ? m.won / m.closed * 100 : 0}%`}} />
            <div className="bg-red-500" style={{width:`${m.closed ? m.lost / m.closed * 100 : 0}%`}} />
          </div>
        </section>
        <section className="crm-panel p-6">
          <h2 className="font-semibold flex gap-2 items-center"><CalendarClock size={18} /> Demo & follow-ups</h2>
          <p className="mt-4 text-sm">Demo tasks: <strong>{m.demo_tasks}</strong></p>
          <p className="mt-2 text-sm">Upcoming open tasks: <strong>{m.upcoming_tasks}</strong></p>
          <p className="mt-2 text-sm">Overdue open tasks: <strong>{m.overdue_tasks}</strong></p>
          <Link className="inline-block mt-5 underline text-sm" href="/dashboard/follow-ups">View follow-ups</Link>
        </section>
        <section className="crm-panel p-6">
          <h2 className="font-semibold flex gap-2 items-center"><XCircle size={18} /> Lead outcomes</h2>
          <p className="mt-4 text-sm">Lead progression: <strong>{m.progressed} / {m.total}</strong></p>
          <p className="mt-2 text-sm">Average time to LOST: <strong>{pretty(m.avg_lost_days, " days")}</strong></p>
          <p className="mt-2 text-xs text-muted-foreground">Conversion metrics are descriptive, not causal. Missing audit timestamps are excluded from averages.</p>
        </section>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        <strong>Definitions:</strong> All ratios describe the current status of leads submitted in the selected period.
        Win rate = WON / (WON + LOST), not WON / all leads. Lead → Won = WON / all leads.
        Demo and task counts use tasks associated with the same cohort, regardless of task creation date.
        “Recorded contact lag” uses the available last-contact timestamp and is only a proxy for first response time.
        No data or zero denominator is shown as —.
      </p>
    </div>
  );
}
