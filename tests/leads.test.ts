import { test } from "node:test";
import assert from "node:assert/strict";
import {
  accessStatus,
  parseFilters,
  parseChange,
  applyFilters,
} from "../src/lib/leads/domain";

test("missing identity is 401; membership is required even for authenticated users", () => {
  assert.equal(accessStatus(null, false), 401);
  assert.equal(accessStatus({ id: "u" }, false), 403);
  assert.equal(accessStatus({ id: "u" }, true), 200);
});
test("pagination is bounded and filters cannot inject PostgREST syntax", () => {
  const f = parseFilters(
    new URLSearchParams(
      "page=2&status=QUALIFIED&q=Jane,or(email.neq.x)&from=2026-10-01&to=2026-10-31&sort=oldest",
    ),
  );
  assert.equal(f.offset, 25);
  assert.equal(f.ascending, true);
  assert.equal(f.search.includes(","), false);
  assert.equal(f.before, "2026-11-01T00:00:00.000Z");
  assert.throws(() => parseFilters(new URLSearchParams("page=-2")));
  assert.throws(() => parseFilters(new URLSearchParams("from=2026-02-30")));
  assert.throws(() =>
    parseFilters(new URLSearchParams("from=2026-11-01&to=2026-10-01")),
  );
  assert.throws(() => parseFilters(new URLSearchParams("status=ADMIN")));
});
test("query emits server-side pagination and exact filter bounds", () => {
  const calls: unknown[][] = [];
  const query = new Proxy(
    {},
    {
      get:
        (_, name) =>
        (...args: unknown[]) => {
          calls.push([name, ...args]);
          return query;
        },
    },
  );
  applyFilters(
    query as never,
    parseFilters(
      new URLSearchParams(
        "page=3&status=LOST&interest=both&deployment=hybrid&to=2026-10-31",
      ),
    ),
  );
  assert.ok(calls.some((c) => JSON.stringify(c) === '["range",50,74]'));
  assert.ok(
    calls.some((c) => JSON.stringify(c) === '["eq","lead_status","LOST"]'),
  );
  assert.ok(
    calls.some(
      (c) =>
        JSON.stringify(c) ===
        '["lt","submitted_at","2026-11-01T00:00:00.000Z"]',
    ),
  );
});
test("mutation validates status, dates, assignment and note length; rejects original fields", () => {
  assert.equal(
    parseChange({
      status: "LOST",
      note: "Not a fit",
      expectedUpdatedAt: "2026-10-01T00:00:00Z",
    }).status,
    "LOST",
  );
  for (const body of [
    { status: "invalid" },
    { email: "replace@example.com" },
    { assignedAdmin: "bad" },
    { note: "x".repeat(5001) },
    { demoScheduledAt: "bad" },
    {},
  ])
    assert.throws(() => parseChange(body));
});
