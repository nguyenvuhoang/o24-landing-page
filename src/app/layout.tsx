import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin", "vietnamese"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "O24 Platform | vKnight - OpenAPI & Core Banking Integration",
    description:
        "O24 là nền tảng OpenAPI & Core Banking Integration mạnh mẽ từ vKnight. Triển khai nhanh, bảo mật cao, hỗ trợ on-prem & cloud với Observability toàn diện.",
    keywords: [
        "O24",
        "vKnight",
        "OpenAPI",
        "Core Banking",
        "API Gateway",
        "Fintech",
        "Integration Platform",
    ],
    authors: [{ name: "vKnight" }],
    openGraph: {
        title: "O24 Platform | vKnight - OpenAPI & Core Banking Integration",
        description:
            "Nền tảng OpenAPI & Core Banking Integration mạnh mẽ. Triển khai nhanh, bảo mật cao, hỗ trợ on-prem & cloud.",
        url: "https://o24.vknight.io",
        siteName: "O24 by vKnight",
        locale: "vi_VN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "O24 Platform | vKnight",
        description: "OpenAPI & Core Banking Integration Platform",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={inter.variable} suppressHydrationWarning>
            <body className="min-h-screen antialiased font-sans">{children}</body>
        </html>
    );
}

