import { getArticleLastModified, getPublishedArticle, type BlogArticle } from "@/data/blog";
import type { JsonValue } from "@/components/seo/JsonLd";

const SITE_URL = "https://vknight.io.vn";
const VKNIGHT_ORGANIZATION: JsonValue = {
  "@type": "Organization",
  name: "vKnight",
  url: SITE_URL,
};

export type ArticleJsonLdContent = {
  title: string;
  description: string;
  url: string;
  keywords?: string | string[];
  proficiencyLevel?: "Beginner" | "Intermediate" | "Advanced";
  isAccessibleForFree?: boolean;
};

export type ArticleJsonLdInput = ArticleJsonLdContent & {
  /** Slug in the blog content registry (src/data/blog.ts); supplies datePublished/dateModified when known. */
  slug: string;
};

/**
 * Pure builder: assembles the TechArticle JSON-LD from already-resolved
 * dates. Exported separately from buildArticleJsonLd so tests can verify
 * date inclusion/omission without depending on the live content registry.
 */
export function buildArticleJsonLdFromDates(
  content: ArticleJsonLdContent,
  dates: Pick<BlogArticle, "publishedAt" | "updatedAt"> | undefined,
): JsonValue {
  const datePublished = dates?.publishedAt;
  const dateModified = dates ? getArticleLastModified(dates) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: content.title,
    description: content.description,
    url: content.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": content.url },
    author: VKNIGHT_ORGANIZATION,
    publisher: VKNIGHT_ORGANIZATION,
    inLanguage: "en",
    ...(content.isAccessibleForFree !== undefined
      ? { isAccessibleForFree: content.isAccessibleForFree }
      : {}),
    ...(content.proficiencyLevel ? { proficiencyLevel: content.proficiencyLevel } : {}),
    ...(content.keywords ? { keywords: content.keywords } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

/**
 * Builds the TechArticle JSON-LD shared by every /blog/[slug] page.
 * datePublished/dateModified are included only when the content registry
 * has a verified date for that article; never fabricated here.
 */
export function buildArticleJsonLd(input: ArticleJsonLdInput): JsonValue {
  const article = getPublishedArticle(input.slug);
  return buildArticleJsonLdFromDates(input, article);
}
