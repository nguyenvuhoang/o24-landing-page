"use client";

import { CalendarDays, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyReport } from "@/types/reports";

const statusBadge: Record<string, string> = {
    "on-track": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "at-risk": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "delayed": "bg-red-500/10 text-red-400 border-red-500/20",
    "completed": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const statusLabel: Record<string, string> = {
    "on-track": "Đúng tiến độ",
    "at-risk": "Có rủi ro",
    "delayed": "Trì hoãn",
    "completed": "Hoàn thành",
};

interface WeeklyHistoryProps {
    reports: WeeklyReport[];
    selectedWeek: number;
    onSelectWeek: (week: number) => void;
}

export default function WeeklyHistory({ reports, selectedWeek, onSelectWeek }: WeeklyHistoryProps) {
    if (reports.length === 0) return null;

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                    <CalendarDays className="w-5 h-5 text-orange-500" />
                    Lịch Sử Báo Cáo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Tuần</th>
                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Thời gian</th>
                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Tiến độ</th>
                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Trạng thái</th>
                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Cập nhật bởi</th>
                                <th className="py-3 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => {
                                const isSelected = report.week_number === selectedWeek;
                                return (
                                    <tr
                                        key={report.id}
                                        onClick={() => onSelectWeek(report.week_number)}
                                        className={`border-b border-slate-800/50 cursor-pointer transition-colors ${
                                            isSelected
                                                ? "bg-orange-500/10 border-l-2 border-l-orange-500"
                                                : "hover:bg-slate-800/50"
                                        }`}
                                    >
                                        <td className="py-3 px-4 font-medium text-slate-200">
                                            Tuần {report.week_number}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">
                                            {report.week_start} → {report.week_end}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-orange-500 rounded-full"
                                                        style={{ width: `${report.overall_progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-slate-200 font-medium">
                                                    {report.overall_progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${
                                                statusBadge[report.overall_status] || statusBadge["on-track"]
                                            }`}>
                                                {statusLabel[report.overall_status] || report.overall_status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">
                                            {report.updated_by || "—"}
                                        </td>
                                        <td className="py-3 px-4">
                                            <ChevronRight className={`w-4 h-4 transition-colors ${
                                                isSelected ? "text-orange-500" : "text-slate-600"
                                            }`} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
