import { Metadata } from "next";
import { Check } from "lucide-react";
import { plans } from "@/data/pricing";
import { faqs } from "@/data/faqs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Bảng giá | O24",
    description: "Các gói dịch vụ linh hoạt phù hợp với mọi quy mô doanh nghiệp",
    openGraph: {
        title: "Bảng giá | O24",
        description: "Các gói dịch vụ linh hoạt phù hợp với mọi quy mô doanh nghiệp",
        url: "/pricing",
    },
};

export default function PricingPage() {
    return (
        <div className="container mx-auto py-24 md:py-32">
            {/* Header */}
            <div className="mx-auto max-w-[800px] text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                    Bảng giá linh hoạt
                </h1>
                <p className="text-lg text-muted-foreground">
                    Chọn gói phù hợp với lộ trình phát triển của bạn. Minh bạch, không chi phí ẩn.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`flex flex-col relative h-full ${plan.popular
                            ? "border-primary shadow-lg scale-100 md:scale-105 z-10"
                            : "border-border"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <Badge className="bg-primary hover:bg-primary/90 px-3 py-1">
                                    Phổ biến nhất
                                </Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.price !== "Liên hệ" && plan.price !== "Custom" && plan.price !== "Miễn phí" && (
                                    <span className="text-muted-foreground">/tháng</span>
                                )}
                            </div>
                            <CardDescription className="mt-2">
                                {plan.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={plan.popular ? "default" : "outline"}
                                size="lg"
                                asChild
                            >
                                <Link href="/contact">
                                    {plan.cta}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* FAQs */}
            <div className="mx-auto max-w-[800px]">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Câu hỏi thường gặp
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-base">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* CTA Bottom */}
            <div className="mt-24 text-center bg-muted/30 py-16 rounded-3xl border">
                <h2 className="text-2xl font-bold mb-4">
                    Vẫn chưa chắc chắn?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-[600px] mx-auto">
                    Liên hệ với đội ngũ tư vấn của chúng tôi để được giải đáp mọi thắc mắc và tìm ra giải pháp tối ưu nhất cho doanh nghiệp của bạn.
                </p>
                <Button size="lg" variant="default" asChild>
                    <Link href="/contact">Liên hệ ngay</Link>
                </Button>
            </div>
        </div>
    );
}
