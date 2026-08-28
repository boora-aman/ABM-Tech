import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/shell/Header";
import { getMenuPanels } from "@/lib/content/megamenu";
import { Footer } from "@/components/shell/Footer";
import { BackToTop } from "@/components/shell/BackToTop";
import { themeScript } from "@/components/shell/Theme";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, organizationLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site.config";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — CRM, ERP & Business Software Development`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  publisher: site.legalName,
  category: "technology",
  keywords: [
    "custom crm development india",
    "erp software development india",
    "business website with admin panel",
    "billing software development",
    "ai automation for business india",
    "business digitization services",
    "google business profile optimization",
  ],
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: site.verification.google ? { google: site.verification.google } : undefined,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Built from the content repo so a service renamed in the admin is renamed
  // in the header without a redeploy.
  const panels = await getMenuPanels();

  return (
    <html
      lang="en-IN"
      className={`${syne.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Stamps the stored theme before first paint — no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <JsonLd data={graph(organizationLd(), websiteLd())} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-sm focus:border focus:border-brand focus:bg-surface focus:px-5 focus:py-3"
        >
          Skip to content
        </a>

        <Header panels={panels} />
        <main id="main">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
