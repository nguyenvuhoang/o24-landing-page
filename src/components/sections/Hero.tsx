import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Shield, Zap, Globe } from "lucide-react";

const trustBadges = [
    { icon: Shield, label: "Enterprise Security" },
    { icon: Zap, label: "99.99% Uptime" },
    { icon: Globe, label: "Global CDN" },
];

export function Hero() {
    return (
        <section className="relative overflow-hidden gradient-hero">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 py-20 lg:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <Badge variant="secondary" className="mb-6 px-4 py-1.5">
                        <span className="mr-2">🚀</span>
                        Phiên bản 3.0 — Multi-tenant & Auto-scaling
                    </Badge>

                    {/* Headline */}
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                        <span className="block">Xây dựng hệ thống</span>
                        <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Banking & Fintech
                        </span>
                        <span className="block mt-2">chỉ trong vài tuần</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        <strong>O24</strong> là nền tảng OpenAPI & Open Banking Integration từ{" "}
                        <strong>vKnight</strong>. Triển khai nhanh trên on-prem hoặc cloud,
                        với Observability toàn diện và bảo mật cấp enterprise.
                    </p>

                    {/* CTAs */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button variant="gradient" size="lg" className="min-w-[180px]">
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="min-w-[180px]">
                            <Play className="mr-2 h-5 w-5" />
                            Request Demo
                        </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                        {trustBadges.map((badge) => (
                            <div
                                key={badge.label}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                                <badge.icon className="h-4 w-4 text-primary" />
                                <span>{badge.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero image placeholder */}
                <div className="mt-16 mx-auto max-w-5xl">
                    <div className="relative rounded-2xl border bg-gradient-to-b from-muted/50 to-muted p-2 shadow-2xl shadow-primary/10">
                        <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 flex items-center justify-center border">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-4">
                                    <Zap className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-lg font-semibold text-muted-foreground">
                                    O24 Dashboard Preview
                                </p>
                                <p className="text-sm text-muted-foreground/70 mt-1">
                                    API Gateway • Monitoring • Analytics
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
