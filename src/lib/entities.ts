import type { JsonValue } from "@/components/seo/JsonLd";

export const SITE_URL = "https://vknight.io.vn";

/**
 * Stable Schema.org node identifiers. The nodes themselves are defined once
 * in src/app/layout.tsx (Organization, WebSite) and src/app/page.tsx
 * (SoftwareApplication) — every other page references them by @id instead
 * of duplicating the full object.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_APPLICATION_ID = `${SITE_URL}/#software`;

export const organizationRef: JsonValue = { "@id": ORGANIZATION_ID };
export const websiteRef: JsonValue = { "@id": WEBSITE_ID };
export const softwareApplicationRef: JsonValue = { "@id": SOFTWARE_APPLICATION_ID };
