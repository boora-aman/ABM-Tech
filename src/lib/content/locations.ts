/* ==========================================================================
   LOCATIONS — Dehradun-first, deliberately capped.

   The local-service SEO template warns at 30+ location pages; a city × service
   matrix (4 cities × 13 services = 52 pages) is index bloat and reads as
   exactly the kind of low-effort programmatic page Google's Helpful Content
   system was built to demote — see the Xform Technologies example in
   docs/seo/COMPETITOR-ANALYSIS.md for what that looks like in this market.

   So: nine pages, hand-written, honestly scoped.
     - Four city hubs. Dehradun is where ABM Tech is based; Haridwar,
       Rishikesh and Haldwani are served remotely from that base — the copy
       says so plainly rather than implying a local office that doesn't exist.
     - Five Dehradun × service pages, for the five searches that genuinely
       carry "I want to meet someone" intent. Not all 14 services get one.
   ========================================================================== */

export type CityPage = {
  slug: string;
  name: string;
  seoTitle: string;
  keywords: string[];
  /** Whether ABM Tech has a physical base in this city. */
  isBase: boolean;
  intro: string;
  /** Industry slugs with a genuine, non-generic presence in this city. */
  sectors: string[];
  faqs: { q: string; a: string }[];
};

export const cities: CityPage[] = [
  {
    slug: "dehradun",
    name: "Dehradun",
    seoTitle: "Custom Software Development Company in Dehradun",
    keywords: [
      "software development company in dehradun",
      "software company dehradun",
      "crm software company in dehradun",
    ],
    isBase: true,
    intro:
      "ABM Tech is based in Dehradun, and it's where every engagement starts as an in-person conversation if you want one — not a call centre routing you to a project manager in another city. Across the retail, healthcare, hospitality and field-service businesses we hear from here, the underlying need is the same one: the operations, the billing and the online presence agreeing with each other, which off-the-shelf tools configured in a hurry rarely do.",
    sectors: ["retail-wholesale", "healthcare-pharmacy", "hospitality-food", "field-home-services"],
    faqs: [
      {
        q: "Can we meet in person, or is this a remote-only engagement?",
        a: "In Dehradun, in person if you'd like — a first meeting, a discovery session, or handover training at your own premises. Most of the day-to-day build work still happens remotely with weekly preview links, which is faster than requiring an in-person session for every update.",
      },
      {
        q: "Do you only work with Dehradun businesses?",
        a: "No — most of our engagements are remote, across India. Dehradun is where we're based and where an in-person option genuinely exists, not a limit on who we'll work with.",
      },
    ],
  },
  {
    slug: "haridwar",
    name: "Haridwar",
    seoTitle: "Software Development for Haridwar Businesses",
    keywords: [
      "software company haridwar",
      "billing software haridwar",
      "crm software haridwar",
    ],
    isBase: false,
    intro:
      "We don't have an office in Haridwar — ABM Tech is based in Dehradun, about an hour away, and Haridwar businesses are served remotely from there: discovery calls over video, weekly preview links you can open from a phone, and an in-person visit scoped in when a rollout genuinely needs one (a multi-day staff training session, for instance). The businesses we hear from most in Haridwar are retail and hospitality operations, where a Google Business Profile that actually ranks for pilgrimage-season footfall matters as much as the software underneath it.",
    sectors: ["hospitality-food", "retail-wholesale"],
    faqs: [
      {
        q: "Since you're not based in Haridwar, how does support work day to day?",
        a: "The same way it would for any remote client — a named contact, defined response times, and a support retainer if you want ongoing cover after launch. Distance from our Dehradun base doesn't change the support model.",
      },
    ],
  },
  {
    slug: "rishikesh",
    name: "Rishikesh",
    seoTitle: "Software & Website Development for Rishikesh Businesses",
    keywords: [
      "software company rishikesh",
      "website development rishikesh",
      "hotel booking software rishikesh",
    ],
    isBase: false,
    intro:
      "Rishikesh is served remotely from our Dehradun base — no local office, and we say so plainly rather than imply otherwise. What we hear from Rishikesh businesses most often is hospitality: a booking calendar that actually prevents double-booking a room across seasons, and a Google Maps listing that shows up when a traveller is searching from a few kilometres away rather than losing that search to the ashram or guesthouse next door that got there first.",
    sectors: ["hospitality-food", "field-home-services"],
    faqs: [
      {
        q: "We run a seasonal business — does that change how you'd scope this?",
        a: "Yes, and it should — seasonal booking patterns, staffing that scales up and down, and a slow season where a support retainer might not be worth carrying are all things we'd scope around rather than ignore.",
      },
    ],
  },
  {
    slug: "haldwani",
    name: "Haldwani",
    seoTitle: "ERP & Billing Software Development for Haldwani Businesses",
    keywords: [
      "software company haldwani",
      "erp software haldwani",
      "billing software haldwani",
    ],
    isBase: false,
    intro:
      "Haldwani is served remotely from our Dehradun base, further out than Haridwar or Rishikesh but the same remote-first model: video discovery, weekly preview links, an in-person visit scoped in only where the rollout genuinely needs it. As a distribution and trading hub for the Kumaon region, the recurring need we see from Haldwani is operational — stock that agrees across a counter and a godown, and billing that reconciles without an argument at month end.",
    sectors: ["retail-wholesale", "manufacturing"],
    faqs: [
      {
        q: "Is the distance from Dehradun a practical problem for an ERP rollout, which usually needs on-site time?",
        a: "It's scoped honestly rather than glossed over — an ERP rollout benefits from at least one in-person visit for staff training, and that's costed as travel time in the proposal, not hidden inside the project price.",
      },
    ],
  },
];

export type DehradunServicePage = {
  slug: string;
  title: string;
  seoTitle: string;
  keywords: string[];
  intro: string;
  serviceSlug: string;
  faqs: { q: string; a: string }[];
};

export const dehradunServicePages: DehradunServicePage[] = [
  {
    slug: "software-development",
    title: "Software Development, Dehradun",
    seoTitle: "Custom Software Development Company in Dehradun",
    keywords: ["software development dehradun", "software company dehradun"],
    intro:
      "Most software development companies listed for Dehradun are directories, listicles, or a national studio with a Dehradun keyword bolted onto a template page — see docs/seo/COMPETITOR-ANALYSIS.md for exactly what that looks like on the current search results. ABM Tech is based here, and builds custom CRM, ERP, billing and mobile software for businesses across the city and the wider Doon valley, priced against a written scope with every figure published on /pricing rather than quoted after a sales call.",
    serviceSlug: "erp-system",
    faqs: [
      {
        q: "Are you actually based in Dehradun, or is this a national company targeting the city?",
        a: "Based here. We're happy to meet in person for a first conversation, which is not something every result on this search can say.",
      },
    ],
  },
  {
    slug: "crm-software",
    title: "Custom CRM Software, Dehradun",
    seoTitle: "CRM Software Development Company in Dehradun",
    keywords: ["crm software company in dehradun", "crm development dehradun"],
    intro:
      "A CRM built around how a Dehradun sales team already works — real estate site visits, education admissions enquiries, distribution follow-ups — rather than a generic pipeline you have to bend to fit. Built and delivered in 3–5 weeks, from ₹12,000, with your existing leads migrated and reconciled before go-live.",
    serviceSlug: "crm",
    faqs: [
      {
        q: "Can you build for a specific local sector — real estate, coaching, distribution?",
        a: "Yes — the CRM's stages and required fields are mapped to your actual process during discovery, not assumed from a template, so the sector shapes the build rather than the other way round.",
      },
    ],
  },
  {
    slug: "website-design",
    title: "Website Design & Development, Dehradun",
    seoTitle: "Website Designing Company in Dehradun",
    keywords: ["website designing company in dehradun", "website development dehradun"],
    intro:
      "A business website that loads fast on a mid-range phone, is structured for both Google and AI search from the first commit, and is handed over with the code in your own Git organisation — not a page-builder template with a Dehradun business's name pasted into it. Static builds from ₹6,000; a dynamic site with a real admin panel from ₹15,000.",
    serviceSlug: "business-website",
    faqs: [
      {
        q: "How is this different from a freelancer offering a website for a similar price?",
        a: "The published scope, exclusions and delivery sequence — you know exactly what ₹6,000 includes and what it doesn't before paying anything, and the code is yours to hand to another developer if you ever need to.",
      },
    ],
  },
  {
    slug: "billing-software",
    title: "GST Billing Software, Dehradun",
    seoTitle: "GST Billing Software Development in Dehradun",
    keywords: ["billing software dehradun", "gst billing software uttarakhand"],
    intro:
      "Billing software built for how a Dehradun retail counter, distributor or fuel outlet actually reconciles — multi-rate pricing, credit customers with enforced limits, and shift-wise variance attribution, not a generic invoice generator. Delivered as a web and mobile combination from ₹20,000, with GST-correct output from day one.",
    serviceSlug: "billing-platform-app",
    faqs: [
      {
        q: "Does this replace Tally for us?",
        a: "Usually not — see /compare/custom-erp-vs-tally for the full honest comparison. Tally typically stays the accounting book of record; this is the operational billing layer above it.",
      },
    ],
  },
  {
    slug: "google-business-profile",
    title: "Google Business Profile Setup, Dehradun",
    seoTitle: "Google My Business Setup Service in Dehradun",
    keywords: ["google my business dehradun", "gmb setup dehradun"],
    intro:
      "A Google Business Profile built out fully and submitted the same day, for ₹2,499 one time — and you don't pay until it's actually live on Maps. This is the setup only; ongoing posting and review management is the separate Google Maps Profile & SEO retainer.",
    serviceSlug: "google-business-profile-setup",
    faqs: [
      {
        q: "Why does location matter for a Google Business Profile setup?",
        a: "Maps results are personalised by the searcher's distance from your premises, so getting the address, service area and categories exactly right for a Dehradun search matters more here than the setup process itself.",
      },
    ],
  },
];
