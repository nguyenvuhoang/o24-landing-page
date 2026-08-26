"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Update this config (or set enabled=false) to control the holiday notice —
 * no other file needs to change once the campaign window is over.
 */
const HOLIDAY_NOTICE = {
    enabled: true,
    storageKey: "o24_holiday_notice_2026_national_day",
    startAt: "2026-08-26T00:00:00+07:00",
    endAt: "2026-09-02T23:59:59+07:00",
    image: {
        src: "/images/holiday/national-day-2026.png",
        alt: "Thông báo lịch nghỉ lễ Quốc Khánh 2/9/2026 - O24",
        width: 1254,
        height: 1254,
    },
} as const;

function isWithinNoticeWindow(now: Date): boolean {
    const start = new Date(HOLIDAY_NOTICE.startAt);
    const end = new Date(HOLIDAY_NOTICE.endAt);
    return now >= start && now <= end;
}

export function HolidayNoticeModal() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (!HOLIDAY_NOTICE.enabled) return;
        if (!isWithinNoticeWindow(new Date())) return;

        try {
            if (window.sessionStorage.getItem(HOLIDAY_NOTICE.storageKey)) return;
        } catch {
            // sessionStorage unavailable (e.g. privacy mode) — show once for this mount anyway
        }

        setOpen(true);
    }, []);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            try {
                window.sessionStorage.setItem(HOLIDAY_NOTICE.storageKey, "1");
            } catch {
                // ignore
            }
        }
    };

    if (!HOLIDAY_NOTICE.enabled) return null;

    return (
        <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    )}
                />
                <DialogPrimitive.Content
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    className={cn(
                        "fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] max-w-[600px] -translate-x-1/2 -translate-y-1/2",
                        "flex max-h-[90vh] flex-col items-center gap-3 outline-none",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">
                        Thông báo lịch nghỉ lễ Quốc Khánh 2/9
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Lịch nghỉ lễ Quốc Khánh Việt Nam 2/9 năm 2026 của O24.
                    </DialogPrimitive.Description>

                    <div className="relative w-full">
                        <Image
                            src={HOLIDAY_NOTICE.image.src}
                            alt={HOLIDAY_NOTICE.image.alt}
                            width={HOLIDAY_NOTICE.image.width}
                            height={HOLIDAY_NOTICE.image.height}
                            sizes="(max-width: 640px) 90vw, 600px"
                            priority
                            className="h-auto max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                        />

                        <DialogPrimitive.Close
                            aria-label="Đóng thông báo"
                            className={cn(
                                "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full",
                                "bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80",
                                "focus:outline-none focus:ring-2 focus:ring-white/70"
                            )}
                        >
                            <X className="h-4 w-4" />
                        </DialogPrimitive.Close>
                    </div>

                    <DialogPrimitive.Close
                        className={cn(
                            "rounded-full bg-black/40 px-4 py-1.5 text-xs font-medium text-white/90",
                            "backdrop-blur-sm transition hover:bg-black/60",
                            "focus:outline-none focus:ring-2 focus:ring-white/70"
                        )}
                    >
                        Đóng thông báo
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
