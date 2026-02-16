import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Github, BookOpen, Terminal, Rocket, Globe, Shield } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Bắt đầu với O24 Starter | Miễn phí cho Developers",
    description: "Khám phá sức mạnh của O24 Community Edition. Open-source, dễ dàng triển khai, và hoàn toàn miễn phí.",
    openGraph: {
        title: "Bắt đầu với O24 Starter | Miễn phí cho Developers",
        description: "Khám phá sức mạnh của O24 Community Edition. Open-source, dễ dàng triển khai, và hoàn toàn miễn phí.",
        url: "/pricing/starter",
    },
};

const features = [
    {
        title: "Open Source 100%",
        description: "Mã nguồn mở hoàn toàn trên GitHub, cho phép bạn tùy chỉnh theo nhu cầu.",
        icon: Github,
    },
    {
        title: "Triển khai nhanh với Docker",
        description: "Sẵn sàng chạy chỉ với một câu lệnh Docker Compose.",
        icon: Terminal,
    },
    {
        title: "Cộng đồng hỗ trợ",
        description: "Tham gia cộng đồng developer của vKnight để nhận hỗ trợ và đóng góp.",
        icon: Globe,
    },
    {
        title: "Bảo mật & Hiệu năng",
        description: "Thừa hưởng các tính năng bảo mật cốt lõi và hiệu năng cao từ O24 Core.",
        icon: Shield,
    },
];

const steps = [
    {
        name: "Clone Repository",
        command: "git clone https://github.com/vknightteam/o24-platform.git",
    },
    {
        name: "Install Dependencies",
        command: "cd o24-platform && npm install",
    },
    {
        name: "Start Platform",
        command: "docker-compose up -d",
    },
];

export default function StarterPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(2,68,48,0.05)_0%,transparent_100%)]" />

            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                        Community Edition
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                        Bắt đầu hành trình API của bạn{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                            hoàn toàn miễn phí
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                        O24 Starter là phiên bản mã nguồn mở mạnh mẽ nhất dành cho các developers cá nhân và dự án prototype.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" variant="gradient" className="min-w-[200px]" asChild>
                            <Link href="https://github.com/vknightteam" target="_blank">
                                <Github className="mr-2 h-5 w-5" />
                                Clone trên GitHub
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="min-w-[200px]" asChild>
                            <Link href="https://docs.vknight.io.vn" target="_blank">
                                <BookOpen className="mr-2 h-5 w-5" />
                                Tài liệu kỹ thuật
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {features.map((feature, i) => (
                        <Card key={i} className="border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Start Guide */}
                <div className="max-w-4xl mx-auto bg-muted/30 border border-border rounded-3xl p-8 md:p-12 mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold">Triển khai trong 3 bước</h2>
                    </div>
                    <div className="space-y-8">
                        {steps.map((step, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary text-primary font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold mb-3">{step.name}</h3>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                        <code className="relative block w-full bg-background border border-border p-4 rounded-xl text-sm font-mono overflow-x-auto whitespace-pre">
                                            {step.command}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-primary/5 border border-primary/10 rounded-3xl py-16 px-8">
                    <Rocket className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-black mb-4">Sẵn sàng để đưa API của bạn lên tầm cao mới?</h2>
                    <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                        Tham gia cùng hàng nghìn developer đang sử dụng O24 để xây dựng hạ tầng API hiện đại.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" variant="gradient" asChild>
                            <Link href="/">Khám phá thêm tính năng</Link>
                        </Button>
                        <Button size="lg" variant="ghost" asChild>
                            <Link href="/pricing/business">Tìm hiểu gói Business</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
