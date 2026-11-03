import { test } from "node:test";
import assert from "node:assert/strict";
import { createPageMetadata } from "../src/lib/seo";
import { JsonLd } from "../src/components/seo/JsonLd";

// --- OpenGraph publishedTime/modifiedTime (Phase E) -----------------------

test("createPageMetadata: sets openGraph.publishedTime/modifiedTime for article type when provided", () => {
  const metadata = createPageMetadata({
    title: "An article",
    description: "Description",
    path: "/blog/an-article",
    type: "article",
    publishedTime: "2026-01-01T00:00:00.000Z",
    modifiedTime: "2026-01-05T00:00:00.000Z",
  });
  const og = metadata.openGraph as Record<string, unknown>;
  assert.equal(og.publishedTime, "2026-01-01T00:00:00.000Z");
  assert.equal(og.modifiedTime, "2026-01-05T00:00:00.000Z");
});

test("createPageMetadata: omits publishedTime/modifiedTime when not provided (no fabricated freshness)", () => {
  const metadata = createPageMetadata({
    title: "An article",
    description: "Description",
    path: "/blog/an-article",
    type: "article",
  });
  const og = metadata.openGraph as Record<string, unknown>;
  assert.equal("publishedTime" in og, false);
  assert.equal("modifiedTime" in og, false);
});

test("createPageMetadata: ignores publishedTime/modifiedTime for non-article pages", () => {
  const metadata = createPageMetadata({
    title: "A page",
    description: "Description",
    path: "/about",
    publishedTime: "2026-01-01T00:00:00.000Z",
  });
  const og = metadata.openGraph as Record<string, unknown>;
  assert.equal("publishedTime" in og, false);
});

// --- JSON-LD safe serialization (Phase C.10 / F.11) ------------------------

function renderedHtml(data: unknown): string {
  const element = JsonLd({ data } as never) as unknown as {
    props: { dangerouslySetInnerHTML: { __html: string } };
  };
  return element.props.dangerouslySetInnerHTML.__html;
}

test("JsonLd: escapes </script>-breaking characters so structured data cannot inject markup", () => {
  const html = renderedHtml({ headline: "</script><img src=x onerror=alert(1)>" });
  assert.equal(html.includes("</script>"), false);
  assert.equal(html.includes("<img"), false);
  assert.match(html, /\\u003c/);
});

test("JsonLd: round-trips to valid JSON after escaping", () => {
  const original = { "@type": "TechArticle", headline: "A & B <C>", datePublished: "2026-01-01" };
  const html = renderedHtml(original);
  const unescaped = html
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\u0026/g, "&");
  assert.deepEqual(JSON.parse(unescaped), original);
});
