"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectMilestone } from "@/types/reports";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; dotClass: string; lineClass: string }> = {
    completed: {
        icon: CheckCircle2,
        color: "text-emerald-400",
        dotClass: "bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
        lineClass: "bg-emerald-500/40",
    },
    "in-progress": {
        icon: Clock,
        color: "text-blue-400",
        dotClass: "bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)] animate-pulse",
        lineClass: "bg-blue-500/40",
    },
    pending: {
        icon: Circle,
        color: "text-slate-500",
        dotClass: "bg-slate-700 border-slate-600",
        lineClass: "bg-slate-700",
    },
};

export default function MilestoneTracker({ milestones }: { milestones: ProjectMilestone[] }) {
    if (milestones.length === 0) return null;

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    Milestone Dự Án
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Desktop: horizontal timeline */}
                <div className="hidden md:block overflow-x-auto pb-4">
                    <div className="flex items-start min-w-max px-4">
                        {milestones.map((ms, idx) => {
                            const cfg = statusConfig[ms.status] || statusConfig.pending;
                            const Icon = cfg.icon;
                            const isLast = idx === milestones.length - 1;
                            return (
                                <div key={ms.id} className="flex items-start">
                                    <div className="flex flex-col items-center min-w-[140px]">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${cfg.dotClass}`}>
                                            <Icon className={`w-4 h-4 ${ms.status === "pending" ? "text-slate-400" : "text-white"}`} />
                                        </div>
                                        <div className="mt-3 text-center px-2">
                                            <p className={`text-xs font-semibold ${cfg.color}`}>{ms.title}</p>
                                            {ms.target_date && (
                                                <p className="text-[10px] text-slate-500 mt-1">{ms.target_date}</p>
                                            )}
                                        </div>
                                    </div>
                                    {!isLast && (
                                        <div className={`h-0.5 w-12 mt-4 rounded ${cfg.lineClass}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile: vertical timeline */}
                <div className="md:hidden space-y-0">
                    {milestones.map((ms, idx) => {
                        const cfg = statusConfig[ms.status] || statusConfig.pending;
                        const Icon = cfg.icon;
                        const isLast = idx === milestones.length - 1;
                        return (
                            <div key={ms.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${cfg.dotClass}`}>
                                        <Icon className={`w-3.5 h-3.5 ${ms.status === "pending" ? "text-slate-400" : "text-white"}`} />
                                    </div>
                                    {!isLast && <div className={`w-0.5 flex-1 min-h-[24px] ${cfg.lineClass}`} />}
                                </div>
                                <div className="pb-6">
                                    <p className={`text-sm font-semibold ${cfg.color}`}>{ms.title}</p>
                                    {ms.target_date && (
                                        <p className="text-xs text-slate-500 mt-0.5">{ms.target_date}</p>
                                    )}
                                    {ms.description && (
                                        <p className="text-xs text-slate-400 mt-1">{ms.description}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
