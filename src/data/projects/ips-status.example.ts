/**
 * IPS public project status — edit this file when a progress update is approved.
 * Do not publish customer data, credentials, hostnames, private defect details or backups.
 * Unconfirmed information is explicitly labelled pending rather than invented.
 */
export type WorkStatus = "in_progress" | "awaiting" | "not_complete" | "complete";
export type GateStatus = "pending" | "ready" | "blocked";

export type IPSWorkstream = {
  id: string;
  title: string;
  summary: string;
  status: WorkStatus;
  owner: string;
  nextAction: string;
  details: string[];
};

export const ipsProject = {
  code: "IPS",
  title: "IPS — Project Go-Live Readiness",
  subtitle: "Báo cáo tiến độ UAT và mức độ sẵn sàng triển khai chính thức",
  phase: "UAT Testing",
  updatedAt: "2026-11-04",
  targetGoLive: "2026-11-30T00:00:00+07:00",
  targetGoLiveLabel: "30/11/2026",
  targetNote: "Mốc kế hoạch, phụ thuộc kết quả UAT và quyết định Go / No-Go.",
  overview:
    "Dự án IPS đang trong giai đoạn UAT Testing. Các công việc cần hoàn tất trước Go-Live gồm chuẩn bị Production, backup và migration dữ liệu hệ thống cũ, và xử lý các hạng mục UAT sau khi nhận báo cáo từ hai đội kiểm thử.",
  workstreams: [
    {
      id: "production",
      title: "Môi trường LIVE / Production",
      summary: "Cài đặt và kiểm tra môi trường vận hành chính thức.",
      status: "not_complete",
      owner: "Đang xác nhận",
      nextAction: "Hoàn tất triển khai và xác nhận checklist Production readiness.",
      details: [
        "Cấu hình môi trường Production và các dịch vụ phụ thuộc",
        "Kiểm tra kết nối, quyền truy cập và cấu hình vận hành",
        "Xác nhận phương án giám sát, sao lưu và khôi phục",
      ],
    },
    {
      id: "migration",
      title: "Backup & Data Migration",
      summary: "Chuẩn bị sao lưu, chuyển đổi và đối soát dữ liệu hệ thống cũ.",
      status: "not_complete",
      owner: "Đang xác nhận",
      nextAction: "Thống nhất kế hoạch backup, migration, validation và phương án rollback.",
      details: [
        "Xác nhận phạm vi dữ liệu và thời điểm backup",
        "Thực hiện migration theo kế hoạch được phê duyệt",
        "Đối soát dữ liệu sau migration và kiểm tra khả năng rollback",
      ],
    },
    {
      id: "uat",
      title: "Hoàn thiện UAT Testing",
      summary: "Đang kiểm thử; chờ báo cáo từ hai đội để tổng hợp và xử lý các hạng mục còn mở.",
      status: "in_progress",
      owner: "Hai đội kiểm thử — chờ xác nhận báo cáo",
      nextAction: "Nhận báo cáo của hai đội, phân loại lỗi, sửa và retest trước khi sign-off.",
      details: [
        "Nhận và tổng hợp báo cáo UAT từ hai đội",
        "Phân loại blocker, lỗi cần xử lý và các hạng mục đã đạt",
        "Thực hiện fix, retest và xác nhận UAT sign-off",
      ],
    },
  ] satisfies IPSWorkstream[],
  testTeams: [
    { id: "team-a", name: "Đội kiểm thử 1", report: "awaiting" as "awaiting" | "received", note: "Chờ báo cáo UAT chính thức" },
    { id: "team-b", name: "Đội kiểm thử 2", report: "awaiting" as "awaiting" | "received", note: "Chờ báo cáo UAT chính thức" },
  ],
  decisionGates: [
    { title: "Production readiness", detail: "Hạ tầng và cấu hình môi trường LIVE được xác nhận", status: "pending" as GateStatus },
    { title: "Backup & migration validation", detail: "Dữ liệu chuyển đổi được đối soát, có phương án rollback", status: "pending" as GateStatus },
    { title: "UAT sign-off", detail: "Hai đội gửi báo cáo, lỗi trọng yếu được xử lý và nghiệm thu", status: "pending" as GateStatus },
    { title: "Go / No-Go approval", detail: "Các bên liên quan phê duyệt quyết định triển khai", status: "pending" as GateStatus },
  ],
  risks: [
    { title: "Chậm báo cáo UAT", impact: "Có thể làm chậm việc phân loại lỗi và hoàn tất kiểm thử.", response: "Theo dõi việc tiếp nhận báo cáo của hai đội." },
    { title: "Production và migration chưa sẵn sàng", impact: "Có thể ảnh hưởng khả năng triển khai đúng mốc kế hoạch.", response: "Chốt checklist, kiểm tra backup/rollback và đối soát dữ liệu." },
  ],
  milestones: [
    { label: "UAT Testing", detail: "Đang thực hiện", state: "current" as const },
    { label: "Production & migration readiness", detail: "Chưa hoàn tất", state: "upcoming" as const },
    { label: "UAT sign-off / Go-No-Go", detail: "Chờ xác nhận", state: "upcoming" as const },
    { label: "Go-Live mục tiêu", detail: "30/11/2026", state: "target" as const },
  ],
} as const;
