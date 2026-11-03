import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import robots from "../src/app/robots";
import { DEFAULT_OG_IMAGE } from "../src/lib/seo";

const APP_DIR = join(__dirname, "..", "src", "app");
const PUBLIC_DIR = join(__dirname, "..", "public");
const PRIVATE_PREFIXES = ["/api/", "/auth/", "/admin/", "/dashboard", "/login", "/register", "/sign-in", "/sign-up"];
const EXCLUDED_SEGMENTS = ["dashboard", "api", "auth"];

function readPngDimensions(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  assert.deepEqual([...buf.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], `${path} is not a PNG file`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** Minimal JPEG SOF-marker dimension reader; enough to assert against fabricated/stale metadata. */
function readJpegDimensions(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  assert.equal(buf.readUInt16BE(0), 0xffd8, `${path} is not a JPEG file`);
  let offset = 2;
  while (offset < buf.length) {
    assert.equal(buf[offset], 0xff, "expected JPEG marker");
    const marker = buf[offset + 1];
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    const segmentLength = buf.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }
  throw new Error(`no SOF marker found in ${path}`);
}

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

// --- Apple touch icon --------------------------------------------------

test("apple-icon.png exists under the Next.js app-icon convention at 180x180", () => {
  const iconPath = join(APP_DIR, "apple-icon.png");
  assert.ok(statSync(iconPath).isFile(), "src/app/apple-icon.png must exist");
  const { width, height } = readPngDimensions(iconPath);
  assert.equal(width, 180);
  assert.equal(height, 180);
});

test("root layout no longer declares a manual icons.apple pointing at a non-existent /apple-touch-icon.png", () => {
  const layout = readFileSync(join(APP_DIR, "layout.tsx"), "utf8");
  assert.ok(!layout.includes("/apple-touch-icon.png"), "stale apple-touch-icon path must be removed");
  assert.ok(!/apple\s*:/.test(layout.match(/icons:\s*{[\s\S]*?}/)?.[0] ?? ""), "manual icons.apple override must not reappear (it suppresses Next.js's apple-icon.png file-convention auto-detection)");
});

test("no remaining reference anywhere in src/ to the broken /apple-touch-icon.png path", () => {
  function scan(dir: string, acc: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) scan(fullPath, acc);
      else if (/\.(tsx?|mjs)$/.test(entry.name)) {
        if (readFileSync(fullPath, "utf8").includes("/apple-touch-icon.png")) acc.push(fullPath);
      }
    }
    return acc;
  }
  assert.deepEqual(scan(join(__dirname, "..", "src")), []);
});

// --- OG image honesty ----------------------------------------------------
// public/images/og-image.png is actually a 1024x1024 JPEG despite its .png
// extension (pre-existing asset, not something this step may re-encode or
// redesign). The declared width/height must match the real file rather than
// a stale, fabricated 1200x630 claim.

test("DEFAULT_OG_IMAGE width/height match the real on-disk asset dimensions", () => {
  const { width, height } = readJpegDimensions(join(PUBLIC_DIR, "images", "og-image.png"));
  assert.equal(DEFAULT_OG_IMAGE.width, width);
  assert.equal(DEFAULT_OG_IMAGE.height, height);
});

test("root layout's openGraph.images dimensions match DEFAULT_OG_IMAGE (no drift between the two declarations)", () => {
  const layout = readFileSync(join(APP_DIR, "layout.tsx"), "utf8");
  assert.match(layout, new RegExp(`width:\\s*${DEFAULT_OG_IMAGE.width}\\b`));
  assert.match(layout, new RegExp(`height:\\s*${DEFAULT_OG_IMAGE.height}\\b`));
});

// --- Language attributes --------------------------------------------------

test("root <html> declares lang=\"en\" (the site's primary language)", () => {
  const layout = readFileSync(join(APP_DIR, "layout.tsx"), "utf8");
  assert.match(layout, /<html lang="en"/);
});

test("pages that are substantively Vietnamese mark their root element lang=\"vi\" rather than being translated or rewritten", () => {
  const vietnamesePages = [
    join(APP_DIR, "pricing", "starter", "page.tsx"),
    join(APP_DIR, "pricing", "business", "page.tsx"),
    join(APP_DIR, "enterprise", "page.tsx"),
    join(APP_DIR, "changelog", "page.tsx"),
  ];
  for (const file of vietnamesePages) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /lang="vi"/, `${file} should mark its Vietnamese content with lang="vi"`);
    // The Vietnamese marketing copy itself must be untouched, not translated.
    assert.ok(/[àáâãèéêìíòóôõùúăđĩũơưẠ-ỹ]/i.test(source), `${file} should still contain its original Vietnamese copy`);
  }
});

test("the sitewide Vietnamese login control is tagged lang=\"vi\" without translating it", () => {
  const header = readFileSync(join(__dirname, "..", "src", "components", "layout", "Header.tsx"), "utf8");
  const loginOccurrences = header.match(/Đăng nhập/g) ?? [];
  const langViOccurrences = header.match(/lang="vi"/g) ?? [];
  assert.ok(loginOccurrences.length >= 1, "expected at least one Đăng nhập login control");
  assert.equal(
    langViOccurrences.length,
    loginOccurrences.length,
    "every Đăng nhập control should have a matching lang=\"vi\" attribute",
  );
});

test("the Vietnamese enterprise lead form is tagged lang=\"vi\"", () => {
  const form = readFileSync(join(APP_DIR, "enterprise", "EnterpriseForm.tsx"), "utf8");
  assert.match(form, /<form lang="vi"/);
});

// --- Robots policy preservation -------------------------------------------

test("robots(): preserves the private-route disallow list and sitemap pointer", () => {
  const result = robots();
  const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
  assert.equal(rule.userAgent, "*");
  assert.equal(rule.allow, "/");
  const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
  for (const prefix of PRIVATE_PREFIXES) {
    assert.ok(disallow.includes(prefix), `robots() must disallow ${prefix}`);
  }
  assert.equal(result.sitemap, "https://vknight.io.vn/sitemap.xml");
  assert.equal(result.host, "https://vknight.io.vn");
});

// --- No accidental noindex on public routes -------------------------------

test("no public page.tsx sets robots noindex (only /dashboard routes may)", () => {
  const offenders: string[] = [];
  for (const file of listPageFiles(APP_DIR)) {
    const source = readFileSync(file, "utf8");
    if (/index:\s*false/.test(source)) offenders.push(file);
  }
  assert.deepEqual(offenders, [], "no file under src/app (excluding dashboard/api/auth) should set robots index:false");
});
