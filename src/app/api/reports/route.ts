import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const VALID_KEY = process.env.W4S_ACCESS_KEY || "W4S-2026";

function checkAuth(request: NextRequest) {
    const key = request.headers.get("x-access-key");
    return key === VALID_KEY;
}

export async function GET(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectSlug = request.nextUrl.searchParams.get("projectSlug");
    if (!projectSlug) {
        return NextResponse.json({ error: "projectSlug is required" }, { status: 400 });
    }

    const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", projectSlug)
        .single();

    if (projectError || !project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const [reportsResult, milestonesResult] = await Promise.all([
        supabase
            .from("weekly_reports")
            .select("*")
            .eq("project_id", project.id)
            .order("week_number", { ascending: false }),
        supabase
            .from("project_milestones")
            .select("*")
            .eq("project_id", project.id)
            .order("sort_order", { ascending: true }),
    ]);

    return NextResponse.json({
        project,
        reports: reportsResult.data || [],
        milestones: milestonesResult.data || [],
    });
}

export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { projectSlug, ...reportData } = body;

    if (!projectSlug || typeof projectSlug !== "string") {
        return NextResponse.json({ error: "projectSlug is required" }, { status: 400 });
    }

    const weekNumber = reportData.week_number;
    if (!weekNumber || typeof weekNumber !== "number" || weekNumber < 1) {
        return NextResponse.json({ error: "Valid week_number is required" }, { status: 400 });
    }

    const progress = reportData.overall_progress;
    if (progress === undefined || typeof progress !== "number" || progress < 0 || progress > 100) {
        return NextResponse.json({ error: "overall_progress must be 0-100" }, { status: 400 });
    }

    const { data: project } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single();

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: existing } = await supabase
        .from("weekly_reports")
        .select("id")
        .eq("project_id", project.id)
        .eq("week_number", weekNumber)
        .single();

    if (existing) {
        return NextResponse.json({ error: "A report for this week already exists" }, { status: 409 });
    }

    const { data, error } = await supabase
        .from("weekly_reports")
        .insert({
            project_id: project.id,
            ...reportData,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
