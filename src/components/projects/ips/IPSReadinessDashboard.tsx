"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowLeft, ArrowRight, CalendarDays,
  ChevronDown, ChevronUp, Clock3, DatabaseBackup,
  Download, Flag, ListTodo,
  Rocket, ServerCog, ShieldAlert, ShieldCheck, Target, TestTube2,
  TriangleAlert, UsersRound,
} from "lucide-react";
import { ipsProject, type IPSWorkstream, type WorkStatus } from "@/data/projects/ips-status";

const STATUS: Record<WorkStatus, { label: string; className: string }> = {
  in_progress: { label: "Đang thực hiện", className: "border-sky-400/25 bg-sky-400/10 text-sky-700 dark:text-sky-300" },
  awaiting: { label: "Đang chờ", className: "border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300" },
  not_complete: { label: "Chưa hoàn tất", className: "border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300" },
  complete: { label: "Hoàn thành", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300" },
};
const icons = { production: ServerCog, migration: DatabaseBackup, uat: TestTube2 } as const;
const dayMs = 86400000;
function remainingDays(now: number, target: string): number {
  return Math.max(0, Math.ceil((new Date(target).getTime() - now) / dayMs));
}
function StatusChip({ status }: { status: WorkStatus }) {
  const item = STATUS[status];
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${item.className}`}>{item.label}</span>;
}
function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
    </div>
  );
}
function WorkstreamCard({ item, index }: { item: IPSWorkstream; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = icons[item.id as keyof typeof icons] ?? ListTodo;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-[#14243a]">
      <div className="flex-1 p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0df] text-orange-600 dark:bg-orange-400/10 dark:text-orange-300"><Icon aria-hidden="true" size={23}/></div>
          <StatusChip status={item.status}/>
        </div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Workstream {String(index + 1).padStart(2, "0")}</div>
        <h3 className="text-lg font-bold text-slate-950 dark:text-white">{item.title}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
        <div className="mt-5 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bước tiếp theo</p>
          <p className="mt-1 text-sm leading-6 text-slate-800 dark:text-slate-200">{item.nextAction}</p>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-4 dark:border-white/10 sm:px-6">
        <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-slate-700 hover:text-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 dark:text-slate-200 dark:hover:text-orange-300">
          <span>{open ? "Thu gọn checklist" : "Xem checklist chuẩn bị"}</span>
          {open ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </button>
        {open && (
          <div className="pt-4">
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Phụ trách: {item.owner}</p>
            <ul className="space-y-3">
              {item.details.map(detail => <li key={detail} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-400"/>{detail}</li>)}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

export function IPSReadinessDashboard() {
  const [now, setNow] = useState<number | null>(null);
  const [view, setView] = useState<"overview" | "readiness">("overview");
  useEffect(() => {
    // Update in an external subscription callback; initial output is hydration-safe.
    const immediate = window.setTimeout(() => setNow(Date.now()), 0);
    const id = window.setInterval(() => setNow(Date.now()), 60000);
    return () => { window.clearTimeout(immediate); window.clearInterval(id); };
  }, []);
  const days = now === null ? null : remainingDays(now, ipsProject.targetGoLive);
  const pendingGates = ipsProject.decisionGates.filter(g => g.status !== "ready").length;
  return (
    <main className="min-h-screen bg-[#f5f7fb] pb-20 text-slate-900 dark:bg-[#0c1728] dark:text-slate-100">
      <div className="relative overflow-hidden bg-[#0b1931] text-white">
        <div className="pointer-events-none absolute -right-24 -top-44 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" aria-hidden="true"/>
        <div className="pointer-events-none absolute left-1/3 top-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" aria-hidden="true"/>
        <div className="mx-auto max-w-[1360px] px-4 pb-14 pt-8 sm:px-6 sm:pb-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><ArrowLeft size={13} aria-hidden="true"/> vKnight</Link>
            <span aria-hidden="true">/</span><span>Project Updates</span><span aria-hidden="true">/</span><span className="text-orange-300">IPS</span>
          </nav>
          <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1.3fr_.7fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-xs font-bold tracking-wide text-sky-200">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300" aria-hidden="true"/>
                {ipsProject.phase.toUpperCase()}
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[.23em] text-orange-300">VKNIGHT / IPS PROJECT DELIVERY</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-[3.45rem]">
                IPS <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">Go-Live Readiness</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{ipsProject.overview}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-xs text-slate-400"><CalendarDays size={14} aria-hidden="true"/> Cập nhật nội dung: {ipsProject.updatedAt.split("-").reverse().join("/")}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/[.07] p-6 shadow-2xl backdrop-blur-sm sm:p-7">
              <div className="flex items-center justify-between gap-2 text-sm text-slate-300"><span>Mục tiêu Go-Live</span><Rocket size={20} className="text-amber-300" aria-hidden="true"/></div>
              <div className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{ipsProject.targetGoLiveLabel}</div>
              <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-sm">
                <Clock3 size={17} className="text-orange-300" aria-hidden="true"/>
                <span>{days === null ? "Đang tính thời gian còn lại…" : days > 0 ? `Còn ${days} ngày đến mốc kế hoạch` : "Đã đến hoặc qua ngày mục tiêu"}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{ipsProject.targetNote}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Activity, label: "Giai đoạn hiện tại", value: "UAT Testing", note: "Đang thực hiện" },
            { icon: ListTodo, label: "Nhóm công việc còn mở", value: String(ipsProject.workstreams.filter(w => (w.status === "not_complete" || w.status === "in_progress")).length), note: "Production · Migration · UAT" },
            { icon: UsersRound, label: "Báo cáo UAT", value: `${ipsProject.testTeams.filter(t => t.report !== "awaiting").length}/${ipsProject.testTeams.length}`, note: "Chờ hai đội gửi báo cáo" },
            { icon: Flag, label: "Quyết định Go / No-Go", value: "Chờ phê duyệt", note: `${pendingGates} điều kiện cần xác nhận` },
          ].map(kpi => <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-[#14243a]">
            <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"><span>{kpi.label}</span><kpi.icon size={18} className="text-orange-500" aria-hidden="true"/></div>
            <p className="mt-3 break-words text-3xl font-extrabold tracking-tight text-[#11264a] dark:text-white">{kpi.value}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{kpi.note}</p>
          </div>)}
        </div>

        <div className="mt-7 grid gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-300/15 dark:bg-amber-400/5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-amber-800 dark:text-amber-300">Executive release assessment</p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white sm:text-2xl">Chưa đủ điều kiện xác nhận Go-Live</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
              Ngày 30/11/2026 là mốc kế hoạch. Việc triển khai chính thức phụ thuộc vào hoàn tất môi trường Production,
              backup và đối soát migration, kết quả UAT từ cả hai đội và phê duyệt Go / No-Go.
            </p>
          </div>
          <button type="button" onClick={() => setView("readiness")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#142c52] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#213c68] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
            Xem 4 điều kiện phê duyệt <ArrowRight size={16} className="ml-2" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Chế độ xem báo cáo">
            <button type="button" onClick={() => setView("overview")} aria-pressed={view === "overview"} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${view === "overview" ? "bg-[#142c52] text-white" : "bg-white text-slate-600 hover:bg-orange-50 dark:bg-white/10 dark:text-slate-200"}`}>Tổng quan</button>
            <button type="button" onClick={() => setView("readiness")} aria-pressed={view === "readiness"} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${view === "readiness" ? "bg-[#142c52] text-white" : "bg-white text-slate-600 hover:bg-orange-50 dark:bg-white/10 dark:text-slate-200"}`}>Go-Live checklist</button>
          </div>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-orange-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"><Download size={16} aria-hidden="true"/> In / Lưu PDF</button>
        </div>

        {view === "overview" ? <>
          <section className="pt-10" aria-labelledby="workstreams-heading">
            <SectionTitle eyebrow="01 / DELIVERY READINESS" title="Ba công việc trọng tâm trước Go-Live" description="Trạng thái phản ánh thông tin đã xác nhận. Không suy diễn phần trăm hoàn thành từ các công việc đang mở."/>
            <div className="grid gap-5 lg:grid-cols-3">{ipsProject.workstreams.map((w,i)=><WorkstreamCard key={w.id} item={w} index={i}/>)}</div>
          </section>
          <section className="mt-12" aria-labelledby="uat-teams-heading">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14243a] sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-600 dark:text-orange-400">02 / UAT TESTING</p>
                  <h2 id="uat-teams-heading" className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">Tình hình kiểm thử của hai đội</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">Theo dõi tiến độ tiếp nhận báo cáo UAT và các bước xử lý tiếp theo. Chưa công bố số lỗi, tỷ lệ pass hoặc tỷ lệ hoàn thành khi chưa có báo cáo chính thức.</p>
                </div>
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-200">
                  Đã nhận {ipsProject.testTeams.filter(t => t.report === "received").length}/{ipsProject.testTeams.length} báo cáo
                </span>
              </div>
              <div className="mt-7 grid gap-4 lg:grid-cols-2">
                {ipsProject.testTeams.map((team, index) => (
                  <article key={team.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[.04] sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"><UsersRound size={22} aria-hidden="true" /></div>
                        <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">UAT TEAM {String(index + 1).padStart(2, "0")}</p><h3 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{team.name}</h3></div>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${team.report === "received" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300"}`}>
                        {team.report === "received" ? "Đã nhận báo cáo" : "Chờ báo cáo chính thức"}
                      </span>
                    </div>
                    <dl className="mt-5 grid gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:grid-cols-2">
                      <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Giai đoạn</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">UAT Testing</dd></div>
                      <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Báo cáo</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{team.report === "received" ? "Đã tiếp nhận" : "Chưa tiếp nhận"}</dd></div>
                    </dl>
                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#14243a]"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Cập nhật từ đội kiểm thử</p><p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{team.note}</p></div>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Bước tiếp theo:</strong> {team.report === "received" ? "Phân loại kết quả, xử lý các hạng mục còn mở và retest." : "Nhận báo cáo chính thức, tổng hợp kết quả và xác nhận danh sách vấn đề còn mở."}</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-sky-50 p-4 text-sm leading-7 text-slate-700 dark:bg-sky-400/5 dark:text-slate-300"><ShieldCheck size={20} className="mt-1 shrink-0 text-sky-600 dark:text-sky-300" aria-hidden="true" /><p>Việc nhận đủ báo cáo UAT <strong>không đồng nghĩa với UAT sign-off</strong>. Chỉ xác nhận nghiệm thu sau khi tổng hợp kết quả, xử lý lỗi trọng yếu và được các bên liên quan phê duyệt.</p></div>
            </div>
          </section>
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#14243a] sm:p-8" aria-label="Milestones">
            <SectionTitle eyebrow="03 / MILESTONES" title="Lộ trình đến Production" />
            <ol className="grid gap-4 lg:grid-cols-4">{ipsProject.milestones.map((m,i)=><li key={m.label} className="relative rounded-xl border border-slate-200 p-5 dark:border-white/10"><div className="mb-3 flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${m.state === "current" ? "bg-sky-500" : m.state === "target" ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"}`} aria-hidden="true"/><span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Mốc {i+1}</span></div><p className="font-bold text-slate-900 dark:text-white">{m.label}</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{m.detail}</p></li>)}</ol>
          </section>
        </> : <section className="pt-10"><SectionTitle eyebrow="GO / NO-GO" title="Điều kiện nghiệm thu trước Go-Live" description="Các mục bên dưới là các cổng phê duyệt, không phải checkbox có thể tự đánh dấu trên trang công khai."/><div className="grid gap-4 md:grid-cols-2">{ipsProject.decisionGates.map((gate,i)=><div key={gate.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14243a]"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300">{i+1}</div><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-slate-950 dark:text-white">{gate.title}</p><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${gate.status === "ready" ? "border-emerald-300/50 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300" : gate.status === "blocked" ? "border-red-300/50 bg-red-50 text-red-800 dark:bg-red-400/10 dark:text-red-300" : "border-amber-300/50 bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300"}`}>{gate.status === "ready" ? "Đã xác nhận" : gate.status === "blocked" ? "Đang bị chặn" : "Chờ xác nhận"}</span></div><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{gate.detail}</p></div></div>)}</div></section>}

        <section className="mt-12" aria-label="Risks and release decision">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#14243a] sm:p-7">
              <SectionTitle eyebrow="04 / MONITORING" title="Điểm cần theo dõi" description="Các rủi ro tiềm ẩn được xác định từ những hạng mục chưa hoàn tất; đây không phải sự cố đã xác nhận."/>
              <div className="space-y-5">{ipsProject.risks.map(risk=><div key={risk.title} className="flex gap-3"><TriangleAlert className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300" size={19} aria-hidden="true"/><div><p className="font-semibold text-slate-900 dark:text-white">{risk.title}</p><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{risk.impact}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Theo dõi: {risk.response}</p></div></div>)}</div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-[#102444] p-6 text-white sm:p-7">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-500/15 blur-3xl" aria-hidden="true"/>
              <div className="relative"><div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-200"><ShieldAlert size={15} aria-hidden="true"/> RELEASE GATE</div>
              <h2 className="mt-5 text-2xl font-extrabold">{pendingGates === 0 ? "Chờ phê duyệt Go / No-Go cuối cùng" : "Chưa đủ điều kiện xác nhận Go-Live"}</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">Mốc Go-Live 30/11/2026 vẫn là mục tiêu kế hoạch. Cần hoàn tất Production readiness, đối soát migration, UAT sign-off của hai đội và phê duyệt Go / No-Go trước khi triển khai.</p>
              <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-300"><Target size={17} className="mr-2 inline text-orange-300" aria-hidden="true"/> Mục tiêu triển khai: <strong className="text-white">30/11/2026</strong></div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>IPS Project Delivery · Public project status · Cập nhật: {ipsProject.updatedAt.split("-").reverse().join("/")}</span>
          <Link href="/" className="inline-flex items-center gap-1 font-semibold text-orange-700 hover:underline dark:text-orange-300">vKnight Platform <ArrowRight size={14} aria-hidden="true"/></Link>
        </div>
      </div>
      <style jsx global>{`@media print { header, footer, button { display: none !important; } main { background: white !important; } article, section { break-inside: avoid; } }`}</style>
    </main>
  );
}
