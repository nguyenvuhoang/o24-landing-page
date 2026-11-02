import type { Metadata } from "next";
import BankFintechClient from "./BankFintechClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "Banking & Fintech Integration Solutions | vKnight O24",
    description:
        "Explore API-led banking and fintech integration approaches with O24, including core banking connectivity, workflow orchestration, and enterprise security planning.",
    path: "/solutions/bank-fintech",
    ogDescription:
        "Connect core banking systems, digital channels, and partner services through API-led integration architecture.",
});

export default function BankFintechPage() {
    return <BankFintechClient />;
}
