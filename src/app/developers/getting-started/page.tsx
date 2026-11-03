import type { Metadata } from "next";
import { GettingStarted } from "./GettingStarted";
import { createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = createPageMetadata({
  title: "Getting Started | O24 Developer Hub",
  description: "Start with O24 architecture, prepare a local development environment, inspect illustrative API calls, and explore a workflow simulation without live banking access.",
  path: "/developers/getting-started",
  ogDescription: "A guided, safe introduction to API integration and workflow concepts in O24.",
});

const breadcrumbData = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Developer Hub", path: "/developers" },
  { name: "Getting Started", path: "/developers/getting-started" },
]);

export default function GettingStartedPage() {
  return (
    <>
      <JsonLd data={breadcrumbData} />
      <GettingStarted />
    </>
  );
}
