import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sitemap from "../src/app/sitemap";
import { buildBreadcrumbJsonLd } from "../src/lib/breadcrumbs";
import { buildArticleJsonLdFromDates } from "../src/lib/structuredData";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  SOFTWARE_APPLICATION_ID,
  organizationRef,
  SITE_URL,
} from "../src/lib/entities";
import { JsonLd } from "../src/components/seo/JsonLd";

const APP_DIR = join(__dirname, "..", "src", "app");
const readSrc = (relativePath: string) => readFileSync(join(APP_DIR, relativePath), "utf8");

// --- buildBreadcrumbJsonLd: shape, ordering, eligibility --------------------

test("buildBreadcrumbJsonLd: positions increase from 1 and preserve order", () => {
  const data = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/solutions" },
    { name: "Banking & Fintech", path: "/solutions/bank-fintech" },
  ]) as { itemListElement: Array<{ position: number; name: string }> };
  assert.deepEqual(
    data.itemListElement.map((i) => i.position),
    [1, 2, 3],
  );
  assert.deepEqual(
    data.itemListElement.map((i) => i.name),
    ["Home", "Solutions", "Banking & Fintech"],
  );
});

test("buildBreadcrumbJsonLd: every item resolves to an absolute canonical URL", () => {
  const data = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]) as { itemListElement: Array<{ item: string }> };
  for (const item of data.itemListElement) {
    assert.match(item.item, /^https:\/\/vknight\.io\.vn\//);
  }
  assert.equal(data.itemListElement[1].item, `${SITE_URL}/blog`);
});

test("buildBreadcrumbJsonLd: rejects fewer than 2 items (Google eligibility floor)", () => {
  assert.throws(() => buildBreadcrumbJsonLd([]));
  assert.throws(() => buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]));
});

test("buildBreadcrumbJsonLd: accepts non-ASCII labels and serializes safely through JsonLd", () => {
  const data = buildBreadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: "Giá & Kế hoạch — \"Starter\" </script>", path: "/pricing/starter" },
  ]);
  const html = (
    JsonLd({ data } as never) as unknown as { props: { dangerouslySetInnerHTML: { __html: string } } }
  ).props.dangerouslySetInnerHTML.__html;
  assert.equal(html.includes("</script>"), false);
  assert.ok(html.includes("Trang ch\\u1ee7") || html.includes("Trang chủ"));
});

test("buildBreadcrumbJsonLd: accepts an explicit @id for WebPage.breadcrumb linkage", () => {
  const data = buildBreadcrumbJsonLd(
    [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ],
    { id: `${SITE_URL}/blog#breadcrumb` },
  ) as Record<string, unknown>;
  assert.equal(data["@id"], `${SITE_URL}/blog#breadcrumb`);
});

test("buildBreadcrumbJsonLd: no duplicate positions within one list", () => {
  const data = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Developer Hub", path: "/developers" },
    { name: "Guides", path: "/developers/guides" },
    { name: "CQRS & Command Handling", path: "/developers/guides/cqrs" },
  ]) as { itemListElement: Array<{ position: number }> };
  const positions = data.itemListElement.map((i) => i.position);
  assert.equal(positions.length, new Set(positions).size);
});

// --- Entity identifiers: stable, distinct, reference-based ----------------

test("entity IDs are the stable absolute IDs and are mutually distinct", () => {
  assert.equal(ORGANIZATION_ID, `${SITE_URL}/#organization`);
  assert.equal(WEBSITE_ID, `${SITE_URL}/#website`);
  assert.equal(SOFTWARE_APPLICATION_ID, `${SITE_URL}/#software`);
  assert.equal(new Set([ORGANIZATION_ID, WEBSITE_ID, SOFTWARE_APPLICATION_ID]).size, 3);
});

test("buildArticleJsonLdFromDates: author/publisher reference Organization by @id, never duplicate it", () => {
  const data = buildArticleJsonLdFromDates(
    { title: "T", description: "D", url: `${SITE_URL}/blog/t` },
    undefined,
  ) as Record<string, unknown>;
  assert.deepEqual(data.author, organizationRef);
  assert.deepEqual(data.publisher, organizationRef);
  assert.equal(JSON.stringify(data).includes('"name":"vKnight"'), false);
});

test("buildArticleJsonLdFromDates: mainEntityOfPage.breadcrumb references the page's BreadcrumbList by @id", () => {
  const withBreadcrumb = buildArticleJsonLdFromDates(
    { title: "T", description: "D", url: `${SITE_URL}/blog/t`, breadcrumbId: `${SITE_URL}/blog/t#breadcrumb` },
    undefined,
  ) as Record<string, { breadcrumb?: { "@id": string } }>;
  assert.equal(withBreadcrumb.mainEntityOfPage.breadcrumb?.["@id"], `${SITE_URL}/blog/t#breadcrumb`);

  const withoutBreadcrumb = buildArticleJsonLdFromDates(
    { title: "T", description: "D", url: `${SITE_URL}/blog/t` },
    undefined,
  ) as Record<string, { breadcrumb?: unknown }>;
  assert.equal("breadcrumb" in withoutBreadcrumb.mainEntityOfPage, false);
});

// --- No fabricated entity properties ---------------------------------------

const FORBIDDEN_KEYS = ["sameAs", "telephone", "address", "foundingDate", "aggregateRating", "review", "offers"];

test("no fabricated identity/credential properties on Organization, WebSite or SoftwareApplication nodes", () => {
  for (const file of ["layout.tsx", "page.tsx"]) {
    const source = readSrc(file);
    for (const key of FORBIDDEN_KEYS) {
      assert.equal(source.includes(`${key}:`), false, `${file} should not declare "${key}"`);
    }
  }
});

// --- Preservation of existing structured data ------------------------------

test("homepage SoftwareApplication schema is preserved and now carries a stable @id + Organization reference", () => {
  const source = readSrc("page.tsx");
  assert.match(source, /"@type":\s*"SoftwareApplication"/);
  assert.match(source, /SOFTWARE_APPLICATION_ID/);
  assert.match(source, /publisher:\s*\{\s*"@id":\s*ORGANIZATION_ID\s*\}/);
});

test("homepage does not emit a BreadcrumbList (no meaningful hierarchy for the root page)", () => {
  const source = readSrc("page.tsx");
  assert.equal(source.includes("buildBreadcrumbJsonLd"), false);
});

test("FAQPage schema on the homepage FAQ section is preserved", () => {
  const source = readFileSync(
    join(__dirname, "..", "src", "components", "sections", "FAQ.tsx"),
    "utf8",
  );
  assert.match(source, /"@type":\s*"FAQPage"/);
});

test("all seven blog article pages wire a BreadcrumbList via buildBreadcrumbJsonLd", () => {
  const slugs = [
    "api-security-dotnet-10-jwt-oauth2-mtls-zero-trust",
    "docker-cicd-dotnet-10-microservices",
    "rabbitmq-event-driven-transactions-dotnet-10",
    "core-banking-integration-architecture",
    "building-api-gateway-aspnet-core",
    "cqrs-pattern-dotnet-10",
    "api-gateway-vs-reverse-proxy",
  ];
  for (const slug of slugs) {
    const source = readSrc(join("blog", slug, "page.tsx"));
    assert.ok(source.includes("buildArticleJsonLd("), `${slug} should keep its TechArticle schema`);
    assert.ok(source.includes("buildBreadcrumbJsonLd"), `${slug} should emit a BreadcrumbList`);
  }
});

test("the four developer guide routes (single dynamic page) wire a BreadcrumbList", () => {
  const source = readSrc(join("developers", "guides", "[slug]", "page.tsx"));
  assert.ok(source.includes("buildBreadcrumbJsonLd"));
  assert.ok(source.includes("guide.title"));
});

test("developer hub, solutions, pricing and enterprise section pages wire a BreadcrumbList", () => {
  const targets = [
    "blog/page.tsx",
    "developers/page.tsx",
    "developers/getting-started/page.tsx",
    "developers/api-explorer/page.tsx",
    "developers/guides/page.tsx",
    "solutions/page.tsx",
    "solutions/bank-fintech/page.tsx",
    "solutions/developers/page.tsx",
    "solutions/enterprise/page.tsx",
    "pricing/page.tsx",
    "pricing/starter/page.tsx",
    "pricing/business/page.tsx",
    "enterprise/page.tsx",
    "enterprise/security-review/page.tsx",
    "enterprise/deployment/page.tsx",
    "security/page.tsx",
  ];
  for (const relativePath of targets) {
    const source = readSrc(relativePath);
    assert.ok(source.includes("buildBreadcrumbJsonLd"), `${relativePath} should emit a BreadcrumbList`);
  }
});

test("enterprise/deployment breadcrumb mirrors its real visible hierarchy (Solutions > Enterprise Integration), not the URL path", () => {
  const source = readSrc("enterprise/deployment/page.tsx");
  assert.ok(source.includes('{ name: "Solutions", path: "/solutions" }'));
  assert.ok(source.includes('{ name: "Enterprise Integration", path: "/solutions/enterprise" }'));
  assert.ok(source.includes('{ name: "Deployment & Operations", path: "/enterprise/deployment" }'));
});

test("flat top-level pages without a prior visible breadcrumb do not gain a new BreadcrumbList", () => {
  for (const relativePath of ["about/page.tsx", "contact/page.tsx", "careers/page.tsx", "features/page.tsx"]) {
    const source = readSrc(relativePath);
    assert.equal(source.includes("buildBreadcrumbJsonLd"), false, `${relativePath} should stay unchanged`);
  }
});

// --- Sitemap unchanged ------------------------------------------------------

test("sitemap URL coverage is unchanged by this step (still exactly 37 URLs)", () => {
  const entries = sitemap();
  assert.equal(entries.length, 37);
});
