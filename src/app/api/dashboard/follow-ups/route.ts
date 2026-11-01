import { NextResponse } from "next/server";
import { adminSession } from "@/lib/leads/auth";
import { uuid } from "@/lib/leads/domain";

const response = (value: unknown, status = 200) => NextResponse.json(value, {
  status, headers: { "Cache-Control": "private, no-store" },
});
const types = ["FOLLOW_UP", "CALL", "EMAIL", "MEETING", "DEMO"];
function date(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d\d-\d\dT/.test(value)) return undefined;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : undefined;
}
export async function GET(request: Request) {
  const { db, status } = await adminSession();
  if (status !== 200) return response({ error: status === 401 ? "Authentication required" : "Admin access required" }, status);
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") ?? "upcoming";
  const pageRaw = url.searchParams.get("page") ?? "1";
  const leadId = url.searchParams.get("leadId");
  if (!/^[1-9]\d{0,3}$/.test(pageRaw) || !["upcoming", "overdue", "completed", "cancelled", "all"].includes(filter)
      || (leadId !== null && !uuid.test(leadId))) return response({ error: "Invalid filters" }, 400);
  const page = Number(pageRaw), size = 25;
  const now = new Date().toISOString();
  let q = db.from("crm_followup_tasks")
    .select("id,lead_id,kind,title,description,due_at,ends_at,status,assigned_admin,created_at,completed_at", { count: "exact" });
  if (leadId) q = q.eq("lead_id", leadId);
  if (filter === "upcoming") q = q.eq("status", "OPEN").gte("due_at", now);
  if (filter === "overdue") q = q.eq("status", "OPEN").lt("due_at", now);
  if (filter === "completed") q = q.eq("status", "COMPLETED");
  if (filter === "cancelled") q = q.eq("status", "CANCELLED");
  const { data, count, error } = await q.order("due_at", { ascending: true })
    .order("id", { ascending: true }).range((page - 1) * size, page * size - 1);
  if (error) return response({ error: "Could not load follow-ups" }, 503);
  return response({ items: data ?? [], total: count ?? 0, page, pageSize: size });
}
export async function POST(request: Request) {
  const { db, status } = await adminSession();
  if (status !== 200) return response({ error: status === 401 ? "Authentication required" : "Admin access required" }, status);
  if (request.headers.get("origin") !== new URL(request.url).origin) return response({ error: "Invalid request origin" }, 403);
  let body: Record<string, unknown>;
  try {
    if (Number(request.headers.get("content-length") || 0) > 8192) return response({ error: "Request too large" }, 413);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 8192) return response({ error: "Request too large" }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw Error();
    body = parsed as Record<string, unknown>;
  } catch { return response({ error: "Invalid JSON" }, 400); }
  if (Object.keys(body).some(k => !["leadId", "kind", "title", "description", "dueAt", "endsAt", "assignedAdmin"].includes(k))) return response({ error: "Unsupported field" }, 400);
  const due = date(body.dueAt), end = date(body.endsAt);
  const assigned = body.assignedAdmin === "" || body.assignedAdmin == null ? null : body.assignedAdmin;
  if (typeof body.leadId !== "string" || !uuid.test(body.leadId)
    || typeof body.kind !== "string" || !types.includes(body.kind)
    || typeof body.title !== "string" || body.title.trim().length < 1 || body.title.trim().length > 200
    || (body.description != null && (typeof body.description !== "string" || body.description.length > 5000))
    || !due || end === undefined || (body.kind === "DEMO" && !end)
    || (end && end <= due) || (assigned !== null && (typeof assigned !== "string" || !uuid.test(assigned)))) {
    return response({ error: "Invalid follow-up details" }, 400);
  }
  const { data, error } = await db.rpc("create_crm_followup_task", {
    p_lead_id: body.leadId,
    p_kind: body.kind,
    p_title: body.title.trim(),
    p_description: typeof body.description === "string" ? body.description : null,
    p_due_at: due,
    p_ends_at: end,
    p_assigned_admin: assigned,
  });
  if (error) {
    const code = error.code;
    return response({ error: code === "42501" ? "Admin access required" : code === "P0002" ? "Lead not found" : code === "22023" || code === "23514" ? "Invalid follow-up details" : "Could not create follow-up" },
      code === "42501" ? 403 : code === "P0002" ? 404 : code === "22023" || code === "23514" ? 400 : 503);
  }
  return response({ ok: true, id: data }, 201);
}
