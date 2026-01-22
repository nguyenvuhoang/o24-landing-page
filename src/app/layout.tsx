import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatBox from "@/components/chat/ChatBox";


const inter = Inter({
    subsets: ["latin", "vietnamese"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
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
        url: "https://vknight.io.vn",
        siteName: "O24 by vKnight",
        locale: "vi_VN",
        type: "website",
        images: [
            {
                url: "https://vknight.io.vn/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "O24 Platform | vKnight",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "O24 Platform | vKnight",
        description: "OpenAPI & Open Banking Integration Platform",
        images: [
            {
                url: "https://vknight.io.vn/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "O24 Platform | vKnight",
            },
        ],
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
            <body className="min-h-screen antialiased font-sans">
                {children}
                <ChatBox />
            </body>

        </html>
    );
}

