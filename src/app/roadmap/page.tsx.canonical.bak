import { Suspense } from "react";
import { RoadmapContent } from "./RoadmapClient";
import { roadmapData } from "@/data/roadmap";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Roadmap | Lộ trình phát triển O24 Platform",
    description: "Khám phá lộ trình phát triển và các tính năng đột phá sắp tới của vKnight O24.",
    openGraph: {
        title: "Roadmap | Lộ trình phát triển O24 Platform",
        description: "Khám phá lộ trình phát triển và các tính năng đột phá sắp tới của vKnight O24.",
        url: "/roadmap",
    },
};

export default async function RoadmapPage() {
    // Simulate server-side data fetching latency if desired, or just pass static data
    // await new Promise(resolve => setTimeout(resolve, 100));

    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Roadmap{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                            O24 Platform
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Khám phá lộ trình phát triển và các tính năng đột phá của vKnight O24.
                        Chúng tôi liên tục cải tiến để mang lại giải pháp OpenAPI & Open Banking toàn diện nhất.
                    </p>
                </div>

                <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Đang tải roadmap...</div>}>
                    <RoadmapContent items={roadmapData} />
                </Suspense>
            </div>
        </main>
    );
}
