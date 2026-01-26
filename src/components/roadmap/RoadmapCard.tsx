"use client";

import { RoadmapItem, statusConfig, groupConfig } from "@/data/roadmap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
    item: RoadmapItem;
    onClick: (item: RoadmapItem) => void;
}

export function RoadmapCard({ item, onClick }: RoadmapCardProps) {
    const status = statusConfig[item.status];
    const GroupIcon = groupConfig[item.group].icon;

    return (
        <Card
            className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
            onClick={() => onClick(item)}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className={cn("capitalize flex items-center gap-1.5 px-2 py-0.5 border-none bg-opacity-10", status.color.replace('bg-', 'text-'), status.color.replace('bg-', 'bg-'))}>
                        <status.icon className="w-3.5 h-3.5" />
                        {status.label}
                    </Badge>
                    <Badge variant="outline" className={cn(
                        "text-[10px] uppercase font-bold px-1.5 py-0",
                        item.impact === 'high' ? "text-red-500 border-red-500/20 bg-red-500/5" :
                            item.impact === 'med' ? "text-amber-500 border-amber-500/20 bg-amber-500/5" :
                                "text-blue-500 border-blue-500/20 bg-blue-500/5"
                    )}>
                        {item.impact}
                    </Badge>
                </div>
                <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                </p>
                <div className="flex flex-wrap gap-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                        <GroupIcon className="w-3 h-3" />
                        {item.group}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] text-muted-foreground/70">
                            #{tag}
                        </span>
                    ))}
                    {item.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground/70">+{item.tags.length - 3}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
