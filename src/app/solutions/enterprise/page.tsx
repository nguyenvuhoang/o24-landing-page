import type { Metadata } from "next";
import EnterpriseSolutionClient from "./EnterpriseSolutionClient";

export const metadata: Metadata = {
    title: "Enterprise API Integration Solutions | O24 by vKnight",
    description:
        "Explore O24 enterprise API integration, workflow orchestration, architecture considerations, and deployment planning. Discuss your requirements with vKnight.",
    alternates: { canonical: "/solutions/enterprise" },
    openGraph: {
        title: "Enterprise API Integration Solutions | O24 by vKnight",
        description:
            "Plan API modernization and enterprise integrations with O24. Explore solutions and discuss your requirements with vKnight.",
        url: "/solutions/enterprise",
        type: "website",
    },
};

export default function EnterpriseSolutionPage() {
    return <EnterpriseSolutionClient />;
}
