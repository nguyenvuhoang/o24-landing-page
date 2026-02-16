import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://vknight.io.vn';
    const appDir = path.join(process.cwd(), 'src/app');

    const getRoutes = (dir: string): MetadataRoute.Sitemap => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        let sitemapEntries: MetadataRoute.Sitemap = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip API routes, auth routes, and private folders (starting with _)
                if (['api', 'auth'].includes(entry.name) || entry.name.startsWith('_')) {
                    continue;
                }
                sitemapEntries = [...sitemapEntries, ...getRoutes(fullPath)];
            } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
                const relativePath = path.relative(appDir, dir);

                // Clean route path: remove route groups like (marketing) and handle Windows/Linux paths
                const routePath = relativePath
                    .split(path.sep)
                    .filter(segment => !(segment.startsWith('(') && segment.endsWith(')')))
                    .join('/');

                const url = `${baseUrl}${routePath === '' ? '' : `/${routePath}`}`;
                const stats = fs.statSync(fullPath);

                sitemapEntries.push({
                    url,
                    lastModified: stats.mtime,
                    changeFrequency: 'weekly',
                    priority: routePath === '' ? 1 : 0.8,
                });
            }
        }
        return sitemapEntries;
    };

    try {
        return getRoutes(appDir);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Fallback to minimal sitemap if something goes wrong
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 1,
            },
        ];
    }
}
