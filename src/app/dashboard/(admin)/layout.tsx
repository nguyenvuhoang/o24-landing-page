import { requireAdmin } from "@/lib/leads/auth";
import { signOut } from "../login/actions";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import "./dashboard.css";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();
  return (
    <DashboardShell userEmail={user?.email} signOutAction={signOut}>
      {children}
    </DashboardShell>
  );
}
