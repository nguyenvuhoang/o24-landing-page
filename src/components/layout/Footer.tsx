"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, Linkedin, Twitter, Youtube } from "lucide-react";
import { GitHub } from "@/components/ui/Icons";
import { usePathname } from "next/navigation";


const footerLinks = {
    product: [
        { label: "Tính năng", href: "/features" },
        { label: "Bảng giá", href: "/pricing" },
        { label: "Nhật ký thay đổi", href: "/changelog" },
        { label: "Lộ trình", href: "/roadmap" },
    ],
    developers: [
        { label: "Tài liệu", href: "https://docs.vknight.io.vn" },
        { label: "Tài liệu API", href: "#" },
        { label: "SDK", href: "#" },
        { label: "Trạng thái", href: "#" },
    ],
    company: [
        { label: "Về chúng tôi", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Tuyển dụng", href: "/careers" },
        { label: "Liên hệ", href: "/contact" },
    ],
    legal: [
        { label: "Chính sách bảo mật", href: "/privacy" },
        { label: "Điều khoản", href: "/terms" },
        { label: "Bảo mật", href: "/security" },
    ],
};

const socialLinks = [
    { icon: GitHub, href: "https://github.com/vknightteam", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith("/dashboard")) return null;

    return (
        <footer className="border-t bg-muted/30" id="contact">
            <div className="container mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/Logo.png"
                                alt="vKnight"
                                width={120}
                                height={40}
                                className="h-10 w-auto dark:brightness-0 dark:invert"
                            />
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            Đơn vị tiên phong trong lĩnh vực OpenAPI & Open Banking Integration
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
                        <h3 className="font-semibold mb-4">Sản phẩm</h3>
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
                        <h3 className="font-semibold mb-4">Nhà phát triển</h3>
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
                        <h3 className="font-semibold mb-4">Công ty</h3>
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
                        <h3 className="font-semibold mb-4">Pháp lý</h3>
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
                        © {new Date().getFullYear()} vKnight. Bảo lưu mọi quyền.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Được làm bằng ❤️ tại Việt Nam
                    </p>
                </div>
            </div>
        </footer>
    );
}
