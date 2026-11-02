"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UsersRound, ChevronRight, CalendarClock, ChartNoAxesCombined } from "lucide-react";
export function DashboardNav() {
  const path = usePathname();
  return (
    <nav aria-label="Dashboard" className="crm-nav">
      {[
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        {
          href: "/dashboard/leads",
          label: "Enterprise leads",
          icon: UsersRound,
        },
        {
          href: "/dashboard/follow-ups",
          label: "Follow-ups",
          icon: CalendarClock,
        },
        {
          href: "/dashboard/analytics",
          label: "Conversion analytics",
          icon: ChartNoAxesCombined,
        },
      ].map((item) => {
        const active =
          item.href === "/dashboard"
            ? path === item.href
            : path === item.href || path.startsWith(item.href + "/");
        return (
          <Link
            href={item.href}
            key={item.href}
            aria-current={active ? "page" : undefined}
            className={`crm-nav-link ${active ? "is-active" : ""}`}
          >
            <item.icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
            {active && (
              <ChevronRight size={15} className="ml-auto" aria-hidden="true" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
export function DashboardBreadcrumb() {
  const path = usePathname();
  const detail = path.startsWith("/dashboard/leads/");
  return (
    <nav className="crm-breadcrumb" aria-label="Breadcrumb">
      <Link href="/dashboard">Workspace</Link>
      <ChevronRight size={13} aria-hidden="true" />
      {detail ? (
        <>
          <Link href="/dashboard/leads">Enterprise leads</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">Lead details</span>
        </>
      ) : (
        <span aria-current="page">
          {path === "/dashboard"
            ? "Overview"
            : path === "/dashboard/leads"
              ? "Enterprise leads"
              : labelPath(path)}
        </span>
      )}
    </nav>
  );
}
function labelPath(path: string) {
  const segment = path.split("/").filter(Boolean).pop() || "Dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
