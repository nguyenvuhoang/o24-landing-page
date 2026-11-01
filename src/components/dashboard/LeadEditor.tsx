"use client";
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
  const input = "mt-2 w-full rounded-md border bg-background p-2.5 text-sm";
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
    <form onSubmit={save} className="space-y-5">
      <fieldset disabled={pending} className="space-y-5">
        <legend className="font-semibold mb-4">Manage this lead</legend>
        <label className="block text-sm">
          Lead status
          <select
            name="status"
            defaultValue={lead.lead_status}
            className={input}
          >
            {allowed.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <p className="text-xs text-muted-foreground">
          NEW → CONTACTED → QUALIFIED → DEMO SCHEDULED → WON. Mark LOST at any
          stage; history is retained.
        </p>
        <label className="block text-sm">
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
        <label className="block text-sm">
          Last contacted (UTC)
          <input
            name="lastContactedAt"
            type="datetime-local"
            defaultValue={local(lead.last_contacted_at)}
            className={input}
          />
        </label>
        <label className="block text-sm">
          Demo scheduled (UTC)
          <input
            name="demoScheduledAt"
            type="datetime-local"
            defaultValue={local(lead.demo_scheduled_at)}
            className={input}
          />
        </label>
        <label className="block text-sm">
          Add internal note
          <textarea
            name="note"
            maxLength={5000}
            rows={4}
            placeholder="Record context, a contact activity or next steps…"
            className={input}
          />
        </label>
        <p className="text-xs text-muted-foreground">
          Notes are appended to the history with your identity and the time of
          the change.
        </p>
        <button className="rounded-md bg-primary text-primary-foreground w-full p-3 font-semibold disabled:opacity-50">
          {pending ? "Saving…" : "Save changes"}
        </button>
      </fieldset>
      <p role="status" aria-live="polite" className="text-sm">
        {message}
      </p>
    </form>
  );
}
