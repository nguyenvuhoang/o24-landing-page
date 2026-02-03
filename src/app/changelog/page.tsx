import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { changelogData, ChangeType } from "@/data/changelog";
import { CheckCircle2, FlaskConical, ShieldCheck, Sparkles, Wrench, Calendar } from "lucide-react";
import React from "react";

const ChangeTypeIcon = ({ type }: { type: ChangeType }) => {
    switch (type) {
        case "feature":
            return <Sparkles className="w-4 h-4 text-purple-500" />;
        case "fix":
            return <Wrench className="w-4 h-4 text-orange-500" />;
        case "improvement":
            return <FlaskConical className="w-4 h-4 text-blue-500" />;
        case "security":
            return <ShieldCheck className="w-4 h-4 text-green-500" />;
        default:
            return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
    }
};

const ChangeTypeBadge = ({ type }: { type: ChangeType }) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let className = "";

    switch (type) {
        case "feature":
            className = "border-purple-200 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
            break;
        case "fix":
            className = "border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
            break;
        case "improvement":
            className = "border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
            break;
        case "security":
            className = "border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
            break;
    }

    return (
        <Badge variant={variant} className={`gap-1.5 px-3 py-1 ${className}`}>
            <ChangeTypeIcon type={type} />
            <span className="capitalize">{type}</span>
        </Badge>
    );
};

export default function ChangelogPage() {
    return (
        <div className="min-h-screen pt-20 pb-16">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 gradient-hero z-0 pointer-events-none" />
                <div className="container relative z-10 px-4 mx-auto text-center">
                    <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 bg-background/50 backdrop-blur-sm text-primary">
                        What's New
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Nhật Ký Thay Đổi
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Theo dõi hành trình phát triển và các bản cập nhật mới nhất của O24.
                    </p>
                </div>
            </section>

            <div className="container px-4 mx-auto max-w-4xl">
                <div className="relative border-l border-border/50 pl-8 ml-4 md:ml-8 space-y-12">
                    {changelogData.map((item, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line Dot */}
                            <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full border-4 border-background bg-muted-foreground/30" />

                            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-0">
                                    <div className="p-6 md:p-8 border-b border-border/50 bg-muted/20">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-2xl font-bold">{item.version}</h2>
                                                <ChangeTypeBadge type={item.type} />
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded-full border border-border/50 w-fit">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {item.date}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground/90">{item.title}</h3>
                                        <p className="text-muted-foreground mt-2">{item.description}</p>
                                    </div>

                                    <div className="p-6 md:p-8">
                                        <ul className="space-y-4">
                                            {item.changes.map((change, i) => (
                                                <li key={i} className="flex items-start gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0 group-hover:bg-primary transition-colors" />
                                                    <span className="leading-relaxed">{change}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
