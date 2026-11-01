
import type { Metadata } from "next";

const SITE_URL = "https://vknight.io.vn";

type SeoOptions = {
    title: string;
    description: string;
    path: string;
};

export function createPageMetadata({
    title,
    description,
    path,
}: SeoOptions): Metadata {
    const normalizedPath =
        path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;

    const url = new URL(normalizedPath, SITE_URL).toString();

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "vKnight",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
