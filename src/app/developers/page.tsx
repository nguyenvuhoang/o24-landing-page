import type { Metadata } from "next";
import { getPublishedArticles } from "@/data/blog";
import DeveloperHubClient from "./DeveloperHubClient";

export const metadata: Metadata = {
  title: "Developer Hub | .NET, API Security & Banking Architecture | vKnight",
  description: "Explore hands-on guides for ASP.NET Core, CQRS, API gateways, banking integration, RabbitMQ, security, and DevOps. Learn practical architecture patterns with vKnight Engineering.",
  alternates: { canonical: "/developers" },
  openGraph: {
    title: "vKnight Developer Hub — Practical Engineering Guides",
    description: "Architecture, banking integration, API security, and DevOps resources for building reliable systems.",
    url: "/developers",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function DeveloperHubPage() {
  // Only registry entries marked published are exposed to the client.
  const articles = getPublishedArticles().map(({ slug, title, description, category, readTimeMinutes, icon }) => ({
    slug, title, description, category, readTimeMinutes, icon,
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "vKnight Developer Hub",
    url: "https://vknight.io.vn/developers",
    description: "Practical engineering guides on .NET, API architecture, banking integration, security, and DevOps.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: `https://vknight.io.vn/blog/${article.slug}`,
      })),
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <DeveloperHubClient articles={articles} />
    </>
  );
}
