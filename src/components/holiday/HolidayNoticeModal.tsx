
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeCampaign = {
    enabled: boolean;
    storageKey: string;
    startAt: string;
    endAt: string;
    title: string;
    description: string;
    image: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
};

const NOTICE_CAMPAIGNS: NoticeCampaign[] = [
    {
        enabled: false,
        storageKey: "o24_holiday_notice_2026_national_day",
        startAt: "2026-08-26T00:00:00+07:00",
        endAt: "2026-09-02T23:59:59+07:00",
        title: "Thông báo nghỉ lễ Quốc Khánh 2/9",
        description: "Lịch nghỉ lễ Quốc Khánh năm 2026 của O24.",
        image: {
            src: "/images/holiday/national-day-2026.png",
            alt: "Thông báo Quốc Khánh 2026 - O24",
            width: 1254,
            height: 1254,
        },
    },
    {
        enabled: true,
        storageKey: "o24_campaign_halloween_2026",
        startAt: "2026-10-27T00:00:00+07:00",
        endAt: "2026-11-01T23:59:59+07:00",
        title: "Happy Halloween 2026 - vKnight",
        description: "Halloween cùng vKnight và nền tảng O24.",
        image: {
            src: "/images/holiday/halloween-2026.png",
            alt: "Happy Halloween 2026 - vKnight O24",
            width: 1024,
            height: 1536,
        },
    },
];

function getActiveCampaign(now: Date): NoticeCampaign | null {
    return (
        NOTICE_CAMPAIGNS.find((campaign) => {
            if (!campaign.enabled) return false;

            const start = new Date(campaign.startAt);
            const end = new Date(campaign.endAt);

            return now >= start && now <= end;
        }) ?? null
    );
}

export function HolidayNoticeModal() {
    const [open, setOpen] = React.useState(false);
    const [campaign, setCampaign] =
        React.useState<NoticeCampaign | null>(null);

    React.useEffect(() => {
        const activeCampaign = getActiveCampaign(new Date());

        if (!activeCampaign) return;

        try {
            if (
                window.sessionStorage.getItem(
                    activeCampaign.storageKey
                )
            ) {
                return;
            }
        } catch {
            // sessionStorage unavailable
        }

        setCampaign(activeCampaign);
        setOpen(true);
    }, []);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen && campaign) {
            try {
                window.sessionStorage.setItem(
                    campaign.storageKey,
                    "1"
                );
            } catch {
                // Ignore storage errors
            }
        }
    };

    if (!campaign) return null;

    return (
        <DialogPrimitive.Root
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    )}
                />

                <DialogPrimitive.Content
                    onPointerDownOutside={(e) =>
                        e.preventDefault()
                    }
                    onInteractOutside={(e) =>
                        e.preventDefault()
                    }
                    className={cn(
                        "fixed left-1/2 top-1/2 z-[101]",
                        "w-[calc(100vw-2rem)] max-w-[520px]",
                        "-translate-x-1/2 -translate-y-1/2",
                        "flex max-h-[95dvh] flex-col items-center gap-3",
                        "outline-none",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "duration-200"
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">
                        {campaign.title}
                    </DialogPrimitive.Title>

                    <DialogPrimitive.Description className="sr-only">
                        {campaign.description}
                    </DialogPrimitive.Description>

                    <div className="relative flex w-full justify-center">
                        <Image
                            src={campaign.image.src}
                            alt={campaign.image.alt}
                            width={campaign.image.width}
                            height={campaign.image.height}
                            sizes="(max-width: 640px) 90vw, 520px"
                            priority
                            className={cn(
                                "h-auto w-auto max-w-full",
                                "max-h-[85dvh]",
                                "rounded-2xl object-contain shadow-2xl"
                            )}
                        />

                        <DialogPrimitive.Close
                            aria-label="Đóng thông báo"
                            className={cn(
                                "absolute right-2 top-2 z-10",
                                "flex h-9 w-9 items-center justify-center",
                                "rounded-full bg-black/65 text-white",
                                "backdrop-blur-sm transition",
                                "hover:bg-black/85",
                                "focus:outline-none focus:ring-2 focus:ring-white/70"
                            )}
                        >
                            <X className="h-5 w-5" />
                        </DialogPrimitive.Close>
                    </div>

                    <DialogPrimitive.Close
                        className={cn(
                            "rounded-full bg-white/15 px-5 py-2",
                            "text-sm font-medium text-white",
                            "backdrop-blur-sm transition",
                            "hover:bg-white/25",
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
