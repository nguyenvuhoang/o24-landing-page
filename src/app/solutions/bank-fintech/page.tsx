import type { Metadata } from "next";
import BankFintechClient from "./BankFintechClient";

export const metadata: Metadata = {
    title: "Banking & Fintech Integration Solutions | vKnight O24",
    description:
        "Explore API-led banking and fintech integration approaches with O24, including core banking connectivity, workflow orchestration, and enterprise security planning.",
    alternates: { canonical: "/solutions/bank-fintech" },
    openGraph: {
        title: "Banking & Fintech Integration Solutions | vKnight O24",
        description:
            "Connect core banking systems, digital channels, and partner services through API-led integration architecture.",
        url: "/solutions/bank-fintech",
        type: "website",
    },
};

export default function BankFintechPage() {
    return <BankFintechClient />;
}
