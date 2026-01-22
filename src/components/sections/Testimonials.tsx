import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote:
            "O24 đã giúp chúng tôi giảm 70% thời gian tích hợp Core Banking. API Gateway hoạt động cực kỳ ổn định với hàng triệu request mỗi ngày.",
        author: "Nguyễn Văn A",
        role: "CTO",
        company: "TechBank Vietnam",
    },
    {
        quote:
            "Observability của O24 là game-changer. Chúng tôi có thể trace từng request từ mobile app đến Core Banking, giúp debug nhanh chóng.",
        author: "Trần Thị B",
        role: "Head of Engineering",
        company: "VietFintech",
    },
    {
        quote:
            "Workflow Engine mạnh mẽ và linh hoạt. Chúng tôi xây dựng các quy trình phê duyệt phức tạp mà không cần code nhiều.",
        author: "Lê Văn C",
        role: "Technical Lead",
        company: "DigiPay Solutions",
    },
];

export function Testimonials() {
    return (
        <section className="py-20 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Khách hàng{" "}
                        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            nói gì về chúng tôi
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Hàng trăm tổ chức đã tin tưởng O24 cho hệ thống mission-critical của
                        họ.
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="relative">
                            <CardContent className="pt-8">
                                <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20" />
                                <blockquote className="relative z-10">
                                    <p className="text-muted-foreground leading-relaxed">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </p>
                                </blockquote>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-white font-semibold">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.role}, {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
