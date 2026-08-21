import type { Metadata } from "next";
import { site, absoluteUrl } from "./site.config";

/* ==========================================================================
   METADATA + JSON-LD
   One place that decides how a page describes itself to search engines, social
   crawlers and LLM retrievers. Nodes are keyed by @id so the graph is
   connected rather than a pile of unrelated blocks.
   ========================================================================== */

const ORG = absoluteUrl("/#organization");
const WEB = absoluteUrl("/#website");

export function pageMeta({
  title,
  description,
  path = "/",
  keywords,
  type = "website",
  noIndex,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: readonly string[];
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const image = `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

type Json = Record<string, unknown>;

export function organizationLd(): Json {
  const sameAs = site.socials.map((s) => s.url).filter(Boolean);
  return {
    "@type": "Organization",
    "@id": ORG,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    foundingDate: site.founded,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.phoneE164,
        email: site.contact.email,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
  };
}

export function websiteLd(): Json {
  return {
    "@type": "WebSite",
    "@id": WEB,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": ORG },
    inLanguage: "en-IN",
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.path),
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]): Json | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceLd(s: {
  slug: string;
  title: string;
  summary: string;
  from: number;
  priceMode: string;
}): Json {
  return {
    "@type": "Service",
    "@id": absoluteUrl(`/services/${s.slug}#service`),
    name: s.title,
    description: s.summary,
    url: absoluteUrl(`/services/${s.slug}`),
    provider: { "@id": ORG },
    serviceType: s.title,
    areaServed: site.serviceAreas.map((a) => ({ "@type": "Place", name: a })),
    ...(s.from > 0
      ? {
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/services/${s.slug}`),
            priceCurrency: "INR",
            price: s.from,
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: s.from,
              priceCurrency: "INR",
              valueAddedTaxIncluded: false,
            },
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function graph(...nodes: (Json | null | undefined)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
