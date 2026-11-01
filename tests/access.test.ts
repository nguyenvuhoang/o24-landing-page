import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";
const id = "11111111-1111-4111-8111-111111111111";
test("dashboard proxy protects overview, leads, detail and legacy W4S while allowing login", async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://demo.test";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon";
  for (const path of [
    "/dashboard",
    "/dashboard/leads",
    "/dashboard/leads/" + id,
    "/dashboard/w4s",
  ]) {
    const result = await proxy(new NextRequest("https://app.test" + path));
    assert.equal(result.status, 307);
    assert.equal(
      new URL(result.headers.get("location")!).pathname,
      "/dashboard/login",
    );
  }
  assert.equal(
    (await proxy(new NextRequest("https://app.test/dashboard/login"))).status,
    200,
  );
});
test("verified sessions without an admin role receive 403; admin sessions proceed", async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://demo.test";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon";
  const original = globalThis.fetch;
  let admin = false;
  const user = {
    id,
    aud: "authenticated",
    role: "authenticated",
    email: "admin@example.test",
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
  };
  const jwt = [
    "e30",
    Buffer.from(
      JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600 }),
    ).toString("base64url"),
    "sig",
  ].join(".");
  const session = {
    access_token: jwt,
    refresh_token: "test-refresh",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: "bearer",
    user,
  };
  const cookie =
    "sb-demo-auth-token=base64-" +
    Buffer.from(JSON.stringify(session)).toString("base64url");
  globalThis.fetch = async (input) =>
    new Response(
      JSON.stringify(
        String(input).includes("auth/v1/user")
          ? user
          : admin
            ? [{ user_id: id }]
            : [],
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  try {
    const request = () =>
      new NextRequest("https://app.test/dashboard/leads", {
        headers: { cookie },
      });
    assert.equal((await proxy(request())).status, 403);
    admin = true;
    assert.equal((await proxy(request())).status, 200);
  } finally {
    globalThis.fetch = original;
  }
});
