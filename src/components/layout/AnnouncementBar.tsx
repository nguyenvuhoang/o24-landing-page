"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white">
            <div className="container mx-auto flex items-center justify-center gap-x-4 px-4 py-2.5 text-sm">
                <span className="hidden sm:inline">🎉</span>
                <p className="text-center font-medium">
                    <span className="font-semibold">O24 v3.0</span> đã ra mắt! Hỗ trợ
                    Multi-tenant và Auto-scaling.{" "}
                    <a
                        href="#features"
                        className="inline-flex items-center gap-1 underline underline-offset-4 hover:no-underline"
                    >
                        Khám phá ngay →
                    </a>
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20 transition-colors"
                    aria-label="Đóng thông báo"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
