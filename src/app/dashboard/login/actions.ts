"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export async function login(form: FormData) {
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!email || !password || email.length > 254 || password.length > 1024)
    redirect("/dashboard/login?error=invalid");
  const db = await createClient();
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) redirect("/dashboard/login?error=invalid");
  redirect("/dashboard");
}
export async function signOut() {
  const db = await createClient();
  await db.auth.signOut();
  redirect("/dashboard/login");
}
