import test from "node:test";
import assert from "node:assert/strict";
import { parseFunnelCSV, summarizeFunnel } from "@/lib/analytics/funnel";
test("CSV parser parses aggregate rows and quoted paths", () => {
  const r = parseFunnelCSV('date,event,source,destination,count\n2026-11-02,journey_page_view,,/features,15\n2026-11-02,journey_navigation,"/features","/demo",2\n');
  assert.equal(r.length, 2); assert.equal(r[0].count, 15);
  const s = summarizeFunnel(r); assert.equal(s.stages[1].views, 15); assert.equal(s.navigation[0].count, 2);
});
test("Invalid counts and PII event names rejected", () => {
  assert.throws(() => parseFunnelCSV('date,event,source,destination,count\n2026-11-02,journey_page_view,,/features,-2'));
  assert.throws(() => parseFunnelCSV('date,event,source,destination,count\n2026-11-02,customer_email,,/features,2'));
});
test("Date filters are inclusive", () => {
  const rows = parseFunnelCSV('date,event,source,destination,count\n2026-11-01,demo_request_success,,,1\n2026-11-02,demo_request_success,,,2');
  assert.equal(summarizeFunnel(rows, '2026-11-02', '2026-11-02').demoSuccess, 2);
});
