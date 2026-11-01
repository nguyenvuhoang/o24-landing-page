import { NextResponse } from "next/server";
import { Resend } from "resend";
import { demoAdmin } from "@/lib/demo-admin";

export const runtime = "nodejs";

type DemoRequest = {
  name: string;
  email: string;
  company: string;
  role: string;
  interest: string;
  deployment: string;
  message: string;
  timeline?: string;
  openSource?: string;
};

const selections = {
  role: ["cto", "tech-lead", "developer", "platform-engineer", "product-owner", "other"],
  interest: ["api-management", "product-service", "both"],
  deployment: ["cloud", "on-premise", "hybrid", "not-decided"],
  timeline: ["exploring", "1-3-months", "scheduled"],
  openSource: ["yes", "no", "not-sure"],
} as const;

const clean = (value: unknown, max: number) =>
  typeof value === "string" && value.trim().length <= max ? value.trim() : null;
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character] ?? character);

function parseDemo(value: unknown): DemoRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const name = clean(body.name, 160);
  const email = clean(body.email, 254);
  const company = clean(body.company, 200);
  const message = clean(body.message, 5000);
  const role = clean(body.role, 60);
  const interest = clean(body.interest, 60);
  const deployment = clean(body.deployment, 60);
  const timeline = clean(body.timeline ?? "", 60);
  const openSource = clean(body.openSource ?? "", 60);
  if (!name || !email || !company || !message || !role || !interest || !deployment ||
    timeline === null || openSource === null ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !selections.role.includes(role as never) ||
    !selections.interest.includes(interest as never) ||
    !selections.deployment.includes(deployment as never) ||
    (timeline !== "" && !selections.timeline.includes(timeline as never)) ||
    (openSource !== "" && !selections.openSource.includes(openSource as never))) return null;
  return { name, email, company, role, interest, deployment, message, timeline, openSource };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 20_000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const input = parseDemo(payload);
  if (!input) return NextResponse.json({ error: "Invalid demo request" }, { status: 400 });

  const db = demoAdmin();
  const { data: saved, error: insertError } = await db.from("demo_requests").insert({
    name: input.name,
    email: input.email,
    company: input.company,
    role: input.role,
    interest: input.interest,
    deployment: input.deployment,
    message: input.message,
    timeline: input.timeline || null,
    open_source: input.openSource || null,
    email_status: "pending",
  }).select("id").single();

  if (insertError || !saved) {
    console.error("Demo persistence failed", insertError?.code ?? "no-record");
    return NextResponse.json({ error: "Unable to save demo request" }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.SMTP_FROM;
  if (!apiKey || !sender) {
    await db.from("demo_requests").update({ email_status: "failed", email_status_at: new Date().toISOString() }).eq("id", saved.id);
    return NextResponse.json({ error: "Email service not configured", requestId: saved.id }, { status: 503 });
  }

  const html = `
    <h2>New O24 Demo Request</h2>
    <p><b>Request ID:</b> ${escapeHtml(saved.id)}</p>
    <p><b>Name:</b> ${escapeHtml(input.name)}</p>
    <p><b>Email:</b> ${escapeHtml(input.email)}</p>
    <p><b>Company:</b> ${escapeHtml(input.company)}</p>
    <p><b>Role:</b> ${escapeHtml(input.role)}</p>
    <p><b>Interest:</b> ${escapeHtml(input.interest)}</p>
    <p><b>Deployment:</b> ${escapeHtml(input.deployment)}</p>
    <p><b>Timeline:</b> ${escapeHtml(input.timeline ?? "")}</p>
    <p><b>Open-source:</b> ${escapeHtml(input.openSource ?? "")}</p>
    <p><b>Message:</b><br>${escapeHtml(input.message).replaceAll("\n", "<br>")}</p>`;

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from: sender,
      to: [process.env.DEMO_NOTIFICATION_EMAIL || "support@vknight.io.vn"],
      replyTo: input.email,
      subject: `[Demo Request] ${input.company} - ${input.name}`,
      html,
      text: `Request: ${saved.id}\nName: ${input.name}\nEmail: ${input.email}\nCompany: ${input.company}\nRole: ${input.role}\nInterest: ${input.interest}\nDeployment: ${input.deployment}\nTimeline: ${input.timeline ?? ""}\nOpen-source: ${input.openSource ?? ""}\nMessage:\n${input.message}`,
    });
    if (error || !data?.id) {
      await db.from("demo_requests").update({ email_status: "failed", email_status_at: new Date().toISOString() }).eq("id", saved.id);
      console.error("Demo email not accepted", error?.name ?? "missing-email-id");
      return NextResponse.json({ error: "Demo saved but email notification failed. Contact support with your reference ID.", requestId: saved.id }, { status: 502 });
    }
    const { error: updateError } = await db.from("demo_requests").update({
      resend_email_id: data.id,
      email_status: "accepted",
      email_status_at: new Date().toISOString(),
    }).eq("id", saved.id);
    if (updateError) {
      console.error("Demo email ID persistence failed", updateError.code);
      return NextResponse.json({ error: "Demo saved but notification state could not be confirmed. Contact support with reference ID.", requestId: saved.id }, { status: 503 });
    }
    return NextResponse.json({ success: true, requestId: saved.id, message: "Demo request saved and email accepted" });
  } catch (error) {
    await db.from("demo_requests").update({ email_status: "failed", email_status_at: new Date().toISOString() }).eq("id", saved.id);
    console.error("Demo email processing failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Demo saved but email notification failed. Contact support with your reference ID.", requestId: saved.id }, { status: 502 });
  }
}
