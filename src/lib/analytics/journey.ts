/** Fixed public path taxonomy. Query strings, hashes and unknown URLs are never tracked. */
export const JOURNEY_ROUTES = [
  { path: "/", stage: "awareness", label: "home" },
  { path: "/features", stage: "evaluation", label: "features" },
  { path: "/solutions", stage: "evaluation", label: "solutions" },
  { path: "/solutions/bank-fintech", stage: "evaluation", label: "bank_fintech" },
  { path: "/solutions/enterprise", stage: "evaluation", label: "enterprise_solution" },
  { path: "/solutions/developers", stage: "evaluation", label: "developer_solution" },
  { path: "/security", stage: "trust", label: "security" },
  { path: "/enterprise/deployment", stage: "trust", label: "deployment" },
  { path: "/enterprise/security-review", stage: "trust", label: "security_review" },
  { path: "/developers", stage: "education", label: "developers" },
  { path: "/developers/getting-started", stage: "education", label: "getting_started" },
  { path: "/developers/guides", stage: "education", label: "guides" },
  { path: "/developers/api-explorer", stage: "education", label: "api_explorer" },
  { path: "/enterprise", stage: "conversion", label: "enterprise_contact" },
  { path: "/demo", stage: "conversion", label: "demo" },
] as const;

export type JourneyRoute = (typeof JOURNEY_ROUTES)[number];
export type JourneyLabel = JourneyRoute["label"];

export function classifyJourneyPath(pathname: string | null | undefined): JourneyRoute | null {
  if (!pathname) return null;
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  // A nested technical guide has the same classification. No slug is sent.
  if (/^\/developers\/guides\/[a-z0-9-]+$/.test(normalized)) {
    return JOURNEY_ROUTES.find((route) => route.path === "/developers/guides") ?? null;
  }
  return JOURNEY_ROUTES.find((route) => route.path === normalized) ?? null;
}

export function classifyInternalDestination(href: string, origin: string): JourneyRoute | null {
  try {
    const url = new URL(href, origin);
    if (url.origin !== origin) return null;
    return classifyJourneyPath(url.pathname);
  } catch {
    return null;
  }
}
