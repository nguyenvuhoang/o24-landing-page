"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

const groups = [
  { title: "Platform", links: [
    { label: "Product capabilities", href: "/features" },
    { label: "Solutions overview", href: "/solutions" },
    { label: "Banking & Fintech", href: "/solutions/bank-fintech" },
    { label: "Enterprise Integration", href: "/solutions/enterprise" },
    { label: "Pricing", href: "/pricing" },
  ]},
  { title: "Developers", links: [
    { label: "Developer Hub", href: "/developers" },
    { label: "Getting Started", href: "/developers/getting-started" },
    { label: "Technical Guides", href: "/developers/guides" },
    { label: "API Explorer", href: "/developers/api-explorer" },
    { label: "Engineering Blog", href: "/blog" },
  ]},
  { title: "Enterprise & Trust", links: [
    { label: "Security & Trust", href: "/security" },
    { label: "Deployment & Operations", href: "/enterprise/deployment" },
    { label: "Security Review & FAQ", href: "/enterprise/security-review" },
    { label: "Enterprise Consultation", href: "/enterprise" },
    { label: "Request Demo", href: "/demo" },
  ]},
  { title: "Company", links: [
    { label: "About vKnight", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ]},
] as const;

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <footer className="border-t border-border bg-muted/30" aria-label="Site footer">
    <div className="container mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
        <div>
          <Link href="/" aria-label="vKnight home" className="inline-flex items-center">
            <Image src="/images/Logo.png" alt="vKnight" width={120} height={40} className="h-10 w-auto dark:brightness-0 dark:invert" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">O24 by vKnight explores API management, workflow orchestration and integration architecture for financial and enterprise teams.</p>
          <Link href="/demo" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Request a Demo <ArrowUpRight size={16}/></Link>
        </div>
        {groups.map(group => <div key={group.title}>
          <h2 className="text-sm font-bold">{group.title}</h2>
          <ul className="mt-5 space-y-3">{group.links.map(link => <li key={link.href}>
            <Link href={link.href} className="text-sm leading-6 text-muted-foreground transition-colors hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary">{link.label}</Link>
          </li>)}</ul>
        </div>)}
      </div>
      <div className="mt-12 flex flex-col justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} vKnight. All rights reserved.</span>
        <span>Platform scope, deployment options and service terms depend on project requirements.</span>
      </div>
    </div>
  </footer>;
}
