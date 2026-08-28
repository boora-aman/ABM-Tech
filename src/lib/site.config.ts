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
    "ABM Tech builds the systems a business runs on — website, CRM, ERP, billing, mobile apps, integrations, dashboards and AI automation. Any sector, any size. Fixed scope, fixed price, code you own.",

  positioning:
    "ABM Tech is a software engineering studio. We build the six systems every business depends on — the website that gets you found, the CRM that catches demand, the operations core that keeps stock and jobs honest, the billing that reconciles, the mobile apps for work that happens away from a desk, and the automation and reporting that stop the copying in between. Retail, healthcare, manufacturing, logistics, education, hospitality, services — the software differs, the six loops do not. Every engagement is a fixed price against a written scope, and you own the code from the first commit.",

  /** One sentence a visitor should be able to repeat after five seconds. */
  promise:
    "Whatever your business is, we build the software that runs it — and we tell you when you don't need us.",

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

  /** Leave a URL empty and that icon is simply not rendered — no dead links.
   *  These also feed `sameAs` in Organization schema, which is how search
   *  engines tie the site and the profiles to one entity. */
  socials: [
    /* ⚠️ These MUST be ABM Tech's own profiles, not another brand's. They feed
       `sameAs` in Organization schema, which is how a search engine ties a
       site and a profile to one entity — pointing them at a different company
       actively tells Google the two brands are the same thing. Left empty
       until the ABM Tech accounts exist; an empty URL renders no icon. */
    {
      key: "instagram",
      label: "Instagram",
      url: or(process.env.NEXT_PUBLIC_INSTAGRAM, ""), // TODO: ABM Tech Instagram
    },
    {
      key: "facebook",
      label: "Facebook",
      url: or(process.env.NEXT_PUBLIC_FACEBOOK, ""), // TODO: ABM Tech Facebook page
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: or(process.env.NEXT_PUBLIC_LINKEDIN, "https://www.linkedin.com/in/boora-aman/"),
    },
    {
      key: "github",
      label: "GitHub",
      url: or(process.env.NEXT_PUBLIC_GITHUB, "https://github.com/boora-aman"),
    },
    { key: "x", label: "X", url: or(process.env.NEXT_PUBLIC_X, "") },
    { key: "youtube", label: "YouTube", url: or(process.env.NEXT_PUBLIC_YOUTUBE, "") },
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

  /** Scale facts for the home page counter strip. Deliberately structural —
   *  countable things about the offer, never invented client numbers. */
  scale: [
    { v: "13", k: "Services", note: "The whole business, not one slice" },
    { v: "12", k: "Sectors", note: "Modelled in their own vocabulary" },
    { v: "6", k: "Systems", note: "Found, capture, operate, bill, mobile, know" },
    { v: "1", k: "Team", note: "The people building it are the people you talk to" },
  ],

  /** Answers the "are we too small / too big / too weird for you" question
   *  before a visitor has to ask it. */
  fit: [
    {
      title: "A business with no software at all",
      body: "Registers, WhatsApp and a shared Excel file. We start with the one process that hurts most and digitise it properly, rather than replacing everything in one weekend.",
    },
    {
      title: "A business that has outgrown its tools",
      body: "Five subscriptions that do not talk to each other and a person whose job is to copy between them. Usually the cheapest fix we sell, and the fastest to pay back.",
    },
    {
      title: "A business somebody else built software for",
      body: "An abandoned build, a vendor who stopped replying, or code nobody can deploy. We audit it honestly and tell you whether it is worth rescuing or replacing.",
    },
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
  { href: "/industries", label: "Industries", index: "02" },
  { href: "/pricing", label: "Pricing", index: "03" },
  { href: "/work", label: "Work", index: "04" },
  { href: "/blog", label: "Journal", index: "05" },
  { href: "/about", label: "About", index: "06" },
  { href: "/contact", label: "Contact", index: "07" },
] as const;
