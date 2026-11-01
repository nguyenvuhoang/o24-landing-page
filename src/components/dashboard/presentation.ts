import { dateTime, type Admin } from "@/lib/leads/domain";
const labels: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  DEMO_SCHEDULED: "Demo scheduled",
  WON: "Won",
  LOST: "Lost",
  pending: "Pending",
  accepted: "Accepted",
  sent: "Sent",
  delivered: "Delivered",
  delivery_delayed: "Delivery delayed",
  bounced: "Bounced",
  complained: "Complaint",
  failed: "Failed",
  cto: "CTO",
  "tech-lead": "Technical lead",
  developer: "Developer",
  "platform-engineer": "Platform engineer",
  "product-owner": "Product owner",
  other: "Other",
  "api-management": "API management",
  "product-service": "Product service",
  both: "API management & product service",
  cloud: "Cloud",
  "on-premise": "On-premise",
  hybrid: "Hybrid",
  "not-decided": "Not decided",
  exploring: "Exploring",
  "1-3-months": "1–3 months",
  scheduled: "Scheduled",
  yes: "Yes",
  no: "No",
  "not-sure": "Not sure",
  lead_status: "Lead status",
  assigned_admin: "Assigned administrator",
  last_contacted_at: "Last contacted",
  demo_scheduled_at: "Demo scheduled",
  updated_at: "Updated",
};
export function label(value: string | null | undefined) {
  return value ? labels[value] || value.replaceAll("_", " ") : "Not provided";
}
export function initials(value: string) {
  return (
    value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((v) => v[0])
      .join("")
      .toUpperCase() || "—"
  );
}
export function auditValue(key: string, value: unknown, admins: Admin[]) {
  if (value === null || value === undefined) return "Not set";
  if (key === "assigned_admin")
    return (
      admins.find((a) => a.user_id === value)?.display_name ||
      "Former administrator"
    );
  if (
    key.endsWith("_at") &&
    typeof value === "string" &&
    Number.isFinite(Date.parse(value))
  )
    return dateTime(value);
  return label(String(value));
}
