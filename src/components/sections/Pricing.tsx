import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "Miễn phí",
        description: "Dành cho developers và prototype",
        features: [
            "1,000 API calls/ngày",
            "1 Environment",
            "Community support",
            "Basic monitoring",
            "Sandbox environment",
        ],
        cta: "Bắt đầu miễn phí",
        popular: false,
    },
    {
        name: "Business",
        price: "Liên hệ",
        description: "Dành cho teams và production",
        features: [
            "Unlimited API calls",
            "Multiple environments",
            "24/7 support",
            "Advanced observability",
            "Custom workflows",
            "SSO integration",
            "SLA 99.9%",
        ],
        cta: "Liên hệ Sales",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Dành cho tổ chức lớn",
        features: [
            "Everything in Business",
            "On-premise deployment",
            "Dedicated support team",
            "Custom SLA",
            "Compliance consulting",
            "Training & onboarding",
            "Source code access",
        ],
        cta: "Đặt lịch demo",
        popular: false,
    },
];

export function Pricing() {
    return (
        <section className="py-20 lg:py-32" id="pricing">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Pricing{" "}
                        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            đơn giản & minh bạch
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Chọn gói phù hợp với nhu cầu của bạn. Upgrade hoặc downgrade bất cứ
                        lúc nào.
                    </p>
                </div>

                {/* Pricing grid */}
                <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative ${plan.popular
                                    ? "border-primary shadow-xl shadow-primary/10 scale-105"
                                    : ""
                                }`}
                        >
                            {plan.popular && (
                                <Badge
                                    variant="gradient"
                                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                                >
                                    Most Popular
                                </Badge>
                            )}
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {plan.description}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={plan.popular ? "gradient" : "outline"}
                                    className="w-full"
                                >
                                    {plan.cta}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
