import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import ChatBox from "@/components/chat/ChatBox";
import { Analytics } from '@vercel/analytics/next';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Agentation } from "@/components/agentation/Agentation";
import { TetHolidayPopup } from "@/components/layout/TetHolidayPopup";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";


const quicksand = Quicksand({
    subsets: ["latin", "vietnamese"],
    variable: "--font-quicksand",
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
        "Open Banking Vietnam",
        "Giải pháp Fintech",
        "Kết nối ngân hàng",
        "API Management Vietnam",
        "Chuyển đổi số ngân hàng",
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

// Anti-flash script: sets dark class before first paint
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var resolved = theme;
    if (!theme || theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();
`;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={quicksand.variable} suppressHydrationWarning>
            <head>
                <meta property="zalo-platform-site-verification" content="IDslAR-ZFWv7jhK4lf8zMM63laQDzMeUDJKo" />
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="min-h-screen antialiased font-sans transition-colors duration-300" suppressHydrationWarning>
                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "vKnight",
                        "url": "https://vknight.io.vn",
                        "logo": "https://vknight.io.vn/favicon.ico",
                        "sameAs": [
                            "https://www.facebook.com/vknight.team",
                            "https://github.com/vknightteam"
                        ]
                    }}
                />
                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "O24 Platform",
                        "url": "https://vknight.io.vn",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://vknight.io.vn/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    }}
                />
                <ThemeProvider>
                    <AnnouncementBar />
                    <Header />
                    {children}
                    <Footer />
                    <ChatBox />
                    <Analytics />
                    <Agentation />
                    <TetHolidayPopup />
                </ThemeProvider>
            </body>
        </html>
    );
}

