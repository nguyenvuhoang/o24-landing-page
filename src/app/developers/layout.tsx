import type { ReactNode } from "react";
import { DeveloperPortalNav } from "@/components/developers/DeveloperPortalNav";

/** Shared navigation for Developer Hub, onboarding, documentation and API Explorer. */
export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DeveloperPortalNav />
      {children}
    </>
  );
}
