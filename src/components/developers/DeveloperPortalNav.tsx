"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Code2, Compass, Rocket } from "lucide-react";

const pages = [
  { href: "/developers", label: "Developer Hub", icon: Compass },
  { href: "/developers/getting-started", label: "Getting Started", icon: Rocket },
  { href: "/developers/guides", label: "Technical Guides", icon: BookOpen },
  { href: "/developers/api-explorer", label: "API Explorer", icon: Code2 },
] as const;

export function DeveloperPortalNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Developer portal" className="border-b border-border/70 bg-background/95">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="flex min-w-0 gap-1 overflow-x-auto py-2 [scrollbar-width:thin]">
          {pages.map(({ href, label, icon: Icon }) => {
            const active = href === "/developers"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:text-sm ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
