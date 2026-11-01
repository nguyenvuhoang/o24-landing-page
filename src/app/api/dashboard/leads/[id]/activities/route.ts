import { NextResponse } from "next/server";
import { adminSession } from "@/lib/leads/auth";
import { uuid } from "@/lib/leads/domain";

const TYPES = ["CALL", "EMAIL", "MEETING", "DEMO", "NOTE"] as const;
type ActivityType = (typeof TYPES)[number];
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { db, status } = await adminSession();
  if (status !== 200)
    return json({ error: status === 401 ? "Authentication required" : "Admin access required" }, status);

  const { id } = await params;
  if (!uuid.test(id)) return json({ error: "Invalid lead ID" }, 400);

  const url = new URL(request.url);
  const requestedPage = url.searchParams.get("page") ?? "1";
  if (!/^[1-9]\d{0,4}$/.test(requestedPage))
    return json({ error: "Invalid page" }, 400);
  const page = Number(requestedPage);
  const pageSize = 10;
  const { data, count, error } = await db
    .from("crm_lead_activities")
    .select("id, activity_type, subject, description, occurred_at, next_follow_up_at, created_at, actor_id", { count: "exact" })
    .eq("lead_id", id)
    .order("occurred_at", { ascending: false })
    .order("id", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (error) return json({ error: "Unable to load customer activities" }, 503);
  return json({ items: data ?? [], total: count ?? 0, page, pageSize });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { db, status } = await adminSession();
  if (status !== 200)
    return json({ error: status === 401 ? "Authentication required" : "Admin access required" }, status);
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return json({ error: "Invalid request origin" }, 403);

  const { id } = await params;
  if (!uuid.test(id)) return json({ error: "Invalid lead ID" }, 400);

  if (Number(request.headers.get("content-length") || 0) > 8192)
    return json({ error: "Request too large" }, 413);
  let input: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 8192)
      return json({ error: "Request too large" }, 413);
    input = JSON.parse(text);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return json({ error: "Invalid activity" }, 400);
  const body = input as Record<string, unknown>;
  if (Object.keys(body).some((key) => !["type", "subject", "description", "occurredAt", "nextFollowUpAt"].includes(key)))
    return json({ error: "Unsupported field" }, 400);
  const type = body.type;
  const subject = body.subject;
  const description = body.description ?? null;
  const occurredAt = body.occurredAt;
  const nextFollowUpAt = body.nextFollowUpAt ?? null;
  if (
    typeof type !== "string" || !TYPES.includes(type as ActivityType) ||
    typeof subject !== "string" || subject.trim().length < 1 || subject.trim().length > 200 ||
    (description !== null && (typeof description !== "string" || description.length > 5000)) ||
    typeof occurredAt !== "string" || !Number.isFinite(Date.parse(occurredAt)) ||
    (nextFollowUpAt !== null && (typeof nextFollowUpAt !== "string" || !Number.isFinite(Date.parse(nextFollowUpAt))))
  ) return json({ error: "Invalid activity fields" }, 400);

  const { data, error } = await db.rpc("record_crm_lead_activity", {
    p_lead_id: id,
    p_activity_type: type,
    p_subject: subject.trim(),
    p_description: description,
    p_occurred_at: new Date(occurredAt).toISOString(),
    p_next_follow_up_at: nextFollowUpAt === null ? null : new Date(nextFollowUpAt).toISOString(),
  });
  if (error) {
    const code = error.code;
    return json(
      { error: code === "42501" ? "Admin access required" : code === "P0002" ? "Lead not found" : code === "22023" || code === "23514" ? "Invalid activity or follow-up date" : "Unable to record activity" },
      code === "42501" ? 403 : code === "P0002" ? 404 : code === "22023" || code === "23514" ? 400 : 503,
    );
  }
  return json({ ok: true, id: data }, 201);
}
