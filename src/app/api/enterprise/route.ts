import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enterpriseEmail, parseEnterprise } from "@/lib/enterprise/request";

export const runtime = "nodejs";
const MAX_BYTES = 20_000;
const noStoreHeaders = { "Cache-Control": "no-store" };

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response({ success: false, error: "Expected application/json" }, 415);
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BYTES) {
    return response({ success: false, error: "Request too large" }, 413);
  }

  let raw: string;
  try {
    // Enforce a real byte limit even if Content-Length is absent/incorrect.
    const reader = request.body?.getReader();
    if (!reader) return response({ success: false, error: "Empty request" }, 400);
    const decoder = new TextDecoder();
    const chunks: string[] = [];
    let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) {
          await reader.cancel();
          return response({ success: false, error: "Request too large" }, 413);
        }
        chunks.push(decoder.decode(value, { stream: true }));
      }
      chunks.push(decoder.decode());
    } finally {
      reader.releaseLock();
    }
    raw = chunks.join("");
  } catch {
    return response({ success: false, error: "Invalid request body" }, 400);
  }

  let parsed: unknown;
  try { parsed = JSON.parse(raw); }
  catch { return response({ success: false, error: "Invalid JSON" }, 400); }
  const input = parseEnterprise(parsed);
  if (!input) return response({ success: false, error: "Invalid enterprise request" }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SMTP_FROM;
  const recipient = process.env.CONTACT_EMAIL;
  if (!apiKey || !from || !recipient) {
    console.error("Enterprise notification unavailable: configuration missing");
    return response({ success: false, error: "Notification service unavailable" }, 503);
  }

  try {
    const { html, text } = enterpriseEmail(input);
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to: [recipient],
      replyTo: input.email,
      // Constant subject avoids untrusted data in mail headers.
      subject: "[O24] New Enterprise Inquiry",
      html,
      text,
    });
    if (error || !data?.id) {
      console.error("Enterprise notification rejected", error?.name ?? "missing-email-id");
      return response({ success: false, error: "Unable to submit request. Please try again." }, 502);
    }
    // Resend accepted the email; delivery to the inbox is not guaranteed by this response.
    return response({ success: true, message: "Your inquiry was submitted for notification." }, 200);
  } catch (error) {
    // Do not log raw request/SDK error details (which can include personal data).
    console.error("Enterprise notification exception", error instanceof Error ? error.name : "unknown");
    return response({ success: false, error: "Unable to submit request. Please try again." }, 502);
  }
}
