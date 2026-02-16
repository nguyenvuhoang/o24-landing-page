"use client";

import { EnterpriseForm } from "@/app/enterprise/EnterpriseForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    BarChart3,
    Building2,
    CheckCircle2,
    Globe,
    Headphones,
    MessageSquare,
    Server,
    Shield,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function EnterpriseSolutionClient() {
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
                                    <Building2 className="h-4 w-4" />
                                    Giải pháp cho Doanh nghiệp (Enterprise)
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                                    Hệ sinh thái API <span className="text-primary italic font-serif">Quy mô lớn</span> cho Doanh nghiệp
                                </h1>
                                <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                                    Quản trị tập trung, bảo mật tuyệt đối và khả năng mở rộng không giới hạn cho các tập đoàn
                                    đa quốc gia và tổ chức hành chính công.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button asChild size="lg" className="rounded-full px-8">
                                        <Link href="#contact-sales">
                                            Liên hệ tư vấn Enterprise
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                                        <Link href="/pricing/business">
                                            Xem bảng giá Business
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Tùy biến cao",
                                    desc: "Phát triển các module và plugin riêng biệt theo quy trình kinh doanh đặc thù.",
                                    icon: Zap
                                },
                                {
                                    title: "Managed Services",
                                    desc: "Đội ngũ vKnight hỗ trợ vận hành, giám sát và bảo trì hệ thống 24/7.",
                                    icon: Headphones
                                },
                                {
                                    title: "Bảo mật nâng cao",
                                    desc: "Hỗ trợ HSM, mTLS và các tiêu chuẩn bảo mật khắt khe nhất của chính phủ.",
                                    icon: Shield
                                },
                                {
                                    title: "Scale linh hoạt",
                                    desc: "Kiến trúc microservices sẵn sàng mở rộng khi lưu lượng truy cập tăng đột biến.",
                                    icon: Globe
                                }
                            ].map((benefit, i) => (
                                <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <benefit.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-bold mb-2">{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {benefit.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Feature Deep-Dive */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="space-y-24">
                            {/* Feature 1 */}
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">Quản trị tập trung (Governance)</h2>
                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        Kiểm soát mọi API trong doanh nghiệp từ một dashboard duy nhất. Phân quyền dựa trên vai trò (RBAC), quản lý vòng đời API và áp dụng policy đồng nhất trên toàn hệ thống.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Phân quyền đa cấp cho các phòng ban",
                                            "Audit log chi tiết cho mọi hành động",
                                            "Quản lý phiên bản và môi trường (Dev/Staging/Prod)"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gradient-to-br from-primary/5 to-primary/20 rounded-3xl p-8 border border-primary/10">
                                    <div className="aspect-video bg-card rounded-2xl shadow-xl border overflow-hidden flex flex-col">
                                        <div className="h-8 border-b bg-muted/50 flex items-center px-4 gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                            <div className="h-2 w-2 rounded-full bg-red-400/50" />
                                            Admin Dashboard / Governance
                                        </div>
                                        <div className="flex-1 p-6 space-y-4">
                                            <div className="h-4 w-1/3 bg-primary/20 rounded" />
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="h-20 bg-muted rounded-xl" />
                                                <div className="h-20 bg-muted rounded-xl" />
                                                <div className="h-20 bg-muted rounded-xl" />
                                            </div>
                                            <div className="h-32 bg-muted/30 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="grid lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
                                <div className="lg:order-2">
                                    <h2 className="text-3xl font-bold mb-6">Khả năng triển khai Hybrid</h2>
                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        Linh hoạt lựa chọn mô hình triển khai: On-premise hoàn toàn, Cloud-native hoặc mô hình Hybrid để tối ưu hóa chi phí và tuân thủ các quy định về dữ liệu cục bộ.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5">
                                            <Server className="h-6 w-6 text-primary mb-2" />
                                            <div className="font-bold text-sm">On-Premise</div>
                                            <div className="text-[10px] text-muted-foreground mt-1">Full control, air-gapped support</div>
                                        </div>
                                        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5">
                                            <Globe className="h-6 w-6 text-primary mb-2" />
                                            <div className="font-bold text-sm">Multi-Cloud</div>
                                            <div className="text-[10px] text-muted-foreground mt-1">AWS, Azure, GCP, vngCloud</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:order-1 flex justify-center">
                                    <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                                        <div className="relative z-10 w-48 h-48 bg-card rounded-[2.5rem] shadow-2xl border flex items-center justify-center">
                                            <Users className="h-20 w-20 text-primary/20 absolute" />
                                            <Building2 className="h-16 w-16 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial / Trust */}
                <section className="py-24 bg-zinc-950 text-white overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16 px-4">
                            <h2 className="text-3xl font-bold mb-6">Được tin dùng bởi các tập đoàn hàng đầu</h2>
                            <p className="text-zinc-400">O24 là nền tảng đứng sau các hệ thống kết nối API quan trọng của nhiều ngân hàng và doanh nghiệp lớn tại Việt Nam.</p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <Card className="bg-zinc-900 border-zinc-800 text-white p-8 md:p-12 rounded-[2.5rem] relative">
                                <MessageSquare className="absolute top-8 right-8 h-12 w-12 text-primary/10" />
                                <div className="relative z-10">
                                    <div className="flex gap-1 mb-6 text-amber-500">
                                        {[1, 2, 3, 4, 5].map((s) => <Zap key={s} className="h-4 w-4 fill-current" />)}
                                    </div>
                                    <p className="text-xl md:text-2xl font-medium italic mb-8 leading-relaxed">
                                        "Giải pháp Enterprise của vKnight đã giúp chúng tôi thống nhất hơn 200 API nội bộ và mở rộng kết nối với 50+ đối tác bên thứ ba chỉ trong vòng 6 tháng. Độ ổn định của hệ thống vượt xa mong đợi của chúng tôi."
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-zinc-800 border-zinc-700" />
                                        <div>
                                            <div className="font-bold">Đặng Minh Tuấn</div>
                                            <div className="text-sm text-zinc-500">Giám đốc Khối Công nghệ thông tin</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Enterprise Contact Form Section */}
                <section id="contact-sales" className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto bg-card rounded-[3rem] border shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                            <div className="lg:w-2/5 gradient-primary p-12 text-white">
                                <h2 className="text-3xl font-bold mb-6">Yêu cầu tư vấn chuyên gia</h2>
                                <p className="text-white/80 mb-8 leading-relaxed">
                                    Để lại thông tin của bạn và đội ngũ kĩ thuật của chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center shrink-0">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <p className="text-sm">Bảo mật thông tin được ưu tiên hàng đầu theo chuẩn ISO 27001.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center shrink-0">
                                            <BarChart3 className="h-5 w-5" />
                                        </div>
                                        <p className="text-sm">Tư vấn lộ trình chuyển đổi và ước tính ROI cụ thể.</p>
                                    </div>
                                </div>

                                <div className="mt-16 pt-8 border-t border-white/10">
                                    <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Hoặc gọi trực tiếp</p>
                                    <a href="tel:+84123456789" className="text-xl font-bold hover:underline">+84 123 456 789</a>
                                </div>
                            </div>
                            <div className="lg:w-3/5 p-12 lg:p-16">
                                <EnterpriseForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
