import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/leads/auth";
import { admins } from "@/lib/leads/data";
import { uuid, dateTime, type Lead } from "@/lib/leads/domain";
import { Status } from "@/components/dashboard/LeadTable";
import { LeadEditor } from "@/components/dashboard/LeadEditor";
export default async function Detail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ historyPage?: string; emailPage?: string }>;
}) {
  const { db } = await requireAdmin();
  const { id } = await params;
  if (!uuid.test(id)) notFound();
  const p = await searchParams;
  const page = (v?: string) => {
    const n = Number(v || 1);
    return Number.isSafeInteger(n) && n > 0 && n < 100000 ? n : 1;
  };
  const hp = page(p.historyPage),
    ep = page(p.emailPage);
  const [result, history, directory] = await Promise.all([
    db.from("enterprise_leads").select("*").eq("id", id).maybeSingle(),
    db
      .from("lead_history")
      .select("*", { count: "exact" })
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range((hp - 1) * 25, hp * 25 - 1),
    admins(),
  ]);
  if (result.error || history.error) throw new Error("Unable to load lead");
  if (!result.data) notFound();
  const l = result.data as Lead;
  const events = l.resend_email_id
    ? await db
        .from("demo_email_events")
        .select("*", { count: "exact" })
        .eq("resend_email_id", l.resend_email_id)
        .order("received_at", { ascending: false })
        .order("event_id", { ascending: false })
        .range((ep - 1) * 25, ep * 25 - 1)
    : { data: [], error: null, count: 0 };
  if (events.error) throw new Error("Unable to load email history");
  const fields = [
    ["Name", l.name],
    ["Work email", l.email],
    ["Company", l.company],
    ["Role", l.role],
    ["Interest", l.interest],
    ["Deployment", l.deployment],
    ["Timeline", l.timeline],
    ["Open source", l.open_source],
    ["Submitted", dateTime(l.submitted_at)],
    ["Request ID", l.id],
  ];
  const pager = (key: string, n: number, total: number) => (
    <nav aria-label={`${key} pagination`} className="flex gap-4 text-xs mt-5">
      {n > 1 && (
        <Link
          className="underline"
          href={`?historyPage=${key === "History" ? n - 1 : hp}&emailPage=${key === "Email" ? n - 1 : ep}`}
        >
          Previous
        </Link>
      )}
      <span>
        Page {n} of {Math.max(1, Math.ceil(total / 25))}
      </span>
      {n * 25 < total && (
        <Link
          className="underline"
          href={`?historyPage=${key === "History" ? n + 1 : hp}&emailPage=${key === "Email" ? n + 1 : ep}`}
        >
          Next
        </Link>
      )}
    </nav>
  );
  return (
    <div className="space-y-7">
      <Link
        className="text-sm underline text-muted-foreground"
        href="/dashboard/leads"
      >
        ← Enterprise leads
      </Link>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight break-words">
            {l.company}
          </h1>
          <p className="mt-2 text-muted-foreground">Request from {l.name}</p>
        </div>
        <Status value={l.lead_status} />
      </div>
      <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6 items-start">
        <div className="space-y-6">
          <section className="rounded-lg border bg-card p-6">
            <h2 className="font-semibold mb-6">Original demo request</h2>
            <dl className="grid sm:grid-cols-2 gap-5">
              {fields.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="text-sm mt-1 break-words">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            <h3 className="text-xs text-muted-foreground mt-6">Message</h3>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed mt-2">
              {l.message}
            </p>
          </section>
          <section className="rounded-lg border bg-card p-6">
            <h2 className="font-semibold">Activity and internal notes</h2>
            <p className="text-xs mt-2 text-muted-foreground">
              Last updated {dateTime(l.updated_at)}
            </p>
            {history.data?.length ? (
              <ol className="mt-6 space-y-6">
                {history.data.map((h) => (
                  <li key={h.id} className="border-l-2 border-primary/40 pl-4">
                    <p className="text-sm font-semibold">{h.actor_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dateTime(h.created_at)} ·{" "}
                      {h.actor_id || "Removed account"}
                    </p>
                    {h.note && (
                      <p className="text-sm whitespace-pre-wrap break-words my-3">
                        {h.note}
                      </p>
                    )}
                    <dl className="mt-2 space-y-2">
                      {Object.entries(
                        h.changes as Record<
                          string,
                          { before: unknown; after: unknown }
                        >,
                      ).map(([key, change]) => (
                        <div key={key} className="text-xs break-words">
                          <dt className="font-medium">
                            {key.replaceAll("_", " ")}
                          </dt>
                          <dd className="text-muted-foreground">
                            {String(change.before ?? "—")} →{" "}
                            {String(change.after ?? "—")}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground mt-5">
                No activity recorded yet.
              </p>
            )}
            {pager("History", hp, history.count || 0)}
          </section>
          <section className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="font-semibold">Email delivery</h2>
            <Status value={l.email_status} />
            <p className="text-xs text-muted-foreground">
              Status updated {dateTime(l.email_status_at)}
            </p>
            <p className="text-xs break-all">
              Resend ID: {l.resend_email_id || "No notification ID recorded"}
            </p>
            <p className="text-xs text-muted-foreground">
              This notification goes to the internal sales team. “Delivered”
              confirms delivery. Events show when the webhook was received.
            </p>
            {events.data?.length ? (
              <ul className="divide-y">
                {events.data.map((e) => (
                  <li key={e.event_id} className="py-3 text-sm">
                    <p>{e.event_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateTime(e.received_at)}
                    </p>
                    <p className="text-xs break-all text-muted-foreground">
                      {e.event_id}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No email events received.
              </p>
            )}
            {pager("Email", ep, events.count || 0)}
          </section>
        </div>
        <section className="rounded-lg border bg-card p-6">
          <LeadEditor key={l.updated_at} lead={l} admins={directory} />
        </section>
      </div>
    </div>
  );
}
