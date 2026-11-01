export const statuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "DEMO_SCHEDULED",
  "WON",
  "LOST",
] as const;
export const interests = ["api-management", "product-service", "both"];
export const deployments = ["cloud", "on-premise", "hybrid", "not-decided"];
export type LeadStatus = (typeof statuses)[number];
export function accessStatus(user: { id: string } | null, admin: boolean) {
  return !user ? 401 : admin ? 200 : 403;
}
export const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function day(value: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  )
    throw new Error("Invalid date");
  return value;
}
export function parseFilters(p: URLSearchParams) {
  const page = Number(p.get("page") || 1);
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000)
    throw new Error("Invalid page");
  const choice = (key: string, values: readonly string[]) => {
    const v = p.get(key) || "";
    if (v && !values.includes(v)) throw new Error(`Invalid ${key}`);
    return v;
  };
  const from = p.get("from") ? day(p.get("from")!) : "";
  const to = p.get("to") ? day(p.get("to")!) : "";
  if (from && to && from > to)
    throw new Error("Start date must precede end date");
  return {
    page,
    offset: (page - 1) * 25,
    search: (p.get("q") || "")
      .slice(0, 160)
      .replace(/[^\p{L}\p{N} @.+-]/gu, " ")
      .trim(),
    status: choice("status", statuses),
    interest: choice("interest", interests),
    deployment: choice("deployment", deployments),
    from,
    before: to ? new Date(Date.parse(to) + 86400000).toISOString() : "",
    ascending: choice("sort", ["newest", "oldest"]) === "oldest",
  };
}
export type Filters = ReturnType<typeof parseFilters>;
type Query = {
  eq(k: string, v: string): Query;
  gte(k: string, v: string): Query;
  lt(k: string, v: string): Query;
  or(v: string): Query;
  order(k: string, v: { ascending: boolean }): Query;
  range(a: number, b: number): Query;
};
export function applyFilters<T>(query: T, f: Filters): T {
  let q = query as Query;
  if (f.search)
    q = q.or(
      `name.ilike.*${f.search}*,email.ilike.*${f.search}*,company.ilike.*${f.search}*`,
    );
  for (const [key, v] of [
    ["lead_status", f.status],
    ["interest", f.interest],
    ["deployment", f.deployment],
  ])
    if (v) q = q.eq(key, v);
  if (f.from) q = q.gte("submitted_at", f.from);
  if (f.before) q = q.lt("submitted_at", f.before);
  return q
    .order("submitted_at", { ascending: f.ascending })
    .order("id", { ascending: f.ascending })
    .range(f.offset, f.offset + 24) as T;
}
export type LeadChange = {
  status?: LeadStatus;
  assignedAdmin?: string | null;
  note?: string;
  lastContactedAt?: string | null;
  demoScheduledAt?: string | null;
  expectedUpdatedAt: string;
};
export function parseChange(value: unknown): LeadChange {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid change");
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).some(
      (k) =>
        ![
          "status",
          "assignedAdmin",
          "note",
          "lastContactedAt",
          "demoScheduledAt",
          "expectedUpdatedAt",
        ].includes(k),
    )
  )
    throw new Error("Unknown field");
  if (
    typeof v.expectedUpdatedAt !== "string" ||
    !Number.isFinite(Date.parse(v.expectedUpdatedAt))
  )
    throw new Error("Reload this lead before saving");
  if (v.status !== undefined && !statuses.includes(v.status as LeadStatus))
    throw new Error("Invalid status");
  if (
    v.assignedAdmin !== undefined &&
    v.assignedAdmin !== null &&
    (typeof v.assignedAdmin !== "string" || !uuid.test(v.assignedAdmin))
  )
    throw new Error("Invalid admin");
  if (
    v.note !== undefined &&
    (typeof v.note !== "string" || !v.note.trim() || v.note.length > 5000)
  )
    throw new Error("Notes must contain 1–5000 characters");
  for (const k of ["lastContactedAt", "demoScheduledAt"])
    if (
      v[k] !== undefined &&
      v[k] !== null &&
      (typeof v[k] !== "string" || !Number.isFinite(Date.parse(v[k] as string)))
    )
      throw new Error("Invalid activity date");
  if (Object.keys(v).filter((k) => k !== "expectedUpdatedAt").length === 0)
    throw new Error("No changes provided");
  return v as LeadChange;
}
export type Lead = {
  id: string;
  submitted_at: string;
  name: string;
  email: string;
  company: string;
  role: string;
  interest: string;
  deployment: string;
  message: string;
  timeline: string | null;
  open_source: string | null;
  email_status: string;
  email_status_at: string | null;
  resend_email_id: string | null;
  lead_status: LeadStatus;
  assigned_admin: string | null;
  last_contacted_at: string | null;
  demo_scheduled_at: string | null;
  updated_at: string;
};
export type Admin = { user_id: string; display_name: string };
export type History = {
  id: string;
  actor_id: string | null;
  created_at: string;
  changes: Record<string, unknown>;
  note: string | null;
};
export function dateTime(value: string | null) {
  return value
    ? new Date(value).toLocaleString("en-GB", {
        timeZone: "UTC",
        dateStyle: "medium",
        timeStyle: "short",
      }) + " UTC"
    : "—";
}
