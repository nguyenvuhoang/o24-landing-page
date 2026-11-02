import assert from "node:assert/strict";
import test from "node:test";
import { classifyInternalDestination, classifyJourneyPath } from "../src/lib/analytics/journey";

test("known routes are classified", () => {
  assert.equal(classifyJourneyPath("/security")?.stage, "trust");
  assert.equal(classifyJourneyPath("/demo")?.label, "demo");
  assert.equal(classifyJourneyPath("/developers/guides/workflow-orchestration")?.label, "guides");
});
test("unknown paths and sensitive inputs are not tracked", () => {
  assert.equal(classifyJourneyPath("/dashboard"), null);
  assert.equal(classifyJourneyPath("/api/demo"), null);
  assert.equal(classifyJourneyPath("/demo?email=a@example.com"), null);
  assert.equal(classifyInternalDestination("https://external.test/demo", "https://vknight.io.vn"), null);
});
test("query and fragment are discarded; only allowlisted label is returned", () => {
  const result = classifyInternalDestination("/demo?email=test%40mail.com#submit", "https://vknight.io.vn");
  assert.equal(result?.label, "demo");
  assert.equal(JSON.stringify(result).includes("mail"), false);
});
