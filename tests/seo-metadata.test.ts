import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createPageMetadata, DEFAULT_OG_IMAGE } from "../src/lib/seo";

const SITE_URL = "https://vknight.io.vn";
const DEFAULT_IMAGE_URL = `${SITE_URL}${DEFAULT_OG_IMAGE.url}`;

function firstImageUrl(images: unknown): string | undefined {
  const list = Array.isArray(images) ? images : images ? [images] : [];
  const first = list[0];
  if (!first) return undefined;
  if (typeof first === "string") return first;
  if (first instanceof URL) return first.toString();
  if (typeof first === "object" && "url" in first) {
    const url = (first as { url: unknown }).url;
    return url instanceof URL ? url.toString() : String(url);
  }
  return undefined;
}

function assertHasAbsoluteOgAndTwitterImage(
  metadata: ReturnType<typeof createPageMetadata>,
  path: string,
) {
  const canonical = (metadata.alternates as { canonical?: unknown } | null)?.canonical;
  const canonicalStr = canonical instanceof URL ? canonical.toString() : String(canonical);
  assert.equal(canonicalStr, new URL(path, SITE_URL).toString());

  assert.ok(metadata.openGraph, "openGraph metadata must be present");
  const ogImageUrl = firstImageUrl((metadata.openGraph as { images?: unknown })?.images);
  assert.ok(ogImageUrl, "openGraph.images must contain at least one image");
  assert.match(ogImageUrl!, /^https:\/\/vknight\.io\.vn\//, "openGraph image must be an absolute vknight.io.vn URL");

  assert.ok(metadata.twitter, "twitter metadata must be present");
  const twitterImageUrl = firstImageUrl((metadata.twitter as { images?: unknown })?.images);
  assert.ok(twitterImageUrl, "twitter.images must contain at least one image");
  assert.match(twitterImageUrl!, /^https:\/\/vknight\.io\.vn\//, "twitter image must be an absolute vknight.io.vn URL");
}

// --- createPageMetadata() unit coverage -----------------------------------

test("createPageMetadata: injects the sitewide OG image by default and resolves absolute canonical/image URLs", () => {
  const metadata = createPageMetadata({
    title: "Example title",
    description: "Example description",
    path: "/example",
  });
  assertHasAbsoluteOgAndTwitterImage(metadata, "/example");
  assert.equal(firstImageUrl((metadata.openGraph as { images?: unknown })?.images), DEFAULT_IMAGE_URL);
  assert.equal((metadata.openGraph as { title?: unknown })?.title, "Example title");
  assert.equal((metadata.openGraph as { description?: unknown })?.description, "Example description");
});

test("createPageMetadata: normalizes the home path to '/' without a double slash", () => {
  const metadata = createPageMetadata({ title: "Home", description: "Home description", path: "/" });
  const canonical = (metadata.alternates as { canonical?: unknown } | null)?.canonical;
  assert.equal(canonical instanceof URL ? canonical.toString() : String(canonical), `${SITE_URL}/`);
});

test("createPageMetadata: ogTitle/ogDescription override the social title/description without changing the document title", () => {
  const metadata = createPageMetadata({
    title: "Document Title | Suffix",
    description: "Document description",
    path: "/overridden",
    ogTitle: "Social Title",
    ogDescription: "Social description",
  });
  assert.equal(metadata.title, "Document Title | Suffix");
  assert.equal(metadata.description, "Document description");
  assert.equal((metadata.openGraph as { title?: unknown })?.title, "Social Title");
  assert.equal((metadata.openGraph as { description?: unknown })?.description, "Social description");
  assert.equal((metadata.twitter as { title?: unknown })?.title, "Social Title");
});

test("createPageMetadata: a custom image overrides the default while staying an absolute URL", () => {
  const metadata = createPageMetadata({
    title: "Custom image page",
    description: "Description",
    path: "/custom-image",
    image: { url: "/images/custom.png", width: 800, height: 400, alt: "Custom alt" },
  });
  assert.equal(firstImageUrl((metadata.openGraph as { images?: unknown })?.images), `${SITE_URL}/images/custom.png`);
});

test("createPageMetadata: siteName/locale overrides propagate to openGraph (matches /enterprise usage)", () => {
  const metadata = createPageMetadata({
    title: "Localized page",
    description: "Description",
    path: "/localized",
    siteName: "O24 by vKnight",
    locale: "vi_VN",
  });
  assert.equal((metadata.openGraph as { siteName?: unknown })?.siteName, "O24 by vKnight");
  assert.equal((metadata.openGraph as { locale?: unknown })?.locale, "vi_VN");
});

test("createPageMetadata: article type is carried through to openGraph.type (matches blog/guide usage)", () => {
  const metadata = createPageMetadata({
    title: "An article",
    description: "Description",
    path: "/blog/an-article",
    type: "article",
  });
  assert.equal((metadata.openGraph as { type?: unknown })?.type, "article");
});

test("createPageMetadata: robots/other top-level metadata fields are left untouched (not part of this helper)", () => {
  const metadata = createPageMetadata({ title: "T", description: "D", path: "/x" });
  assert.equal("robots" in metadata, false);
});

// --- Representative per-route-category coverage ---------------------------
// These mirror the exact createPageMetadata() calls used by the real routes
// (homepage, a blog article, a developer guide, a solutions page, a nested
// enterprise page) without importing the .tsx files themselves: importing
// next/link or next/image outside of the Next build pulls in React's
// "react-server" condition, which does not implement createContext and
// crashes under plain `node --test`. Static source verification below
// guards that the real files actually call this helper.

test("homepage-equivalent metadata resolves canonical '/' and an absolute OG/Twitter image", () => {
  const metadata = createPageMetadata({
    title: "O24 Platform by vKnight | API Management & Enterprise Integration",
    description:
      "Build, integrate, and scale with O24: API management, workflow orchestration, and enterprise integration capabilities for developers and organizations.",
    path: "/",
  });
  assertHasAbsoluteOgAndTwitterImage(metadata, "/");
});

test("blog-article-equivalent metadata keeps the suffixed document title but a bare social title", () => {
  const title = "CQRS Pattern in .NET 10: A Practical Guide";
  const metadata = createPageMetadata({
    title: `${title} | vKnight Engineering`,
    description: "Learn CQRS with an ASP.NET Core .NET 10 Minimal API example.",
    path: "/blog/cqrs-pattern-dotnet-10",
    type: "article",
    ogTitle: title,
  });
  assertHasAbsoluteOgAndTwitterImage(metadata, "/blog/cqrs-pattern-dotnet-10");
  assert.equal(metadata.title, `${title} | vKnight Engineering`);
  assert.equal((metadata.openGraph as { title?: unknown })?.title, title);
  assert.equal((metadata.openGraph as { type?: unknown })?.type, "article");
});

test("developer-guide-equivalent metadata (dynamic [slug] route) resolves a per-slug canonical and image", () => {
  const guide = { slug: "cqrs", title: "CQRS in Practice", summary: "Summary text." };
  const metadata = createPageMetadata({
    title: `${guide.title} | O24 Developer Guides`,
    description: guide.summary,
    path: `/developers/guides/${guide.slug}`,
    type: "article",
    ogTitle: guide.title,
  });
  assertHasAbsoluteOgAndTwitterImage(metadata, "/developers/guides/cqrs");
  assert.equal((metadata.openGraph as { title?: unknown })?.title, guide.title);
});

test("solutions-page-equivalent metadata (bank-fintech) resolves an absolute OG/Twitter image", () => {
  const metadata = createPageMetadata({
    title: "Banking & Fintech Integration Solutions | vKnight O24",
    description: "Explore API-led banking and fintech integration approaches with O24.",
    path: "/solutions/bank-fintech",
    ogDescription: "Connect core banking systems, digital channels, and partner services.",
  });
  assertHasAbsoluteOgAndTwitterImage(metadata, "/solutions/bank-fintech");
});

test("nested-enterprise-page-equivalent metadata (enterprise/deployment) resolves an absolute OG/Twitter image", () => {
  const metadata = createPageMetadata({
    title: "Enterprise Deployment & Operations | O24 by vKnight",
    description: "Explore conceptual O24 deployment patterns.",
    path: "/enterprise/deployment",
    ogDescription: "Compare on-premises, private cloud and hybrid deployment considerations.",
  });
  assertHasAbsoluteOgAndTwitterImage(metadata, "/enterprise/deployment");
});

// --- Static source regression guard ---------------------------------------
// Fails the build if a future public page defines its own `openGraph` object
// literal without going through createPageMetadata() (the exact regression
// the SEO audit found: a page-level `openGraph` silently drops the sitewide
// image because Next.js does not deep-merge it with the root layout's).

const APP_DIR = join(__dirname, "..", "src", "app");
const EXCLUDED_SEGMENTS = ["dashboard", "api", "auth"];

function listPageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_SEGMENTS.includes(entry.name)) continue;
      listPageFiles(fullPath, acc);
    } else if (entry.name === "page.tsx") {
      acc.push(fullPath);
    }
  }
  return acc;
}

test("every public page.tsx that exports metadata either uses createPageMetadata() or sets its own openGraph.images", () => {
  const offenders: string[] = [];
  for (const file of listPageFiles(APP_DIR)) {
    const source = readFileSync(file, "utf8");
    const exportsMetadata = /export const metadata|export (async )?function generateMetadata/.test(source);
    if (!exportsMetadata) continue;

    const usesHelper = source.includes("createPageMetadata(");
    const hasOwnOgImages = /openGraph:\s*{[^}]*images/.test(source);
    if (!usesHelper && !hasOwnOgImages) {
      offenders.push(file.replace(APP_DIR, "src/app"));
    }
  }
  assert.deepEqual(offenders, [], `Pages missing createPageMetadata()/openGraph.images: ${offenders.join(", ")}`);
});
