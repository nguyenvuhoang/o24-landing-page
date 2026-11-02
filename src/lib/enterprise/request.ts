/** Server-side validation and safe rendering for public Enterprise inquiries. */
export type EnterpriseRequest = {
  name: string; email: string; company: string; jobTitle: string;
  teamSize: string; useCase: string; deployment: string; message: string;
  timeline: string; budget: string; sla: string;
};

const options = {
  jobTitle: ["cto", "tech-lead", "engineering-manager", "product-owner", "devops", "director", "other"],
  teamSize: ["1-10", "11-50", "51-200", "201-500", "500+"],
  useCase: ["api-gateway", "open-banking", "microservices", "integration", "product-api", "migration", "other"],
  deployment: ["on-premise", "private-cloud", "hybrid", "managed-cloud", "not-decided"],
  timeline: ["", "immediate", "1-3-months", "3-6-months", "exploring"],
  budget: ["", "under-10m", "10-50m", "50-100m", "100m+", "discuss"],
  sla: ["", "99.9", "99.95", "99.99", "custom", "none"],
} as const;

const limits = {
  name: 160, email: 254, company: 200, message: 5000,
} as const;

function stringWithin(value: unknown, max: number): string | null {
  return typeof value === "string" && value.trim().length <= max ? value.trim() : null;
}

export function parseEnterprise(value: unknown): EnterpriseRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const name = stringWithin(input.name, limits.name);
  const email = stringWithin(input.email, limits.email);
  const company = stringWithin(input.company, limits.company);
  const message = stringWithin(input.message, limits.message);
  if (!name || !email || !company || !message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null;
  const choice = <K extends keyof typeof options>(key: K): string | null => {
    const value = stringWithin(input[key] ?? "", 60);
    return value !== null && (options[key] as readonly string[]).includes(value) ? value : null;
  };
  const jobTitle = choice("jobTitle"), teamSize = choice("teamSize"), useCase = choice("useCase");
  const deployment = choice("deployment"), timeline = choice("timeline"), budget = choice("budget"), sla = choice("sla");
  if (!jobTitle || !teamSize || !useCase || !deployment || timeline === null || budget === null || sla === null) return null;
  return { name, email, company, message, jobTitle, teamSize, useCase, deployment, timeline, budget, sla };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

const labels: Record<string, Record<string,string>> = {
  jobTitle: { cto:"CTO / VP of Engineering", "tech-lead":"Tech Lead / Architect", "engineering-manager":"Engineering Manager", "product-owner":"Product Owner / PM", devops:"DevOps / Platform Engineer",director:"Director / C-Level",other:"Other" },
  teamSize: { "1-10":"1–10", "11-50":"11–50", "51-200":"51–200", "201-500":"201–500", "500+":"500+" },
  useCase: { "api-gateway":"API Gateway & Management", "open-banking":"Open Banking / Fintech", microservices:"Microservices Orchestration", integration:"System Integration / iPaaS", "product-api":"API-as-a-Product", migration:"Legacy Migration",other:"Other" },
  deployment: { "on-premise":"On-premises", "private-cloud":"Private Cloud", hybrid:"Hybrid", "managed-cloud":"Managed Cloud", "not-decided":"Not decided" },
  timeline: { immediate:"Within 1 month", "1-3-months":"1–3 months", "3-6-months":"3–6 months", exploring:"Exploring" },
  budget: { "under-10m":"Under 10m VND/month", "10-50m":"10–50m VND/month", "50-100m":"50–100m VND/month", "100m+":"Over 100m VND/month", discuss:"To discuss" },
  sla: { "99.9":"99.9% requested", "99.95":"99.95% requested", "99.99":"99.99% requested", custom:"Custom requirement", none:"Not specified" },
};

export function enterpriseEmail(data: EnterpriseRequest) {
  const fields: [string,string][] = [
    ["Name", data.name], ["Email", data.email], ["Company", data.company],
    ["Job title", labels.jobTitle[data.jobTitle]], ["Team size", labels.teamSize[data.teamSize]],
    ["Use case", labels.useCase[data.useCase]], ["Deployment", labels.deployment[data.deployment]],
  ];
  for (const key of ["timeline", "budget", "sla"] as const) {
    if (data[key]) fields.push([key === "sla" ? "Requested SLA (not a commitment)" : key, labels[key][data[key]]]);
  }
  fields.push(["Message", data.message]);
  const htmlFields = fields.map(([label, value]) => `<tr><th scope="row" style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #e2e8f0;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join("\n");
  const html = `<!doctype html><html lang="en"><body style="font-family:Arial,sans-serif;color:#19243a"><h1>New O24 Enterprise Inquiry</h1><table style="border-collapse:collapse;width:100%">${htmlFields}</table></body></html>`;
  const text = `New O24 Enterprise Inquiry\n\n${fields.map(([k,v])=>`${k}: ${v}`).join("\n")}`;
  return { html, text };
}
