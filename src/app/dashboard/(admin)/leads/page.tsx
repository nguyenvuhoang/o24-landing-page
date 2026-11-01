import Link from "next/link";
import { listLeads, admins } from "@/lib/leads/data";
import { parseFilters } from "@/lib/leads/domain";
import { LeadListView } from "@/components/dashboard/LeadListView";
export default async function Leads({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const params = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (typeof v === "string") params.set(k, v);
  });
  let filters;
  try {
    filters = parseFilters(params);
  } catch (error) {
    return (
      <div role="alert" className="crm-panel crm-state">
        <h1 className="crm-state-title">Invalid filters</h1>
        <p className="my-4">
          {error instanceof Error ? error.message : "Check your filters"}
        </p>
        <Link
          href="/dashboard/leads"
          className="crm-button crm-button-secondary"
        >
          Reset filters
        </Link>
      </div>
    );
  }
  const [{ leads, count }, directory] = await Promise.all([
    listLeads(filters),
    admins(),
  ]);
  return (
    <LeadListView
      filters={filters}
      params={params}
      leads={leads}
      count={count}
      directory={directory}
    />
  );
}
