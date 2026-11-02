import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
const admin = "11111111-1111-4111-8111-111111111111",
  regular = "22222222-2222-4222-8222-222222222222",
  lead = "33333333-3333-4333-8333-333333333333";
test("migration preserves submissions and email RPC, restricts RLS, and atomically audits valid changes", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
 create schema auth; grant usage on schema auth to authenticated, anon;
 create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table public.demo_requests(id uuid primary key default gen_random_uuid(), name text, email text, company text, role text, interest text, deployment text, message text, timeline text, open_source text, email_status text default 'pending', resend_email_id text, email_status_at timestamptz, submitted_at timestamptz default now());
 create table public.demo_email_events(event_id text primary key,resend_email_id text,event_type text,received_at timestamptz default now());
 create function public.record_demo_email_event(p_event_id text,p_email_id text,p_type text) returns void language sql as $$insert into public.demo_email_events(event_id,resend_email_id,event_type) values(p_event_id,p_email_id,p_type) on conflict do nothing$$;
 insert into auth.users values('${admin}'),('${regular}');
 insert into demo_requests(id,name,email,company,interest,deployment,message,email_status,submitted_at) values('${lead}','Mai','mai@example.test','Test bank','both','hybrid','Original message','delivered','2026-10-15');
 -- Prove restrictive policies constrain even a legacy permissive read policy.
 alter table demo_requests enable row level security;create policy legacy_read on demo_requests for select to authenticated using(true);`);
    const before = await db.query(
      "select pg_get_functiondef('record_demo_email_event(text,text,text)'::regprocedure) as sql",
    );
    await db.exec(
      readFileSync(
        "supabase/migrations/202611010001_enterprise_leads.sql",
        "utf8",
      ),
    );
    assert.deepEqual(
      await db.query(
        "select pg_get_functiondef('record_demo_email_event(text,text,text)'::regprocedure) as sql",
      ),
      before,
    );
    await db.exec(
      `insert into admin_users(user_id,display_name) values('${admin}','Sales admin'); set role anon;`,
    );
    await assert.rejects(
      db.query("select * from demo_requests"),
      /permission denied/,
    );
    await assert.rejects(
      db.query(
        "select record_demo_email_event('spoof','mail','email.delivered')",
      ),
      /permission denied/,
    );
    await db.exec(
      `reset role; set role authenticated; select set_config('request.jwt.claim.sub','${regular}',false);`,
    );
    assert.equal(
      (await db.query("select * from enterprise_leads")).rows.length,
      0,
    );
    await assert.rejects(
      db.query(`select update_enterprise_lead('${lead}','{}')`),
      /Admin access required/,
    );
    await db.exec(
      `select set_config('request.jwt.claim.sub','${admin}',false)`,
    );
    const rows = await db.query<{ updated_at: Date }>(
      "select updated_at from enterprise_leads",
    );
    assert.equal(rows.rows.length, 1);
    const version = String(
      rows.rows[0].updated_at instanceof Date
        ? rows.rows[0].updated_at.toISOString()
        : rows.rows[0].updated_at,
    );
    const update = (change: object) =>
      db.query("select update_enterprise_lead($1,$2::jsonb)", [
        lead,
        JSON.stringify({ expectedUpdatedAt: version, ...change }),
      ]);
    await assert.rejects(update({ status: "WON" }), /pipeline/);
    await assert.rejects(update({ status: null }), /Invalid status/);
    await assert.rejects(
      update({ email: "overwrite@example.test" }),
      /Invalid fields/,
    );
    await update({
      status: "CONTACTED",
      assignedAdmin: admin,
      note: "Called the prospect",
      lastContactedAt: "2026-10-18T09:00:00Z",
    });
    const history = await db.query<{ actor_id: string; note: string }>(
      "select * from lead_history",
    );
    assert.equal(history.rows.length, 1);
    assert.equal(history.rows[0].actor_id, admin);
    assert.equal(history.rows[0].note, "Called the prospect");
    await assert.rejects(update({ status: "LOST" }), /reload/);
    await assert.rejects(
      db.query("update demo_requests set message='overwritten'"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("delete from lead_history"),
      /permission denied/,
    );
    assert.equal(
      (await db.query<{ message: string }>("select message from demo_requests"))
        .rows[0].message,
      "Original message",
    );
    const metrics = await db.query<{
      m: {
        total: number;
        delivered: number;
        attempted: number;
        daily: unknown[];
      };
    }>("select enterprise_lead_metrics('2026-10-01','2026-11-01') m");
    assert.equal(metrics.rows[0].m.total, 1);
    assert.equal(metrics.rows[0].m.delivered, 1);
    assert.equal(metrics.rows[0].m.attempted, 1);
    assert.equal(metrics.rows[0].m.daily.length, 31);
    const changeCurrent = async (change: object) => {
      const row = await db.query<{ version: string }>(
        "select updated_at::text as version from lead_management where lead_id=$1",
        [lead],
      );
      return db.query("select update_enterprise_lead($1,$2::jsonb)", [
        lead,
        JSON.stringify({ expectedUpdatedAt: row.rows[0].version, ...change }),
      ]);
    };
    await changeCurrent({ status: "QUALIFIED" });
    await assert.rejects(
      changeCurrent({ status: "DEMO_SCHEDULED" }),
      /demo date/,
    );
    await changeCurrent({
      status: "DEMO_SCHEDULED",
      demoScheduledAt: "2026-11-10T09:00:00Z",
    });
    await changeCurrent({ status: "WON" });
    await changeCurrent({ status: "LOST", note: "Contract cancelled" });
    assert.equal(
      (
        await db.query<{ lead_status: string }>(
          "select lead_status from enterprise_leads",
        )
      ).rows[0].lead_status,
      "LOST",
    );
    assert.equal((await db.query("select * from lead_history")).rows.length, 5);
    await db.exec(`reset role; grant all on demo_requests,demo_email_events to service_role;set role service_role;
 insert into demo_requests(name,email_status) values('New submission','pending');
 update demo_requests set email_status='accepted',resend_email_id='mail_1' where name='New submission';
 select record_demo_email_event('evt_1','mail_1','email.delivered');`);
    await db.exec(`reset role;`);
    assert.equal(
      (await db.query("select * from lead_management")).rows.length,
      2,
    );
    assert.equal(
      (await db.query("select * from demo_email_events")).rows.length,
      1,
    );
    await db.exec(
      `delete from admin_users where user_id='${admin}';set role authenticated;select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    assert.equal(
      (await db.query("select * from enterprise_leads")).rows.length,
      0,
    );
    await assert.rejects(
      db.query("select enterprise_lead_metrics('2026-10-01','2026-11-01')"),
      /Admin access required/,
    );
  } finally {
    await db.close();
  }
});
