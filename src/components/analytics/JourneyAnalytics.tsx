"use client";

import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { useEffect, useRef } from "react";
import { classifyInternalDestination, classifyJourneyPath } from "@/lib/analytics/journey";

/**
 * Privacy-safe marketing funnel telemetry; no visitor IDs, raw URLs, query params,
 * form inputs, email addresses, company names or free-text values are emitted.
 * This measures journeys in aggregate, NOT per-lead attribution.
 */
export function JourneyAnalytics() {
  const pathname = usePathname();
  const previousRoute = useRef<string | null>(null);

  useEffect(() => {
    const route = classifyJourneyPath(pathname);
    if (!route || route.path === previousRoute.current) return;
    previousRoute.current = route.path;
    try {
      track("journey_page_view", { page: route.label, stage: route.stage });
    } catch {
      // Analytics must never block page rendering.
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("download")) return;
      const source = classifyJourneyPath(window.location.pathname);
      const destination = classifyInternalDestination(anchor.href, window.location.origin);
      if (!source || !destination || source.path === destination.path) return;
      try {
        // Click navigation is intent, not a completed lead or a form submission.
        track("journey_navigation", {
          from: source.label,
          to: destination.label,
          from_stage: source.stage,
          to_stage: destination.stage,
        });
      } catch {
        // Navigation is independent from telemetry availability.
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
