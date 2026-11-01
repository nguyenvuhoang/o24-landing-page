/** Public-facing plan overview. Confirm contractual entitlements before publishing. */
export const plans = [
    {
        name: "Starter",
        eyebrow: "FOR EXPLORATION",
        price: "Starter",
        description: "A starting point for individual developers and proof-of-concept projects.",
        features: [
            "Explore API management concepts",
            "Build an initial integration prototype",
            "Review developer learning resources",
            "Discuss environment and usage requirements",
        ],
        cta: "Explore Starter",
        href: "/pricing/starter",
        popular: false,
    },
    {
        name: "Business",
        eyebrow: "FOR GROWING TEAMS",
        price: "Talk to us",
        description: "Plan an integration platform around your team's operational needs.",
        features: [
            "Plan API and environment requirements",
            "Discuss workflows and observability",
            "Review identity and access requirements",
            "Define support and service expectations",
        ],
        cta: "Explore Business",
        href: "/pricing/business",
        popular: true,
    },
    {
        name: "Enterprise",
        eyebrow: "FOR COMPLEX ENVIRONMENTS",
        price: "Custom scope",
        description: "Evaluate architecture and deployment requirements for complex organizations.",
        features: [
            "Discuss on-premises and cloud deployment",
            "Assess existing system integrations",
            "Review security and governance needs",
            "Define onboarding and commercial terms",
        ],
        cta: "Book an Enterprise Demo",
        href: "/demo",
        popular: false,
    },
] as const;
