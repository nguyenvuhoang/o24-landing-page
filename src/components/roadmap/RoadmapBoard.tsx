"use client";

import { useMemo } from "react";
import { RoadmapItem, statusConfig, RoadmapStatus } from "@/data/roadmap";
import { RoadmapCard } from "./RoadmapCard";
import { cn } from "@/lib/utils";

interface RoadmapBoardProps {
    data: RoadmapItem[];
    onItemClick: (item: RoadmapItem) => void;
}

const BOARD_COLUMNS: RoadmapStatus[] = ['live', 'in_progress', 'planned', 'backlog'];

export function RoadmapBoard({ data, onItemClick }: RoadmapBoardProps) {
    const columns = useMemo(() => {
        const cols: Record<RoadmapStatus, RoadmapItem[]> = {
            live: [],
            in_progress: [],
            planned: [],
            backlog: [],
            deprecated: []
        };
        data.forEach(item => {
            cols[item.status].push(item);
        });
        return cols;
    }, [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            {BOARD_COLUMNS.map(statusKey => {
                const config = statusConfig[statusKey];
                const items = columns[statusKey];

                return (
                    <div key={statusKey} className="flex flex-col gap-4 bg-muted/20 p-4 rounded-3xl min-h-[500px]">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", config.color)} />
                                {config.label}
                            </h3>
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {items.length}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {items.length > 0 ? (
                                items.map(item => (
                                    <RoadmapCard key={item.id} item={item} onClick={onItemClick} />
                                ))
                            ) : (
                                <div className="py-10 text-center text-[10px] text-muted-foreground border border-dashed rounded-2xl">
                                    Trống
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
