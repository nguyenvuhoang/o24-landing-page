"use client";

import { useMemo } from "react";
import { RoadmapItem } from "@/data/roadmap";
import { RoadmapCard } from "./RoadmapCard";

interface RoadmapTimelineProps {
    data: RoadmapItem[];
    onItemClick: (item: RoadmapItem) => void;
}

export function RoadmapTimeline({ data, onItemClick }: RoadmapTimelineProps) {
    const groupedData = useMemo(() => {
        const groups: Record<string, RoadmapItem[]> = {};
        data.forEach(item => {
            if (!groups[item.quarter]) groups[item.quarter] = [];
            groups[item.quarter].push(item);
        });

        // Sort quarters: e.g., 2025-Q4, 2026-Q1
        return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
                Không tìm thấy module nào phù hợp với bộ lọc.
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {groupedData.map(([quarter, items]) => (
                <div key={quarter} className="relative">
                    {/* Quarter Header */}
                    <div className="sticky top-20 z-10 py-4 bg-background/95 backdrop-blur-sm flex items-center gap-4 mb-6">
                        <h3 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
                            {quarter}
                        </h3>
                        <div className="h-px w-full bg-gradient-to-r from-muted to-transparent" />
                    </div>

                    {/* Items Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map(item => (
                            <RoadmapCard key={item.id} item={item} onClick={onItemClick} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
