"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Publish only verified announcements. Toggle enabled to hide the banner globally.
const announcement = {
    enabled: true,
    label: "Explore O24",
    message: "Discover the platform's API and integration capabilities.",
    href: "/features",
    cta: "Explore features",
} as const;

export function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();

    if (!announcement.enabled || !isVisible || pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <aside aria-label="Site announcement" className="relative border-b border-primary/20 bg-gradient-to-r from-amber-500 via-primary to-orange-600 text-white">
            <div className="container mx-auto flex min-h-11 items-center justify-center px-12 py-2 sm:px-14">
                <p className="text-center text-xs leading-relaxed sm:text-sm">
                    <span className="mr-2 rounded-full bg-white/20 px-2 py-0.5 font-bold">{announcement.label}</span>
                    <span className="hidden sm:inline">{announcement.message} </span>
                    <Link href={announcement.href} className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:no-underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        {announcement.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                </p>
                <button type="button" onClick={() => setIsVisible(false)} aria-label="Dismiss announcement" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4">
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </aside>
    );
}
