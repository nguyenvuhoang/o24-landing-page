"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoadmapFilters } from "./useRoadmapFilters";
import { X, Search, Filter, LayoutGrid, LayoutList } from "lucide-react";
import { statusConfig } from "@/data/roadmap";

import { RoadmapItem } from "@/data/roadmap";

export function RoadmapFilters({ items }: { items: RoadmapItem[] }) {
    const { filters, updateFilters, resetFilters, quarters, groups } = useRoadmapFilters(items);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* View Toggle */}
                <Tabs
                    defaultValue={filters.view}
                    onValueChange={(v) => updateFilters({ view: v as "timeline" | "board" })}
                    className="w-full md:w-auto"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="timeline" className="flex items-center gap-2">
                            <LayoutList className="w-4 h-4" />
                            Timeline
                        </TabsTrigger>
                        <TabsTrigger value="board" className="flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            Board
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Search */}
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm modules, tags..."
                        value={filters.q}
                        onChange={(e) => updateFilters({ q: e.target.value })}
                        className="pl-9 bg-muted/50 border-none focus-visible:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
                    <Filter className="w-4 h-4" />
                    BỘ LỌC
                </div>

                {/* Status Filter */}
                <Select value={filters.status} onValueChange={(v) => updateFilters({ status: v })}>
                    <SelectTrigger className="w-[140px] h-9 text-xs rounded-full bg-muted/30 border-none">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Group Filter */}
                <Select value={filters.group} onValueChange={(v) => updateFilters({ group: v })}>
                    <SelectTrigger className="w-[180px] h-9 text-xs rounded-full bg-muted/30 border-none">
                        <SelectValue placeholder="Nhóm sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả các nhóm</SelectItem>
                        {groups.map(group => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Quarter Filter */}
                <Select value={filters.quarter} onValueChange={(v) => updateFilters({ quarter: v })}>
                    <SelectTrigger className="w-[120px] h-9 text-xs rounded-full bg-muted/30 border-none">
                        <SelectValue placeholder="Quý" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả quý</SelectItem>
                        {quarters.map(q => (
                            <SelectItem key={q} value={q}>{q}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Reset */}
                {(filters.status !== "all" || filters.group !== "all" || filters.quarter !== "all" || filters.q) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Đặt lại
                    </Button>
                )}
            </div>
        </div>
    );
}
