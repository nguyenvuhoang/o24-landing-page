"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, CheckCircle2, XCircle, Plus } from "lucide-react";

type Task = { id: string; lead_id: string; kind: string; title: string; description: string | null; due_at: string; ends_at: string | null; status: string; assigned_admin: string | null; created_at: string; completed_at: string | null };
type Result = { items: Task[]; total: number; page: number; pageSize: number };
const filters = ["upcoming", "overdue", "completed", "cancelled", "all"] as const;
const kinds = ["FOLLOW_UP", "CALL", "EMAIL", "MEETING", "DEMO"] as const;
const fmt = (v: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));
const localValue = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export function FollowUpWorkspace({ initialLeadId = "" }: { initialLeadId?: string }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("upcoming");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Result | null>(null);
  const [kind, setKind] = useState<(typeof kinds)[number]>("FOLLOW_UP");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(0);
  const [defaultDueAt, setDefaultDueAt] = useState("");
  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const query = new URLSearchParams({ filter, page: String(page) });
      if (initialLeadId) query.set("leadId", initialLeadId);
      const r = await fetch(`/api/dashboard/follow-ups?${query}`, { credentials: "same-origin", cache: "no-store", signal });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || "Failed to load tasks");
      if (!signal?.aborted) {
        setData(body as Result);
        setError("");
        const fetchedAt = Date.now();
        setNow(fetchedAt);
        setDefaultDueAt(localValue(new Date(fetchedAt + 3600000)));
      }
    } catch (e) { if (!signal?.aborted) setError(e instanceof Error ? e.message : "Failed to load tasks"); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, [filter, page, initialLeadId]);
  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ filter, page: String(page) });
    if (initialLeadId) query.set("leadId", initialLeadId);

    fetch(`/api/dashboard/follow-ups?${query}`, {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Failed to load tasks");
        return body as Result;
      })
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setError("");
        const fetchedAt = Date.now();
        setNow(fetchedAt);
        setDefaultDueAt(localValue(new Date(fetchedAt + 3600000)));
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Failed to load tasks");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filter, page, initialLeadId]);
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form);
    setBusy(true); setError(""); setNotice("");
    try {
      const leadId = initialLeadId || String(fd.get("leadId") || "");
      const dueAt = new Date(String(fd.get("dueAt"))).toISOString();
      const endsValue = String(fd.get("endsAt") || "");
      const endsAt = endsValue ? new Date(endsValue).toISOString() : null;
      const r = await fetch("/api/dashboard/follow-ups", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, kind, title: String(fd.get("title") || ""), description: String(fd.get("description") || ""), dueAt, endsAt }) });
      const body = await r.json(); if (!r.ok) throw new Error(body.error || "Unable to create task");
      form.reset(); setKind("FOLLOW_UP"); setNotice("Task created.");
      setLoading(true);
      if (filter !== "all") { setFilter("all"); setPage(1); } else if (page !== 1) setPage(1); else await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create task"); }
    finally { setBusy(false); }
  }
  async function closeTask(id: string, status: "COMPLETED" | "CANCELLED") {
    setBusy(true); setError(""); setNotice("");
    try {
      const r = await fetch(`/api/dashboard/follow-ups/${id}`, { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const body = await r.json(); if (!r.ok) throw new Error(body.error || "Unable to update task");
      setNotice(`Task ${status.toLowerCase()}.`); setLoading(true); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update task"); }
    finally { setBusy(false); }
  }
  return <div className="crm-page">
    {!initialLeadId && <header className="crm-page-header"><div><h1>Follow-ups & Demo Scheduling</h1><p>Track upcoming meetings, overdue actions and completed customer tasks.</p></div></header>}
    <section className="crm-panel">
      <div className="crm-panel-heading"><h2><Plus size={18} /> Schedule a task</h2></div>
      <form onSubmit={create} style={{ padding: 22, display: "grid", gap: 14 }}>
        <fieldset disabled={busy} style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14 }}>
            {!initialLeadId && <label className="crm-field">Lead ID<input className="crm-input" name="leadId" placeholder="Paste lead UUID" required /></label>}
            <label className="crm-field">Task type<select className="crm-input" name="kind" value={kind} onChange={e => setKind(e.target.value as typeof kind)}>{kinds.map(k => <option key={k} value={k}>{k.replaceAll("_", " ")}</option>)}</select></label>
            <label className="crm-field">Scheduled date & time<input className="crm-input" type="datetime-local" name="dueAt" required defaultValue={defaultDueAt} /></label>
            {kind === "DEMO" && <label className="crm-field">Demo ends at<input className="crm-input" type="datetime-local" name="endsAt" required /></label>}
          </div>
          <label className="crm-field">Title<input className="crm-input" name="title" required maxLength={200} placeholder="Follow up on O24 integration requirements" /></label>
          <label className="crm-field">Details<textarea className="crm-input" name="description" rows={2} maxLength={5000} placeholder="Agenda, meeting link or agreed next steps" /></label>
          <button type="submit" className="crm-button crm-button-primary" style={{ justifySelf: "start" }}><Plus size={15} /> {busy ? "Saving…" : "Create task"}</button>
        </fieldset>
      </form>
    </section>
    <section className="crm-panel">
      <div className="crm-panel-heading"><h2><CalendarClock size={18} /> Scheduled tasks <span className="crm-section-count">{data?.total ?? 0}</span></h2></div>
      <div style={{ padding: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>{filters.map(f => <button key={f} type="button" onClick={() => { if (f !== filter) { setLoading(true); setFilter(f); setPage(1); } }} className={`crm-button ${filter === f ? "crm-button-primary" : "crm-button-secondary"}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}</div>
      {error && <p role="alert" style={{ padding: "0 20px", color: "var(--crm-danger-text)" }}>{error}</p>}
      {notice && <p role="status" style={{ padding: "0 20px" }}>{notice}</p>}
      {loading ? <p style={{ padding: 22 }}>Loading tasks…</p> : data?.items.length === 0 ? <p style={{ padding: 22 }}>No matching tasks.</p> :
        <div style={{ display: "grid", gap: 0 }}>{data?.items.map(t => <article key={t.id} style={{ padding: "18px 22px", borderTop: "1px solid hsl(var(--border))", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 5, flex: "1 1 320px" }}>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}><strong>{t.title}</strong><span className="crm-status crm-status-neutral">{t.kind}</span><span className={`crm-status ${t.status === "COMPLETED" ? "crm-status-success" : t.status === "CANCELLED" ? "crm-status-neutral" : new Date(t.due_at).getTime() < now ? "crm-status-danger" : "crm-status-accent"}`}>{t.status === "OPEN" && new Date(t.due_at).getTime() < now ? "OVERDUE" : t.status}</span></div>
            <span className="crm-small crm-muted">{fmt(t.due_at)}{t.ends_at ? ` – ${fmt(t.ends_at)}` : ""}</span>
            {t.description && <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{t.description}</p>}
            <Link className="crm-back-link" href={`/dashboard/leads/${t.lead_id}`}>View lead</Link>
          </div>
          {t.status === "OPEN" && <div style={{ display: "flex", gap: 8, alignItems: "start", flexWrap: "wrap" }}><button disabled={busy} className="crm-button crm-button-primary" onClick={() => void closeTask(t.id, "COMPLETED")}><CheckCircle2 size={15} /> Complete</button><button disabled={busy} className="crm-button crm-button-secondary" onClick={() => void closeTask(t.id, "CANCELLED")}><XCircle size={15} /> Cancel</button></div>}
        </article>)}</div>}
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "end", padding: 18 }}><span className="crm-small crm-muted">Page {page} / {Math.max(1, Math.ceil((data?.total ?? 0) / 25))}</span><button className="crm-button crm-button-secondary" disabled={loading || page <= 1} onClick={() => { setLoading(true); setPage(p => p - 1); }}>Previous</button><button className="crm-button crm-button-secondary" disabled={loading || page * 25 >= (data?.total ?? 0)} onClick={() => { setLoading(true); setPage(p => p + 1); }}>Next</button></div>
    </section>
  </div>;
}
