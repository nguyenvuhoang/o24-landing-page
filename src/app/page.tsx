import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Solutions } from "@/components/sections/Solutions";
import { Architecture } from "@/components/sections/Architecture";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
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
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "O24 Platform",
                    "operatingSystem": "All",
                    "applicationCategory": "BusinessApplication",
                    "description": "Nền tảng OpenAPI & Open Banking Integration mạnh mẽ.",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "VND"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "ratingCount": "120"
                    }
                }}
            />
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
