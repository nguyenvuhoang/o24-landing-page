import "server-only";
import { createClient } from "@/lib/supabase/server";
import { accessStatus } from "./domain";
import { redirect, forbidden } from "next/navigation";
export async function adminSession() {
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) return { db, user: null, status: 401 };
  const { data, error: roleError } = await db
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  return { db, user, status: accessStatus(user, !roleError && !!data) };
}
export async function requireAdmin() {
  const session = await adminSession();
  if (session.status === 401) redirect("/dashboard/login");
  if (session.status !== 200) forbidden();
  return session;
}
