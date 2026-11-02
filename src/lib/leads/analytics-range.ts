export const analyticsRanges = [30, 90, 180, 365] as const;
export function analyticsWindow(raw?: string | null, now = new Date()) {
  const days = analyticsRanges.find((n) => String(n) === raw) ?? 30;
  const end = new Date(now);
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCDate(end.getUTCDate() + 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  return { days, start: start.toISOString(), end: end.toISOString() };
}
export type FunnelStage = { status: string; count: number };
export type FunnelMetrics = { total: number; lost: number; stages: FunnelStage[] };
export type ConversionMetrics = {
  total: number;
  won: number;
  lost: number;
  win_rate_percent: number | null;
  lead_to_won_percent: number | null;
  qualification_percent: number | null;
  demo_tasks: number;
  completed_demos: number;
  overdue_tasks: number;
  upcoming_tasks: number;
  daily: { date: string; total: number; won: number; lost: number }[];
};
