import { Metadata } from "next";
import { DemoForm } from "./DemoForm";
import Link from "next/link";
import { FileText, Map } from "lucide-react";

export const metadata: Metadata = {
    title: "Request a Technical Demo | O24 Platform",
    description: "Schedule a live walkthrough of O24 Platform tailored to your API management and integration use case. No slides, real configuration examples.",
    openGraph: {
        title: "Request a Technical Demo | O24 Platform",
        description: "Schedule a live walkthrough of O24 Platform tailored to your use case.",
        url: "/demo",
        images: [
            {
                url: "/images/og-image.png", // Đảm bảo link này tồn tại trong public
                width: 1200,
                height: 630,
                alt: "O24 Platform Demo",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Request a Technical Demo | O24 Platform",
        description: "Schedule a live walkthrough of O24 Platform tailored to your use case.",
        images: ["/images/og-image.png"],
    },
};

const demoScopes = [
    "API lifecycle management: publish, version control, deprecation policy",
    "Product Service configuration and API catalog setup",
    "Governance controls: rate limiting, access policies, consumer management",
    "Observability overview: logs, metrics, distributed tracing",
    "Deployment options: self-hosted, on-premise, hybrid cloud",
];

const sideContent = {
    whatDemo: [
        "Live walkthrough of API publish and versioning flow",
        "Policy configuration (rate limit, access control)",
        "Product catalog and consumer onboarding",
        "Observability dashboard overview",
        "Q&A on deployment and integration options",
    ],
    whoFor: [
        "CTOs and Tech Leads evaluating API infrastructure",
        "Platform teams planning integration strategy",
        "Product Owners exploring API-as-a-product model",
    ],
};

export default function DemoPage() {
    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Request a{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                            Technical Demo
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        See O24 in action with a live walkthrough tailored to your use case.
                        No slides, no pitch deck — just the platform, your questions, and real configuration examples.
                    </p>
                </div>

                {/* Demo Scope Preview */}
                <div className="mb-12 p-6 rounded-2xl border border-border bg-card">
                    <h2 className="text-lg font-semibold mb-4">What the demo covers</h2>
                    <ul className="space-y-2">
                        {demoScopes.map((scope, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium mt-0.5">
                                    {index + 1}
                                </span>
                                <span className="text-muted-foreground">{scope}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Form Column */}
                    <div className="lg:col-span-2">
                        <DemoForm />
                    </div>

                    {/* Side Content Column */}
                    <div className="space-y-8">
                        {/* What a demo covers */}
                        <div className="p-6 rounded-2xl border border-border bg-muted/30">
                            <h3 className="font-semibold mb-4">Demo session includes</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {sideContent.whatDemo.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Who this demo is for */}
                        <div className="p-6 rounded-2xl border border-border bg-muted/30">
                            <h3 className="font-semibold mb-4">Who this demo is for</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {sideContent.whoFor.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Open-source readiness */}
                        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
                            <h3 className="font-semibold mb-2">Open-source ready</h3>
                            <p className="text-sm text-muted-foreground">
                                O24 supports self-hosted deployment with full feature parity.
                                The demo can include deployment architecture review and on-prem configuration guidance.
                            </p>
                        </div>

                        {/* Secondary CTAs */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href="https://docs.vknight.io.vn"
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                View Documentation
                            </Link>
                            <Link
                                href="/roadmap"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Map className="w-4 h-4" />
                                See Roadmap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
