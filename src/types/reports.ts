export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    created_at: string;
}

export interface Workstream {
    name: string;
    icon: string;
    steps: string[];
}

export interface NextAction {
    title: string;
    shortDesc: string;
    fullDesc: string;
    status: "pending" | "in-progress" | "completed" | "milestone";
    timeframe: string;
    priority: "high" | "medium" | "low";
}

export interface RiskNote {
    title: string;
    description: string;
    category: "risk" | "dependency" | "note";
}

export interface WeeklyReport {
    id: string;
    project_id: string;
    week_number: number;
    week_start: string;
    week_end: string;
    overall_progress: number;
    overall_status: "on-track" | "at-risk" | "delayed" | "completed";
    summary: string | null;
    ongoing_activities: string[];
    parallel_workstreams: Workstream[];
    achievements: string[];
    next_actions: NextAction[];
    risks: RiskNote[];
    updated_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectMilestone {
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    target_date: string | null;
    status: "pending" | "in-progress" | "completed";
    sort_order: number;
    created_at: string;
}

export interface ProjectReportData {
    project: Project;
    reports: WeeklyReport[];
    milestones: ProjectMilestone[];
}

export type ReportFormData = Omit<WeeklyReport, "id" | "project_id" | "created_at" | "updated_at">;
