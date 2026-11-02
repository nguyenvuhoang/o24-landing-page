import type { Metadata } from "next";
import { GettingStarted } from "./GettingStarted";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Getting Started | O24 Developer Hub",
  description: "Start with O24 architecture, prepare a local development environment, inspect illustrative API calls, and explore a workflow simulation without live banking access.",
  path: "/developers/getting-started",
  ogDescription: "A guided, safe introduction to API integration and workflow concepts in O24.",
});

export default function GettingStartedPage() {
  return <GettingStarted />;
}
