#!/usr/bin/env node
/**
 * Production-safe, read-only SEO audit.
 *
 * Fetches the live sitemap and robots.txt, then checks every sitemap URL
 * over plain HTTP(S) GET requests with bounded concurrency and a real
 * (non-impersonating) user agent. Never submits to external webmaster
 * tools, never sends credentials, and never crawls routes outside the
 * sitemap. Intended for a developer or CI to run against production or a
 * preview deployment; nothing here mutates remote state.
 *
 * Usage:
 *   node scripts/audit-seo.mjs [--base-url=https://vknight.io.vn] [--json]
 *     [--concurrency=4] [--timeout=10000] [--delay=150]
 */

const args = new Map(
    process.argv.slice(2).map((arg) => {
        const [key, value] = arg.replace(/^--/, "").split("=");
        return [key, value ?? "true"];
    }),
);

const BASE_URL = (args.get("base-url") ?? "https://vknight.io.vn").replace(/\/+$/, "");
const CONCURRENCY = Number(args.get("concurrency") ?? 4);
const TIMEOUT_MS = Number(args.get("timeout") ?? 10_000);
const DELAY_MS = Number(args.get("delay") ?? 150);
const AS_JSON = args.has("json");

const USER_AGENT = "o24-seo-audit-script/1.0 (+https://vknight.io.vn; read-only SEO audit)";

const SEARCH_CRAWLERS = ["Googlebot", "Bingbot", "OAI-SearchBot"];
const PRIVATE_PREFIXES = ["/api/", "/auth/", "/admin/", "/dashboard", "/login", "/register", "/sign-in", "/sign-up"];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, { timeout = TIMEOUT_MS } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const startedAt = Date.now();
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            redirect: "follow",
            headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml,*/*" },
        });
        const body = await response.text();
        return {
            ok: true,
            status: response.status,
            finalUrl: response.url,
            redirected: response.redirected,
            body,
            durationMs: Date.now() - startedAt,
        };
    } catch (error) {
        return {
            ok: false,
            networkError: error.name === "AbortError" ? `timeout after ${timeout}ms` : error.message,
            durationMs: Date.now() - startedAt,
        };
    } finally {
        clearTimeout(timer);
    }
}

function extractSitemapUrls(xml) {
    return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

function extractTag(html, pattern) {
    const match = html.match(pattern);
    return match ? match[1].trim() : null;
}

function analyzeHtml(html, requestedUrl) {
    const title = extractTag(html, /<title[^>]*>([^<]*)<\/title>/i);
    const description = extractTag(
        html,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
    );
    const canonical = extractTag(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
    const robotsMeta = extractTag(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
    const ogImage = extractTag(
        html,
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i,
    );
    const jsonLdCount = (html.match(/<script[^>]+type=["']application\/ld\+json["']/gi) ?? []).length;

    return {
        title,
        description,
        canonical,
        robotsMeta,
        ogImage,
        jsonLdCount,
        canonicalMatches: canonical ? canonical.replace(/\/$/, "") === requestedUrl.replace(/\/$/, "") : false,
    };
}

async function auditUrl(url) {
    const result = await fetchText(url);
    if (!result.ok) {
        return { url, status: "FAIL", reason: "network-error", detail: result.networkError };
    }

    const { status, finalUrl, redirected, body, durationMs } = result;

    if (status < 200 || status >= 300) {
        return { url, status: "FAIL", reason: `http-${status}`, httpStatus: status, durationMs };
    }

    const meta = analyzeHtml(body, url);
    const warnings = [];

    if (redirected && finalUrl.replace(/\/$/, "") !== url.replace(/\/$/, "")) {
        warnings.push(`unexpected redirect to ${finalUrl}`);
    }
    if (!meta.title) warnings.push("missing <title>");
    if (!meta.description) warnings.push("missing meta description");
    if (!meta.canonical) warnings.push("missing canonical link");
    else if (!meta.canonicalMatches) warnings.push(`canonical mismatch (${meta.canonical})`);
    if (!meta.ogImage) warnings.push("missing og:image");
    if (meta.jsonLdCount === 0) warnings.push("no JSON-LD structured data found");
    if (meta.robotsMeta && /noindex/i.test(meta.robotsMeta)) warnings.push(`noindex robots meta: "${meta.robotsMeta}"`);

    return {
        url,
        status: warnings.length ? "WARN" : "PASS",
        httpStatus: status,
        durationMs,
        warnings,
        meta,
    };
}

async function runWithConcurrency(items, limit, worker) {
    const results = [];
    let index = 0;
    async function next() {
        while (index < items.length) {
            const current = index++;
            results[current] = await worker(items[current]);
            await sleep(DELAY_MS);
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
    return results;
}

function auditRobots(robotsText) {
    const findings = [];
    if (!robotsText) {
        findings.push({ level: "FAIL", message: "robots.txt could not be fetched" });
        return findings;
    }

    if (!/Sitemap:\s*https?:\/\//i.test(robotsText)) {
        findings.push({ level: "WARN", message: "robots.txt has no Sitemap: directive" });
    } else if (!robotsText.includes(`${BASE_URL}/sitemap.xml`)) {
        findings.push({ level: "WARN", message: "robots.txt Sitemap: directive does not point at this base URL's sitemap.xml" });
    }

    for (const crawler of SEARCH_CRAWLERS) {
        const blockPattern = new RegExp(`User-agent:\\s*${crawler}[\\s\\S]*?Disallow:\\s*/\\s*(?:\\n|$)`, "i");
        if (blockPattern.test(robotsText)) {
            findings.push({ level: "FAIL", message: `${crawler} appears disallowed from "/"` });
        }
    }

    const wildcardGroups = [...robotsText.matchAll(/User-agent:\s*\*/gi)];
    if (wildcardGroups.length > 1) {
        findings.push({
            level: "WARN",
            message: `robots.txt defines ${wildcardGroups.length} separate "User-agent: *" groups; strict RFC 9309 parsers may only honor the first one (commonly injected by Cloudflare's managed content ahead of the app's own group)`,
        });
    }

    for (const prefix of PRIVATE_PREFIXES) {
        if (!robotsText.includes(`Disallow: ${prefix}`)) {
            findings.push({ level: "WARN", message: `no explicit Disallow rule found for "${prefix}"` });
        }
    }

    return findings;
}

async function main() {
    const report = { baseUrl: BASE_URL, generatedAt: new Date().toISOString() };

    const [sitemapResult, robotsResult] = await Promise.all([
        fetchText(`${BASE_URL}/sitemap.xml`),
        fetchText(`${BASE_URL}/robots.txt`),
    ]);

    if (!sitemapResult.ok || sitemapResult.status !== 200) {
        report.fatal = `sitemap.xml unreachable: ${sitemapResult.networkError ?? `HTTP ${sitemapResult.status}`}`;
        printReport(report);
        process.exitCode = 1;
        return;
    }

    const urls = extractSitemapUrls(sitemapResult.body);
    report.sitemapUrlCount = urls.length;
    report.duplicateUrls = urls.filter((u, i) => urls.indexOf(u) !== i);
    report.privateUrlsInSitemap = urls.filter((u) => PRIVATE_PREFIXES.some((p) => new URL(u).pathname.startsWith(p)));

    report.robotsFindings = auditRobots(robotsResult.ok ? robotsResult.body : null);

    report.pages = await runWithConcurrency(urls, CONCURRENCY, auditUrl);

    report.counts = {
        pass: report.pages.filter((p) => p.status === "PASS").length,
        warn: report.pages.filter((p) => p.status === "WARN").length,
        fail: report.pages.filter((p) => p.status === "FAIL").length,
    };

    printReport(report);

    const hasFail = report.counts.fail > 0 || report.robotsFindings.some((f) => f.level === "FAIL") || report.privateUrlsInSitemap.length > 0 || report.duplicateUrls.length > 0;
    process.exitCode = hasFail ? 1 : 0;
}

function printReport(report) {
    if (AS_JSON) {
        console.log(JSON.stringify(report, null, 2));
        return;
    }

    console.log(`SEO audit for ${report.baseUrl} — ${report.generatedAt}`);
    if (report.fatal) {
        console.log(`FAIL  ${report.fatal}`);
        return;
    }

    console.log(`\nSitemap: ${report.sitemapUrlCount} URL(s)`);
    if (report.duplicateUrls.length) console.log(`FAIL  duplicate URLs: ${report.duplicateUrls.join(", ")}`);
    if (report.privateUrlsInSitemap.length) console.log(`FAIL  private-looking URLs in sitemap: ${report.privateUrlsInSitemap.join(", ")}`);

    console.log("\nRobots.txt:");
    if (report.robotsFindings.length === 0) console.log("PASS  no issues found");
    for (const finding of report.robotsFindings) {
        console.log(`${finding.level.padEnd(6)}${finding.message}`);
    }

    console.log("\nPages:");
    for (const page of report.pages) {
        console.log(`${page.status.padEnd(6)}${page.url}${page.httpStatus ? ` (${page.httpStatus})` : ""}`);
        if (page.reason) console.log(`        ${page.reason}${page.detail ? `: ${page.detail}` : ""}`);
        for (const warning of page.warnings ?? []) console.log(`        - ${warning}`);
    }

    console.log(`\n${report.counts.pass} PASS, ${report.counts.warn} WARN, ${report.counts.fail} FAIL`);
    console.log("NOTE: read-only audit; does not bypass Cloudflare, simulate crawler identities, or validate Lighthouse/WCAG scores.");
}

main();
