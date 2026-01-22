import Link from "next/link";
import { Zap, Github, Linkedin, Twitter, Youtube } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#" },
        { label: "Roadmap", href: "#" },
    ],
    developers: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "SDK", href: "#" },
        { label: "Status", href: "#" },
    ],
    company: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#contact" },
    ],
    legal: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
    ],
};

const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
    return (
        <footer className="border-t bg-muted/30" id="contact">
            <div className="container mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">vKnight</span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            Đơn vị tiên phong trong lĩnh vực OpenAPI & Core Banking Integration
                            tại Việt Nam.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background hover:bg-accent transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Developers</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.developers.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} vKnight. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Made with ❤️ in Vietnam
                    </p>
                </div>
            </div>
        </footer>
    );
}
