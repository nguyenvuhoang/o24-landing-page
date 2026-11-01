/**
 * Central registry for vKnight Engineering articles.
 * Only mark an article as published when its /blog/[slug] route is deployed.
 * Keep publication dates absent until an accurate date is available.
 */
export type BlogCategory =
  | ".NET Architecture"
  | "API Architecture"
  | "Banking Integration"
  | "Security"
  | "DevOps";

export type BlogIcon = "code" | "layers" | "landmark" | "shield" | "server";

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  readTimeMinutes: number;
  icon: BlogIcon;
  status: "published" | "draft";
  /** ISO 8601 date, only if the actual publication date is known. */
  publishedAt?: string;
};

export const blogArticles: readonly BlogArticle[] = [
  {
    slug: "docker-cicd-dotnet-10-microservices",
    category: "DevOps",
    title: "Docker CI/CD for .NET 10 Microservices: Build, Promote, and Roll Back Safely",
    description:
      "Containerize ASP.NET Core with multi-stage Docker builds, test and publish images via GitHub Actions, promote immutable digests, and design health-aware rollbacks.",
    icon: "server",
    readTimeMinutes: 16,
    status: "published",
  },
  {
    slug: "rabbitmq-event-driven-transactions-dotnet-10",
    category: ".NET Architecture",
    title: "RabbitMQ & Event-Driven Transaction Processing in .NET 10",
    description:
      "Build reliable event-driven transaction workflows with a transactional outbox, bounded retries, dead-letter queues, idempotent consumers, and reconciliation.",
    icon: "server",
    readTimeMinutes: 18,
    status: "published",
  },
  {
    slug: "core-banking-integration-architecture",
    category: "Banking Integration",
    title: "Core Banking Integration Architecture: A Developer’s Guide",
    description:
      "Design a resilient banking integration layer with API gateways, anti-corruption adapters, CQRS, transaction states, RabbitMQ, and defense-in-depth security.",
    icon: "landmark",
    readTimeMinutes: 15,
    status: "published",
  },
  {
    slug: "building-api-gateway-aspnet-core",
    category: "API Architecture",
    title: "Building an API Gateway with ASP.NET Core and YARP",
    description:
      "Build a practical .NET 10 reverse proxy with YARP, route configuration, rate limiting, health checks, and production security considerations.",
    icon: "layers",
    readTimeMinutes: 12,
    status: "published",
  },
  {
    slug: "cqrs-pattern-dotnet-10",
    category: ".NET Architecture",
    title: "CQRS Pattern in .NET 10: A Practical Guide",
    description:
      "Build a small ASP.NET Core API with separate command and query handlers, dependency injection, and an in-memory store. Learn the trade-offs before production.",
    icon: "code",
    readTimeMinutes: 10,
    status: "published",
  },
  {
    slug: "api-gateway-vs-reverse-proxy",
    category: "API Architecture",
    title: "API Gateway vs. Reverse Proxy: What Changes in an Enterprise Architecture?",
    description:
      "Understand the roles of routing, authentication, policies, observability, and service ownership before choosing an API entry point.",
    icon: "layers",
    readTimeMinutes: 7,
    status: "published",
  },
];

export function getPublishedArticles(): BlogArticle[] {
  return blogArticles.filter((article) => article.status === "published");
}

export function getPublishedArticle(slug: string): BlogArticle | undefined {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getPublishedArticlePaths(): string[] {
  return getPublishedArticles().map((article) => `/blog/${article.slug}`);
}
