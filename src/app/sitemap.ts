import { getArticleLastModified, getPublishedArticles } from "@/data/blog";
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

type SitemapEntry = MetadataRoute.Sitemap[number];

// Static pages have no verified content-modification date source yet, so
// they intentionally carry no lastModified (see Step 32.5 date provenance
// report — do not substitute a build or deploy timestamp here).
function staticEntry(route: string): SitemapEntry {
  return {
    url: new URL(route, BASE_URL).toString(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  };
}

function articleEntry(route: string, lastModified: string | undefined): SitemapEntry {
  return {
    url: new URL(route, BASE_URL).toString(),
    changeFrequency: "monthly",
    priority: 0.7,
    ...(lastModified ? { lastModified } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = new Map<string, SitemapEntry>();

  for (const route of staticRoutes) {
    const entry = staticEntry(route);
    entries.set(entry.url, entry);
  }

  for (const article of getPublishedArticles()) {
    const entry = articleEntry(`/blog/${article.slug}`, getArticleLastModified(article));
    entries.set(entry.url, entry);
  }

  return [...entries.values()];
}
