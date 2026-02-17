"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import { LoginModal } from "@/components/auth/LoginModal";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    if (pathname?.startsWith("/dashboard")) return null;

    return (
        <header className="sticky top-0 z-50 w-full glass">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/Logo.png"
                            alt="vKnight"
                            width={120}
                            height={40}
                            className="h-10 w-auto dark:brightness-0 dark:invert"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
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
                            <Link href="/demo">Request Demo</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 px-4 space-y-2">
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
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            )}
                            <Button variant="gradient" className="w-full" asChild>
                                <Link href="/demo" onClick={() => setIsMobileMenuOpen(false)}>Request Demo</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header>
    );
}
