import Link from "next/link";
import {
  MoveHorizontal,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  UsersRound,
  CirclePlus,
  UserRound,
  MailCheck,
} from "lucide-react";
import {
  statuses,
  interests,
  deployments,
  type Filters,
  type Lead,
  type Admin,
} from "@/lib/leads/domain";
import { LeadTable } from "./LeadTable";
import { label } from "./presentation";
export function LeadListView({
  filters,
  params,
  leads,
  count,
  directory,
}: {
  filters: Filters;
  params: URLSearchParams;
  leads: Lead[];
  count: number;
  directory: Admin[];
}) {
  const pageLink = (page: number) => {
    const q = new URLSearchParams(params);
    q.set("page", String(page));
    return `/dashboard/leads?${q}`;
  };
  const filtered = !!(
    filters.search ||
    filters.status ||
    filters.interest ||
    filters.deployment ||
    filters.from ||
    filters.before
  );
  const metrics = [
    {
      title: "Matching leads",
      value: count,
      hint: filtered
        ? "Across your filtered results"
        : "Across all submissions",
      icon: UsersRound,
    },
    {
      title: "New leads",
      value: leads.filter((l) => l.lead_status === "NEW").length,
      hint: "On this page",
      icon: CirclePlus,
    },
    {
      title: "Unassigned",
      value: leads.filter((l) => !l.assigned_admin).length,
      hint: "On this page",
      icon: UserRound,
    },
    {
      title: "Email delivered",
      value: leads.filter((l) => l.email_status === "delivered").length,
      hint: "On this page",
      icon: MailCheck,
    },
  ];
  return (
    <div className="crm-page">
      <header className="crm-page-header">
        <div>
          <h1>
            Enterprise leads{" "}
            <span className="crm-count">{count.toLocaleString()}</span>
          </h1>
          <p>
            Manage demo requests, follow up with prospects and move your
            pipeline forward.
          </p>
        </div>
        <span className="crm-header-meta">
          {filtered ? "Filtered results" : "All submissions"}
          <span className="crm-meta-divider" />
          25 leads per page
        </span>
      </header>
      <section className="crm-kpis" aria-label="Lead summary">
        {metrics.map((m) => (
          <article className="crm-kpi" key={m.title}>
            <div className="crm-kpi-heading">
              <h2>{m.title}</h2>
              <m.icon size={17} aria-hidden="true" />
            </div>
            <div className="crm-kpi-value">
              {m.value.toLocaleString()}
              <span>{m.hint}</span>
            </div>
          </article>
        ))}
      </section>
      <section
        className="crm-panel crm-leads-panel"
        aria-labelledby="lead-results-heading"
      >
        <div className="crm-panel-heading">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal
              size={17}
              className="crm-muted"
              aria-hidden="true"
            />
            <h2 id="lead-results-heading">Lead directory</h2>
          </div>
          <span className="crm-small crm-muted">
            Search and filter your pipeline
          </span>
        </div>
        <form method="get" className="crm-filter-grid">
          <label className="crm-field">
            Search
            <span className="crm-search">
              <Search size={16} aria-hidden="true" />
              <input
                name="q"
                defaultValue={params.get("q") || ""}
                placeholder="Name, email or company"
                maxLength={160}
                className="crm-input"
              />
            </span>
          </label>
          {(
            [
              ["status", "Lead status", statuses],
              ["interest", "Interest", interests],
              ["deployment", "Deployment", deployments],
            ] as const
          ).map(([key, title, values]) => (
            <label key={key} className="crm-field">
              {title}
              <select
                name={key}
                defaultValue={params.get(key) || ""}
                className="crm-input"
              >
                <option value="">
                  All{" "}
                  {title.toLowerCase() === "lead status"
                    ? "statuses"
                    : title.toLowerCase() === "interest"
                      ? "interests"
                      : "deployments"}
                </option>
                {values.map((v) => (
                  <option key={v} value={v}>
                    {label(v)}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="crm-field">
            Submitted from · UTC
            <input
              name="from"
              type="date"
              defaultValue={filters.from}
              className="crm-input"
            />
          </label>
          <label className="crm-field">
            Submitted through · UTC
            <input
              name="to"
              type="date"
              defaultValue={params.get("to") || ""}
              className="crm-input"
            />
          </label>
          <label className="crm-field">
            Sort by submission
            <select
              name="sort"
              defaultValue={params.get("sort") || "newest"}
              className="crm-input"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
          <div className="crm-filter-actions">
            <Link
              href="/dashboard/leads"
              className="crm-button crm-button-secondary"
            >
              Reset
            </Link>
            <button className="crm-button crm-button-primary">
              Apply filters
            </button>
          </div>
        </form>
        <div className="crm-results-bar">
          <p>
            <strong>{count.toLocaleString()}</strong>{" "}
            {count === 1 ? "lead" : "leads"}
            {filtered ? " match your filters" : " in your workspace"}
          </p>
          <div className="crm-results-summary">
            <span className="crm-scroll-hint">
              <MoveHorizontal size={13} aria-hidden="true" />
              Scroll for all columns
            </span>
            <span>
              Showing {leads.length ? filters.offset + 1 : 0}–
              {leads.length ? filters.offset + leads.length : 0}
            </span>
          </div>
        </div>
        <LeadTable leads={leads} admins={directory} />
        <nav aria-label="Lead pages" className="crm-pagination">
          <span>
            Page <strong>{filters.page}</strong> of{" "}
            {Math.max(1, Math.ceil(count / 25))}
          </span>
          <div>
            {filters.page > 1 ? (
              <Link
                className="crm-button crm-button-secondary"
                href={pageLink(filters.page - 1)}
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Previous
              </Link>
            ) : (
              <span
                className="crm-button crm-button-secondary is-disabled"
                aria-disabled="true"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Previous
              </span>
            )}
            {filters.offset + 25 < count ? (
              <Link
                className="crm-button crm-button-secondary"
                href={pageLink(filters.page + 1)}
              >
                Next
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ) : (
              <span
                className="crm-button crm-button-secondary is-disabled"
                aria-disabled="true"
              >
                Next
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            )}
          </div>
        </nav>
      </section>
    </div>
  );
}
