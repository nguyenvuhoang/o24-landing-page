"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { RoadmapItem } from "@/data/roadmap";

export function useRoadmapFilters(data: RoadmapItem[]) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const filters = useMemo(() => ({
        view: (searchParams.get("view") as "timeline" | "board") || "timeline",
        status: searchParams.get("status") || "all",
        group: searchParams.get("group") || "all",
        quarter: searchParams.get("quarter") || "all",
        q: searchParams.get("q") || "",
    }), [searchParams]);

    const updateFilters = useCallback((updates: Partial<typeof filters>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== "all") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    const resetFilters = useCallback(() => {
        router.push(pathname, { scroll: false });
    }, [router, pathname]);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchStatus = filters.status === "all" || item.status === filters.status;
            const matchGroup = filters.group === "all" || item.group === filters.group;
            const matchQuarter = filters.quarter === "all" || item.quarter === filters.quarter;
            const matchSearch = !filters.q ||
                item.title.toLowerCase().includes(filters.q.toLowerCase()) ||
                item.description.toLowerCase().includes(filters.q.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(filters.q.toLowerCase()));

            return matchStatus && matchGroup && matchQuarter && matchSearch;
        });
    }, [filters]);

    const stats = useMemo(() => {
        const counts = {
            live: 0,
            in_progress: 0,
            planned: 0,
            backlog: 0,
            total: data.length
        };
        data.forEach(item => {
            if (item.status in counts) {
                counts[item.status as keyof typeof counts]++;
            }
        });
        return counts;
    }, []);

    const quarters = useMemo(() => {
        const uniqueQuarters = Array.from(new Set(data.map(item => item.quarter)));
        return uniqueQuarters.sort();
    }, []);

    const groups = useMemo(() => {
        return Array.from(new Set(data.map(item => item.group))).sort();
    }, []);

    return {
        filters,
        updateFilters,
        resetFilters,
        filteredData,
        stats,
        quarters,
        groups
    };
}
