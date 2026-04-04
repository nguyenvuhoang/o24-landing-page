"use client";

import { useState } from "react";
import { Plus, Trash2, Copy, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveReport } from "@/hooks/useProjectReports";
import type { WeeklyReport, ReportFormData, NextAction, RiskNote, Workstream } from "@/types/reports";

const emptyForm: ReportFormData = {
    week_number: 1,
    week_start: "",
    week_end: "",
    overall_progress: 0,
    overall_status: "on-track",
    summary: "",
    ongoing_activities: [],
    parallel_workstreams: [],
    achievements: [],
    next_actions: [],
    risks: [],
    updated_by: "",
};

const emptyAction: NextAction = {
    title: "",
    shortDesc: "",
    fullDesc: "",
    status: "pending",
    timeframe: "",
    priority: "medium",
};

const emptyRisk: RiskNote = {
    title: "",
    description: "",
    category: "risk",
};

const emptyWorkstream: Workstream = {
    name: "",
    icon: "activity",
    steps: [],
};

function reportToForm(r: WeeklyReport): ReportFormData {
    return {
        week_number: r.week_number,
        week_start: r.week_start,
        week_end: r.week_end,
        overall_progress: r.overall_progress,
        overall_status: r.overall_status,
        summary: r.summary || "",
        ongoing_activities: r.ongoing_activities || [],
        parallel_workstreams: r.parallel_workstreams || [],
        achievements: r.achievements || [],
        next_actions: r.next_actions || [],
        risks: r.risks || [],
        updated_by: r.updated_by || "",
    };
}

interface ReportEditorProps {
    projectSlug: string;
    report: WeeklyReport | null;
    lastWeekNumber: number;
    latestReport: WeeklyReport | null;
    onSave: () => void;
    mode: "create" | "edit";
}

export default function ReportEditor({
    projectSlug,
    report,
    lastWeekNumber,
    latestReport,
    onSave,
    mode,
}: ReportEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [form, setForm] = useState<ReportFormData>(
        mode === "edit" && report ? reportToForm(report) : { ...emptyForm, week_number: lastWeekNumber + 1 }
    );

    const handleOpen = (open: boolean) => {
        if (open) {
            setForm(
                mode === "edit" && report
                    ? reportToForm(report)
                    : { ...emptyForm, week_number: lastWeekNumber + 1 }
            );
            setSaveError("");
        }
        setIsOpen(open);
    };

    const copyFromPrevious = () => {
        if (!latestReport) return;
        const copied = reportToForm(latestReport);
        copied.week_number = lastWeekNumber + 1;
        copied.updated_by = "";
        setForm(copied);
    };

    const updateField = <K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // Next Actions helpers
    const addAction = () => updateField("next_actions", [...form.next_actions, { ...emptyAction }]);
    const removeAction = (idx: number) =>
        updateField("next_actions", form.next_actions.filter((_, i) => i !== idx));
    const updateAction = (idx: number, updates: Partial<NextAction>) => {
        const updated = [...form.next_actions];
        updated[idx] = { ...updated[idx], ...updates };
        updateField("next_actions", updated);
    };

    // Risks helpers
    const addRisk = () => updateField("risks", [...form.risks, { ...emptyRisk }]);
    const removeRisk = (idx: number) =>
        updateField("risks", form.risks.filter((_, i) => i !== idx));
    const updateRisk = (idx: number, updates: Partial<RiskNote>) => {
        const updated = [...form.risks];
        updated[idx] = { ...updated[idx], ...updates };
        updateField("risks", updated);
    };

    // Workstream helpers
    const addWorkstream = () =>
        updateField("parallel_workstreams", [...form.parallel_workstreams, { ...emptyWorkstream }]);
    const removeWorkstream = (idx: number) =>
        updateField("parallel_workstreams", form.parallel_workstreams.filter((_, i) => i !== idx));
    const updateWorkstream = (idx: number, updates: Partial<Workstream>) => {
        const updated = [...form.parallel_workstreams];
        updated[idx] = { ...updated[idx], ...updates };
        updateField("parallel_workstreams", updated);
    };

    const handleSave = async () => {
        if (!form.week_start || !form.week_end) {
            setSaveError("Vui lòng nhập ngày bắt đầu và kết thúc tuần.");
            return;
        }

        setIsSaving(true);
        setSaveError("");
        try {
            const payload =
                mode === "create" ? { projectSlug, ...form } : form;
            await saveReport(mode, payload, report?.id);
            setIsOpen(false);
            onSave();
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Không thể lưu báo cáo");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                {mode === "create" ? (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2">
                        <Plus className="w-4 h-4" /> Tạo Báo Cáo Mới
                    </Button>
                ) : (
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 font-medium gap-2">
                        <Save className="w-4 h-4" /> Chỉnh Sửa
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-slate-50 shadow-2xl max-w-2xl max-h-[90vh] p-0 overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500" />
                <div className="p-6 pb-0">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-100">
                            {mode === "create" ? "Tạo Báo Cáo Mới" : `Chỉnh Sửa Tuần ${report?.week_number}`}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {mode === "create"
                                ? "Nhập thông tin cho báo cáo tuần mới"
                                : "Cập nhật nội dung báo cáo"}
                        </DialogDescription>
                    </DialogHeader>
                    {mode === "create" && latestReport && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyFromPrevious}
                            className="mt-3 border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            Copy từ Tuần {latestReport.week_number}
                        </Button>
                    )}
                </div>

                <ScrollArea className="max-h-[60vh] px-6 pb-6">
                    <Tabs defaultValue="basic" className="mt-4">
                        <TabsList className="bg-slate-900 border border-slate-800 w-full grid grid-cols-5">
                            <TabsTrigger value="basic" className="text-xs data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                                Thông tin
                            </TabsTrigger>
                            <TabsTrigger value="activities" className="text-xs data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                                Hoạt động
                            </TabsTrigger>
                            <TabsTrigger value="achievements" className="text-xs data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                                Kết quả
                            </TabsTrigger>
                            <TabsTrigger value="actions" className="text-xs data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                                Kế hoạch
                            </TabsTrigger>
                            <TabsTrigger value="risks" className="text-xs data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                                Rủi ro
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab 1: Basic Info */}
                        <TabsContent value="basic" className="space-y-4 mt-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs">Tuần số</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={form.week_number}
                                        onChange={(e) => updateField("week_number", parseInt(e.target.value) || 1)}
                                        className="bg-slate-900 border-slate-700 text-slate-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs">Ngày bắt đầu</Label>
                                    <Input
                                        type="date"
                                        value={form.week_start}
                                        onChange={(e) => updateField("week_start", e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-slate-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs">Ngày kết thúc</Label>
                                    <Input
                                        type="date"
                                        value={form.week_end}
                                        onChange={(e) => updateField("week_end", e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-slate-50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs">Tiến độ tổng thể (%)</Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={form.overall_progress}
                                            onChange={(e) => updateField("overall_progress", parseInt(e.target.value))}
                                            className="flex-1 accent-orange-500"
                                        />
                                        <span className="text-lg font-bold text-orange-500 w-12 text-right">
                                            {form.overall_progress}%
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs">Trạng thái</Label>
                                    <Select
                                        value={form.overall_status}
                                        onValueChange={(v) => updateField("overall_status", v as ReportFormData["overall_status"])}
                                    >
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value="on-track">Đúng tiến độ</SelectItem>
                                            <SelectItem value="at-risk">Có rủi ro</SelectItem>
                                            <SelectItem value="delayed">Trì hoãn</SelectItem>
                                            <SelectItem value="completed">Hoàn thành</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-xs">Tóm tắt (Key message cho stakeholder)</Label>
                                <Textarea
                                    value={form.summary || ""}
                                    onChange={(e) => updateField("summary", e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-slate-50 min-h-[100px]"
                                    placeholder="Nội dung tóm tắt chính cho tuần này..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-xs">Người cập nhật</Label>
                                <Input
                                    value={form.updated_by || ""}
                                    onChange={(e) => updateField("updated_by", e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-slate-50"
                                    placeholder="Tên người cập nhật báo cáo"
                                />
                            </div>
                        </TabsContent>

                        {/* Tab 2: Activities & Workstreams */}
                        <TabsContent value="activities" className="space-y-6 mt-4">
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-xs">Hoạt động đang diễn ra (mỗi dòng = 1 hoạt động)</Label>
                                <Textarea
                                    value={form.ongoing_activities.join("\n")}
                                    onChange={(e) =>
                                        updateField("ongoing_activities", e.target.value.split("\n").filter(Boolean))
                                    }
                                    className="bg-slate-900 border-slate-700 text-slate-50 min-h-[100px]"
                                    placeholder={"Hoạt động 1\nHoạt động 2\nHoạt động 3"}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-slate-400 text-xs">Luồng triển khai song song</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addWorkstream}
                                        className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1 h-7 text-xs"
                                    >
                                        <Plus className="w-3 h-3" /> Thêm
                                    </Button>
                                </div>
                                {form.parallel_workstreams.map((ws, idx) => (
                                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={ws.name}
                                                onChange={(e) => updateWorkstream(idx, { name: e.target.value })}
                                                className="bg-slate-900 border-slate-700 text-slate-50 flex-1"
                                                placeholder="Tên luồng (vd: Thiết Kế)"
                                            />
                                            <Select
                                                value={ws.icon}
                                                onValueChange={(v) => updateWorkstream(idx, { icon: v })}
                                            >
                                                <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50 w-36">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-700">
                                                    <SelectItem value="figma">Figma</SelectItem>
                                                    <SelectItem value="smartphone">Smartphone</SelectItem>
                                                    <SelectItem value="activity">Activity</SelectItem>
                                                    <SelectItem value="rocket">Rocket</SelectItem>
                                                    <SelectItem value="zap">Zap</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeWorkstream(idx)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <Input
                                            value={ws.steps.join(", ")}
                                            onChange={(e) =>
                                                updateWorkstream(idx, {
                                                    steps: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                                })
                                            }
                                            className="bg-slate-900 border-slate-700 text-slate-50"
                                            placeholder="Bước 1, Bước 2, Bước 3 (cách nhau bằng dấu phẩy)"
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Tab 3: Achievements */}
                        <TabsContent value="achievements" className="space-y-4 mt-4">
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-xs">Kết quả đạt được (mỗi dòng = 1 thành tựu)</Label>
                                <Textarea
                                    value={form.achievements.join("\n")}
                                    onChange={(e) =>
                                        updateField("achievements", e.target.value.split("\n").filter(Boolean))
                                    }
                                    className="bg-slate-900 border-slate-700 text-slate-50 min-h-[180px]"
                                    placeholder={"Thành tựu 1\nThành tựu 2\nThành tựu 3"}
                                />
                            </div>
                        </TabsContent>

                        {/* Tab 4: Next Actions */}
                        <TabsContent value="actions" className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-400 text-xs">Kế hoạch hành động tiếp theo</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addAction}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1 h-7 text-xs"
                                >
                                    <Plus className="w-3 h-3" /> Thêm
                                </Button>
                            </div>
                            {form.next_actions.map((action, idx) => (
                                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-400">Action #{idx + 1}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAction(idx)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            value={action.title}
                                            onChange={(e) => updateAction(idx, { title: e.target.value })}
                                            className="bg-slate-900 border-slate-700 text-slate-50"
                                            placeholder="Tiêu đề"
                                        />
                                        <Input
                                            value={action.timeframe}
                                            onChange={(e) => updateAction(idx, { timeframe: e.target.value })}
                                            className="bg-slate-900 border-slate-700 text-slate-50"
                                            placeholder="Timeline (vd: Tuần 2)"
                                        />
                                    </div>
                                    <Input
                                        value={action.shortDesc}
                                        onChange={(e) => updateAction(idx, { shortDesc: e.target.value })}
                                        className="bg-slate-900 border-slate-700 text-slate-50"
                                        placeholder="Mô tả ngắn (hiển thị trên card)"
                                    />
                                    <Textarea
                                        value={action.fullDesc}
                                        onChange={(e) => updateAction(idx, { fullDesc: e.target.value })}
                                        className="bg-slate-900 border-slate-700 text-slate-50 min-h-[60px]"
                                        placeholder="Mô tả chi tiết"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Select
                                            value={action.status}
                                            onValueChange={(v) => updateAction(idx, { status: v as NextAction["status"] })}
                                        >
                                            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
                                                <SelectValue placeholder="Trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700">
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="milestone">Milestone</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={action.priority}
                                            onValueChange={(v) => updateAction(idx, { priority: v as NextAction["priority"] })}
                                        >
                                            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
                                                <SelectValue placeholder="Ưu tiên" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700">
                                                <SelectItem value="high">Cao</SelectItem>
                                                <SelectItem value="medium">Trung bình</SelectItem>
                                                <SelectItem value="low">Thấp</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                            {form.next_actions.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-6">
                                    Chưa có action nào. Nhấn &quot;Thêm&quot; để bắt đầu.
                                </p>
                            )}
                        </TabsContent>

                        {/* Tab 5: Risks */}
                        <TabsContent value="risks" className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-400 text-xs">Rủi ro &amp; Lưu ý</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addRisk}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1 h-7 text-xs"
                                >
                                    <Plus className="w-3 h-3" /> Thêm
                                </Button>
                            </div>
                            {form.risks.map((risk, idx) => (
                                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-400">Risk #{idx + 1}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRisk(idx)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <Input
                                        value={risk.title}
                                        onChange={(e) => updateRisk(idx, { title: e.target.value })}
                                        className="bg-slate-900 border-slate-700 text-slate-50"
                                        placeholder="Tiêu đề"
                                    />
                                    <Textarea
                                        value={risk.description}
                                        onChange={(e) => updateRisk(idx, { description: e.target.value })}
                                        className="bg-slate-900 border-slate-700 text-slate-50 min-h-[60px]"
                                        placeholder="Mô tả chi tiết"
                                    />
                                    <Select
                                        value={risk.category}
                                        onValueChange={(v) => updateRisk(idx, { category: v as RiskNote["category"] })}
                                    >
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50 w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value="risk">Risk</SelectItem>
                                            <SelectItem value="dependency">Dependency</SelectItem>
                                            <SelectItem value="note">Note</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                            {form.risks.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-6">
                                    Chưa có risk nào. Nhấn &quot;Thêm&quot; để bắt đầu.
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-slate-800 p-4 flex items-center justify-between">
                    {saveError && <p className="text-red-400 text-xs flex-1">{saveError}</p>}
                    <div className="flex gap-2 ml-auto">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> Lưu Báo Cáo
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
