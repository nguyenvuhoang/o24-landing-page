import { leadApi } from "@/lib/leads/api";
import { adminSession } from "@/lib/leads/auth";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return leadApi(adminSession).update(request, (await params).id);
}
