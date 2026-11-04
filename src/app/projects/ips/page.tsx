import type { Metadata } from "next";
import { IPSReadinessDashboard } from "@/components/projects/ips/IPSReadinessDashboard";

export const metadata: Metadata = {
  title: "IPS Project Status | Go-Live Readiness — vKnight",
  description: "Cập nhật tiến độ dự án IPS: giai đoạn UAT Testing, chuẩn bị Production, backup và migration, với mục tiêu Go-Live ngày 30/11/2026.",
  alternates: { canonical: "/projects/ips" },
  openGraph: {
    title: "IPS Go-Live Readiness | vKnight",
    description: "Báo cáo công khai tiến độ UAT và chuẩn bị Go-Live dự án IPS.",
    url: "/projects/ips",
    type: "website",
  },
  // Page remains publicly accessible to anyone with the URL.
  // Do not advertise this operational report in search engines by default.
  robots: { index: false, follow: false },
};

export default function IPSProjectPage() {
  return <IPSReadinessDashboard />;
}
