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

    const { data: project } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single();

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", project.id)
        .order("sort_order", { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
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

    const { projectSlug, ...milestoneData } = body;

    if (!projectSlug || typeof projectSlug !== "string") {
        return NextResponse.json({ error: "projectSlug is required" }, { status: 400 });
    }

    if (!milestoneData.title || typeof milestoneData.title !== "string") {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const { data: project } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single();

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data, error } = await supabase
        .from("project_milestones")
        .insert({
            project_id: project.id,
            ...milestoneData,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { id, ...updateData } = body;

    if (!id || typeof id !== "string") {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    delete updateData.project_id;
    delete updateData.created_at;

    const { data, error } = await supabase
        .from("project_milestones")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
