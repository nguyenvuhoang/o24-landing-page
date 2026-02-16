import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Zap, Headphones, BarChart, Server, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EnterpriseForm } from "../../enterprise/EnterpriseForm";

export const metadata: Metadata = {
    title: "O24 Business | Giải pháp cho Teams chuyên nghiệp",
    description: "Nắm quyền kiểm soát hạ tầng API với gói O24 Business. Advanced monitoring, priority support và 99.9% SLA.",
    openGraph: {
        title: "O24 Business | Giải pháp cho Teams chuyên nghiệp",
        description: "Nắm quyền kiểm soát hạ tầng API với gói O24 Business. Advanced monitoring, priority support và 99.9% SLA.",
        url: "/pricing/business",
    },
};

const valueProps = [
    {
        title: "Managed Cloud or On-prem",
        desc: "Linh hoạt lựa chọn triển khai trên hạ tầng cloud của chúng tôi hoặc tự vận hành với sự hỗ trợ từ chuyên gia.",
        icon: Server,
    },
    {
        title: "SLA Cam Kết 99.9%",
        desc: "Đảm bảo hệ thống luôn hoạt động ổn định với các cam kết mức độ dịch vụ nghiêm ngặt.",
        icon: Shield,
    },
    {
        title: "Hỗ Trợ Ưu Tiên 24/7",
        desc: "Đội ngũ kỹ thuật luôn sẵn sàng giải quyết các vấn đề của bạn qua kênh chat và email riêng.",
        icon: Headphones,
    },
    {
        title: "Advanced Observability",
        desc: "Bộ công cụ giám sát, log tập trung và dashboard chi tiết giúp nắm bắt mọi hoạt động của API.",
        icon: BarChart,
    },
];

const businessFeatures = [
    "Unlimited API calls & endpoints",
    "Multiple environments (Dev/Staging/Prod)",
    "Custom workflows & plugins",
    "SSO / LDAP Integration",
    "Team access control & Role-based settings",
    "Audit trails & Compliance tools",
    "Dedicated support engineer",
];

export default function BusinessPage() {
    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Hero section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <Badge variant="gradient" className="mb-4">
                        Dành cho doanh nghiệp vừa và nhỏ
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        Scale hạ tầng API của bạn với{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                            độ tin cậy tuyệt đối
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Gói Business cung cấp những tính năng mạnh mẽ nhất để vận hành các ứng dụng production quy mô lớn.
                    </p>
                </div>

                {/* Value Props Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {valueProps.map((prop, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <prop.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">{prop.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{prop.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content: Info + Form */}
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Features List */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Tính năng vượt trội</h2>
                            <ul className="space-y-4">
                                {businessFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-amber-500/5 border border-primary/10">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-6 h-6 text-primary" />
                                <h3 className="font-bold">Hơn 50+ teams tin dùng</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-6">
                                "O24 đã giúp chúng tôi giảm 70% thời gian triển khai API và đảm bảo an toàn tuyệt đối cho dữ liệu khách hàng."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted border" />
                                <div>
                                    <p className="text-xs font-bold">Lê Văn Thành</p>
                                    <p className="text-[10px] text-muted-foreground">CTO @ Fintech Solutions</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button variant="outline" className="justify-between" asChild>
                                <Link href="/enterprise">
                                    Cần giải pháp Enterprise tùy chỉnh?
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="p-8 rounded-3xl border border-border shadow-xl shadow-primary/5 bg-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16" />
                            <h2 className="text-2xl font-bold mb-2">Liên hệ nhận báo giá Business</h2>
                            <p className="text-muted-foreground mb-8 text-sm">
                                Để lại thông tin bên dưới, chuyên gia của vKnight sẽ chủ động liên hệ tư vấn trong 24h.
                            </p>
                            <EnterpriseForm />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
