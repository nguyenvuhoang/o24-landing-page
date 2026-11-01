import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  CalendarDays,
  UserRound,
  FileText,
  Activity,
  MailCheck,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { dateTime, type Lead, type Admin } from "@/lib/leads/domain";
import { label } from "./presentation";
import { Status } from "./LeadTable";
import { LeadEditor } from "./LeadEditor";
import { LeadPipeline } from "./LeadPipeline";
import {
  ActivityTimeline,
  EmailTimeline,
  type ActivityEntry,
  type EmailEntry,
} from "./LeadTimelines";
export type LeadDetailViewProps = {
  lead: Lead;
  directory: Admin[];
  history: ActivityEntry[];
  historyCount: number;
  events: EmailEntry[];
  eventCount: number;
  historyPage: number;
  emailPage: number;
};
export function LeadDetailView({
  lead: l,
  directory,
  history,
  historyCount,
  events,
  eventCount,
  historyPage: hp,
  emailPage: ep,
}: LeadDetailViewProps) {
  const pager = (key: string, n: number, total: number) => (
    <nav
      aria-label={`${key} pagination`}
      className="crm-pagination crm-timeline-pagination"
    >
      <span>
        Page <strong>{n}</strong> of {Math.max(1, Math.ceil(total / 25))}
      </span>
      <div>
        {n > 1 && (
          <Link
            className="crm-button crm-button-secondary"
            href={`?historyPage=${key === "History" ? n - 1 : hp}&emailPage=${key === "Email" ? n - 1 : ep}`}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Previous
          </Link>
        )}
        {n * 25 < total && (
          <Link
            className="crm-button crm-button-secondary"
            href={`?historyPage=${key === "History" ? n + 1 : hp}&emailPage=${key === "Email" ? n + 1 : ep}`}
          >
            Next
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
  const contact = [
    ["Contact name", l.name],
    ["Role", label(l.role)],
    ["Work email", l.email],
    ["Company", l.company],
  ];
  const request = [
    ["Solution interest", label(l.interest)],
    ["Deployment", label(l.deployment)],
    ["Evaluation timeline", label(l.timeline)],
    ["Open-source interest", label(l.open_source)],
  ];
  return (
    <div className="crm-page">
      <Link className="crm-back-link" href="/dashboard/leads">
        <ArrowLeft size={15} aria-hidden="true" />
        All enterprise leads
      </Link>
      <header className="crm-detail-header">
        <div className="crm-detail-company">
          <span className="crm-detail-avatar">
            <Building2 size={27} aria-hidden="true" />
          </span>
          <div>
            <h1>{l.company}</h1>
            <div className="crm-contact-header">
              <span>{l.name}</span>
              <span className="crm-meta-divider" />
              <span>{label(l.role)}</span>
              <a href={`mailto:${l.email}`}>
                <Mail size={14} aria-hidden="true" />
                {l.email}
              </a>
            </div>
          </div>
        </div>
        <div className="crm-detail-header-meta">
          <Status value={l.lead_status} />
          <span>
            <CalendarDays size={14} aria-hidden="true" />
            Submitted {dateTime(l.submitted_at)}
          </span>
        </div>
      </header>
      <LeadPipeline status={l.lead_status} />
      <div className="crm-detail-grid">
        <section
          className="crm-panel crm-detail-customer"
          aria-labelledby="request-heading"
        >
          <div className="crm-panel-heading">
            <h2 id="request-heading">
              <UserRound size={18} aria-hidden="true" />
              Customer information
            </h2>
            <span className="crm-record-label">Original request</span>
          </div>
          <div className="crm-record-section">
            <dl className="crm-record-grid">
              {contact.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="crm-record-section">
            <h3>
              <FileText size={15} aria-hidden="true" />
              Demo requirements
            </h3>
            <dl className="crm-record-grid">
              {request.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="crm-request-message">
              <h4>Message from the prospect</h4>
              <p>{l.message}</p>
            </div>
          </div>
          <details className="crm-disclosure crm-record-metadata">
            <summary>
              <ChevronDown size={14} aria-hidden="true" />
              Request details
            </summary>
            <dl className="crm-technical">
              <div>
                <dt>Request ID</dt>
                <dd>{l.id}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{dateTime(l.submitted_at)}</dd>
              </div>
            </dl>
          </details>
        </section>
        <aside className="crm-management-panel">
          <LeadEditor key={l.updated_at} lead={l} admins={directory} />
        </aside>
        <section
          className="crm-panel crm-detail-activity"
          aria-labelledby="activity-heading"
        >
          <div className="crm-panel-heading">
            <h2 id="activity-heading">
              <Activity size={18} aria-hidden="true" />
              Activity & notes
              <span className="crm-section-count">{historyCount}</span>
            </h2>
            <span className="crm-small crm-muted">Newest first</span>
          </div>
          <div className="crm-timeline-intro">
            <p>Every update is recorded with its author and timestamp.</p>
            <span>Last updated {dateTime(l.updated_at)}</span>
          </div>
          <ActivityTimeline entries={history} admins={directory} />
          {pager("History", hp, historyCount)}
        </section>
        <section
          className="crm-panel crm-detail-email"
          aria-labelledby="email-heading"
        >
          <div className="crm-panel-heading">
            <h2 id="email-heading">
              <MailCheck size={18} aria-hidden="true" />
              Email delivery
              <span className="crm-section-count">{eventCount}</span>
            </h2>
            <Status value={l.email_status} />
          </div>
          <div className="crm-email-summary">
            <p>Internal sales notification</p>
            <span>Delivery status updated {dateTime(l.email_status_at)}</span>
            <p className="crm-small crm-muted">
              Events are ordered by webhook receipt time, newest first.
              “Delivered” confirms receipt by the mail server.
            </p>
            <details className="crm-disclosure">
              <summary>
                <ChevronDown size={13} aria-hidden="true" />
                Notification details
              </summary>
              <dl className="crm-technical">
                <div>
                  <dt>Resend email ID</dt>
                  <dd>{l.resend_email_id || "No notification ID recorded"}</dd>
                </div>
              </dl>
            </details>
          </div>
          <EmailTimeline events={events} />
          {pager("Email", ep, eventCount)}
        </section>
      </div>
    </div>
  );
}
