"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project, WeeklyReport, ProjectMilestone } from "@/types/reports";

export function useProjectReports(projectSlug: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [reports, setReports] = useState<WeeklyReport[]>([]);
    const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const key = localStorage.getItem("w4s_auth_key") || "";
            const res = await fetch(`/api/reports?projectSlug=${encodeURIComponent(projectSlug)}`, {
                headers: { "x-access-key": key },
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to fetch reports");
            }
            const result = await res.json();
            setProject(result.project);
            setReports(result.reports);
            setMilestones(result.milestones);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [projectSlug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { project, reports, milestones, loading, error, refetch: fetchData };
}

export async function saveReport(
    mode: "create" | "edit",
    data: Record<string, unknown>,
    reportId?: string
) {
    const key = localStorage.getItem("w4s_auth_key") || "";
    const url = mode === "create" ? "/api/reports" : `/api/reports/${reportId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "x-access-key": key,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save report");
    }

    return res.json();
}
