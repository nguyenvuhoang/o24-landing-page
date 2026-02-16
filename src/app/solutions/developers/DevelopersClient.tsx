"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Code2,
    Terminal,
    Smartphone,
    ArrowLeft,
    CheckCircle2,
    FileText,
    Cpu,
    Zap,
    BookOpen,
    Puzzle,
    Coffee
} from "lucide-react";
import Link from "next/link";

export default function DevelopersClient() {
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
                                    <Code2 className="h-4 w-4" />
                                    Dành cho Developers
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                                    Xây dựng nhanh hơn với <span className="text-primary italic font-serif">DX Tuyệt vời</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Bộ công cụ SDK đa ngôn ngữ, tài liệu API chi tiết và môi trường Sandbox miễn phí giúp bạn
                                    tích hợp O24 vào ứng dụng chỉ trong vài phút.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button asChild size="lg" className="rounded-full px-8">
                                        <a href="https://docs.vknight.io.vn" target="_blank" rel="noopener noreferrer">
                                            Đọc tài liệu (Docs)
                                        </a>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                                        <Link href="/demo">
                                            Thử Sandbox
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Developer Experience Metrics */}
                <section className="py-12 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Time to First Call", value: "< 5 mins", icon: Zap },
                                { label: "SDKs hỗ trợ", value: "10+", icon: Puzzle },
                                { label: "Uptime Sandbox", value: "99.9%", icon: Activity },
                                { label: "Community", value: "5k+", icon: Coffee },
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

                {/* Core Tools */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold mb-4">Công cụ xây dựng hệ sinh thái</h2>
                            <p className="text-muted-foreground">Chúng tôi cung cấp mọi thứ bạn cần để phát triển các sản phẩm tài chính sáng tạo.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "RESTful API Chuẩn hóa",
                                    description: "Hệ thống API thiết kế theo chuẩn OpenAPI (Swagger), dễ dàng thử nghiệm ngay trên trình duyệt.",
                                    icon: Terminal,
                                    features: ["JSON/REST Standard", "Pagination & Filtering", "Rate Limiting"]
                                },
                                {
                                    title: "SDK đa nền tảng",
                                    description: "Thư viện được build sẵn cho Node.js, Python, Go, Java, Swift và Kotlin.",
                                    icon: Smartphone,
                                    features: ["Type-safe classes", "Automatic retries", "Error handling"]
                                },
                                {
                                    title: "Tài liệu chi tiết",
                                    description: "Guides, tutorials và code snippets cho mọi use case phổ biến nhất.",
                                    icon: BookOpen,
                                    features: ["Copy-paste code", "Interactive Playground", "Change logs"]
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

                {/* Sandbox Section */}
                <section className="py-24 bg-zinc-900 text-zinc-100 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-6">
                                    Developer First
                                </div>
                                <h2 className="text-3xl font-bold mb-6">Môi trường Sandbox Miễn phí</h2>
                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Đừng chờ đợi phê duyệt. Đăng ký tài khoản developer và nhận API Key ngay lập tức để bắt đầu
                                    thử nghiệm với dữ liệu giả lập chất lượng cao.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Mô phỏng Error States</h4>
                                            <p className="text-sm text-zinc-500">Thử nghiệm cách ứng dụng của bạn phản ứng với lỗi network hoặc từ chối giao dịch.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                            <Cpu className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Mock Data phong phú</h4>
                                            <p className="text-sm text-zinc-500">Dữ liệu tài khoản, thẻ và giao dịch được gen tự động theo thực tế.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                {/* Visual Code representation */}
                                <div className="rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 font-mono text-sm overflow-hidden">
                                    <div className="flex gap-2 mb-4 italic opacity-50">
                                        <div className="h-3 w-3 rounded-full bg-red-500/50" />
                                        <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                                        <div className="h-3 w-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-primary">const <span className="text-zinc-100">o24</span> = require(<span className="text-emerald-400">'@vknight/o24-sdk'</span>);</div>
                                        <div>&nbsp;</div>
                                        <div className="text-zinc-100">o24.init({'{'}</div>
                                        <div className="text-zinc-400">&nbsp;&nbsp;apiKey: <span className="text-emerald-400">'sk_test_123...'</span>,</div>
                                        <div className="text-zinc-400">&nbsp;&nbsp;env: <span className="text-emerald-400">'sandbox'</span></div>
                                        <div className="text-zinc-100">{'})'};</div>
                                        <div>&nbsp;</div>
                                        <div className="text-zinc-100">o24.payments.create({'{'}</div>
                                        <div className="text-zinc-400">&nbsp;&nbsp;amount: <span className="text-amber-400">50000</span>,</div>
                                        <div className="text-zinc-400">&nbsp;&nbsp;currency: <span className="text-emerald-400">'VND'</span>,</div>
                                        <div className="text-zinc-400">&nbsp;&nbsp;desc: <span className="text-emerald-400">'Thanh toan don hang #024'</span></div>
                                        <div className="text-zinc-100">{'})'}.then(res ={'>'} console.log(res));</div>
                                    </div>
                                </div>
                                {/* Added glow effect */}
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-8 animate-bounce">
                            <Puzzle className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Mọi thứ bạn cần để thành công</h2>
                        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Bắt đầu xây dựng ngay hôm nay với API Key sandbox. Tài liệu của chúng tôi sẽ dẫn dắt bạn từng bước.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button asChild size="lg" className="rounded-full px-12">
                                <a href="https://docs.vknight.io.vn" target="_blank" rel="noopener noreferrer">
                                    Khám phá Docs
                                </a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full px-12">
                                <Link href="/contact">
                                    Hỗ trợ Kỹ thuật
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Simple Activity icon replacement
function Activity(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
