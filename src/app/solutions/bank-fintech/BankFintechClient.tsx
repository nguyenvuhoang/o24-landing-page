"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    CheckCircle2,
    Cpu,
    Database,
    Globe,
    Landmark,
    Lock,
    ShieldCheck,
    TrendingUp,
    Workflow,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function BankFintechClient() {
    return (
        <div className="min-h-screen bg-background">
            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,hsl(var(--primary)/0.05)_0%,transparent_100%)]" />
                    <div className="container mx-auto px-4">
                        <Link
                            href="/#solutions"
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại Giải pháp
                        </Link>

                        <div className="max-w-4xl">
                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                                    <Landmark className="h-4 w-4" />
                                    Giải pháp Tài chính & Ngân hàng
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                                    Thúc đẩy <span className="text-primary italic font-serif">Chuyển đổi số</span> Tài chính toàn diện
                                </h1>
                                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Giải pháp tích hợp toàn diện giúp các ngân hàng và tổ chức Fintech kết nối Core Banking,
                                    xử lý giao dịch real-time và tuân thủ các quy định bảo mật khắt khe nhất.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button asChild size="lg" className="rounded-full px-8">
                                        <Link href="/enterprise">
                                            Nhận tư vấn giải pháp
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                                        <a href="https://docs.vknight.io.vn" target="_blank" rel="noopener noreferrer">
                                            Xem tài liệu kỹ thuật
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Metrics / Value Prop */}
                <section className="py-12 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Uptime", value: "99.99%", icon: Zap },
                                { label: "Độ trễ", value: "< 50ms", icon: Cpu },
                                { label: "Tuân thủ", value: "PCI-DSS", icon: ShieldCheck },
                                { label: "Xử lý", value: "10k+ TPS", icon: TrendingUp },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="text-center animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="flex justify-center mb-2">
                                        <stat.icon className="h-5 w-5 text-primary/60" />
                                    </div>
                                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Core Capabilities */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold mb-4">Khả năng cốt lõi</h2>
                            <p className="text-muted-foreground">O24 cung cấp bộ công cụ mạnh mẽ để xây dựng hệ sinh thái tài chính mở hiện đại.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Tích hợp Core Banking",
                                    description: "Kết nối an toàn với các hệ thống Core Banking truyền thống (T24, Flexcube, v.v.) thông qua adapter hiện đại.",
                                    icon: Database,
                                    features: ["Middleware linh hoạt", "Chống lỗi treo hệ thống", "Mapping dữ liệu thông minh"]
                                },
                                {
                                    title: "Giao dịch Real-time",
                                    description: "Xử lý hàng triệu giao dịch mỗi giây với độ trễ cực thấp, đáp ứng nhu cầu thanh toán tức thời.",
                                    icon: Workflow,
                                    features: ["Event-driven architecture", "Cân bằng tải thông minh", "Tự động hòa đối"]
                                },
                                {
                                    title: "Tuân thủ & Bảo mật",
                                    description: "Đáp ứng các tiêu chuẩn bảo mật ngân hàng và quy định của Ngân hàng Nhà nước.",
                                    icon: Lock,
                                    features: ["Mã hóa đầu cuối", "Quản lý quyền truy cập", "Kiểm toán log chi tiết"]
                                }
                            ].map((item, i) => (
                                <Card key={i} className="border-none shadow-lg bg-card/50 backdrop-blur">
                                    <CardContent className="pt-8">
                                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                        <ul className="space-y-3">
                                            {item.features.map((f, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Architecture Visual Mockup */}
                <section className="py-24 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Kiến trúc kết nối hiện đại</h2>
                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                    O24 đóng vai trò là lớp đệm (Overlay) thông minh, giúp trừu tượng hóa sự phức tạp của hệ thống Core cũ và cung cấp các RESTful API chuẩn hóa cho các ứng dụng Frontend, Mobile App và Đối tác bên thứ ba.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Giảm 60% thời gian triển khai tích hợp mới",
                                        "Tăng khả năng chịu tải của hệ thống Core thêm 300%",
                                        "Mở rộng hệ sinh thái đối tác không giới hạn"
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                            <p className="font-medium">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                {/* Visual Architecture representation */}
                                <div className="aspect-square max-w-md mx-auto relative flex items-center justify-center">
                                    <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow" />

                                    <div className="z-10 bg-card p-6 rounded-2xl shadow-2xl border border-primary/10 text-center">
                                        <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-white">
                                            <Landmark className="h-8 w-8" />
                                        </div>
                                        <div className="font-bold text-xl">O24 Platform</div>
                                        <div className="text-xs text-muted-foreground">Unified API Gateway</div>
                                    </div>

                                    {/* Satellite nodes */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-3 rounded-lg border shadow-sm">
                                        <Database className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-background p-3 rounded-lg border shadow-sm">
                                        <Globe className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background p-3 rounded-lg border shadow-sm">
                                        <Workflow className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background p-3 rounded-lg border shadow-sm">
                                        <TrendingUp className="h-5 w-5 text-orange-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="bg-primary p-12 rounded-[2rem] text-primary-foreground text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Landmark className="h-64 w-64" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
                                Sẵn sàng nâng cấp hạ tầng tài chính của bạn?
                            </h2>
                            <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto relative z-10">
                                Liên hệ với đội ngũ chuyên gia của chúng tôi để nhận được bản demo chuyên sâu và tư vấn giải pháp tối ưu cho tổ chức của bạn.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                <Button size="lg" variant="secondary" className="rounded-full px-8">
                                    Yêu cầu Demo
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 border-white/20 hover:bg-white/20 transition-colors">
                                    Liên hệ ngay
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
