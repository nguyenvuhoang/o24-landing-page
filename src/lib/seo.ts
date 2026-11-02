import type { Metadata } from "next";

const SITE_URL = "https://vknight.io.vn";
const SITE_NAME = "vKnight";

/**
 * Single source of truth for the sitewide social preview image.
 * Verified to exist at public/images/og-image.png (1200x630).
 */
export const DEFAULT_OG_IMAGE: SeoImageInput = {
    url: "/images/og-image.png",
    width: 1200,
    height: 630,
    alt: "vKnight O24 Platform",
};

export type SeoImageInput = {
    /** Absolute or site-relative URL. Relative URLs are resolved against SITE_URL. */
    url: string;
    width?: number;
    height?: number;
    alt?: string;
};

export type SeoOptions = {
    /** Document <title>. */
    title: string;
    /** Document meta description. Used as the Open Graph/Twitter description unless ogDescription is set. */
    description: string;
    /** Route path relative to the site root, e.g. "/about" or "/". */
    path: string;
    /** Open Graph object type. "article" for blog posts and guides. */
    type?: "website" | "article";
    /** Open Graph/Twitter title override, when a page intentionally uses a shorter social title. */
    ogTitle?: string;
    /** Open Graph/Twitter description override, when a page intentionally uses different social copy. */
    ogDescription?: string;
    /** Open Graph site name override. Defaults to "vKnight". */
    siteName?: string;
    /** Open Graph locale override, e.g. "vi_VN". */
    locale?: string;
    /** Preview image. Defaults to the sitewide OG image so every page always has one. */
    image?: SeoImageInput;
    /** Twitter card type. Defaults to "summary_large_image". */
    twitterCard?: "summary" | "summary_large_image";
};

function absoluteUrl(path: string): string {
    return new URL(path, SITE_URL).toString();
}

/**
 * Builds canonical + Open Graph + Twitter metadata for a public page.
 *
 * Next.js does not deep-merge `openGraph`/`twitter` objects between a layout
 * and a page: a page-level `openGraph` fully replaces the root layout's,
 * including its image. Every page must therefore supply its own complete
 * `openGraph`/`twitter` block — this helper is the one place that does it,
 * so the sitewide preview image can't be dropped again by a future page.
 */
export function createPageMetadata({
    title,
    description,
    path,
    type = "website",
    ogTitle,
    ogDescription,
    siteName = SITE_NAME,
    locale,
    image = DEFAULT_OG_IMAGE,
    twitterCard = "summary_large_image",
}: SeoOptions): Metadata {
    const normalizedPath =
        path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;

    const url = absoluteUrl(normalizedPath);
    const resolvedTitle = ogTitle ?? title;
    const resolvedDescription = ogDescription ?? description;
    const resolvedImageUrl = absoluteUrl(image.url);
    const resolvedImage = {
        url: resolvedImageUrl,
        width: image.width,
        height: image.height,
        alt: image.alt ?? title,
    };

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: resolvedTitle,
            description: resolvedDescription,
            url,
            siteName,
            locale,
            type,
            images: [resolvedImage],
        } as Metadata["openGraph"],
        twitter: {
            card: twitterCard,
            title: resolvedTitle,
            description: resolvedDescription,
            images: [resolvedImageUrl],
        } as Metadata["twitter"],
    };
}
