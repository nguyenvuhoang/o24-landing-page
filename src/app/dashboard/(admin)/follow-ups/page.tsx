import { requireAdmin } from "@/lib/leads/auth";
import { FollowUpWorkspace } from "@/components/dashboard/FollowUpWorkspace";
export default async function FollowUpsPage() {
  await requireAdmin();
  return <FollowUpWorkspace />;
}
