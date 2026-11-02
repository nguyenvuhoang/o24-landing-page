import { getPublishedArticlePaths } from "@/data/blog";
import type { MetadataRoute } from "next";

const BASE_URL = "https://vknight.io.vn";

// Public non-article pages only. Blog articles come from the content registry.
const staticRoutes = [
  "/",
  "/about",
  "/blog",
  "/careers",
  "/changelog",
  "/contact",
  "/demo",
  "/developers",
  "/developers/getting-started",
  "/developers/api-explorer",
  "/developers/guides",
  "/developers/guides/workflow-orchestration",
  "/developers/guides/cqrs",
  "/developers/guides/api-gateway",
  "/developers/guides/core-banking-integration",
  "/enterprise",
  "/enterprise/security-review",
  "/enterprise/deployment",
  "/features",
  "/pricing",
  "/pricing/business",
  "/pricing/starter",
  "/privacy",
  "/roadmap",
  "/security",
  "/solutions",
  "/solutions/bank-fintech",
  "/solutions/developers",
  "/solutions/enterprise",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...staticRoutes, ...getPublishedArticlePaths()];
  return [...new Set(routes)].map((route) => ({
    url: new URL(route, BASE_URL).toString(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/blog/") ? 0.7 : 0.6,
  }));
}
