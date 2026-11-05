import { Activity, CheckCircle2, Cpu, Database, HardDrive, Monitor, Server, ShieldAlert } from "lucide-react";
import { ipsProduction } from "@/data/projects/ips-production";

const metricCards = [
  { label: "Compute", value: ipsProduction.server.cpu, detail: ipsProduction.server.cpuFamily, icon: Cpu },
  { label: "Memory", value: `${ipsProduction.server.ramTotalGiB} GiB`, detail: `${ipsProduction.server.ramAvailableGiB} GiB available at snapshot`, icon: Server },
  { label: "System disk", value: `${ipsProduction.server.systemDisk.totalGB} GB`, detail: `${ipsProduction.server.systemDisk.usagePercent}% used`, icon: HardDrive },
  { label: "Data disk", value: `${ipsProduction.server.dataDisk.totalGB} GB`, detail: `${ipsProduction.server.dataDisk.availableGB} GB available`, icon: Database },
] as const;

export function IPSProductionOverview() {
  const data = ipsProduction;
  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14243a] sm:p-7 lg:p-8" aria-labelledby="ips-live-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-600 dark:text-orange-400">01 / PRODUCTION INFRASTRUCTURE</p>
          <h2 id="ips-live-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Môi trường LIVE đã được cài đặt</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">Hạ tầng và các dịch vụ ứng dụng đã triển khai. Kết quả container đang chạy là ảnh chụp trạng thái tại thời điểm ghi nhận, chưa thay thế kiểm tra nghiệp vụ, backup hoặc phê duyệt Go-Live.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"><CheckCircle2 size={15}/> Đã cài đặt</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"><ShieldAlert size={15}/> Chờ nghiệm thu readiness</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({label,value,detail,icon: Icon}) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"><Icon size={18} aria-hidden="true"/> {label}</div>
            <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white"><Activity size={20} className="text-sky-600 dark:text-sky-300"/> Runtime & services</h3>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">{data.runtime.containersRunning}/{data.runtime.containersTotal} running</span>
          </div>
          <div className="mt-4 grid gap-2 text-[15px] leading-7 text-slate-700 dark:text-slate-200">
            <p><strong>OS:</strong> {data.server.os}</p>
            <p><strong>Docker / Compose:</strong> {data.runtime.docker} / {data.runtime.compose}</p>
            <p><strong>Application:</strong> {data.runtime.platform}</p>
            <p><strong>Database:</strong> {data.runtime.database}</p>
            <p><strong>Messaging / cache:</strong> {data.runtime.dependencies}</p>
            <p><strong>Observability:</strong> {data.runtime.monitoring}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white"><Monitor size={20} className="text-sky-600 dark:text-sky-300"/> Access & verification</h3>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-white/10">
            <span className="text-[15px] font-semibold">Back Office (BO)</span>
            <a href={data.endpoints.bo.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-orange-700 underline underline-offset-4 hover:text-orange-600 dark:text-orange-300">Open BO site</a>
          </div>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-300">Backend API endpoint: <strong>Chờ xác nhận URL</strong></p>
          <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
            {data.checks.map(item => <li key={item.label} className="flex items-start justify-between gap-3 text-sm"><span className="text-slate-600 dark:text-slate-300">{item.label}</span><span className="shrink-0 text-amber-700 dark:text-amber-300">Chưa xác nhận</span></li>)}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs leading-6 text-slate-500 dark:text-slate-400">Thông số được ghi nhận ngày {data.observedOn.split("-").reverse().join("/")}. Dung lượng và trạng thái chỉ phản ánh một thời điểm, không phải hệ thống giám sát thời gian thực. Các bước kiểm tra readiness và UAT vẫn đang mở.</p>
    </section>
  );
}
