/* ==========================================================================
   ABM TECH — single source of truth.

   ⚠️  Values marked TODO are placeholders. Fill them here once and they reach
   the header, footer, contact page, LocalBusiness JSON-LD, sitemap, OG cards,
   llms.txt and the mail templates.

   Env vars MUST be read as static literals (`process.env.NEXT_PUBLIC_FOO`).
   Next only inlines NEXT_PUBLIC_* into the client bundle when it can see the
   key as a literal at build time — a dynamic `process.env[key]` lookup works
   on the server and silently returns undefined in every client component.
   ========================================================================== */

const or = (value: string | undefined, fallback: string) =>
  value && value.trim().length > 0 ? value : fallback;

export const site = {
  name: "ABM Tech",
  legalName: or(process.env.NEXT_PUBLIC_LEGAL_NAME, "ABM Tech"),
  shortName: "ABM",
  tagline: "Systems · Software · Scale",

  description:
    "ABM Tech builds the software Indian businesses actually run on — CRM, ERP, billing platforms, admin-driven websites and AI automation. Fixed scope, fixed price, code you own.",

  positioning:
    "ABM Tech is an engineering studio. We build custom CRM and ERP systems, billing platforms, business websites with real admin panels, and the AI automation layer that removes the manual work in between. Every engagement is a fixed price against a written scope, and you own the code from the first commit.",

  url: or(process.env.NEXT_PUBLIC_SITE_URL, "https://abmtech.in"),
  locale: "en_IN",
  founded: "2024",

  contact: {
    email: or(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "contact@abmtech.in"),
    phoneE164: or(process.env.NEXT_PUBLIC_PHONE_E164, "+919119756710"),
    phoneDisplay: or(process.env.NEXT_PUBLIC_PHONE_DISPLAY, "+91 91197 56710"),
    whatsapp: or(process.env.NEXT_PUBLIC_WHATSAPP, "919119756710"),
    whatsappPrefill:
      "Hi ABM Tech — I'd like to discuss a system for my business.",
  },

  /** Keep byte-identical to your Google Business Profile — mismatched NAP
   *  across your site, schema and listings actively suppresses local ranking. */
  address: {
    street: or(process.env.NEXT_PUBLIC_ADDR_STREET, ""), // TODO: street + area
    locality: or(process.env.NEXT_PUBLIC_ADDR_CITY, "Dehradun"),
    region: or(process.env.NEXT_PUBLIC_ADDR_REGION, "Uttarakhand"),
    postalCode: or(process.env.NEXT_PUBLIC_ADDR_POSTAL, "248001"),
    country: "IN",
    countryName: "India",
    lat: Number(or(process.env.NEXT_PUBLIC_GEO_LAT, "30.3165")),
    lng: Number(or(process.env.NEXT_PUBLIC_GEO_LNG, "78.0322")),
    mapsUrl: or(process.env.NEXT_PUBLIC_MAPS_URL, ""), // TODO: GBP share link
  },

  hours: [
    { days: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], opens: "10:00", closes: "19:00" },
  ],

  serviceAreas: ["India", "Remote / Worldwide"],

  /** Leave a URL empty and that icon is simply not rendered — no dead links. */
  socials: [
    { key: "linkedin", label: "LinkedIn", url: or(process.env.NEXT_PUBLIC_LINKEDIN, "") },
    { key: "instagram", label: "Instagram", url: or(process.env.NEXT_PUBLIC_INSTAGRAM, "") },
    { key: "facebook", label: "Facebook", url: or(process.env.NEXT_PUBLIC_FACEBOOK, "") },
    { key: "x", label: "X", url: or(process.env.NEXT_PUBLIC_X, "") },
    { key: "youtube", label: "YouTube", url: or(process.env.NEXT_PUBLIC_YOUTUBE, "") },
    { key: "github", label: "GitHub", url: or(process.env.NEXT_PUBLIC_GITHUB, "") },
  ] as const,

  verification: {
    google: or(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, ""),
  },

  /** Trust points shown under the hero and on /about. Deliberately facts
   *  about how we work rather than unverifiable counts. */
  proof: [
    { k: "Pricing", v: "Fixed", note: "Written scope, no hourly meter" },
    { k: "Code ownership", v: "Yours", note: "Your Git org, from commit one" },
    { k: "First milestone", v: "7 days", note: "Something real to click" },
    { k: "Lock-in", v: "None", note: "Cancel with 30 days notice" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function whatsappLink(message?: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    message ?? site.contact.whatsappPrefill,
  )}`;
}

export function isPlaceholder(v: string | number | null | undefined) {
  if (v === undefined || v === null || v === "") return true;
  return typeof v === "string" && /TODO|0000000000/i.test(v);
}

export const nav = [
  { href: "/services", label: "Services", index: "01" },
  { href: "/pricing", label: "Pricing", index: "02" },
  { href: "/work", label: "Work", index: "03" },
  { href: "/about", label: "About", index: "04" },
  { href: "/contact", label: "Contact", index: "05" },
] as const;
