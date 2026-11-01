export type NavigationLink = {
    label: string;
    href: string;
    description?: string;
};

export type NavigationItem = NavigationLink & {
    children?: NavigationLink[];
};

// All links below use routes that already exist in the current project.
export const navItems: NavigationItem[] = [
    {
        label: "Products",
        href: "/features",
        children: [
            { label: "O24 Platform", href: "/features", description: "Explore platform capabilities" },
            { label: "Roadmap", href: "/roadmap", description: "See what's coming next" },
            { label: "Changelog", href: "/changelog", description: "Discover the latest updates" },
        ],
    },
    {
        label: "Solutions",
        href: "/solutions/enterprise",
        children: [
            { label: "Banking & Fintech", href: "/solutions/bank-fintech", description: "Modern financial integrations" },
            { label: "Enterprise Integration", href: "/solutions/enterprise", description: "Connect and modernize systems" },
        ],
    },
    {
        label: "Developers",
        href: "/solutions/developers",
        children: [
            { label: "Developer Overview", href: "/solutions/developers", description: "Build and integrate with O24" },
            { label: "Product Features", href: "/features", description: "Understand the platform" },
            { label: "Engineering Blog", href: "/blog", description: "Technical articles and insights" },
        ],
    },
    {
        label: "Resources",
        href: "/blog",
        children: [
            { label: "Engineering Blog", href: "/blog" },
            { label: "Security", href: "/security" },
            { label: "About vKnight", href: "/about" },
            { label: "Contact", href: "/contact" },
        ],
    },
    { label: "Pricing", href: "/pricing" },
];
