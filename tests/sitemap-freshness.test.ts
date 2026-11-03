import { test } from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap";
import {
  assertValidArticleDates,
  getArticleLastModified,
  getPublishedArticles,
  type BlogArticle,
} from "../src/data/blog";
import { buildArticleJsonLdFromDates } from "../src/lib/structuredData";

const SITE_URL = "https://vknight.io.vn";
const PRIVATE_SEGMENTS = ["/dashboard", "/api", "/auth"];

function baseArticle(overrides: Partial<BlogArticle> = {}): BlogArticle {
  return {
    slug: "example-article",
    title: "Example",
    description: "Example description",
    category: "Security",
    readTimeMinutes: 5,
    icon: "shield",
    status: "published",
    ...overrides,
  };
}

// --- Sitemap structure -------------------------------------------------

test("sitemap: every URL is absolute https and canonical to vknight.io.vn", () => {
  const entries = sitemap();
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.match(String(entry.url), /^https:\/\/vknight\.io\.vn\//);
  }
});

test("sitemap: no private, API, auth or dashboard routes leak in", () => {
  const entries = sitemap();
  for (const entry of entries) {
    const path = String(entry.url).replace(SITE_URL, "");
    for (const segment of PRIVATE_SEGMENTS) {
      assert.equal(path.startsWith(segment), false, `${path} should not be in the sitemap`);
    }
  }
});

test("sitemap: URLs are unique", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => String(entry.url));
  assert.equal(urls.length, new Set(urls).size);
});

test("sitemap: retains current public route coverage (30 static + 7 blog = 37 URLs)", () => {
  const entries = sitemap();
  assert.equal(entries.length, 37);
  const blogUrls = entries.filter((entry) => String(entry.url).includes("/blog/"));
  assert.equal(blogUrls.length, 7);
});

test("sitemap: blog entries track the published-article registry exactly", () => {
  const entries = sitemap();
  const blogUrls = new Set(entries.map((e) => String(e.url)).filter((u) => u.includes("/blog/")));
  for (const article of getPublishedArticles()) {
    assert.ok(blogUrls.has(`${SITE_URL}/blog/${article.slug}`));
  }
});

// --- Freshness signals: no fabricated lastModified ----------------------

test("sitemap: entries with no verified date carry no lastModified (no build/deploy timestamp fallback)", () => {
  const entries = sitemap();
  for (const entry of entries) {
    const isBlog = String(entry.url).includes("/blog/");
    const article = isBlog
      ? getPublishedArticles().find((a) => String(entry.url) === `${SITE_URL}/blog/${a.slug}`)
      : undefined;
    const hasVerifiedDate = Boolean(article && (article.publishedAt || article.updatedAt));
    assert.equal("lastModified" in entry, hasVerifiedDate);
  }
});

test("sitemap: a known lastModified value matches the article's canonical date source exactly", () => {
  const withDate = { ...baseArticle({ slug: "dated-article", publishedAt: "2026-01-01T00:00:00.000Z" }) };
  assert.equal(getArticleLastModified(withDate), "2026-01-01T00:00:00.000Z");
});

// --- Date provenance / validation ---------------------------------------

test("getArticleLastModified: prefers updatedAt over publishedAt", () => {
  assert.equal(
    getArticleLastModified({ publishedAt: "2026-01-01", updatedAt: "2026-02-01" }),
    "2026-02-01",
  );
});

test("getArticleLastModified: falls back to publishedAt when updatedAt is absent", () => {
  assert.equal(getArticleLastModified({ publishedAt: "2026-01-01" }), "2026-01-01");
});

test("getArticleLastModified: undefined when neither date is known", () => {
  assert.equal(getArticleLastModified({}), undefined);
});

test("assertValidArticleDates: accepts missing, single, or correctly ordered dates", () => {
  assert.doesNotThrow(() => assertValidArticleDates(baseArticle()));
  assert.doesNotThrow(() => assertValidArticleDates(baseArticle({ publishedAt: "2026-01-01" })));
  assert.doesNotThrow(() =>
    assertValidArticleDates(baseArticle({ publishedAt: "2026-01-01", updatedAt: "2026-01-02" })),
  );
});

test("assertValidArticleDates: rejects an invalid (unparsable) date string", () => {
  assert.throws(() => assertValidArticleDates(baseArticle({ publishedAt: "not-a-date" })));
  assert.throws(() => assertValidArticleDates(baseArticle({ updatedAt: "not-a-date" })));
});

test("assertValidArticleDates: rejects reverse-ordered dates (updatedAt before publishedAt)", () => {
  assert.throws(() =>
    assertValidArticleDates(baseArticle({ publishedAt: "2026-02-01", updatedAt: "2026-01-01" })),
  );
});

test("every published blog article in the real registry passes date validation", () => {
  for (const article of getPublishedArticles()) {
    assert.doesNotThrow(() => assertValidArticleDates(article));
  }
});

// --- Article JSON-LD -------------------------------------------------------

test("buildArticleJsonLdFromDates: includes datePublished/dateModified only when verified", () => {
  const withDates = buildArticleJsonLdFromDates(
    { title: "T", description: "D", url: `${SITE_URL}/blog/t` },
    { publishedAt: "2026-01-01", updatedAt: "2026-01-05" },
  ) as Record<string, unknown>;
  assert.equal(withDates.datePublished, "2026-01-01");
  assert.equal(withDates.dateModified, "2026-01-05");

  const withoutDates = buildArticleJsonLdFromDates(
    { title: "T", description: "D", url: `${SITE_URL}/blog/t` },
    undefined,
  ) as Record<string, unknown>;
  assert.equal("datePublished" in withoutDates, false);
  assert.equal("dateModified" in withoutDates, false);
});

test("buildArticleJsonLdFromDates: dateModified falls back to publishedAt when never updated", () => {
  const data = buildArticleJsonLdFromDates(
    { title: "T", description: "D", url: `${SITE_URL}/blog/t` },
    { publishedAt: "2026-01-01" },
  ) as Record<string, unknown>;
  assert.equal(data.dateModified, "2026-01-01");
});

test("buildArticleJsonLdFromDates: serializes without undefined/null date placeholders", () => {
  const data = buildArticleJsonLdFromDates(
    { title: "T", description: "D", url: `${SITE_URL}/blog/t` },
    undefined,
  ) as Record<string, unknown>;
  const json = JSON.stringify(data);
  assert.equal(json.includes("null"), false);
  assert.equal(json.includes("undefined"), false);
});

test("all seven published blog articles produce valid TechArticle JSON-LD", () => {
  const articles = getPublishedArticles();
  assert.equal(articles.length, 7);
  for (const article of articles) {
    const data = buildArticleJsonLdFromDates(
      {
        title: article.title,
        description: article.description,
        url: `${SITE_URL}/blog/${article.slug}`,
      },
      article,
    ) as Record<string, unknown>;
    assert.equal(data["@type"], "TechArticle");
    assert.equal(data["@context"], "https://schema.org");
    assert.equal(data.headline, article.title);
    assert.equal(data.url, `${SITE_URL}/blog/${article.slug}`);
    assert.equal("datePublished" in data, Boolean(article.publishedAt));
    assert.equal("dateModified" in data, Boolean(article.publishedAt || article.updatedAt));
  }
});
