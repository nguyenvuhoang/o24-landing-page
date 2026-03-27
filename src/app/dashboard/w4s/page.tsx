"use client";

import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    CalendarDays,
    Clock,
    Figma,
    GitMerge,
    RefreshCw,
    Rocket,
    Smartphone,
    Zap,
    LayoutTemplate,
    Lock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function W4SProgressReport() {
    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const reportRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessKey, setAccessKey] = useState("");
    const [authError, setAuthError] = useState("");
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("w4s_auth_key");
        if (stored === "W4S-2026") {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessKey === "W4S-2026") {
            localStorage.setItem("w4s_auth_key", accessKey);
            setIsAuthenticated(true);
            setAuthError("");
        } else {
            setAuthError("Mã truy cập không hợp lệ. Vui lòng kiểm tra lại.");
        }
    };

    const generatePDF = async () => {
        const element = reportRef.current;
        if (!element) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#020617', // slate-950
                scale: 2,
                useCORS: true
            });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('W4S_Progress_Report.pdf');
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (isChecking) {
        return <div className="min-h-[50vh] flex items-center justify-center text-slate-400">Checking credentials...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-50 animate-in fade-in duration-500 backdrop-blur-xl">
                <Card className="w-full max-w-sm bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
                    <CardHeader className="text-center relative z-10 space-y-2 pb-4 pt-8">
                        <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 mb-2">
                            <Lock className="w-5 h-5 text-orange-500" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-100 tracking-tight">
                            W4S Application
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-xs px-4">
                            Khu vực báo cáo chỉ dành cho đơn vị W4S. Vui lòng nhập mã truy cập.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 pb-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-400 text-xs">MÃ TRUY CẬP (ACCESS KEY)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-slate-50 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11 shadow-inner text-center font-mono tracking-widest"
                                    placeholder="••••••••"
                                    autoFocus
                                />
                            </div>
                            {authError && <p className="text-red-400 text-xs font-medium text-center">{authError}</p>}
                            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-bold tracking-wide text-white h-11 shadow-[0_4px_20px_rgba(249,115,22,0.25)] transition-all">
                                TRUY CẬP BÁO CÁO
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div
                ref={reportRef}
                className="w-full bg-slate-950 text-slate-50 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                Báo Cáo Tiến Độ Dự Án W4S
                            </h1>
                            <p className="text-slate-400 mt-1">Cập Nhật Hàng Tuần &bull; Ứng Dụng Di Động W4S</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                <Activity className="w-3 h-3 mr-1" /> Đang Triển Khai
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Figma className="w-3 h-3 mr-1" /> Đánh Giá Thiết Kế
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Rocket className="w-3 h-3 mr-1" /> Có Bản Thử Nghiệm
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                        <CalendarDays className="w-4 h-4 text-orange-500" />
                        {today}
                    </div>
                </header>

                {/* Overview Section */}
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
                                <span className="text-4xl font-bold text-slate-50">65</span>
                                <span className="text-xl text-slate-400">%</span>
                            </div>
                            <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                                Trạng Thái Đánh Giá Thiết Kế
                                <LayoutTemplate className="h-4 w-4 text-blue-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-50">Đang Đánh Giá</div>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-4">
                                <RefreshCw className="h-3.5 w-3.5 text-blue-400 animate-spin-slow" />
                                Các bên liên quan đang review Figma
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                                Trạng Thái Bản Thử Nghiệm
                                <Smartphone className="h-4 w-4 text-emerald-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-50">Đã Phát Hành</div>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-4">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                Tính năng cốt lõi sẵn sàng để test
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Status (Key Message) */}
                <Card className="bg-slate-900/80 border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.05)] relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500" />
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0 p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                                <Rocket className="w-8 h-8 text-orange-500" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold text-slate-50 flex items-center gap-2">
                                    Tăng Tốc Độ Triển Khai Nhờ Thực Thi Song Song
                                    <Zap className="w-5 h-5 text-amber-500" />
                                </h2>
                                <p className="text-slate-300 leading-relaxed max-w-4xl">
                                    Dự án hiện đang trong <strong className="text-slate-100">giai đoạn chốt thiết kế</strong>, các bên liên quan đang tích cực review giao diện Ứng dụng W4S trên Figma. Song song đó, một <strong className="text-slate-100">bản prototype thử nghiệm</strong> cũng đã được phát hành nhằm cung cấp trải nghiệm sử dụng thực tế và mang tính trực quan cao hơn.
                                </p>
                                <p className="text-slate-300 leading-relaxed max-w-4xl">
                                    Hai luồng công việc này đang chạy song song để <strong className="text-orange-400">tối ưu hóa thời gian bàn giao</strong>. Do app được xây dựng dựa trên kiến trúc động (dynamic), việc chỉnh sửa diễn ra rất nhanh chóng mà không gây ảnh hưởng tới nền tảng, cho phép team linh hoạt đón nhận phản hồi từ cả góc độ thiết kế tĩnh lẫn trải nghiệm sử dụng thật.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Parallel Workstream */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2 shrink-0">
                        <RefreshCw className="w-5 h-5 text-orange-500" />
                        Quy Trình Triển Khai Song Song
                    </h3>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
                        <p className="text-sm font-medium text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 w-max mb-8">
                            Thực thi song song để tối ưu thời gian dự án
                        </p>

                        {/* Desktop Visualization */}
                        <div className="hidden lg:flex flex-col gap-12 relative py-4 lg:pr-[16rem]">
                            {/* Lane 1 */}
                            <div className="flex items-center gap-4 relative z-10 w-full pl-8">
                                <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 -rotate-90 origin-center tracking-widest uppercase">LUỒNG 1</div>
                                <div className="flex-1 rounded-lg bg-slate-800/80 border border-slate-700 p-4 flex items-center justify-between shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-500/20 p-2 rounded-md"><Figma className="w-5 h-5 text-blue-400" /></div>
                                        <span className="font-semibold text-slate-200">Review Figma</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-500 mx-4" />
                                    <span className="text-sm text-slate-400 shrink-0">Nhận Feedback</span>
                                    <ArrowRight className="w-4 h-4 text-slate-500 mx-4" />
                                    <span className="font-medium text-orange-400 shrink-0">Điều Chỉnh</span>
                                </div>

                                {/* Connector Line down to Merge */}
                                <div className="absolute right-[-4rem] top-1/2 h-[calc(50%+1.5rem)] w-[4rem] border-t border-r border-orange-500/30 rounded-tr-xl opacity-80" />
                            </div>

                            {/* Lane 2 */}
                            <div className="flex items-center gap-4 relative z-10 w-full pl-8">
                                <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 -rotate-90 origin-center tracking-widest uppercase">LUỒNG 2</div>
                                <div className="flex-1 rounded-lg bg-slate-800/80 border border-slate-700 p-4 flex items-center justify-between shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-500/20 p-2 rounded-md"><Smartphone className="w-5 h-5 text-emerald-400" /></div>
                                        <span className="font-semibold text-slate-200">Bản Thử Nghiệm</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-500 mx-4" />
                                    <span className="text-sm text-slate-400 shrink-0">Review Trải Nghiệm</span>
                                    <ArrowRight className="w-4 h-4 text-slate-500 mx-4" />
                                    <span className="font-medium text-orange-400 shrink-0">Nhận Feedback</span>
                                </div>

                                {/* Connector Line up to Merge */}
                                <div className="absolute right-[-4rem] bottom-1/2 h-[calc(50%+1.5rem)] w-[4rem] border-b border-r border-orange-500/30 rounded-br-xl opacity-80" />
                            </div>

                            {/* Merge Node */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-20">
                                <ArrowRight className="w-5 h-5 text-orange-500 mr-2 relative right-[2px]" />
                                <div className="bg-orange-500 text-slate-950 font-bold px-5 py-3 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center gap-2 whitespace-nowrap">
                                    <GitMerge className="w-5 h-5" /> Hợp Nhất &amp; Hoàn Thiện
                                </div>
                            </div>
                        </div>

                        {/* Mobile Visualization */}
                        <div className="flex flex-col lg:hidden gap-6 mt-4">
                            <div className="space-y-3">
                                <div className="text-xs font-bold text-slate-500 tracking-widest uppercase">LUỒNG 1: Thiết Kế</div>
                                <div className="rounded-lg bg-slate-800/80 border border-slate-700 p-4 flex flex-col gap-3">
                                    <span className="font-semibold text-slate-200 flex items-center gap-2"><Figma className="w-4 h-4 text-blue-400" /> Review Figma</span>
                                    <div className="text-xs text-slate-400 pl-6 border-l-2 border-slate-700 py-1 ml-2 space-y-2">
                                        <div>→ Ghi nhận Feedback</div>
                                        <div className="text-orange-400">→ Điều chỉnh trực tiếp</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-xs font-bold text-slate-500 tracking-widest uppercase">LUỒNG 2: Ứng Dụng</div>
                                <div className="rounded-lg bg-slate-800/80 border border-slate-700 p-4 flex flex-col gap-3">
                                    <span className="font-semibold text-slate-200 flex items-center gap-2"><Smartphone className="w-4 h-4 text-emerald-400" /> Bản Thử Nghiệm</span>
                                    <div className="text-xs text-slate-400 pl-6 border-l-2 border-slate-700 py-1 ml-2 space-y-2">
                                        <div>→ Review Trải Nghiệm (UX)</div>
                                        <div className="text-orange-400">→ Cập nhật Feedback thật</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-2">
                                <GitMerge className="w-5 h-5" /> Hợp Nhất &amp; Hoàn Thiện
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements & Next Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                Kết Quả Đạt Được
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
                                    "Thiết kế Figma đang được các bên liên quan review và chốt tích cực",
                                    "Bản dùng thử của app W4S đã được phát hành thành công",
                                    "Team nghiệp vụ có thể đánh giá UI/UX một cách trực quan thông qua app thật",
                                    "Vòng lặp nhận feedback nhanh và hiệu quả hơn đáng kể nhờ có sẵn prototype",
                                    "Cấu trúc động (dynamic app) cho phép thay đổi giao diện và nội dung vô cùng vượt trội"
                                ].map((item, idx) => (
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

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                                <Rocket className="w-5 h-5 text-blue-400" />
                                Bước Tiếp Theo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
                                    "Tiếp tục review và thống nhất Figma với các bên liên quan",
                                    "Tổng hợp đánh giá từ người dùng thông qua bản prototype",
                                    "Cập nhật và điều chỉnh ứng dụng real-time dựa trên feedback",
                                    "Chuẩn bị phương án hợp nhất thiết kế và chốt luồng nghiệp vụ cuối cùng"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex flex-start gap-3 text-sm text-slate-300">
                                        <div className="bg-blue-500/20 p-1 rounded-full text-blue-400 mt-0.5 shrink-0">
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Risks / Notes */}
                <Card className="bg-amber-950/20 border-orange-500/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-[1rem] flex items-center gap-2 text-amber-500">
                            <AlertTriangle className="w-5 h-5" />
                            Rủi Ro &amp; Lưu Ý Quan Trọng
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-orange-500/10 text-sm">
                                <span className="block font-medium text-slate-200 mb-1">Thay Đổi Phạm Vi</span>
                                <span className="text-slate-400">Việc liên tục tinh chỉnh dựa trên phản hồi có thể dẫn đến một vài sai lệch nhỏ so với định cấu trúc ban đầu.</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-orange-500/10 text-sm">
                                <span className="block font-medium text-slate-200 mb-1">Đồng Bộ Giao Diện</span>
                                <span className="text-slate-400">Cần liên tục đối chiếu để đảm bảo giao diện app thực tế bám sát đúng với UI component chuẩn trên Figma.</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-orange-500/10 text-sm">
                                <span className="block font-medium text-slate-200 mb-1">Tính Liên Tục</span>
                                <span className="text-slate-400">Đội ngũ thiết kế và lập trình cần giữ nhịp đồng bộ để xử lý feedback nhanh mà không bị nghẽn trễ.</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className="bg-orange-500 hover:bg-orange-600 font-medium text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
                >
                    {isGenerating ? "Đang tạo PDF..." : "Xác Nhận & Xuất Báo Cáo (PDF)"}
                </Button>
            </div>
        </div>
    );
}
