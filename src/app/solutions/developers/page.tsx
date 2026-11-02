import type { Metadata } from "next";
import DevelopersClient from "./DevelopersClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "O24 Developer Hub | API Architecture & Integration | vKnight",
    description:
        "Explore O24 API management, workflow architecture, CQRS concepts, and enterprise integration resources for developers and engineering teams.",
    path: "/solutions/developers",
    ogTitle: "O24 Developer Hub | vKnight",
    ogDescription:
        "Explore API architecture, service orchestration, and integration concepts with O24 by vKnight.",
});

export default function DevelopersPage() {
    return <DevelopersClient />;
}
