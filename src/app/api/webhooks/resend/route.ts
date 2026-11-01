
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { demoAdmin } from "@/lib/demo-admin";

export const runtime = "nodejs";

type ResendWebhookEvent = {
  type: string;
  data?: {
    email_id?: string;
    [key: string]: unknown;
  };
};

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  const raw = await request.text();

  // Verify the original raw body before parsing JSON.
  try {
    new Webhook(secret).verify(raw, {
      "svix-id": id,
      "svix-timestamp": timestamp,
      "svix-signature": signature,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  let event: ResendWebhookEvent;

  try {
    const payload: unknown = JSON.parse(raw);

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("type" in payload) ||
      typeof payload.type !== "string" ||
      !("data" in payload) ||
      typeof payload.data !== "object" ||
      payload.data === null ||
      !("email_id" in payload.data) ||
      typeof payload.data.email_id !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    event = payload as ResendWebhookEvent;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const emailId = event.data?.email_id;

  // Ignore unrelated Resend events.
  if (!emailId || !event.type.startsWith("email.")) {
    return NextResponse.json({ ok: true });
  }

  try {
    const { error } = await demoAdmin().rpc(
      "record_demo_email_event",
      {
        p_event_id: id,
        p_email_id: emailId,
        p_type: event.type,
      }
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Resend event could not be persisted",
      error instanceof Error ? error.message : "unknown"
    );

    // Non-2xx responses allow Resend to retry.
    return NextResponse.json(
      { error: "Temporary persistence failure" },
      { status: 503 }
    );
  }
}
