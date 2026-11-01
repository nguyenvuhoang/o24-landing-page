import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { applyFilters, parseFilters, parseChange, uuid } from "./domain";
type Session = { db: SupabaseClient; status: number };
export function leadApi(session: () => Promise<Session>) {
  const response = (body: unknown, status = 200) =>
    NextResponse.json(body, {
      status,
      headers: { "Cache-Control": "private, no-store" },
    });
  return {
    async list(request: Request) {
      const { db, status } = await session();
      if (status !== 200)
        return response(
          {
            error:
              status === 401
                ? "Authentication required"
                : "Admin access required",
          },
          status,
        );
      let f;
      try {
        f = parseFilters(new URL(request.url).searchParams);
      } catch (e) {
        return response(
          { error: e instanceof Error ? e.message : "Invalid filters" },
          400,
        );
      }
      const { data, count, error } = await applyFilters(
        db.from("enterprise_leads").select("*", { count: "exact" }),
        f,
      );
      if (error) return response({ error: "Unable to load leads" }, 503);
      return response({
        leads: data,
        total: count,
        page: f.page,
        pageSize: 25,
      });
    },
    async update(request: Request, id: string) {
      const { db, status } = await session();
      if (status !== 200)
        return response(
          {
            error:
              status === 401
                ? "Authentication required"
                : "Admin access required",
          },
          status,
        );
      if (request.headers.get("origin") !== new URL(request.url).origin)
        return response({ error: "Invalid request origin" }, 403);
      if (!uuid.test(id)) return response({ error: "Invalid lead ID" }, 400);
      // Bound the actual streamed body, including requests without Content-Length.
      const reader = request.body?.getReader();
      if (!reader) return response({ error: "Missing body" }, 400);
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 24000) {
          await reader.cancel();
          return response({ error: "Request too large" }, 413);
        }
        chunks.push(value);
      }
      let change;
      try {
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const c of chunks) {
          bytes.set(c, offset);
          offset += c.length;
        }
        change = parseChange(JSON.parse(new TextDecoder().decode(bytes)));
      } catch (e) {
        return response(
          { error: e instanceof Error ? e.message : "Invalid change" },
          400,
        );
      }
      const { error } = await db.rpc("update_enterprise_lead", {
        p_id: id,
        p_change: change,
      });
      if (error) {
        const status =
          error.code === "40001"
            ? 409
            : error.code === "P0002"
              ? 404
              : error.code === "42501"
                ? 403
                : ["22023", "23514", "22P02", "22007", "22008"].includes(
                      error.code,
                    )
                  ? 400
                  : 503;
        return response(
          {
            error:
              status === 409
                ? "This lead changed. Reload before saving."
                : status === 400
                  ? "Invalid change. Follow the pipeline and provide a demo date when scheduling."
                  : status === 404
                    ? "Lead not found"
                    : "Unable to update lead",
          },
          status,
        );
      }
      return response({ ok: true });
    },
  };
}
