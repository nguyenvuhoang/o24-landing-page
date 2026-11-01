"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CalendarClock, Plus } from "lucide-react";

type Entry = {
  id: string;
  activity_type: string;
  subject: string;
  description: string | null;
  occurred_at: string;
  next_follow_up_at: string | null;
  created_at: string;
  actor_id: string;
};
type Response = { items: Entry[]; total: number; page: number; pageSize: number };
const format = (date: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
const toDateTimeLocal = (date: Date) => {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
};

export function LeadCustomerActivities({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${leadId}/activities?page=${page}`, {
        credentials: "same-origin", cache: "no-store", signal,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Unable to load activities");
      if (!signal?.aborted) { setData(body as Response); setError(""); }
    } catch (e) {
      if (!signal?.aborted) setError(e instanceof Error ? e.message : "Unable to load activities");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [leadId, page]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const local = (name: string) => {
        const value = String(values.get(name) ?? "");
        return value ? new Date(value).toISOString() : null;
      };
      const res = await fetch(`/api/dashboard/leads/${leadId}/activities`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: values.get("type"),
          subject: values.get("subject"),
          description: values.get("description"),
          occurredAt: local("occurredAt"),
          nextFollowUpAt: local("nextFollowUpAt"),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Unable to save activity");
      form.reset();
      setNotice("Activity recorded.");
      if (page === 1) await load();
      else setPage(1);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save activity");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="crm-panel" aria-labelledby="customer-activities-heading">
      <div className="crm-panel-heading">
        <h2 id="customer-activities-heading"><Activity size={18} aria-hidden="true" /> Customer activities <span className="crm-section-count">{data?.total ?? 0}</span></h2>
        <span className="crm-small crm-muted">Calls, emails, meetings and demos</span>
      </div>
      <div style={{ padding: 22, display: "grid", gap: 22 }}>
        <form onSubmit={submit} style={{ display: "grid", gap: 13 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
            <label className="crm-field">Activity type
              <select className="crm-input" name="type" required defaultValue="CALL">
                {(["CALL", "EMAIL", "MEETING", "DEMO", "NOTE"] as const).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="crm-field">Occurred at
              <input className="crm-input" type="datetime-local" name="occurredAt" required defaultValue={toDateTimeLocal(new Date())} />
            </label>
            <label className="crm-field">Next follow-up (optional)
              <input className="crm-input" type="datetime-local" name="nextFollowUpAt" />
            </label>
          </div>
          <label className="crm-field">Subject
            <input className="crm-input" name="subject" maxLength={200} required placeholder="Discussed O24 API integration requirements" />
          </label>
          <label className="crm-field">Description (optional)
            <textarea className="crm-input" name="description" rows={3} maxLength={5000} placeholder="Conversation summary and agreed next steps" />
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <button className="crm-button crm-button-primary" disabled={saving} type="submit"><Plus size={15} aria-hidden="true" />{saving ? "Saving…" : "Record activity"}</button>
            {notice && <span role="status" className="crm-small">{notice}</span>}
          </div>
        </form>
        {error && <p role="alert" style={{ color: "var(--crm-danger-text)" }}>{error}</p>}
        <div style={{ borderTop: "1px solid hsl(var(--border))", paddingTop: 16 }}>
          {loading && <p className="crm-muted">Loading activities…</p>}
          {!loading && data?.items.length === 0 && <p className="crm-muted">No customer activities recorded yet.</p>}
          {!loading && data?.items.map(entry => (
            <article key={entry.id} style={{ borderBottom: "1px solid hsl(var(--border))", padding: "13px 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <strong>{entry.activity_type}</strong>
                <span className="crm-small crm-muted">{format(entry.occurred_at)}</span>
              </div>
              <p style={{ fontWeight: 600, marginTop: 5 }}>{entry.subject}</p>
              {entry.description && <p style={{ whiteSpace: "pre-wrap", marginTop: 5 }}>{entry.description}</p>}
              {entry.next_follow_up_at && <p className="crm-small crm-muted" style={{ marginTop: 7 }}><CalendarClock size={13} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle" }} /> Follow up: {format(entry.next_follow_up_at)}</p>}
              <details className="crm-disclosure" style={{ marginTop: 6 }}><summary>Technical details</summary><p className="crm-small crm-muted">Activity: {entry.id} · Recorded by: {entry.actor_id}</p></details>
            </article>
          ))}
          {!!data && data.total > data.pageSize && (
            <nav className="crm-pagination" aria-label="Customer activities pagination" style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
              <button type="button" className="crm-button crm-button-secondary" disabled={loading || page <= 1} onClick={() => setPage(n => n - 1)}>Previous</button>
              <span className="crm-small">Page {page} / {Math.ceil(data.total / data.pageSize)}</span>
              <button type="button" className="crm-button crm-button-secondary" disabled={loading || page * data.pageSize >= data.total} onClick={() => setPage(n => n + 1)}>Next</button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
