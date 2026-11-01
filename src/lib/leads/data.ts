import "server-only";
import { requireAdmin } from "./auth";
import { applyFilters, type Filters, type Lead, type Admin } from "./domain";
export async function listLeads(filters: Filters) {
  const { db } = await requireAdmin();
  const result = await applyFilters(
    db.from("enterprise_leads").select("*", { count: "exact" }),
    filters,
  );
  if (result.error)
    throw new Error(
      "Unable to load leads. Check the dashboard migration and try again.",
    );
  return { leads: result.data as Lead[], count: result.count || 0 };
}
export async function admins() {
  const { db } = await requireAdmin();
  const { data, error } = await db
    .from("admin_users")
    .select("user_id,display_name")
    .order("display_name");
  if (error) throw new Error("Unable to load administrators");
  return data as Admin[];
}
