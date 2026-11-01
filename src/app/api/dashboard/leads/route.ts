import { leadApi } from "@/lib/leads/api";
import { adminSession } from "@/lib/leads/auth";
export const dynamic = "force-dynamic";
export const GET = leadApi(adminSession).list;
