"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2, Mail, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

type FooterLink = { label: string; href: string; external?: boolean };

const footerGroups: { title: string; links: FooterLink[] }[] = [
    {
        title: "Platform",
        links: [
            { label: "Features", href: "/features" },
            { label: "Platform Overview", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Changelog", href: "/changelog" },
            { label: "Roadmap", href: "/roadmap" },
        ],
    },
    {
        title: "Solutions",
        links: [
            { label: "Banking & Fintech", href: "/solutions/bank-fintech" },
            { label: "Enterprise Integration", href: "/solutions/enterprise" },
            { label: "Book a Demo", href: "/demo" },
        ],
    },
    {
        title: "Developers",
        links: [
            { label: "Developer Hub", href: "/solutions/developers" },
            { label: "Engineering Blog", href: "/blog" },
            { label: "Technical Features", href: "/features" },
        ],
    },
    {
        title: "Company & Legal",
        links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Careers", href: "/careers" },
            { label: "Security", href: "/security" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
        ],
    },
];

export function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith("/dashboard")) return null;

    return (
        <footer className="border-t border-border bg-muted/30" aria-label="Site footer">
            <div className="container mx-auto px-4 pt-14 pb-8 lg:pt-20">
                <div className="mb-14 grid gap-8 rounded-3xl border border-primary/20 bg-background p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-8">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Build with vKnight</p>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">From an API idea to enterprise integration.</h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            Explore O24 technology or discuss your integration requirements with our team.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/solutions/developers" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <Code2 className="h-4 w-4" aria-hidden="true" /> For Developers
                        </Link>
                        <Link href="/demo" className="gradient-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            Book a Demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-7">
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Link href="/" className="inline-flex items-center" aria-label="vKnight home">
                            <Image src="/images/Logo.png" alt="vKnight" width={120} height={40} className="h-10 w-auto dark:brightness-0 dark:invert" />
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                            Building API management and enterprise integration experiences for developers and organizations.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                                <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> Contact us
                            </Link>
                            <Link href="/security" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Security
                            </Link>
                        </div>
                    </div>

                    {footerGroups.map((group) => (
                        <div key={group.title}>
                            <h3 className="mb-4 text-sm font-bold text-foreground">{group.title}</h3>
                            <ul className="space-y-3">
                                {group.links.map((link, index) => (
                                    <li key={`${group.title}-${link.href}-${index}`}>
                                        <Link href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                            {link.label}{link.external && <ArrowUpRight className="h-3 w-3" aria-hidden="true" />}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} vKnight. All rights reserved.</p>
                    <p>Built in Vietnam · Designed for developers and enterprises.</p>
                </div>
            </div>
        </footer>
    );
}
