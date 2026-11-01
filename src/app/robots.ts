import type { MetadataRoute } from "next";

const BASE_URL = "https://vknight.io.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/admin/",
        "/dashboard",
        "/login",
        "/register",
        "/sign-in",
        "/sign-up",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
