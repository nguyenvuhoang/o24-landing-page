import type { MetadataRoute } from "next";

const BASE_URL = "https://vknight.io.vn";

// Keep this list aligned with published, indexable public pages.
// Do not add authenticated routes, API routes, drafts or placeholder articles.
const publicRoutes = [
  "/",
  "/about",
  "/blog",
  "/blog/api-gateway-vs-reverse-proxy",
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
  return publicRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/blog/") ? 0.7 : 0.6,
  }));
}
