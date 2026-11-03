import { Agentation } from "@/components/agentation/Agentation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { JourneyAnalytics } from "@/components/analytics/JourneyAnalytics";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SITE_URL as siteUrl, ORGANIZATION_ID, WEBSITE_ID } from "@/lib/entities";
import "./globals.css";

const siteDescription =
    "Explore O24 API management, workflow orchestration, and integration architecture for developers and enterprise teams.";

const quicksand = Quicksand({
    subsets: ["latin", "vietnamese"],
    variable: "--font-quicksand",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: "vKnight",
    // Individual pages currently include their own brand suffix.
    // Avoid a title template to prevent duplicate "| vKnight" text.
    title: "vKnight | O24 API & Enterprise Integration Platform",
    description: siteDescription,
    keywords: [
        "vKnight",
        "O24 Platform",
        "API Management",
        "API Gateway",
        "Enterprise Integration",
        "Workflow Orchestration",
        "Open Banking",
        "Core Banking Integration",
        "Developer Platform",
    ],
    authors: [{ name: "vKnight" }],
    openGraph: {
        type: "website",
        siteName: "vKnight",
        locale: "en_US",
        title: "vKnight | O24 API & Enterprise Integration Platform",
        description: siteDescription,
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "vKnight O24 Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "vKnight | O24 API & Enterprise Integration Platform",
        description: siteDescription,
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

// Preserve the existing theme initialization before first paint.
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
        <html lang="en" className={quicksand.variable} suppressHydrationWarning>
            <head>
                <meta
                    property="zalo-platform-site-verification"
                    content="IDslAR-ZFWv7jhK4lf8zMM63laQDzMeUDJKo"
                />
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body
                className="min-h-screen antialiased font-sans transition-colors duration-300"
                suppressHydrationWarning
            >
                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "@id": ORGANIZATION_ID,
                        name: "vKnight",
                        url: siteUrl,
                        logo: `${siteUrl}/images/Logo.png`,
                    }}
                />
                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "@id": WEBSITE_ID,
                        name: "vKnight",
                        url: siteUrl,
                        publisher: { "@id": ORGANIZATION_ID },
                        inLanguage: "en",
                    }}
                />
                <ThemeProvider>
                    <AnnouncementBar />
                    <Header />
                    {children}
                    <Footer />
                    <JourneyAnalytics />
                    {/* <ChatBox /> */}
                    {process.env.VERCEL === "1" && <Analytics />}
                    {process.env.NODE_ENV === "development" && <Agentation />}
                    {/* <TetHolidayPopup /> */}
                </ThemeProvider>
            </body>
        </html>
    );
}
