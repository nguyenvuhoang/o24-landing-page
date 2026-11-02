import type { Metadata } from "next";
import EnterpriseSolutionClient from "./EnterpriseSolutionClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "Enterprise API Integration Solutions | O24 by vKnight",
    description:
        "Explore O24 enterprise API integration, workflow orchestration, architecture considerations, and deployment planning. Discuss your requirements with vKnight.",
    path: "/solutions/enterprise",
    ogDescription:
        "Plan API modernization and enterprise integrations with O24. Explore solutions and discuss your requirements with vKnight.",
});

export default function EnterpriseSolutionPage() {
    return <EnterpriseSolutionClient />;
}
