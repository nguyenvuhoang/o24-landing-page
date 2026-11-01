import {
    Workflow,
    Database,
    Shield,
    Activity,
    Smartphone,
    Globe,
} from "lucide-react";

export const features = [
    {
        icon: Globe,
        category: "API INFRASTRUCTURE",
        title: "API Gateway",
        description:
            "Bring API entry points together with routing, access control, and a foundation for managing integrations across services.",
        audience: "Developers & Enterprise",
        highlights: ["Routing", "Access control"],
    },
    {
        icon: Database,
        category: "CONNECTED SYSTEMS",
        title: "Banking Integration",
        description:
            "Connect banking services and existing systems through a structured integration layer designed for complex enterprise environments.",
        audience: "Enterprise",
        highlights: ["Core systems", "Integration"],
    },
    {
        icon: Workflow,
        category: "SERVICE ORCHESTRATION",
        title: "Workflow & CQRS",
        description:
            "Organize business operations into workflows and separate commands from queries to keep service responsibilities clear.",
        audience: "Developers",
        highlights: ["Workflows", "CQRS"],
    },
    {
        icon: Activity,
        category: "OPERATIONAL VISIBILITY",
        title: "Observability",
        description:
            "Make service activity easier to understand with operational logs and visibility into distributed integrations.",
        audience: "Developers & Enterprise",
        highlights: ["Logs", "Monitoring"],
    },
    {
        icon: Shield,
        category: "ACCESS & GOVERNANCE",
        title: "Security",
        description:
            "Build secure integration flows with authentication, authorization, and configurable controls appropriate to your deployment.",
        audience: "Enterprise",
        highlights: ["Authentication", "Authorization"],
    },
    {
        icon: Smartphone,
        category: "MULTI-CHANNEL DELIVERY",
        title: "Multi-channel",
        description:
            "Support experiences across web, mobile, and partner channels by connecting them to a shared service architecture.",
        audience: "Developers & Enterprise",
        highlights: ["Web & mobile", "Partner channels"],
    },
] as const;
