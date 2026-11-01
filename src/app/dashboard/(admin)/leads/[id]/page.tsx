import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/leads/auth";
import { admins } from "@/lib/leads/data";
import { uuid, type Lead } from "@/lib/leads/domain";
import { LeadDetailView } from "@/components/dashboard/LeadDetailView";
import type {
  ActivityEntry,
  EmailEntry,
} from "@/components/dashboard/LeadTimelines";
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
  return (
    <LeadDetailView
      lead={l}
      directory={directory}
      history={(history.data || []) as ActivityEntry[]}
      historyCount={history.count || 0}
      events={(events.data || []) as EmailEntry[]}
      eventCount={events.count || 0}
      historyPage={hp}
      emailPage={ep}
    />
  );
}
