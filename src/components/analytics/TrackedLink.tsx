"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { track } from "@vercel/analytics";

type Props = ComponentProps<typeof Link> & {
  eventName: "engineering_blog_to_hub" | "engineering_article_to_hub" | "engineering_hub_to_demo" | "engineering_related_article" | "engineering_hub_to_solution";
  source: string;
  destination: string;
};

/** Records navigation intent only. Does not imply a demo form was submitted. */
export function TrackedLink({ eventName, source, destination, onClick, ...props }: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      track(eventName, { source, destination });
    } catch {
      // Analytics failures must never block navigation.
    }
    onClick?.(event);
  };
  return <Link {...props} onClick={handleClick} />;
}
