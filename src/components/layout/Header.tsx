"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { navItems } from "@/data/navigation";
import { LoginModal } from "@/components/auth/LoginModal";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [supabase] = useState(createClient);
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;

        void supabase.auth.getUser().then(({ data }) => {
            if (mounted) setUser(data.user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) setUser(session?.user ?? null);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    if (pathname?.startsWith("/dashboard")) return null;

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(`${href}/`);

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between gap-3">
                    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="vKnight homepage">
                        <Image
                            src="/images/Logo.png"
                            alt="vKnight"
                            width={120}
                            height={40}
                            className="h-10 w-auto dark:brightness-0 dark:invert"
                            priority
                        />
                    </Link>

                    <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const selected = isActive(item.href) || item.children?.some(child => isActive(child.href));
                            return (
                                <div key={item.label} className="group relative">
                                    <Link
                                        href={item.href}
                                        aria-current={isActive(item.href) ? "page" : undefined}
                                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? "text-foreground" : "text-muted-foreground"}`}
                                    >
                                        {item.label}
                                        {item.children && <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />}
                                    </Link>
                                    {item.children && (
                                        <div className="invisible absolute left-0 top-full z-50 w-72 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                                            <div className="rounded-xl border border-border bg-background p-2 shadow-xl">
                                                {item.children.map(child => (
                                                    <Link
                                                        key={`${item.label}-${child.href}`}
                                                        href={child.href}
                                                        aria-current={isActive(child.href) ? "page" : undefined}
                                                        className="block rounded-lg px-3 py-2.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    >
                                                        <span className="block text-sm font-semibold text-foreground">{child.label}</span>
                                                        {child.description && <span className="mt-0.5 block text-xs text-muted-foreground">{child.description}</span>}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    <div className="hidden lg:flex shrink-0 items-center gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/solutions/developers">For Developers</Link>
                        </Button>
                        {!user ? (
                            <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                                Đăng nhập
                            </Button>
                        ) : (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        )}
                        <Button variant="gradient" size="sm" asChild>
                            <Link href="/demo">Book a Demo</Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="rounded-lg p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={() => setIsMobileMenuOpen(open => !open)}
                            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-main-navigation"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <nav id="mobile-main-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border py-3 lg:hidden">
                        {navItems.map(item => (
                            <div key={item.label} className="border-b border-border/40 py-2 last:border-b-0">
                                <Link
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent"
                                >
                                    {item.label}
                                </Link>
                                {item.children && (
                                    <div className="ml-3 border-l border-border pl-2">
                                        {item.children.map(child => (
                                            <Link
                                                key={`${item.label}-${child.href}`}
                                                href={child.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="grid gap-2 px-3 pt-4">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/solutions/developers" onClick={() => setIsMobileMenuOpen(false)}>For Developers</Link>
                            </Button>
                            {!user ? (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setIsLoginModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                                </Button>
                            )}
                            <Button variant="gradient" className="w-full" asChild>
                                <Link href="/demo" onClick={() => setIsMobileMenuOpen(false)}>Book a Demo</Link>
                            </Button>
                        </div>
                    </nav>
                )}
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header>
    );
}
