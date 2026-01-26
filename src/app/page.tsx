import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Solutions } from "@/components/sections/Solutions";
import { Architecture } from "@/components/sections/Architecture";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

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
