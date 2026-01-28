import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface DemoRequest {
    name: string;
    email: string;
    company: string;
    role: string;
    interest: string;
    deployment: string;
    message: string;
    timeline?: string;
    openSource?: string;
}

const roleLabels: Record<string, string> = {
    cto: "CTO",
    "tech-lead": "Tech Lead",
    developer: "Developer",
    "platform-engineer": "Platform Engineer",
    "product-owner": "Product Owner",
    other: "Other",
};

const interestLabels: Record<string, string> = {
    "api-management": "API Management",
    "product-service": "Product Service",
    both: "Both",
};

const deploymentLabels: Record<string, string> = {
    cloud: "Cloud-managed",
    "on-premise": "On-premise",
    hybrid: "Hybrid",
    "not-decided": "Not decided",
};

const timelineLabels: Record<string, string> = {
    exploring: "Just exploring",
    "1-3-months": "Within 1-3 months",
    scheduled: "Scheduled project",
};

const openSourceLabels: Record<string, string> = {
    yes: "Yes",
    no: "No",
    "not-sure": "Not sure",
};

function formatEmailContent(data: DemoRequest): string {
    return `
New Demo Request from O24 Website
==================================

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company}
- Role: ${roleLabels[data.role] || data.role}

Requirements:
- Primary Interest: ${interestLabels[data.interest] || data.interest}
- Expected Deployment: ${deploymentLabels[data.deployment] || data.deployment}
${data.timeline ? `- Timeline: ${timelineLabels[data.timeline] || data.timeline}` : ""}
${data.openSource ? `- Open-source Interest: ${openSourceLabels[data.openSource] || data.openSource}` : ""}

Use Case / Message:
${data.message}

---
Submitted at: ${new Date().toISOString()}
`;
}

function formatHtmlContent(data: DemoRequest): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .section { margin-bottom: 20px; }
        .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 14px; margin-top: 4px; }
        .message-box { background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .footer { margin-top: 20px; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 20px;">New Demo Request</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">O24 Platform</p>
        </div>
        <div class="content">
            <div class="section">
                <div class="label">Contact</div>
                <div class="value"><strong>${data.name}</strong></div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
                <div class="value">${data.company} - ${roleLabels[data.role] || data.role}</div>
            </div>
            
            <div class="section">
                <div class="label">Requirements</div>
                <div class="value"><strong>Interest:</strong> ${interestLabels[data.interest] || data.interest}</div>
                <div class="value"><strong>Deployment:</strong> ${deploymentLabels[data.deployment] || data.deployment}</div>
                ${data.timeline ? `<div class="value"><strong>Timeline:</strong> ${timelineLabels[data.timeline] || data.timeline}</div>` : ""}
                ${data.openSource ? `<div class="value"><strong>Open-source:</strong> ${openSourceLabels[data.openSource] || data.openSource}</div>` : ""}
            </div>
            
            <div class="section">
                <div class="label">Use Case / Message</div>
                <div class="message-box">${data.message.replace(/\n/g, "<br>")}</div>
            </div>
            
            <div class="footer">
                Submitted at ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
            </div>
        </div>
    </div>
</body>
</html>
`;
}

async function sendEmail(data: DemoRequest): Promise<boolean> {
    // Configure SMTP transport
    // For production, use environment variables for credentials
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || "O24 Platform <noreply@vknight.io.vn>",
            to: "support@vknight.io.vn",
            replyTo: data.email,
            subject: `[Demo Request] ${data.company} - ${data.name}`,
            text: formatEmailContent(data),
            html: formatHtmlContent(data),
        });

        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const body: DemoRequest = await request.json();

        // Validate required fields
        const requiredFields = [
            "name",
            "email",
            "company",
            "role",
            "interest",
            "deployment",
            "message",
        ] as const;

        for (const field of requiredFields) {
            if (!body[field] || body[field].trim() === "") {
                return NextResponse.json(
                    { error: `Field '${field}' is required` },
                    { status: 400 }
                );
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Log the demo request
        console.log("Demo request received:", {
            ...body,
            timestamp: new Date().toISOString(),
        });

        // Send email notification
        const emailSent = await sendEmail(body);

        if (!emailSent) {
            console.warn("Email notification failed, but request was logged");
        }

        return NextResponse.json(
            {
                success: true,
                message: "Demo request received successfully",
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
