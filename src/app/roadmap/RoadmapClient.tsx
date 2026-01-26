"use client";

import { useState, useEffect } from "react";
import { RoadmapFilters } from "@/components/roadmap/RoadmapFilters";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { RoadmapBoard } from "@/components/roadmap/RoadmapBoard";
import { RoadmapDetailDialog } from "@/components/roadmap/RoadmapDetailDialog";
import { useRoadmapFilters } from "@/components/roadmap/useRoadmapFilters";
import { RoadmapItem, statusConfig } from "@/data/roadmap";
import { cn } from "@/lib/utils";

export function RoadmapContent({ items }: { items: RoadmapItem[] }) {
    const { filteredData, filters, stats } = useRoadmapFilters(items);
    const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleItemClick = (item: RoadmapItem) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    if (!mounted) {
        return <div className="h-[600px] flex items-center justify-center">Initializing...</div>;
    }

    return (
        <>
            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                <div className="bg-muted/30 p-4 rounded-3xl border border-muted/50">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Total Modules</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                {Object.entries(statusConfig).filter(([s]) => s !== 'deprecated').map(([key, config]) => (
                    <div key={key} className="bg-muted/30 p-4 rounded-3xl border border-muted/50 relative overflow-hidden group">
                        <div className={cn("absolute top-0 right-0 w-16 h-16 opacity-[0.03] -mr-4 -mt-4 transition-transform group-hover:scale-110", config.color)} />
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{config.label}</p>
                        <p className="text-3xl font-bold">{stats[key as keyof typeof stats]}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="mb-10 bg-background/50 backdrop-blur-md sticky top-0 md:top-[64px] z-20 py-4 border-b">
                <RoadmapFilters items={items} />
            </div>

            {/* Content View */}
            <div className="min-h-[400px]">
                {filters.view === "timeline" ? (
                    <RoadmapTimeline data={filteredData} onItemClick={handleItemClick} />
                ) : (
                    <RoadmapBoard data={filteredData} onItemClick={handleItemClick} />
                )}
            </div>

            {/* Detail Modal */}
            <RoadmapDetailDialog
                item={selectedItem}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </>
    );
}
