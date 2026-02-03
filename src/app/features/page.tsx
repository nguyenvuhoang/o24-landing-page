import { Metadata } from "next";
import { features } from "@/data/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Tính năng | O24",
    description: "Khám phá bộ công cụ toàn diện cho Fintech và Banking của O24",
};

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen pt-24">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] text-slate-900/5 [mask-image:linear-gradient(to_bottom,transparent,white)]" />

                <div className="container relative mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8">
                        Features
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                        Nền tảng công nghệ <br className="hidden sm:block" />
                        cho tương lai ngành tài chính
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                        O24 cung cấp một hệ sinh thái các module mạnh mẽ, linh hoạt và bảo mật cao,
                        giúp doanh nghiệp của bạn tăng tốc đổi mới sáng tạo mà không lo ngại về hạ tầng.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/contact">
                                Bắt đầu ngay <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/pricing">
                                Xem bảng giá
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="group relative overflow-hidden border-border bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <feature.icon className="h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-xl font-bold mb-2">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Additional generic details to make cards look richer since we don't have deep data yet */}
                                    <ul className="mt-6 space-y-2">
                                        <li className="flex items-center text-sm text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                                            <span>Hiệu suất cao</span>
                                        </li>
                                        <li className="flex items-center text-sm text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                                            <span>Dễ dàng tích hợp</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center shadow-2xl sm:px-12 md:px-24">
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-6">
                                Sẵn sàng để chuyển đổi số?
                            </h2>
                            <p className="text-lg text-primary-foreground/80 mb-10">
                                Tham gia cùng hàng trăm tổ chức tài chính đang sử dụng O24 để xây dựng sản phẩm tốt hơn.
                            </p>
                            <Button size="lg" variant="secondary" className="font-semibold" asChild>
                                <Link href="/contact">
                                    Liên hệ tư vấn ngay
                                </Link>
                            </Button>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -z-0 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -z-0 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
                    </div>
                </div>
            </section>
        </div>
    );
}
