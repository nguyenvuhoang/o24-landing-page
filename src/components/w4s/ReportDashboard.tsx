"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock,
    Figma,
    GitMerge,
    LayoutTemplate,
    RefreshCw,
    Rocket,
    Smartphone,
    Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProjectReports } from "@/hooks/useProjectReports";
import type { WeeklyReport, NextAction, RiskNote, Workstream } from "@/types/reports";

import ProgressChart from "./ProgressChart";
import WeeklyHistory from "./WeeklyHistory";
import MilestoneTracker from "./MilestoneTracker";
import ReportEditor from "./ReportEditor";

// ─── Style Mappings ──────────────────────────────────────────────────────────

const workstreamIconMap: Record<string, React.ElementType> = {
    figma: Figma,
    smartphone: Smartphone,
    activity: Activity,
    rocket: Rocket,
    zap: Zap,
};

const workstreamColorMap: Record<string, { bg: string; text: string }> = {
    figma: { bg: "bg-blue-500/20", text: "text-blue-400" },
    smartphone: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
    activity: { bg: "bg-purple-500/20", text: "text-purple-400" },
    rocket: { bg: "bg-orange-500/20", text: "text-orange-400" },
    zap: { bg: "bg-amber-500/20", text: "text-amber-400" },
};

const actionStatusStyles: Record<string, {
    border: string;
    bgIcon: string;
    textIcon: string;
    badgeClass: string;
    cardClass: string;
    hasGlow?: boolean;
}> = {
    "in-progress": {
        border: "border-t-blue-500",
        bgIcon: "bg-blue-500/20 border border-blue-500/20",
        textIcon: "text-blue-400",
        badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        cardClass: "bg-slate-900 border-slate-800 hover:bg-slate-800/80 cursor-pointer shadow-lg hover:shadow-blue-500/10 transition-all",
    },
    pending: {
        border: "border-t-slate-600",
        bgIcon: "bg-slate-800 border border-slate-700",
        textIcon: "text-slate-400",
        badgeClass: "bg-slate-800 text-slate-400 border-slate-700",
        cardClass: "bg-slate-900 border-slate-800 hover:bg-slate-800/80 cursor-pointer shadow-lg transition-all",
    },
    completed: {
        border: "border-t-emerald-500",
        bgIcon: "bg-emerald-500/20 border border-emerald-500/20",
        textIcon: "text-emerald-400",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        cardClass: "bg-slate-900 border-slate-800 hover:bg-slate-800/80 cursor-pointer shadow-lg hover:shadow-emerald-500/10 transition-all",
    },
    milestone: {
        border: "border-t-orange-500",
        bgIcon: "bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)] border border-orange-500/30",
        textIcon: "text-orange-500",
        badgeClass: "bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse font-bold",
        cardClass: "bg-orange-500/10 border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] cursor-pointer transition-all relative overflow-hidden",
        hasGlow: true,
    },
};

const actionIconPool = [Figma, Smartphone, Activity, Rocket, Zap, Clock, CheckCircle2, GitMerge];

const overallStatusConfig: Record<string, { label: string; badge: string }> = {
    "on-track": { label: "Đúng Tiến Độ", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    "at-risk": { label: "Có Rủi Ro", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    delayed: { label: "Trì Hoãn", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
    completed: { label: "Hoàn Thành", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
};

const riskCategoryColors: Record<string, string> = {
    risk: "border-red-500/20",
    dependency: "border-amber-500/20",
    note: "border-blue-500/20",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReportDashboard({ projectSlug }: { projectSlug: string }) {
    const { project, reports, milestones, loading, error, refetch } = useProjectReports(projectSlug);
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const today = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const currentReport: WeeklyReport | null =
        reports.find((r) => r.week_number === selectedWeek) || reports[0] || null;

    const progressData = [...reports]
        .sort((a, b) => a.week_number - b.week_number)
        .map((r) => ({ week: r.week_number, progress: r.overall_progress, weekStart: r.week_start }));

    const generatePDF = async () => {
        const element = reportRef.current;
        if (!element) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(element, {
                backgroundColor: "#020617",
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? "landscape" : "portrait",
                unit: "px",
                format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save(`${project?.name || "Report"}_Week${currentReport?.week_number || ""}.pdf`);
        } catch (err) {
            console.error("Failed to generate PDF", err);
        } finally {
            setIsGenerating(false);
        }
    };

    // ─── Loading / Error / Empty States ──────────────────────────────────

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-slate-800 rounded-lg w-1/3" />
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-slate-800 rounded-xl" />
                    ))}
                </div>
                <div className="h-48 bg-slate-800 rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="bg-red-950/20 border-red-500/20">
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-400 mb-1">Lỗi Tải Dữ Liệu</h3>
                    <p className="text-sm text-slate-400 mb-4">{error}</p>
                    <Button onClick={refetch} variant="outline" className="border-red-500/20 text-red-400">
                        Thử Lại
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!project) {
        return (
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Không Tìm Thấy Dự Án</h3>
                    <p className="text-sm text-slate-400">
                        Vui lòng chạy SQL migration trong Supabase để khởi tạo dự án.
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-100">{project.name}</h1>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-12 text-center">
                        <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">Chưa Có Báo Cáo</h3>
                        <p className="text-sm text-slate-400 mb-6">Tạo báo cáo tuần đầu tiên để bắt đầu.</p>
                        <ReportEditor
                            projectSlug={projectSlug}
                            report={null}
                            lastWeekNumber={0}
                            latestReport={null}
                            onSave={refetch}
                            mode="create"
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ─── Main Dashboard ──────────────────────────────────────────────────

    const statusCfg = overallStatusConfig[currentReport!.overall_status] || overallStatusConfig["on-track"];

    return (
        <div className="space-y-4">
            <div
                ref={reportRef}
                className="w-full bg-slate-950 text-slate-50 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
                {/* ─── Header ─────────────────────────────────────────── */}
                <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                Báo Cáo Tiến Độ Dự Án {project.name}
                            </h1>
                            <p className="text-slate-400 mt-1">
                                Tuần {currentReport!.week_number} &bull; {currentReport!.week_start} → {currentReport!.week_end}
                            </p>
                            {reports.length > 1 && (
                                <p className="text-xs text-slate-500 mt-1 italic">
                                    💡 Chọn tuần muốn xem ở danh sách bên góc phải
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusCfg.badge}`}>
                                <Activity className="w-3 h-3 mr-1" /> {statusCfg.label}
                            </span>
                            {currentReport!.updated_by && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                    Cập nhật: {currentReport!.updated_by}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {reports.length > 1 && (
                            <Select
                                value={String(currentReport!.week_number)}
                                onValueChange={(v) => setSelectedWeek(Number(v))}
                            >
                                <SelectTrigger className="w-52 bg-slate-900 border-slate-700 text-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    {reports.map((r) => (
                                        <SelectItem key={r.week_number} value={String(r.week_number)}>
                                            Tuần {r.week_number} ({r.week_start})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                            <CalendarDays className="w-4 h-4 text-orange-500" />
                            {today}
                        </div>
                    </div>
                </header>

                {/* ─── Overview Cards ─────────────────────────────────── */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-slate-900 border-slate-800 shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                                Tiến Độ Tổng Thể
                                <Zap className="h-4 w-4 text-orange-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-slate-50">{currentReport!.overall_progress}</span>
                                <span className="text-xl text-slate-400">%</span>
                            </div>
                            <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-500"
                                    style={{ width: `${currentReport!.overall_progress}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                                Trạng Thái Tổng Quan
                                <LayoutTemplate className="h-4 w-4 text-blue-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-50">{statusCfg.label}</div>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-4">
                                <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                                Tuần {currentReport!.week_number}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                                Cập Nhật Lần Cuối
                                <Clock className="h-4 w-4 text-emerald-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-50">
                                {new Date(currentReport!.updated_at).toLocaleDateString("vi-VN")}
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-4">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                {currentReport!.updated_by || "System"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* ─── Summary / Key Message ──────────────────────────── */}
                {currentReport!.summary && (
                    <Card className="bg-slate-900/80 border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.05)] relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500" />
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0 p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                                    <Rocket className="w-8 h-8 text-orange-500" />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-xl font-semibold text-slate-50 flex items-center gap-2">
                                        Tóm Tắt Tuần {currentReport!.week_number}
                                        <Zap className="w-5 h-5 text-amber-500" />
                                    </h2>
                                    <div className="text-slate-300 leading-relaxed max-w-4xl whitespace-pre-line">
                                        <Linkify text={currentReport!.summary!} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ─── Parallel Workstreams ───────────────────────────── */}
                {currentReport!.parallel_workstreams.length > 0 && (
                    <WorkstreamSection workstreams={currentReport!.parallel_workstreams} />
                )}

                {/* ─── Achievements ───────────────────────────────────── */}
                {currentReport!.achievements.length > 0 && (
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                Kết Quả Đạt Được
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {currentReport!.achievements.map((item, idx) => (
                                    <li key={idx} className="flex flex-start gap-3 text-sm text-slate-300">
                                        <div className="bg-orange-500/20 p-1 rounded-full text-orange-500 mt-0.5 shrink-0">
                                            <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* ─── Next Actions ───────────────────────────────────── */}
                {currentReport!.next_actions.length > 0 && (
                    <div className="space-y-4 pt-2">
                        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 shrink-0">
                            <CalendarDays className="w-5 h-5 text-orange-500" />
                            Kế Hoạch Tiếp Theo
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {currentReport!.next_actions.map((action, idx) => (
                                <ActionCard key={idx} action={action} index={idx} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Progress Trend ─────────────────────────────────── */}
                {progressData.length > 1 && <ProgressChart data={progressData} />}

                {/* ─── Milestones ─────────────────────────────────────── */}
                {milestones.length > 0 && <MilestoneTracker milestones={milestones} />}

                {/* ─── Risks & Notes ──────────────────────────────────── */}
                {currentReport!.risks.length > 0 && (
                    <Card className="bg-amber-950/20 border-orange-500/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[1rem] flex items-center gap-2 text-amber-500">
                                <AlertTriangle className="w-5 h-5" />
                                Rủi Ro &amp; Lưu Ý Quan Trọng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                {currentReport!.risks.map((risk, idx) => (
                                    <RiskCard key={idx} risk={risk} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ─── Weekly History ─────────────────────────────────── */}
                {reports.length > 1 && (
                    <WeeklyHistory
                        reports={reports}
                        selectedWeek={currentReport!.week_number}
                        onSelectWeek={setSelectedWeek}
                    />
                )}
            </div>

            {/* ─── Action Buttons ─────────────────────────────────────── */}
            <div className="flex flex-wrap justify-end gap-3 pt-4">
                <ReportEditor
                    projectSlug={projectSlug}
                    report={null}
                    lastWeekNumber={reports[0]?.week_number || 0}
                    latestReport={reports[0] || null}
                    onSave={refetch}
                    mode="create"
                />
                {currentReport && (
                    <ReportEditor
                        projectSlug={projectSlug}
                        report={currentReport}
                        lastWeekNumber={reports[0]?.week_number || 0}
                        latestReport={reports[0] || null}
                        onSave={refetch}
                        mode="edit"
                    />
                )}
                <Button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className="bg-orange-500 hover:bg-orange-600 font-medium text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
                >
                    {isGenerating ? "Đang tạo PDF..." : "Xuất Báo Cáo (PDF)"}
                </Button>
            </div>
        </div>
    );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function WorkstreamSection({ workstreams }: { workstreams: Workstream[] }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2 shrink-0">
                <RefreshCw className="w-5 h-5 text-orange-500" />
                Quy Trình Triển Khai Song Song
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
                <p className="text-sm font-medium text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 w-max mb-8">
                    Thực thi song song để tối ưu thời gian dự án
                </p>

                {/* Desktop */}
                <div className="hidden lg:flex flex-col gap-12 relative py-4 lg:pr-[16rem]">
                    {workstreams.map((ws, idx) => {
                        const WsIcon = workstreamIconMap[ws.icon] || Activity;
                        const color = workstreamColorMap[ws.icon] || workstreamColorMap.activity;
                        const isFirst = idx === 0;
                        const isLast = idx === workstreams.length - 1;
                        return (
                            <div key={idx} className="flex items-center gap-4 relative z-10 w-full pl-8">
                                <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 -rotate-90 origin-center tracking-widest uppercase">
                                    LUỒNG {idx + 1}
                                </div>
                                <div className="flex-1 rounded-lg bg-slate-800/80 border border-slate-700 p-4 flex items-center justify-between shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`${color.bg} p-2 rounded-md`}>
                                            <WsIcon className={`w-5 h-5 ${color.text}`} />
                                        </div>
                                        <span className="font-semibold text-slate-200">{ws.name}</span>
                                    </div>
                                    {ws.steps.map((step, sIdx) => (
                                        <span key={sIdx} className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-slate-500 mx-2" />
                                            <span className={sIdx === ws.steps.length - 1 ? "font-medium text-orange-400 shrink-0" : "text-sm text-slate-400 shrink-0"}>
                                                {step}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                                {/* Connector lines */}
                                {isFirst && (
                                    <div className="absolute right-[-4rem] top-1/2 h-[calc(50%+1.5rem)] w-[4rem] border-t border-r border-orange-500/30 rounded-tr-xl opacity-80" />
                                )}
                                {isLast && (
                                    <div className="absolute right-[-4rem] bottom-1/2 h-[calc(50%+1.5rem)] w-[4rem] border-b border-r border-orange-500/30 rounded-br-xl opacity-80" />
                                )}
                            </div>
                        );
                    })}
                    {/* Merge Node */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-20">
                        <ArrowRight className="w-5 h-5 text-orange-500 mr-2 relative right-[2px]" />
                        <div className="bg-orange-500 text-slate-950 font-bold px-5 py-3 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center gap-2 whitespace-nowrap">
                            <GitMerge className="w-5 h-5" /> Hợp Nhất &amp; Hoàn Thiện
                        </div>
                    </div>
                </div>

                {/* Mobile */}
                <div className="flex flex-col lg:hidden gap-6 mt-4">
                    {workstreams.map((ws, idx) => {
                        const WsIcon = workstreamIconMap[ws.icon] || Activity;
                        const color = workstreamColorMap[ws.icon] || workstreamColorMap.activity;
                        return (
                            <div key={idx} className="space-y-3">
                                <div className="text-xs font-bold text-slate-500 tracking-widest uppercase">
                                    LUỒNG {idx + 1}: {ws.name}
                                </div>
                                <div className="rounded-lg bg-slate-800/80 border border-slate-700 p-4 flex flex-col gap-3">
                                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                                        <WsIcon className={`w-4 h-4 ${color.text}`} /> {ws.name}
                                    </span>
                                    <div className="text-xs text-slate-400 pl-6 border-l-2 border-slate-700 py-1 ml-2 space-y-2">
                                        {ws.steps.map((step, sIdx) => (
                                            <div key={sIdx} className={sIdx === ws.steps.length - 1 ? "text-orange-400" : ""}>
                                                → {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="mt-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-2">
                        <GitMerge className="w-5 h-5" /> Hợp Nhất &amp; Hoàn Thiện
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionCard({ action, index }: { action: NextAction; index: number }) {
    const styles = actionStatusStyles[action.status] || actionStatusStyles.pending;
    const Icon = actionIconPool[index % actionIconPool.length];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className={`flex flex-col border-t-4 ${styles.border} ${styles.cardClass}`}>
                    {styles.hasGlow && (
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Icon className="w-24 h-24 text-orange-500" />
                        </div>
                    )}
                    <CardHeader className="p-4 pb-2 relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${styles.bgIcon}`}>
                                <Icon className={`w-5 h-5 ${styles.textIcon}`} />
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider ${styles.badgeClass}`}>
                                {action.status}
                            </span>
                        </div>
                        <CardTitle className="text-base font-bold text-slate-100 leading-tight">{action.title}</CardTitle>
                        <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">
                            Timeline: {action.timeframe}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 mt-auto relative z-10">
                        <p className={`text-xs leading-relaxed ${styles.hasGlow ? "text-orange-200/70" : "text-slate-400"}`}>
                            {action.shortDesc}
                        </p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-slate-50 shadow-2xl p-0 overflow-hidden sm:max-w-md">
                <div className={`h-1 w-full ${styles.border.replace("border-t-", "bg-")}`} />
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-3 rounded-xl ${styles.bgIcon}`}>
                                <Icon className={`w-6 h-6 ${styles.textIcon}`} />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold bg-gradient-to-br from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                    {action.title}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 mt-1">
                                    Target: <span className="text-slate-200 font-semibold">{action.timeframe}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 space-y-3 mt-4">
                        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-orange-500" />
                            Chi tiết công việc
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{action.fullDesc}</p>
                        <div className="pt-2 flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider ${styles.badgeClass}`}>
                                {action.status}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                                {action.priority}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function RiskCard({ risk }: { risk: RiskNote }) {
    return (
        <div className={`bg-slate-900/50 p-4 rounded-lg border ${riskCategoryColors[risk.category] || "border-orange-500/10"} text-sm`}>
            <span className="block font-medium text-slate-200 mb-1">{risk.title}</span>
            <span className="text-slate-400">{risk.description}</span>
            <div className="mt-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                    {risk.category}
                </span>
            </div>
        </div>
    );
}

const URL_REGEX = /https?:\/\/[^\s]+/g;

function Linkify({ text }: { text: string }) {
    const parts = text.split(URL_REGEX);
    const urls = text.match(URL_REGEX) || [];

    return (
        <>
            {parts.map((part, i) => (
                <span key={i}>
                    {part}
                    {urls[i] && (
                        <a
                            href={urls[i]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 underline underline-offset-2 hover:text-orange-300 break-all"
                        >
                            {urls[i]}
                        </a>
                    )}
                </span>
            ))}
        </>
    );
}
