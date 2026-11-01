import { Metadata } from "next";
import { EnterpriseForm } from "./EnterpriseForm";
import Link from "next/link";
import {
    Shield,
    Server,
    HeadphonesIcon,
    Clock,
    FileText,
    Users,
    Zap,
    Lock,
    Check,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Enterprise | O24 Platform – Giải pháp API Management cho doanh nghiệp",
    description:
        "Liên hệ đội ngũ tư vấn O24 để nhận giải pháp API Management tùy chỉnh cho doanh nghiệp. On-premise, SLA đảm bảo, hỗ trợ 24/7.",
    openGraph: {
        title: "Enterprise | O24 Platform",
        description:
            "Giải pháp API Management tùy chỉnh cho doanh nghiệp. On-premise, SLA đảm bảo, hỗ trợ 24/7.",
        url: "/enterprise",
        siteName: "O24 by vKnight",
        locale: "vi_VN",
        type: "website",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "O24 Enterprise Platform",
            },
        ],
    },
};

const enterpriseBenefits = [
    {
        icon: Server,
        title: "On-premise & Private Cloud",
        desc: "Triển khai trong môi trường nội bộ, hoàn toàn kiểm soát dữ liệu.",
    },
    {
        icon: Shield,
        title: "SLA cam kết",
        desc: "Đảm bảo uptime lên đến 99.99% với đội ngũ hỗ trợ chuyên biệt.",
    },
    {
        icon: HeadphonesIcon,
        title: "Hỗ trợ ưu tiên 24/7",
        desc: "Kênh hỗ trợ riêng, dedicated engineer, response time < 1 giờ.",
    },
    {
        icon: Clock,
        title: "Onboarding chuyên sâu",
        desc: "Đào tạo team, migration support, và kiến trúc review miễn phí.",
    },
];

const enterpriseFeatures = [
    "Unlimited API endpoints & traffic",
    "Custom plugin / middleware development",
    "Dedicated infrastructure & tenant isolation",
    "Advanced audit logging & compliance",
    "SSO / LDAP / Active Directory integration",
    "Custom SLA & priority support channel",
];

const trustedBy = [
    "Ngân hàng & Tổ chức tài chính",
    "Fintech & Payment gateway",
    "Bảo hiểm & Chứng khoán",
    "Doanh nghiệp lớn & Tập đoàn",
];

export default function EnterprisePage() {
    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                        <Zap className="h-4 w-4" />
                        Enterprise Solutions
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        API Management{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                            cho doanh nghiệp
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Giải pháp tùy chỉnh, triển khai on-premise, SLA cam kết, và đội ngũ hỗ trợ chuyên biệt.
                        Để lại thông tin để nhận tư vấn miễn phí từ đội ngũ kỹ thuật O24.
                    </p>
                </div>

                {/* Enterprise Benefits Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {enterpriseBenefits.map((item) => (
                        <div
                            key={item.title}
                            className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Two Column: Form + Sidebar */}
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Form Column */}
                    <div className="lg:col-span-2">
                        <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
                            <h2 className="text-2xl font-bold mb-2">Liên hệ tư vấn Enterprise</h2>
                            <p className="text-muted-foreground mb-8">
                                Điền thông tin bên dưới, đội ngũ sẽ liên hệ trong 1-2 ngày làm việc.
                            </p>
                            <EnterpriseForm />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Enterprise features list */}
                        <div className="p-6 rounded-2xl border border-border bg-muted/30">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" />
                                Enterprise bao gồm
                            </h3>
                            <ul className="space-y-3">
                                {enterpriseFeatures.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Trusted by */}
                        <div className="p-6 rounded-2xl border border-border bg-muted/30">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Phù hợp cho
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {trustedBy.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Open source note */}
                        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
                            <h3 className="font-semibold mb-2">Bắt đầu miễn phí</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                O24 Community Edition hoàn toàn miễn phí và open-source. Nâng cấp lên Enterprise khi bạn sẵn sàng.
                            </p>
                            <Link
                                href="https://github.com/vknightteam"
                                target="_blank"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Xem trên GitHub →
                            </Link>
                        </div>

                        {/* Secondary CTAs */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href="https://docs.vknight.io.vn"
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Xem tài liệu kỹ thuật
                            </Link>
                            <Link
                                href="/demo"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Clock className="w-4 h-4" />
                                Đặt lịch demo kỹ thuật
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
