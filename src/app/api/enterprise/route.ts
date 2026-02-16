import { NextResponse } from "next/server";
import { Resend } from "resend";

interface EnterpriseRequest {
    name: string;
    email: string;
    company: string;
    jobTitle: string;
    teamSize: string;
    useCase: string;
    deployment: string;
    message: string;
    timeline?: string;
    budget?: string;
    sla?: string;
}

const jobTitleLabels: Record<string, string> = {
    cto: "CTO / VP of Engineering",
    "tech-lead": "Tech Lead / Architect",
    "engineering-manager": "Engineering Manager",
    "product-owner": "Product Owner / PM",
    devops: "DevOps / Platform Engineer",
    director: "Director / C-Level",
    other: "Khác",
};

const teamSizeLabels: Record<string, string> = {
    "1-10": "1 – 10 người",
    "11-50": "11 – 50 người",
    "51-200": "51 – 200 người",
    "201-500": "201 – 500 người",
    "500+": "500+ người",
};

const useCaseLabels: Record<string, string> = {
    "api-gateway": "API Gateway & Management",
    "open-banking": "Open Banking / Fintech",
    microservices: "Microservices Orchestration",
    integration: "System Integration / iPaaS",
    "product-api": "API-as-a-Product",
    migration: "Legacy Migration",
    other: "Khác",
};

const deploymentLabels: Record<string, string> = {
    "on-premise": "On-premise",
    "private-cloud": "Private Cloud",
    hybrid: "Hybrid Cloud",
    "managed-cloud": "Managed Cloud (SaaS)",
    "not-decided": "Chưa quyết định",
};

const timelineLabels: Record<string, string> = {
    immediate: "Ngay lập tức (< 1 tháng)",
    "1-3-months": "1 – 3 tháng",
    "3-6-months": "3 – 6 tháng",
    exploring: "Đang tìm hiểu",
};

const budgetLabels: Record<string, string> = {
    "under-10m": "Dưới 10 triệu/tháng",
    "10-50m": "10 – 50 triệu/tháng",
    "50-100m": "50 – 100 triệu/tháng",
    "100m+": "Trên 100 triệu/tháng",
    discuss: "Cần trao đổi thêm",
};

const slaLabels: Record<string, string> = {
    "99.9": "99.9% uptime",
    "99.95": "99.95% uptime",
    "99.99": "99.99% uptime",
    custom: "Custom SLA",
    none: "Chưa có yêu cầu cụ thể",
};

function formatEmailContent(data: EnterpriseRequest): string {
    return `
New Enterprise Inquiry from O24 Website
========================================

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company}
- Job Title: ${jobTitleLabels[data.jobTitle] || data.jobTitle}
- Team Size: ${teamSizeLabels[data.teamSize] || data.teamSize}

Requirements:
- Use Case: ${useCaseLabels[data.useCase] || data.useCase}
- Deployment: ${deploymentLabels[data.deployment] || data.deployment}
${data.timeline ? `- Timeline: ${timelineLabels[data.timeline] || data.timeline}` : ""}
${data.budget ? `- Budget: ${budgetLabels[data.budget] || data.budget}` : ""}
${data.sla ? `- SLA Requirement: ${slaLabels[data.sla] || data.sla}` : ""}

Message:
${data.message}

---
Submitted at: ${new Date().toISOString()}
`;
}

function formatHtmlContent(data: EnterpriseRequest): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 8px; }
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
            <div class="badge">ENTERPRISE</div>
            <h1 style="margin: 0; font-size: 20px;">New Enterprise Inquiry</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">O24 Platform</p>
        </div>
        <div class="content">
            <div class="section">
                <div class="label">Contact</div>
                <div class="value"><strong>${data.name}</strong></div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
                <div class="value">${data.company} — ${jobTitleLabels[data.jobTitle] || data.jobTitle}</div>
                <div class="value">Team size: ${teamSizeLabels[data.teamSize] || data.teamSize}</div>
            </div>
            
            <div class="section">
                <div class="label">Requirements</div>
                <div class="value"><strong>Use Case:</strong> ${useCaseLabels[data.useCase] || data.useCase}</div>
                <div class="value"><strong>Deployment:</strong> ${deploymentLabels[data.deployment] || data.deployment}</div>
                ${data.timeline ? `<div class="value"><strong>Timeline:</strong> ${timelineLabels[data.timeline] || data.timeline}</div>` : ""}
                ${data.budget ? `<div class="value"><strong>Budget:</strong> ${budgetLabels[data.budget] || data.budget}</div>` : ""}
                ${data.sla ? `<div class="value"><strong>SLA:</strong> ${slaLabels[data.sla] || data.sla}</div>` : ""}
            </div>
            
            <div class="section">
                <div class="label">Message</div>
                <div class="message-box">${data.message.replaceAll("\n", "<br>")}</div>
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

async function sendEmail(data: EnterpriseRequest): Promise<boolean> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { error } = await resend.emails.send({
            from: process.env.SMTP_FROM || "O24 Platform <onboarding@resend.dev>",
            to: [process.env.CONTACT_EMAIL || "nguyenvuhoangz@gmail.com"],
            replyTo: data.email,
            subject: `[Enterprise Inquiry] ${data.company} - ${data.name}`,
            text: formatEmailContent(data),
            html: formatHtmlContent(data),
        });

        if (error) {
            console.error("Resend error:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Failed to send email via Resend:", error);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const body: EnterpriseRequest = await request.json();

        // Validate required fields
        const requiredFields = [
            "name",
            "email",
            "company",
            "jobTitle",
            "teamSize",
            "useCase",
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

        // Log the enterprise request
        console.log("Enterprise inquiry received:", {
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
                message: "Enterprise inquiry received successfully",
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
