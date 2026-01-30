import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Code2, Blocks, Server, Shield } from "lucide-react";
import { GitHub } from "@/components/ui/Icons";
import Link from "next/link";

const trustBadges = [
    { icon: GitHub, label: "Open Source" },
    { icon: Blocks, label: "Plugin-first" },
    { icon: BookOpen, label: "Docs-first" },
    { icon: Server, label: "Self-host Ready" },
    { icon: Shield, label: "Enterprise Grade" },
];

export function Hero() {
    return (
        <section className="relative overflow-hidden gradient-hero">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 py-20 lg:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <Badge variant="secondary" className="mb-6 px-4 py-1.5">
                        <GitHub className="mr-2 h-4 w-4" />
                        Open Source • Community-driven
                    </Badge>

                    {/* Headline */}
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                        <span className="block">API Management</span>
                        <span className="block mt-2 bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent">
                            cho Enterprise
                        </span>
                        <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-muted-foreground">
                            Được thiết kế để mở rộng
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        <strong>O24</strong> là nền tảng <strong>API Management & Product Service</strong> mã nguồn mở từ{" "}
                        <strong>vKnight</strong>. Plugin-first architecture, tài liệu đầy đủ,
                        triển khai linh hoạt trên on-prem hoặc cloud — xây dựng bởi developers, cho developers.
                    </p>

                    {/* CTAs */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="https://github.com/vknightteam" target="_blank" rel="noopener noreferrer">
                            <Button variant="gradient" size="lg" className="min-w-[180px]">
                                <GitHub className="mr-2 h-5 w-5" />
                                Star on GitHub
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="min-w-[180px]">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Đọc Docs
                        </Button>
                        <Button variant="ghost" size="lg" className="min-w-[160px]">
                            Liên hệ Enterprise
                            <ArrowRight className="ml-2 h-5 w-5" />
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
                        <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-primary/5 via-amber-500/5 to-orange-500/5 flex items-center justify-center border">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-4">
                                    <Code2 className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-lg font-semibold text-muted-foreground">
                                    O24 Developer Portal
                                </p>
                                <p className="text-sm text-muted-foreground/70 mt-1">
                                    API Gateway • Plugin System • Developer Experience
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
