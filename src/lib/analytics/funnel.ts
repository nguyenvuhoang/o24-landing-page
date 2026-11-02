export const STAGES = ["awareness", "evaluation", "trust", "conversion"] as const;
export type Stage = (typeof STAGES)[number];
export type FunnelRow = { date: string; event: string; source: string; destination: string; count: number };
export type FunnelSummary = { stages: { stage: Stage; views: number }[]; ctaClicks: number; demoSuccess: number; enterpriseSuccess: number; navigation: { source: string; destination: string; count: number }[]; days: { day: string; views: number; conversions: number }[] };

export const PAGE_STAGE: Record<string, Stage> = {
  "/": "awareness",
  "/features": "evaluation",
  "/solutions": "evaluation",
  "/solutions/bank-fintech": "evaluation",
  "/solutions/enterprise": "evaluation",
  "/solutions/developers": "evaluation",
  "/developers": "evaluation",
  "/security": "trust",
  "/enterprise/deployment": "trust",
  "/enterprise/security-review": "trust",
  "/demo": "conversion",
  "/enterprise": "conversion",
};
const EVENTS = new Set(["journey_page_view", "journey_navigation", "solutions_cta_click", "demo_request_success", "enterprise_request_success"]);
function csvRecords(input: string): string[][] {
  const out: string[][] = []; let row: string[] = []; let cell = ""; let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') { if (quoted && input[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell = ""; }
    else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && input[i + 1] === '\n') i++; row.push(cell); if (row.some(x => x.trim())) out.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (quoted) throw new Error("CSV contains an unclosed quoted field");
  row.push(cell); if (row.some(x => x.trim())) out.push(row); return out;
}
export function parseFunnelCSV(input: string): FunnelRow[] {
  if (input.length > 2_000_000) throw new Error("CSV exceeds 2 MB");
  const records = csvRecords(input.replace(/^\uFEFF/, ""));
  const header = records.shift()?.map(x => x.trim().toLowerCase()) ?? [];
  for (const field of ["date", "event", "source", "destination", "count"]) if (!header.includes(field)) throw new Error(`Missing CSV column: ${field}`);
  if (records.length > 10_000) throw new Error("CSV exceeds 10,000 rows");
  return records.map((parts, index) => {
    const value = (name: string) => parts[header.indexOf(name)]?.trim() ?? "";
    const date = value("date"), event = value("event"), source = value("source"), destination = value("destination"), raw = value("count");
    const count = Number(raw);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || !EVENTS.has(event) || !Number.isSafeInteger(count) || count < 0 || count > 10_000_000) throw new Error(`Invalid event/date/count at CSV row ${index + 2}`);
    if (source.length > 120 || destination.length > 120) throw new Error(`Invalid path at CSV row ${index + 2}`);
    return { date, event, source, destination, count };
  });
}
export function summarizeFunnel(rows: FunnelRow[], from?: string, to?: string): FunnelSummary {
  const filtered = rows.filter(r => (!from || r.date >= from) && (!to || r.date <= to));
  const totals = Object.fromEntries(STAGES.map(s => [s, 0])) as Record<Stage, number>;
  let ctaClicks = 0, demoSuccess = 0, enterpriseSuccess = 0;
  const navigation = new Map<string, number>(); const daily = new Map<string, { views: number; conversions: number }>();
  for (const r of filtered) {
    const d = daily.get(r.date) ?? { views: 0, conversions: 0 }; daily.set(r.date, d);
    if (r.event === "journey_page_view") {
      // This counts page-view events, not distinct users or cross-stage cohorts.
      const stage = PAGE_STAGE[r.destination] ?? (STAGES.includes(r.source as Stage) ? r.source as Stage : null);
      if (stage) totals[stage] += r.count;
      d.views += r.count;
    }
    if (r.event === "solutions_cta_click") ctaClicks += r.count;
    if (r.event === "demo_request_success") { demoSuccess += r.count; d.conversions += r.count; }
    if (r.event === "enterprise_request_success") { enterpriseSuccess += r.count; d.conversions += r.count; }
    if (r.event === "journey_navigation") {
      const key = `${r.source} → ${r.destination}`; navigation.set(key, (navigation.get(key) ?? 0) + r.count);
    }
  }
  return {
    stages: STAGES.map(stage => ({ stage, views: totals[stage] })), ctaClicks, demoSuccess, enterpriseSuccess,
    navigation: [...navigation].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, count]) => ({ source: path.split(" → ")[0], destination: path.split(" → ")[1], count })),
    days: [...daily].sort((a, b) => a[0].localeCompare(b[0])).map(([day, values]) => ({ day, ...values }))
  };
}
