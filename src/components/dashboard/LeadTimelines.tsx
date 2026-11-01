import {
  Activity,
  MessageSquareText,
  Mail,
  MailCheck,
  Send,
  Eye,
  MousePointer2,
  CircleAlert,
  Clock3,
  ChevronDown,
  History,
} from "lucide-react";
import { dateTime, type Admin } from "@/lib/leads/domain";
import { Status } from "./LeadTable";
import { auditValue, label } from "./presentation";
export type ActivityEntry = {
  id: string;
  actor_name: string;
  actor_id: string | null;
  created_at: string;
  note: string | null;
  changes: Record<string, { before: unknown; after: unknown }>;
};
export type EmailEntry = {
  event_id: string;
  event_type: string;
  received_at: string;
  resend_email_id: string;
};
export function ActivityTimeline({
  entries,
  admins,
}: {
  entries: ActivityEntry[];
  admins: Admin[];
}) {
  if (!entries.length)
    return (
      <div className="crm-timeline-empty">
        <History size={20} aria-hidden="true" />
        <div>
          <h3>No activity yet</h3>
          <p>
            Changes and internal notes will appear here with the author and
            timestamp.
          </p>
        </div>
      </div>
    );
  return (
    <ol className="crm-timeline" aria-label="Lead activity, newest first">
      {entries.map((h) => (
        <li key={h.id}>
          <span className="crm-timeline-marker">
            {h.note ? (
              <MessageSquareText size={16} aria-hidden="true" />
            ) : (
              <Activity size={16} aria-hidden="true" />
            )}
          </span>
          <div className="crm-timeline-body">
            <div className="crm-timeline-heading">
              <p>
                <strong>{h.actor_name}</strong>
                <span>{h.note ? " added a note" : " updated this lead"}</span>
              </p>
              <time dateTime={h.created_at}>{dateTime(h.created_at)}</time>
            </div>
            {h.note && <p className="crm-note">{h.note}</p>}
            {Object.keys(h.changes).length > 0 && (
              <dl className="crm-change-list">
                {Object.entries(h.changes).map(([key, c]) => (
                  <div key={key}>
                    <dt>{label(key)}</dt>
                    <dd>
                      <span className="crm-change-before">
                        {auditValue(key, c.before, admins)}
                      </span>
                      <span aria-label="changed to">→</span>
                      <span className="crm-change-after">
                        {key === "lead_status" &&
                        typeof c.after === "string" ? (
                          <Status value={c.after} />
                        ) : (
                          auditValue(key, c.after, admins)
                        )}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <details className="crm-disclosure">
              <summary>
                <ChevronDown size={13} aria-hidden="true" />
                Audit details
              </summary>
              <dl className="crm-technical">
                <div>
                  <dt>Activity ID</dt>
                  <dd>{h.id}</dd>
                </div>
                <div>
                  <dt>Actor ID</dt>
                  <dd>{h.actor_id || "Removed account"}</dd>
                </div>
              </dl>
              <pre className="crm-audit-json">
                {JSON.stringify(h.changes, null, 2)}
              </pre>
            </details>
          </div>
        </li>
      ))}
    </ol>
  );
}
const emailEvents: Record<
  string,
  { title: string; description: string; icon: typeof Mail; tone: string }
> = {
  "email.sent": {
    title: "Notification sent",
    description: "Resend sent the notification to the internal sales team.",
    icon: Send,
    tone: "neutral",
  },
  "email.delivered": {
    title: "Notification delivered",
    description: "The recipient’s mail server accepted the notification.",
    icon: MailCheck,
    tone: "success",
  },
  "email.opened": {
    title: "Email opened",
    description: "Resend reported an open event for this notification.",
    icon: Eye,
    tone: "neutral",
  },
  "email.clicked": {
    title: "Link clicked",
    description: "Resend reported a link click in this notification.",
    icon: MousePointer2,
    tone: "neutral",
  },
  "email.delivery_delayed": {
    title: "Delivery delayed",
    description:
      "The notification is delayed. Review delivery before following up.",
    icon: Clock3,
    tone: "warning",
  },
  "email.bounced": {
    title: "Email bounced",
    description: "The recipient’s mail server rejected the notification.",
    icon: CircleAlert,
    tone: "danger",
  },
  "email.complained": {
    title: "Spam complaint reported",
    description: "The recipient reported the notification as spam.",
    icon: CircleAlert,
    tone: "danger",
  },
  "email.failed": {
    title: "Delivery failed",
    description: "Resend reported a failure delivering this notification.",
    icon: CircleAlert,
    tone: "danger",
  },
};
export function EmailTimeline({ events }: { events: EmailEntry[] }) {
  if (!events.length)
    return (
      <div className="crm-timeline-empty">
        <Mail size={20} aria-hidden="true" />
        <div>
          <h3>No email events received</h3>
          <p>Delivery events will appear when Resend reports them.</p>
        </div>
      </div>
    );
  return (
    <ol
      className="crm-timeline crm-email-timeline"
      aria-label="Email events, newest received first"
    >
      {events.map((e) => {
        const event = emailEvents[e.event_type] || {
          title: label(e.event_type.replace(/^email\./, "")),
          description: "Event reported by Resend.",
          icon: Mail,
          tone: "neutral",
        };
        const Icon = event.icon;
        return (
          <li key={e.event_id}>
            <span className={`crm-timeline-marker crm-event-${event.tone}`}>
              <Icon size={16} aria-hidden="true" />
            </span>
            <div className="crm-timeline-body">
              <div className="crm-timeline-heading">
                <h3>{event.title}</h3>
                <time dateTime={e.received_at}>{dateTime(e.received_at)}</time>
              </div>
              <p className="crm-event-description">{event.description}</p>
              <details className="crm-disclosure">
                <summary>
                  <ChevronDown size={13} aria-hidden="true" />
                  Technical details
                </summary>
                <dl className="crm-technical">
                  <div>
                    <dt>Event type</dt>
                    <dd>{e.event_type}</dd>
                  </div>
                  <div>
                    <dt>Event ID</dt>
                    <dd>{e.event_id}</dd>
                  </div>
                  <div>
                    <dt>Resend email ID</dt>
                    <dd>{e.resend_email_id}</dd>
                  </div>
                </dl>
              </details>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
