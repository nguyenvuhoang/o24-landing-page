import type { Metadata } from "next";
import { GettingStarted } from "./GettingStarted";

export const metadata: Metadata = {
  title: "Getting Started | O24 Developer Hub",
  description: "Start with O24 architecture, prepare a local development environment, inspect illustrative API calls, and explore a workflow simulation without live banking access.",
  alternates: { canonical: "/developers/getting-started" },
  openGraph: {
    title: "Getting Started | O24 Developer Hub",
    description: "A guided, safe introduction to API integration and workflow concepts in O24.",
    url: "/developers/getting-started",
    type: "website",
  },
};

export default function GettingStartedPage() {
  return <GettingStarted />;
}
