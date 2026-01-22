import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl gradient-primary p-8 sm:p-12 lg:p-16">
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    </div>

                    <div className="relative z-10 text-center text-white">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            Ready to get started?
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Xây dựng nhanh hơn với O24
                        </h2>

                        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                            Tham gia cùng hàng trăm tổ chức đang sử dụng O24 để xây dựng hệ
                            thống Banking & Fintech thế hệ mới.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-primary hover:bg-white/90 min-w-[180px]"
                            >
                                Bắt đầu miễn phí
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 bg-transparent text-white hover:bg-white/10 min-w-[180px]"
                            >
                                Đặt lịch demo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
