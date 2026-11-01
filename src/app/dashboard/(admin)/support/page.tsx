"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Search,
    MessageCircle,
    FileText,
    LifeBuoy,
    ChevronRight,
    Send,
    ExternalLink
} from "lucide-react";

export default function SupportPage() {
    const FAQs = [
        "How do I set up my first workflow?",
        "How to manage team permissions?",
        "Where can I find my API keys?",
        "Troubleshooting connection issues",
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">How can we help?</h1>
                <p className="text-xl text-muted-foreground">Search our knowledge base or contact our support team.</p>
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Describe your issue..." className="pl-10 h-12 text-lg rounded-xl shadow-sm" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardContent className="pt-6 text-center space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-bold">Documentation</h3>
                        <p className="text-xs text-muted-foreground">Detailed guides for every feature.</p>
                    </CardContent>
                </Card>
                <Card className="hover:border-secondary transition-colors cursor-pointer group">
                    <CardContent className="pt-6 text-center space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <MessageCircle className="h-6 w-6 text-secondary" />
                        </div>
                        <h3 className="font-bold">Community</h3>
                        <p className="text-xs text-muted-foreground">Join our Discord and share tips.</p>
                    </CardContent>
                </Card>
                <Card className="hover:border-amber-500 transition-colors cursor-pointer group">
                    <CardContent className="pt-6 text-center space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <LifeBuoy className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="font-bold">Tickets</h3>
                        <p className="text-xs text-muted-foreground">Contact our support agents directly.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        Common Questions
                    </h2>
                    <div className="divide-y border rounded-xl bg-background overflow-hidden">
                        {FAQs.map((faq, i) => (
                            <button key={i} className="flex w-full items-center justify-between p-4 text-left hover:bg-accent transition-colors">
                                <span className="text-sm font-medium">{faq}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                        ))}
                    </div>
                </section>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>Send a Message</CardTitle>
                        <CardDescription>We typically respond within 1-2 hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2 text-sm text-balance">
                            Can&apos;t find what you&apos;re looking for? Reach out to us and we&apos;ll get back to you as soon as possible.
                        </div>
                        <Button className="w-full gap-2 font-bold py-6 text-lg rounded-xl">
                            <Send className="h-5 w-5" /> Contact Support
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                            Available 24/7 for Enterprise
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
