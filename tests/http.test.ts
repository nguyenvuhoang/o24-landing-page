import { test } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { Webhook } from "svix";
import { POST as submit } from "../src/app/api/demo/route";
import { POST as webhook } from "../src/app/api/webhooks/resend/route";
import { leadApi } from "../src/lib/leads/api";
const id = "33333333-3333-4333-8333-333333333333";
const json = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
const valid = {
  name: "Mai Tran",
  email: "mai@example.test",
  company: "Test bank",
  role: "cto",
  interest: "both",
  deployment: "hybrid",
  message: "Please discuss enterprise deployment",
};
test("demo submission persists before sending and records acceptance, never claims delivery", async () => {
  const original = globalThis.fetch;
  const calls: {
    url: string;
    method: string;
    body: Record<string, unknown>;
  }[] = [];
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://demo.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  delete process.env.SUPABASE_SECRET_KEY;
  process.env.RESEND_API_KEY = "re_test";
  process.env.SMTP_FROM = "sales@example.test";
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    const body = JSON.parse(String(init?.body || "{}"));
    calls.push({ url, method: init?.method || "GET", body });
    return url.includes("api.resend.com")
      ? json({ id: "mail_1" })
      : init?.method === "POST"
        ? json({ id }, 201)
        : new Response(null, { status: 204 });
  };
  try {
    const result = await submit(
      new Request("https://app.test/api/demo", {
        method: "POST",
        body: JSON.stringify(valid),
      }),
    );
    assert.equal(result.status, 200);
    assert.deepEqual(await result.json(), {
      success: true,
      requestId: id,
      message: "Demo request saved and email accepted",
    });
    assert.equal(calls[0].body.email_status, "pending");
    assert.equal(calls[0].body.email, valid.email);
    assert.ok(calls[1].url.includes("api.resend.com"));
    assert.equal(calls[2].body.email_status, "accepted");
    assert.equal(calls[2].body.resend_email_id, "mail_1");
    assert.equal(
      (
        await submit(
          new Request("https://app.test/api/demo", {
            method: "POST",
            body: JSON.stringify({ ...valid, email: "bad" }),
          }),
        )
      ).status,
      400,
    );
  } finally {
    globalThis.fetch = original;
  }
});
test("signed webhook calls existing RPC; invalid signature is rejected; persistence errors request retry", async () => {
  const original = globalThis.fetch;
  const calls: unknown[] = [];
  const secret =
    "whsec_" + Buffer.from("test-webhook-secret").toString("base64");
  process.env.RESEND_WEBHOOK_SECRET = secret;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://demo.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  const body = JSON.stringify({
    type: "email.delivered",
    data: { email_id: "mail_1" },
  });
  const timestamp = new Date();
  const signature = new Webhook(secret).sign("evt_1", timestamp, body);
  const request = (sig = signature) =>
    new Request("https://app.test/api/webhooks/resend", {
      method: "POST",
      headers: {
        "svix-id": "evt_1",
        "svix-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
        "svix-signature": sig,
      },
      body,
    });
  globalThis.fetch = async (input, init) => {
    assert.ok(String(input).includes("rpc/record_demo_email_event"));
    calls.push(JSON.parse(String(init?.body)));
    return json(null);
  };
  try {
    assert.equal((await webhook(request("invalid"))).status, 400);
    assert.equal(calls.length, 0);
    assert.equal((await webhook(request())).status, 200);
    assert.deepEqual(calls[0], {
      p_event_id: "evt_1",
      p_email_id: "mail_1",
      p_type: "email.delivered",
    });
    globalThis.fetch = async () =>
      json({ code: "XX000", message: "Test persistence failure" }, 500);
    const previousError = console.error;
    const logs: unknown[][] = [];
    console.error = (...args: unknown[]) => {
      logs.push(args);
    };
    try {
      assert.equal((await webhook(request())).status, 503);
      assert.equal(logs.length, 1);
    } finally {
      console.error = previousError;
    }
  } finally {
    globalThis.fetch = original;
  }
});
test("dashboard endpoints reject unauthenticated/non-admin calls before accessing the database", async () => {
  const db = createClient("https://unused.test", "unused");
  for (const status of [401, 403]) {
    const api = leadApi(async () => ({ db, status }));
    assert.equal(
      (await api.list(new Request("https://app.test/api/dashboard/leads")))
        .status,
      status,
    );
    assert.equal(
      (
        await api.update(
          new Request("https://app.test/api/dashboard/leads/" + id, {
            method: "PATCH",
          }),
          id,
        )
      ).status,
      status,
    );
  }
});
test("admin endpoint enforces origin, rejects original fields and maps stale updates to conflict", async () => {
  const requests: { url: string; body: unknown }[] = [];
  const db = createClient("https://db.test", "test", {
    global: {
      fetch: async (input, init) => {
        requests.push({
          url: String(input),
          body: JSON.parse(String(init?.body || "{}")),
        });
        return json({ code: "40001", message: "Conflict" }, 409);
      },
    },
  });
  const api = leadApi(async () => ({ db, status: 200 }));
  const make = (body: unknown, origin = "https://app.test") =>
    new Request("https://app.test/api/dashboard/leads/" + id, {
      method: "PATCH",
      headers: { origin },
      body: JSON.stringify(body),
    });
  assert.equal(
    (await api.update(make({}, "https://attacker.test"), id)).status,
    403,
  );
  assert.equal(
    (await api.update(make({ email: "replace@example.test" }), id)).status,
    400,
  );
  assert.equal(requests.length, 0);
  assert.equal(
    (
      await api.update(
        make({ status: "LOST", expectedUpdatedAt: "2026-10-01T00:00:00Z" }),
        id,
      )
    ).status,
    409,
  );
  assert.ok(requests[0].url.includes("rpc/update_enterprise_lead"));
});
test("admin list endpoint emits pagination, search and filters to Supabase", async () => {
  let requestUrl = "";
  const db = createClient("https://db.test", "test", {
    global: {
      fetch: async (input) => {
        requestUrl = String(input);
        return json([{ id }], 200, { "Content-Range": "25-25/26" });
      },
    },
  });
  const result = await leadApi(async () => ({ db, status: 200 })).list(
    new Request(
      "https://app.test/api/dashboard/leads?page=2&status=QUALIFIED&q=bank&sort=oldest",
    ),
  );
  assert.equal(result.status, 200);
  const body = await result.json();
  assert.equal(body.total, 26);
  assert.equal(body.page, 2);
  const q = new URL(requestUrl).searchParams;
  assert.equal(q.get("offset"), "25");
  assert.equal(q.get("limit"), "25");
  assert.equal(q.get("lead_status"), "eq.QUALIFIED");
  assert.equal(q.get("order"), "submitted_at.asc,id.asc");
  assert.ok(q.get("or")?.includes("company.ilike.*bank*"));
});
