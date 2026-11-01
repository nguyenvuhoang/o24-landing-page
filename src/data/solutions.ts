import { Building2, Code2, Landmark } from "lucide-react";

/** Public-facing solution summaries. Keep claims aligned with verified O24 capabilities. */
export const solutions = [
    {
        id: "bank-fintech",
        icon: Landmark,
        audience: "FINANCIAL SERVICES",
        title: "Banking & Fintech",
        description:
            "Connect banking services and digital channels through a more organized API and integration architecture.",
        features: [
            "Core system integration patterns",
            "API-led banking services",
            "Workflow orchestration",
        ],
        href: "/solutions/bank-fintech",
        cta: "Explore banking solutions",
    },
    {
        id: "enterprise",
        icon: Building2,
        audience: "ENTERPRISE TEAMS",
        title: "Enterprise Integration",
        description:
            "Bring services, business processes, and integrations together with an extensible platform approach.",
        features: [
            "API lifecycle management",
            "Service orchestration",
            "Deployment flexibility",
        ],
        href: "/solutions/enterprise",
        cta: "Explore enterprise solutions",
    },
    {
        id: "developers",
        icon: Code2,
        audience: "BUILDERS & ENGINEERS",
        title: "Developer Experience",
        description:
            "Explore O24 concepts, architecture, and development workflows with a practical path from learning to building.",
        features: [
            "API development concepts",
            "Workflow and CQRS patterns",
            "Architecture resources",
        ],
        href: "/solutions/developers",
        cta: "Explore developer resources",
    },
] as const;
