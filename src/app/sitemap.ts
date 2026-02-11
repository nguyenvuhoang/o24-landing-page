import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://vknight.io.vn';

    const routes = [
        '',
        '/features',
        '/pricing',
        '/changelog',
        '/roadmap',
        '/contact',
        '/about',
        '/blog',
        '/careers',
        '/privacy',
        '/terms',
        '/security',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));
}
