import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatBox from "@/components/chat/ChatBox";
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({
    subsets: ["latin", "vietnamese"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://vknight.io.vn"),
    title: "O24 Platform | vKnight - OpenAPI & Open Banking Integration",
    description:
        "O24 là nền tảng OpenAPI & Open Banking Integration mạnh mẽ từ vKnight. Triển khai nhanh, bảo mật cao, hỗ trợ on-prem & cloud với Observability toàn diện.",
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
        title: "O24 Platform | vKnight - OpenAPI & Open Banking Integration",
        description:
            "Nền tảng OpenAPI & Open Banking Integration mạnh mẽ. Triển khai nhanh, bảo mật cao, hỗ trợ on-prem & cloud.",
        url: "/",
        siteName: "O24 by vKnight",
        locale: "vi_VN",
        type: "website",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "O24 Platform | vKnight",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "O24 Platform | vKnight - OpenAPI & Open Banking Integration",
        description:
            "Nền tảng OpenAPI & Open Banking Integration mạnh mẽ. Triển khai nhanh, bảo mật cao, hỗ trợ on-prem & cloud.",
        images: ["/images/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={inter.variable} suppressHydrationWarning>
            <body className="min-h-screen antialiased font-sans">
                {children}
                <ChatBox />
                <Analytics />
            </body>

        </html>
    );
}

