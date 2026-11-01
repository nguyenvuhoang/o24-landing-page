# Step 23: Database-backed demo leads + Resend delivery webhook

This package is based on the public `nguyenvuhoang/o24-landing-page` project structure as inspected on 2026-11-01. It does not change DemoForm.tsx; keep the Step 22 client-side success event and error UI. Local files may differ from GitHub; review diffs before copying.

## Files
- `supabase/migrations/20261101_demo_leads.sql`: run manually in Supabase SQL Editor FIRST.
- `src/lib/demo-admin.ts`: new server-only Supabase admin client (NOT the cookie client).
- `src/app/api/demo/route.ts`: replaces existing API route; validates input, saves lead first, sends Resend notification, stores Resend email ID.
- `src/app/api/webhooks/resend/route.ts`: new signed webhook receiver; records delivery events atomically by Svix ID.

## Prerequisites

`npm install svix`

Configure in Vercel (Production and relevant Preview environments) and local `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOURPROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...    # preferred; or SUPABASE_SERVICE_ROLE_KEY (legacy)
RESEND_API_KEY=re_...
RESEND_WEBHOOK_SECRET=whsec_...
SMTP_FROM="O24 Platform <no-reply@your-verified-domain>"
DEMO_NOTIFICATION_EMAIL=support@vknight.io.vn
```

**Never put the secret key or webhook secret in a NEXT_PUBLIC_ variable.** Use a server-only Supabase client; never import it into the browser. Never store secret values in Git.

Create a webhook in Resend Dashboard with URL `https://vknight.io.vn/api/webhooks/resend` and subscribe at least to `email.sent`, `email.delivered`, `email.bounced`, `email.complained`, `email.delivery_delayed` (and `email.failed` if offered). Copy its signing secret into `RESEND_WEBHOOK_SECRET`.

For local webhook testing, use an HTTPS tunnel and a separate webhook secret.

## Operational semantics

- DB insertion failure: reject request, do not send email.
- DB insertion succeeds and Resend accepts email: returns `200`, `requestId`, email_status initially `accepted` (or a later status replayed from webhook).
- Resend rejects email: saves `failed` status, responds `502` with `requestId`. The lead **has been saved**: tell users not to submit repeated copies, and provide support a reference.
- Resend accepts email but saving email ID fails: responds `503`, lead remains in DB but email may have been sent. This must be reconciled manually by support, so DO NOT blindly retry submissions.
- Verified webhook: event inserted by `svix-id` once, request status advanced by priority. Out-of-order events arriving before linking the email ID are replayed on ID update.
- `accepted` is NOT delivered; `delivered` is a provider delivery report, not a human reading the email.
- Demo request success in the browser means the API saved the lead AND Resend accepted the notification; this event is not proof the recipient got it.

## Test / deploy

```
npm install svix
npx tsc --noEmit
npx eslint src/app/api/demo/route.ts src/app/api/webhooks/resend/route.ts src/lib/demo-admin.ts
npm run build
```

Never test delivery status by posting unsigned webhook payloads in production. Use Resend's webhook test feature.

For end-to-end smoke test, submit one real demo request and confirm it appears in `demo_requests` before checking its `resend_email_id` and webhook events. Test a forced email API failure and ensure the lead persists with `failed`.

### Database status query (SQL Editor only)

```sql
select id, company, submitted_at, email_status, resend_email_id
from public.demo_requests order by submitted_at desc limit 20;

select event_id, resend_email_id, event_type, received_at
from public.demo_email_events order by received_at desc limit 20;
```

## Security / release requirements

- Separate rate limiting, CAPTCHA/Turnstile and abuse protection are required before opening a high-volume public API. Add request body size enforcement at the edge; Content-Length alone can be omitted by clients.
- Restrict admin reads to authenticated staff in a future dashboard; no public list endpoint is included here.
- Define retention period and deletion policy for personal data.
- DB persistence alone is not a durable email job queue. For production-grade resilience, use a background worker + outbox for notification dispatch and retry policies.
- Review existing `/api/demo` semantics, especially Step 22 client UI messaging, because a 502 may mean a saved lead.
