"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const HOLIDAY_END_DATE = new Date("2026-02-23T23:59:59+07:00");
const STORAGE_KEY = "tet-holiday-popup-dismissed-2026";

export function TetHolidayPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const now = new Date();
        if (now > HOLIDAY_END_DATE) return;

        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed) return;

        // Small delay so the popup appears after page load
        const timer = setTimeout(() => setIsOpen(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem(STORAGE_KEY, "true");
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleClose}
        >
            <div
                className="relative max-w-lg w-[90vw] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-transform hover:scale-110 hover:bg-gray-100"
                    aria-label="Đóng"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="overflow-hidden rounded-2xl shadow-2xl">
                    <Image
                        src="/images/hpny.png"
                        alt="Thông báo lịch nghỉ Tết Âm Lịch 2026 - vKnight"
                        width={800}
                        height={800}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
