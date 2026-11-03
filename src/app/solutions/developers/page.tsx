import type { Metadata } from "next";
import DevelopersClient from "./DevelopersClient";
import { createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = createPageMetadata({
    title: "O24 Developer Hub | API Architecture & Integration | vKnight",
    description:
        "Explore O24 API management, workflow architecture, CQRS concepts, and enterprise integration resources for developers and engineering teams.",
    path: "/solutions/developers",
    ogTitle: "O24 Developer Hub | vKnight",
    ogDescription:
        "Explore API architecture, service orchestration, and integration concepts with O24 by vKnight.",
});

// Labeled "Developer Experience" (matching src/data/solutions.ts) rather than
// "Developer Hub" to avoid colliding with the distinct /developers route.
const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/solutions" },
    { name: "Developer Experience", path: "/solutions/developers" },
]);

export default function DevelopersPage() {
    return (
        <>
            <JsonLd data={breadcrumbData} />
            <DevelopersClient />
        </>
    );
}
