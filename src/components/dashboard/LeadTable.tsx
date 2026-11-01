import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  Clock3,
  Inbox,
  UserRound,
} from "lucide-react";
import { dateTime, type Lead, type Admin } from "@/lib/leads/domain";
import { label, initials } from "./presentation";
export function Status({ value }: { value: string }) {
  const tone = ["WON", "delivered"].includes(value)
    ? "success"
    : ["LOST", "failed", "bounced", "complained"].includes(value)
      ? "danger"
      : ["DEMO_SCHEDULED", "delivery_delayed"].includes(value)
        ? "warning"
        : ["CONTACTED", "QUALIFIED", "NEW"].includes(value)
          ? "accent"
          : "neutral";
  const Icon =
    tone === "success"
      ? Check
      : tone === "danger"
        ? CircleAlert
        : tone === "warning"
          ? Clock3
          : null;
  return (
    <span className={`crm-status crm-status-${tone}`}>
      {Icon ? (
        <Icon size={12} aria-hidden="true" />
      ) : (
        <span className="crm-status-dot" aria-hidden="true" />
      )}
      {label(value)}
    </span>
  );
}
export function LeadTable({
  leads,
  admins = [],
}: {
  leads: Lead[];
  admins?: Admin[];
}) {
  if (!leads.length)
    return (
      <div className="crm-empty">
        <span className="crm-empty-icon">
          <Inbox size={26} aria-hidden="true" />
        </span>
        <h2>No leads to display</h2>
        <p>
          New demo requests appear here automatically. Try adjusting your search
          or filters to find an existing lead.
        </p>
        <Link
          href="/dashboard/leads"
          className="crm-button crm-button-secondary"
        >
          Clear filters
        </Link>
      </div>
    );
  return (
    <div
      className="crm-table-scroll"
      role="region"
      aria-label="Enterprise demo requests, scroll horizontally to view all columns"
      tabIndex={0}
    >
      <table className="crm-table">
        <caption className="sr-only">
          Enterprise demo requests. Submission dates are in UTC.
        </caption>
        <thead>
          <tr>
            {[
              "Company",
              "Contact",
              "Solution interest",
              "Lead status",
              "Email delivery",
              "Assigned to",
              "Submitted · UTC",
              "",
            ].map((t, i) => (
              <th key={i} scope="col">
                {t || <span className="sr-only">Actions</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const owner = admins.find(
              (a) => a.user_id === l.assigned_admin,
            )?.display_name;
            return (
              <tr key={l.id}>
                <td className="crm-company-cell">
                  <div className="crm-cell-company">
                    <span className="crm-company-avatar" aria-hidden="true">
                      {initials(l.company)}
                    </span>
                    <Link
                      href={`/dashboard/leads/${l.id}`}
                      className="crm-company-link"
                    >
                      {l.company}
                    </Link>
                  </div>
                </td>
                <td>
                  <p className="crm-cell-primary">
                    {l.name}
                    <span className="crm-contact-role">{label(l.role)}</span>
                  </p>
                  <p className="crm-cell-secondary break-all">{l.email}</p>
                </td>
                <td>
                  <p className="crm-cell-primary">{label(l.interest)}</p>
                  <p className="crm-cell-secondary">{label(l.deployment)}</p>
                </td>
                <td>
                  <Status value={l.lead_status} />
                </td>
                <td>
                  <Status value={l.email_status} />
                </td>
                <td>
                  <span className={`crm-owner ${owner ? "" : "crm-muted"}`}>
                    <UserRound size={15} aria-hidden="true" />
                    {owner || "Unassigned"}
                  </span>
                </td>
                <td>
                  <time
                    dateTime={l.submitted_at}
                    title={dateTime(l.submitted_at)}
                    className="crm-date"
                  >
                    <span>
                      {new Date(l.submitted_at).toLocaleDateString("en-GB", {
                        timeZone: "UTC",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>
                      {new Date(l.submitted_at).toLocaleTimeString("en-GB", {
                        timeZone: "UTC",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </time>
                </td>
                <td className="crm-action-cell">
                  <Link
                    href={`/dashboard/leads/${l.id}`}
                    className="crm-table-action"
                    aria-label={`View request from ${l.name}`}
                  >
                    View
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
