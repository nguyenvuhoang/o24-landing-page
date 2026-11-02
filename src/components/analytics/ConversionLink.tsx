"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ComponentProps, MouseEvent } from "react";

type ConversionSource = "homepage" | "features" | "solutions" | "bank_fintech" | "enterprise";
type ConversionDestination = "/demo" | "/solutions" | "/solutions/bank-fintech" | "/solutions/enterprise" | "/solutions/developers";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: ConversionDestination;
  source: ConversionSource;
  placement: string;
};

/** Tracks navigation intent only; never records form input or personal information. */
export function ConversionLink({ source, placement, href, onClick, ...props }: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      track("solutions_cta_click", { source, placement, destination: href });
    } catch {
      // Analytics must not interrupt navigation.
    }
    onClick?.(event);
  };
  return <Link {...props} href={href} onClick={handleClick} />;
}
