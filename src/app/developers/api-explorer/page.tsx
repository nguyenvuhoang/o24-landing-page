import type { Metadata } from "next";
import { ApiExplorer } from "./ApiExplorer";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Interactive API Explorer | O24 Developer Hub",
  description: "Explore illustrative O24-style requests, validation, workflow execution and JSON responses safely in your browser. No live banking connection.",
  path: "/developers/api-explorer",
  ogDescription: "Client-side API simulations with request and response examples, execution traces and cURL snippets.",
});

export default function ApiExplorerPage() {
  return <ApiExplorer />;
}
