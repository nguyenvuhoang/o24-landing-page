import type { Metadata } from "next";
import { ApiExplorer } from "./ApiExplorer";

export const metadata: Metadata = {
  title: "Interactive API Explorer | O24 Developer Hub",
  description: "Explore illustrative O24-style requests, validation, workflow execution and JSON responses safely in your browser. No live banking connection.",
  alternates: { canonical: "/developers/api-explorer" },
  openGraph: {
    title: "Interactive API Explorer | O24 Developer Hub",
    description: "Client-side API simulations with request and response examples, execution traces and cURL snippets.",
    url: "/developers/api-explorer",
    type: "website",
  },
};

export default function ApiExplorerPage() {
  return <ApiExplorer />;
}
