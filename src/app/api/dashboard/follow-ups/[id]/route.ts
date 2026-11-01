import { NextResponse } from "next/server";
import { adminSession } from "@/lib/leads/auth";
import { uuid } from "@/lib/leads/domain";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
  const { db, status } = await adminSession();
  if (status !== 200) return reply({ error: status === 401 ? "Authentication required" : "Admin access required" }, status);
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Invalid request origin" }, 403);
  const { id } = await params;
  if (!uuid.test(id)) return reply({ error: "Invalid task ID" }, 400);
  let body: unknown;
  try {
    if (Number(request.headers.get("content-length") || 0) > 1024) return reply({ error: "Request too large" }, 413);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 1024) return reply({ error: "Request too large" }, 413);
    body = JSON.parse(raw);
  } catch { return reply({ error: "Invalid JSON" }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).length !== 1 || !Object.hasOwn(body, "status")
    || !["COMPLETED", "CANCELLED"].includes((body as { status?: string }).status ?? "")) {
    return reply({ error: "Invalid status" }, 400);
  }
  const { error } = await db.rpc("change_crm_followup_status", { p_task_id: id, p_status: (body as { status: string }).status });
  if (error) return reply({ error: error.code === "42501" ? "Admin access required" : error.code === "P0002" ? "Task not found" : error.code === "22023" ? "Task is already closed or status is invalid" : "Could not update follow-up" }, error.code === "42501" ? 403 : error.code === "P0002" ? 404 : error.code === "22023" ? 409 : 503);
  return reply({ ok: true });
}
