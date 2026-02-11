import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Solutions } from "@/components/sections/Solutions";
import { Architecture } from "@/components/sections/Architecture";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "O24 Platform | vKnight - OpenAPI & Open Banking Integration",
    description: "O24 là nền tảng OpenAPI & Open Banking Integration mạnh mẽ từ vKnight. Triển khai nhanh, bảo mật cao, hỗ trợ on-prem & cloud.",
    openGraph: {
        title: "O24 Platform | vKnight - OpenAPI & Open Banking Integration",
        description: "O24 là nền tảng OpenAPI & Open Banking Integration mạnh mẽ từ vKnight. Triển khai nhanh, bảo mật cao, hỗ trợ on-prem & cloud.",
        url: "/",
    },
};

export default function Home() {
    return (
        <main>
            <Hero />
            <Features />
            <Solutions />
            <Architecture />
            <Pricing />
            <FAQ />
            <CTA />
        </main>
    );
}
