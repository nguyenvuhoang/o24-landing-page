import type { Metadata } from "next";
import DevelopersClient from "./DevelopersClient";

export const metadata: Metadata = {
    title: "O24 Developer Hub | API Architecture & Integration | vKnight",
    description:
        "Explore O24 API management, workflow architecture, CQRS concepts, and enterprise integration resources for developers and engineering teams.",
    alternates: {
        canonical: "/solutions/developers",
    },
    openGraph: {
        title: "O24 Developer Hub | vKnight",
        description:
            "Explore API architecture, service orchestration, and integration concepts with O24 by vKnight.",
        url: "/solutions/developers",
        type: "website",
    },
};

export default function DevelopersPage() {
    return <DevelopersClient />;
}
