import Link from "next/link";
import { dateTime, type Lead, type Admin } from "@/lib/leads/domain";
export function Status({ value }: { value: string }) {
  const color =
    value === "WON" || value === "delivered"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : ["LOST", "failed", "bounced", "complained"].includes(value)
        ? "bg-red-500/10 text-red-700 dark:text-red-300"
        : "bg-muted text-foreground";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded px-2 py-1 text-xs font-semibold ${color}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
export function LeadTable({
  leads,
  admins = [],
}: {
  leads: Lead[];
  admins?: Admin[];
}) {
  if (!leads.length)
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h2 className="font-semibold">No leads found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          New demo requests will appear here. Adjust the filters to broaden your
          search.
        </p>
      </div>
    );
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm text-left">
        <caption className="sr-only">Enterprise demo requests</caption>
        <thead className="bg-muted/60 text-xs text-muted-foreground">
          <tr>
            {[
              "Submitted (UTC)",
              "Name",
              "Email",
              "Company",
              "Role",
              "Interest",
              "Deployment",
              "Lead status",
              "Email status",
              "Assigned to",
              "Actions",
            ].map((t) => (
              <th
                className="p-4 whitespace-nowrap font-medium"
                scope="col"
                key={t}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((l) => (
            <tr key={l.id} className="hover:bg-muted/40">
              <td className="p-4 whitespace-nowrap text-muted-foreground">
                {dateTime(l.submitted_at)}
              </td>
              <td className="p-4 whitespace-nowrap font-medium">{l.name}</td>
              <td className="p-4">{l.email}</td>
              <td className="p-4 whitespace-nowrap">{l.company}</td>
              <td className="p-4 whitespace-nowrap">{l.role}</td>
              <td className="p-4 whitespace-nowrap">{l.interest}</td>
              <td className="p-4">{l.deployment}</td>
              <td className="p-4">
                <Status value={l.lead_status} />
              </td>
              <td className="p-4">
                <Status value={l.email_status} />
              </td>
              <td className="p-4 whitespace-nowrap">
                {admins.find((a) => a.user_id === l.assigned_admin)
                  ?.display_name || "Unassigned"}
              </td>
              <td className="p-4">
                <Link
                  href={`/dashboard/leads/${l.id}`}
                  className="font-semibold underline underline-offset-4 hover:text-primary"
                  aria-label={`View request from ${l.name}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
