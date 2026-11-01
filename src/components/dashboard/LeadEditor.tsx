"use client";
import {
  Save,
  Route,
  CalendarClock,
  NotebookPen,
  ShieldCheck,
} from "lucide-react";
import { label } from "./presentation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { statuses, type Lead, type Admin } from "@/lib/leads/domain";
export function LeadEditor({ lead, admins }: { lead: Lead; admins: Admin[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const current = statuses.indexOf(lead.lead_status);
  const allowed = statuses.filter(
    (s, i) =>
      s === lead.lead_status ||
      s === "LOST" ||
      (current < 4 && i === current + 1),
  );
  const input = "crm-input";
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = event.currentTarget;
    const f = new FormData(form);
    const utc = (k: string) =>
      f.get(k) ? new Date(String(f.get(k)) + ":00Z").toISOString() : null;
    const changes: Record<string, unknown> = {
      expectedUpdatedAt: lead.updated_at,
    };
    if (f.get("status") !== lead.lead_status) changes.status = f.get("status");
    if ((f.get("assignedAdmin") || null) !== lead.assigned_admin)
      changes.assignedAdmin = f.get("assignedAdmin") || null;
    if (String(f.get("lastContactedAt")) !== local(lead.last_contacted_at))
      changes.lastContactedAt = utc("lastContactedAt");
    if (String(f.get("demoScheduledAt")) !== local(lead.demo_scheduled_at))
      changes.demoScheduledAt = utc("demoScheduledAt");
    if (String(f.get("note") || "").trim())
      changes.note = String(f.get("note")).trim();
    if (Object.keys(changes).length === 1) {
      setMessage("No changes to save.");
      setPending(false);
      return;
    }
    try {
      const result = await fetch(`/api/dashboard/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const body = await result.json();
      if (!result.ok) throw new Error(body.error || "Unable to save");
      form.reset();
      setMessage("Changes saved.");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save. Try again.");
    } finally {
      setPending(false);
    }
  }
  const local = (v: string | null) =>
    v ? new Date(v).toISOString().slice(0, 16) : "";
  return (
    <form onSubmit={save} className="crm-panel crm-editor">
      <div className="crm-panel-heading">
        <h2>
          <Route size={18} aria-hidden="true" />
          Lead management
        </h2>
      </div>
      <div className="crm-editor-content">
        <fieldset disabled={pending} className="crm-editor-fields">
          <legend className="sr-only">Manage this lead</legend>
          <div className="crm-editor-section">
            <h3>Pipeline & ownership</h3>
            <label className="crm-field">
              Lead status
              <select
                name="status"
                defaultValue={lead.lead_status}
                className={input}
              >
                {allowed.map((s) => (
                  <option key={s} value={s}>
                    {label(s)}
                  </option>
                ))}
              </select>
            </label>
            <p className="crm-field-help">
              Move to the next stage, or mark this lead as lost. All changes
              stay in its history.
            </p>
            <label className="crm-field">
              Assigned administrator
              <select
                name="assignedAdmin"
                defaultValue={lead.assigned_admin || ""}
                className={input}
              >
                <option value="">Unassigned</option>
                {admins.map((a) => (
                  <option key={a.user_id} value={a.user_id}>
                    {a.display_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="crm-editor-section">
            <h3>
              <CalendarClock size={15} aria-hidden="true" />
              Contact & scheduling
            </h3>
            <label className="crm-field">
              Last contacted
              <input
                name="lastContactedAt"
                type="datetime-local"
                defaultValue={local(lead.last_contacted_at)}
                className={input}
              />
            </label>
            <label className="crm-field">
              Demo scheduled
              <input
                name="demoScheduledAt"
                type="datetime-local"
                defaultValue={local(lead.demo_scheduled_at)}
                className={input}
              />
            </label>
            <p className="crm-field-help">
              All dates are in UTC. Set a demo date when moving to Demo
              scheduled.
            </p>
          </div>
          <div className="crm-editor-section">
            <h3>
              <NotebookPen size={15} aria-hidden="true" />
              Internal note
            </h3>
            <label className="crm-field">
              <span className="sr-only">Add internal note</span>
              <textarea
                name="note"
                maxLength={5000}
                rows={4}
                placeholder="Add context, a contact activity or next steps…"
                className={input}
              />
            </label>
            <p className="crm-field-help">
              Only administrators can see these notes. Your name and the time
              are recorded.
            </p>
          </div>
          <button
            className="crm-button crm-button-primary crm-save"
            disabled={pending}
          >
            <Save size={16} aria-hidden="true" />
            {pending ? "Saving…" : "Save changes"}
          </button>
        </fieldset>
        <p
          role="status"
          aria-live="polite"
          className={`crm-save-feedback ${message ? "has-message" : ""}`}
        >
          {message}
        </p>
        <p className="crm-editor-footer">
          <ShieldCheck size={14} aria-hidden="true" />
          Original submission stays unchanged
        </p>
      </div>
    </form>
  );
}
