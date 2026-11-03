import type { JsonValue } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/entities";

export type BreadcrumbItem = {
  /** Visible label, taken from the site's own navigation/content — never derived from a URL segment. */
  name: string;
  /** Path relative to the site root, e.g. "/blog" or "/blog/my-slug". */
  path: string;
};

/**
 * Builds a Schema.org BreadcrumbList from an explicit, hand-authored trail
 * that mirrors the page's real navigational hierarchy. Google requires at
 * least 2 items for breadcrumb rich-result eligibility, so a shorter trail
 * is rejected rather than silently emitting an ineligible node.
 */
export function buildBreadcrumbJsonLd(
  items: readonly BreadcrumbItem[],
  options?: { id?: string },
): JsonValue {
  if (items.length < 2) {
    throw new Error(
      `buildBreadcrumbJsonLd requires at least 2 items for Google eligibility, got ${items.length}`,
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(options?.id ? { "@id": options.id } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}
