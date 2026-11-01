import Link from "next/link";
import { requireAdmin } from "@/lib/leads/auth";
import { statuses, type Lead } from "@/lib/leads/domain";
import { LeadTable } from "@/components/dashboard/LeadTable";
import { admins } from "@/lib/leads/data";
type Metrics = {
  total: number;
  statuses: Record<string, number>;
  delivered: number;
  attempted: number;
  failures: number;
  daily: { date: string; count: number }[];
};
export default async function Overview({
  searchParams,
}: {
  searchParams: Promise<{ trend?: string }>;
}) {
  const { db } = await requireAdmin();
  const p = await searchParams;
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCDate(end.getUTCDate() + 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 30);
  const [metrics, recent, failures, directory] = await Promise.all([
    db.rpc("enterprise_lead_metrics", {
      p_start: start.toISOString(),
      p_end: end.toISOString(),
    }),
    db
      .from("enterprise_leads")
      .select("*")
      .gte("submitted_at", start.toISOString())
      .lt("submitted_at", end.toISOString())
      .order("submitted_at", { ascending: false })
      .limit(5),
    db
      .from("enterprise_leads")
      .select("id,company,email_status")
      .gte("submitted_at", start.toISOString())
      .lt("submitted_at", end.toISOString())
      .in("email_status", [
        "bounced",
        "complained",
        "failed",
        "delivery_delayed",
      ])
      .order("submitted_at", { ascending: false })
      .limit(10),
    admins(),
  ]);
  if (metrics.error || recent.error || failures.error)
    throw new Error(
      "Unable to load dashboard. Check the migration and database connection.",
    );
  const m = metrics.data as Metrics;
  const weekly = p.trend === "weekly";
  const points = weekly
    ? Array.from({ length: Math.ceil(m.daily.length / 7) }, (_, i) => ({
        date: m.daily[i * 7].date,
        count: m.daily.slice(i * 7, i * 7 + 7).reduce((n, d) => n + d.count, 0),
      }))
    : m.daily;
  const max = Math.max(1, ...points.map((d) => d.count));
  const kpis = [
    ["Total leads", m.total],
    ["New leads", m.statuses.NEW || 0],
    ["Qualified leads", m.statuses.QUALIFIED || 0],
    ["Demo scheduled", m.statuses.DEMO_SCHEDULED || 0],
    ["Won leads", m.statuses.WON || 0],
    [
      "Email delivery rate",
      m.attempted ? `${((m.delivered / m.attempted) * 100).toFixed(1)}%` : "—",
    ],
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between gap-4 items-end">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            O24 / Enterprise sales
          </p>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Pipeline overview
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {start.toISOString().slice(0, 10)} –{" "}
            {new Date(end.getTime() - 86400000).toISOString().slice(0, 10)} · 30
            calendar days, UTC
          </p>
        </div>
        <Link
          className="rounded-md bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold"
          href="/dashboard/leads"
        >
          Manage leads →
        </Link>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-px rounded-lg border overflow-hidden bg-border">
        {kpis.map(([label, value]) => (
          <section className="bg-card p-5 lg:p-7" key={label}>
            <h2 className="text-sm text-muted-foreground">{label}</h2>
            <p className="text-4xl font-semibold tabular-nums tracking-tight mt-3">
              {value}
            </p>
          </section>
        ))}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        All metrics use requests submitted in the range above and their current
        status. Delivery rate: {m.delivered} delivered / {m.attempted}{" "}
        non-pending notifications (accepted, sent, delivered, delayed, bounced,
        complained or failed). Pending requests are excluded; no attempts
        displays “—”.
      </p>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <section className="rounded-lg border bg-card p-6">
          <div className="flex flex-wrap justify-between gap-3">
            <h2 className="font-semibold">Lead arrivals</h2>
            <nav aria-label="Trend interval" className="text-xs flex gap-3">
              <Link
                aria-current={!weekly ? "page" : undefined}
                className={!weekly ? "text-primary font-semibold" : "underline"}
                href="/dashboard"
              >
                Daily
              </Link>
              <Link
                aria-current={weekly ? "page" : undefined}
                className={weekly ? "text-primary font-semibold" : "underline"}
                href="/dashboard?trend=weekly"
              >
                Weekly
              </Link>
            </nav>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {weekly
              ? "Seven-day buckets from the range start; final bucket may be partial."
              : "Submissions per UTC day, including days with zero requests."}
          </p>
          <div
            className="flex h-44 items-end gap-1 mt-8"
            role="img"
            aria-label={points.map((d) => `${d.date}: ${d.count}`).join("; ")}
          >
            {points.map((d) => (
              <div
                key={d.date}
                className="flex-1 h-full flex flex-col justify-end group"
                title={`${d.date}: ${d.count} leads`}
              >
                <div
                  className="bg-primary/80 min-h-[2px] rounded-t-sm group-hover:bg-primary"
                  style={{ height: `${(d.count / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-3">
            <span>{points[0]?.date}</span>
            <span>{points[points.length - 1]?.date}</span>
          </div>
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer underline">
              View trend data
            </summary>
            <table className="w-full mt-3">
              <thead>
                <tr>
                  <th className="text-left">Period starting</th>
                  <th className="text-right">Leads</th>
                </tr>
              </thead>
              <tbody>
                {points.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td className="text-right">{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>
        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-6">Current lead status</h2>
          <div className="space-y-4">
            {statuses.map((s) => (
              <div key={s}>
                <div className="flex justify-between text-xs mb-2">
                  <span>{s.replaceAll("_", " ")}</span>
                  <span className="tabular-nums">{m.statuses[s] || 0}</span>
                </div>
                <div className="h-1.5 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${m.total ? ((m.statuses[s] || 0) / m.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent demo requests</h2>
          <Link className="text-sm underline" href="/dashboard/leads">
            View all
          </Link>
        </div>
        <LeadTable leads={recent.data as Lead[]} admins={directory} />
      </section>
      <section className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold">
          Delivery monitoring{" "}
          <span className="ml-2 text-muted-foreground">{m.failures}</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Failed, bounced, complained and delayed notifications in this
          submission cohort. Emails are never retried automatically by this
          dashboard.
        </p>
        {failures.data?.length ? (
          <ul className="mt-4 divide-y">
            {failures.data.map((f) => (
              <li
                key={f.id}
                className="py-3 flex justify-between gap-4 text-sm"
              >
                <Link className="underline" href={`/dashboard/leads/${f.id}`}>
                  {f.company}
                </Link>
                <span>{f.email_status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm">No delivery issues in this period.</p>
        )}{" "}
        {m.failures > 10 && (
          <p className="text-xs mt-3 text-muted-foreground">
            Showing the 10 most recent issues.
          </p>
        )}
      </section>
    </div>
  );
}
