import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Features } from "@/components/sections/Features";
import { Solutions } from "@/components/sections/Solutions";
import { Architecture } from "@/components/sections/Architecture";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
    return (
        <>
            <AnnouncementBar />
            <Header />
            <main>
                <Hero />
                <SocialProof />
                <Features />
                <Solutions />
                <Architecture />
                <Testimonials />
                <Pricing />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </>
    );
}
