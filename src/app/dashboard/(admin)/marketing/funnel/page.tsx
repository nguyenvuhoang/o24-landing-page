import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/leads/auth";
import { MarketingFunnelClient } from "./MarketingFunnelClient";

export const metadata: Metadata = {
  title: "Marketing Funnel | O24 CRM",
  robots: { index: false, follow: false },
};

export default async function MarketingFunnelPage() {
  await requireAdmin();
  return <div className="crm-page">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Marketing / Analytics</p>
      <h1 className="mt-2 text-3xl font-bold">Marketing funnel</h1>
      <p className="mt-2 text-sm text-muted-foreground">Analyze aggregated website events without importing personal information.</p></div>
      <Link href="/dashboard/analytics" className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted">CRM conversion analytics</Link>
    </div>
    <MarketingFunnelClient />
  </div>;
}
