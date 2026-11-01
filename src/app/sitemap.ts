import type { MetadataRoute } from "next";
import { getPublishedArticlePaths } from "@/data/blog";

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
  "/enterprise",
  "/features",
  "/pricing",
  "/pricing/business",
  "/pricing/starter",
  "/privacy",
  "/roadmap",
  "/security",
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
