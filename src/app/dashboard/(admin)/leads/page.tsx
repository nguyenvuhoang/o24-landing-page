import Link from "next/link";
import { listLeads, admins } from "@/lib/leads/data";
import {
  parseFilters,
  statuses,
  interests,
  deployments,
} from "@/lib/leads/domain";
import { LeadTable } from "@/components/dashboard/LeadTable";
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
      <div role="alert">
        <h1 className="text-2xl font-semibold">Invalid filters</h1>
        <p className="my-4">
          {error instanceof Error ? error.message : "Check your filters"}
        </p>
        <Link href="/dashboard/leads" className="underline">
          Reset filters
        </Link>
      </div>
    );
  }
  const [{ leads, count }, directory] = await Promise.all([
    listLeads(filters),
    admins(),
  ]);
  const pageLink = (page: number) => {
    const q = new URLSearchParams(params);
    q.set("page", String(page));
    return `/dashboard/leads?${q}`;
  };
  const field = "mt-1 w-full rounded-md border bg-background p-2.5 text-sm";
  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Pipeline / Requests
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Enterprise leads
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every conversation starts with a request.
        </p>
      </div>
      <form
        method="get"
        className="grid gap-4 rounded-lg border bg-card p-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <label className="text-sm">
          Search
          <input
            name="q"
            defaultValue={params.get("q") || ""}
            placeholder="Name, email or company"
            maxLength={160}
            className={field}
          />
        </label>
        {[
          ["status", "Lead status", statuses],
          ["interest", "Interest", interests],
          ["deployment", "Deployment", deployments],
        ].map(([key, label, values]) => (
          <label key={key as string} className="text-sm">
            {label as string}
            <select
              name={key as string}
              defaultValue={params.get(key as string) || ""}
              className={field}
            >
              <option value="">All</option>
              {(values as readonly string[]).map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        ))}
        <label className="text-sm">
          Submitted from (UTC)
          <input
            name="from"
            type="date"
            defaultValue={filters.from}
            className={field}
          />
        </label>
        <label className="text-sm">
          Submitted through (UTC)
          <input
            name="to"
            type="date"
            defaultValue={params.get("to") || ""}
            className={field}
          />
        </label>
        <label className="text-sm">
          Submission order
          <select
            name="sort"
            defaultValue={params.get("sort") || "newest"}
            className={field}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
        <div className="flex items-end gap-4">
          <button className="rounded-md bg-primary text-primary-foreground px-5 py-2.5 font-semibold">
            Apply filters
          </button>
          <Link className="text-sm underline pb-2.5" href="/dashboard/leads">
            Reset
          </Link>
        </div>
      </form>
      <div className="flex justify-between text-sm text-muted-foreground">
        <p>{count.toLocaleString()} matching leads</p>
        <p>25 per page</p>
      </div>
      <LeadTable leads={leads} admins={directory} />
      <nav
        aria-label="Lead pages"
        className="flex justify-between items-center text-sm"
      >
        {filters.page > 1 ? (
          <Link
            className="rounded-md border px-4 py-2 hover:bg-accent"
            href={pageLink(filters.page - 1)}
          >
            Previous
          </Link>
        ) : (
          <span />
        )}
        <span>
          Page {filters.page} of {Math.max(1, Math.ceil(count / 25))}
        </span>
        {filters.offset + 25 < count ? (
          <Link
            className="rounded-md border px-4 py-2 hover:bg-accent"
            href={pageLink(filters.page + 1)}
          >
            Next
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
