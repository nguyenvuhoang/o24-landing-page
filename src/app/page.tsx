import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { O24InAction } from "@/components/sections/O24InAction";
import { Solutions } from "@/components/sections/Solutions";
import { Architecture } from "@/components/sections/Architecture";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { HolidayNoticeModal } from "@/components/holiday/HolidayNoticeModal";
import { ORGANIZATION_ID, SOFTWARE_APPLICATION_ID } from "@/lib/entities";

const title = "O24 Platform by vKnight | API Management & Enterprise Integration";
const description = "Build, integrate, and scale with O24: API management, workflow orchestration, and enterprise integration capabilities for developers and organizations.";
export const metadata: Metadata = createPageMetadata({ title, description, path: "/" });
export default function Home() {
  return (
    <main>
      <HolidayNoticeModal />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "@id": SOFTWARE_APPLICATION_ID,
        name: "O24 Platform", applicationCategory: "BusinessApplication",
        operatingSystem: "Web browser",
        description, url: "https://vknight.io.vn/",
        publisher: { "@id": ORGANIZATION_ID },
      }} />
      <Hero />
      <Features />
      <O24InAction />
      <Solutions />
      <Architecture />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  );
}
