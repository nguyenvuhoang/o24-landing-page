"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { RoadmapItem, statusConfig, groupConfig } from "@/data/roadmap";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    User,
    Link as LinkIcon,
    FileText,
    ExternalLink,
    CheckCircle2,
    AlertTriangle,
    Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapDetailDialogProps {
    item: RoadmapItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoadmapDetailDialog({ item, open, onOpenChange }: RoadmapDetailDialogProps) {
    if (!item) return null;

    const status = statusConfig[item.status];
    const GroupIcon = groupConfig[item.group].icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden sm:rounded-3xl border-none shadow-2xl">
                <div className={cn("h-2 w-full", status.color)} />
                <ScrollArea className="max-h-[90vh]">
                    <div className="p-6 sm:p-8">
                        <DialogHeader className="space-y-4 text-left">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className={cn("capitalize flex items-center gap-1.5 px-2.5 py-1 border-none", status.color.replace('bg-', 'text-'), status.color.replace('bg-', 'bg-'), "bg-opacity-10")}>
                                    <status.icon className="w-4 h-4" />
                                    {status.label}
                                </Badge>
                                <Badge variant="secondary" className="px-2.5 py-1 bg-muted/50">
                                    <GroupIcon className="w-4 h-4 mr-1.5" />
                                    {item.group}
                                </Badge>
                                <Badge variant="outline" className="px-2.5 py-1">
                                    <Calendar className="w-4 h-4 mr-1.5" />
                                    {item.quarter}
                                </Badge>
                            </div>
                            <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {item.title}
                            </DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                                {item.description}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-8 space-y-8">
                            {/* Detailed Description */}
                            <section>
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Chi tiết dự kiến
                                </h4>
                                <p className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-2xl">
                                    {item.details}
                                </p>
                            </section>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {/* Deliverables */}
                                {item.deliverables && item.deliverables.length > 0 && (
                                    <section>
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            Deliverables
                                        </h4>
                                        <ul className="space-y-2">
                                            {item.deliverables.map((d, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2 text-foreground/70">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {/* Dependencies & Risks */}
                                <div className="space-y-6">
                                    {item.dependencies && item.dependencies.length > 0 && (
                                        <section>
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                                <Layers className="w-4 h-4" />
                                                Phụ thuộc
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {item.dependencies.map(dep => (
                                                    <Badge key={dep} variant="outline" className="text-[10px] bg-muted/20">
                                                        {dep}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {item.risks && item.risks.length > 0 && (
                                        <section>
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                Rủi ro & Thách thức
                                            </h4>
                                            <ul className="space-y-2">
                                                {item.risks.map((risk, i) => (
                                                    <li key={i} className="text-xs text-amber-600/80 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                                                        {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Owner</p>
                                        <p className="text-sm font-medium">{item.owner}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {item.links?.docs && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={item.links.docs} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon className="w-4 h-4 mr-2" />
                                                Documentation
                                            </a>
                                        </Button>
                                    )}
                                    {item.links?.demo && (
                                        <Button variant="gradient" size="sm" asChild>
                                            <a href={item.links.demo} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                View Demo
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
