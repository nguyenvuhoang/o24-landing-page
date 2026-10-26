
import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://vknight.io.vn";

const EXCLUDED_SEGMENTS = new Set([
    "api",
    "auth",
    "admin",
    "dashboard",
    "login",
    "register",
    "sign-in",
    "sign-up",
]);

const PAGE_FILES = new Set([
    "page.tsx",
    "page.ts",
    "page.jsx",
    "page.js",
]);

export default function sitemap(): MetadataRoute.Sitemap {
    const srcAppDir = path.join(process.cwd(), "src", "app");
    const rootAppDir = path.join(process.cwd(), "app");

    const appDir = fs.existsSync(srcAppDir)
        ? srcAppDir
        : rootAppDir;

    const routes = new Map<
        string,
        MetadataRoute.Sitemap[number]
    >();

    function scan(dir: string): void {
        const entries = fs.readdirSync(dir, {
            withFileTypes: true,
        });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                const name = entry.name;

                if (
                    EXCLUDED_SEGMENTS.has(name.toLowerCase()) ||
                    name.startsWith("_") ||
                    name.startsWith("@") ||
                    name.startsWith("[") ||
                    name.startsWith("(.)") ||
                    name.startsWith("(..)")
                ) {
                    continue;
                }

                scan(fullPath);
                continue;
            }

            if (!PAGE_FILES.has(entry.name)) {
                continue;
            }

            const relativePath = path.relative(appDir, dir);

            const segments = relativePath
                .split(path.sep)
                .filter(Boolean)
                .filter(
                    (segment) =>
                        !(
                            segment.startsWith("(") &&
                            segment.endsWith(")")
                        )
                );

            if (
                segments.some(
                    (segment) =>
                        segment.startsWith("[") ||
                        segment.startsWith("@") ||
                        segment.startsWith("_") ||
                        EXCLUDED_SEGMENTS.has(segment.toLowerCase())
                )
            ) {
                continue;
            }

            const routePath = segments.join("/");
            const url = routePath
                ? `${BASE_URL}/${routePath}`
                : BASE_URL;

            const stats = fs.statSync(fullPath);

            routes.set(url, {
                url,
                lastModified: stats.mtime,
                changeFrequency:
                    routePath === "" ? "weekly" : "monthly",
                priority: routePath === "" ? 1 : 0.7,
            });
        }
    }

    try {
        scan(appDir);

        return Array.from(routes.values()).sort(
            (a, b) => a.url.localeCompare(b.url)
        );
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        throw error;
    }
}
