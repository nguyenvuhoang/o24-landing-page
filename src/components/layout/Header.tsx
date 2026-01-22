"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

const navItems = [
    { label: "Product", href: "#features" },
    { label: "Solutions", href: "#solutions" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#" },
    { label: "Contact", href: "#contact" },
];

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full glass">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">vKnight</span>
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
                        <Button variant="ghost" size="sm">
                            Đăng nhập
                        </Button>
                        <Button variant="gradient" size="sm">
                            Request Demo
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
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
                            <Button variant="outline" className="w-full">
                                Đăng nhập
                            </Button>
                            <Button variant="gradient" className="w-full">
                                Request Demo
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
