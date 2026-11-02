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

const title = "O24 Platform by vKnight | API Management & Enterprise Integration";
const description = "Build, integrate, and scale with O24: API management, workflow orchestration, and enterprise integration capabilities for developers and organizations.";
export const metadata: Metadata = createPageMetadata({ title, description, path: "/" });
export default function Home() {
  return (
    <main>
      <HolidayNoticeModal />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "O24 Platform", applicationCategory: "BusinessApplication",
        description, url: "https://vknight.io.vn/",
        publisher: { "@type": "Organization", name: "vKnight", url: "https://vknight.io.vn/" },
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
