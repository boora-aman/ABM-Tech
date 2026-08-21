import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { BackToTop } from "@/components/shell/BackToTop";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, organizationLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site.config";

/* --------------------------------- Fonts ---------------------------------
   Syne stands in for Monument Extended — the structural, slightly expanded
   grotesque the direction calls for, and the closest freely-licensed match.
   JetBrains Mono carries all technical micro-data; Inter does body copy.     */
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    title: `${site.name} — Systems, Software, Scale`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: site.verification.google
    ? { google: site.verification.google }
    : undefined,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0e12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${syne.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <JsonLd data={graph(organizationLd(), websiteLd())} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-tight focus:border focus:border-hair-warm focus:bg-obsidian focus:px-5 focus:py-3"
        >
          Skip to content
        </a>

        <Header />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
