/* ==========================================================================
   PILLARS — the whole-business view.

   A service list answers "what can I buy". It does not answer the question a
   business owner actually arrives with: "which part of my business is
   broken, and does this company fix that part?"

   These six pillars are that map. Every business on earth runs the same six
   loops — be found, capture demand, run operations, collect money, work away
   from a desk, and know what is happening. A visitor picks the loop that is
   hurting; the pillar names the services that fix it.

   Order matters: it follows a rupee through the business, from the stranger
   searching on a phone to the number on a dashboard at the end of the month.
   ========================================================================== */

export type Pillar = {
  key: string;
  index: string;
  /** The loop, in one verb. */
  name: string;
  /** The question a business owner would actually ask. */
  question: string;
  /** What this layer is, in one line. */
  summary: string;
  /** Concrete things that exist once this layer is in place. */
  outcomes: string[];
  /** Service slugs that build this layer. */
  services: string[];
  /** Search-voice <title> for /systems/[key]. */
  seoTitle: string;
  keywords: string[];
  /** Opening paragraph on the pillar detail page. */
  intro: string;
  faqs: { q: string; a: string }[];
};

export const pillars: Pillar[] = [
  {
    key: "found",
    index: "01",
    name: "Get found",
    question: "Can the people looking for us actually find us?",
    summary:
      "The public surface — a site that loads in under two seconds on a mid-range phone, a Google profile that ranks on the map, and search visibility that holds up when an AI answers the question instead of a results page.",
    outcomes: [
      "A website that is fast, indexed and structured for search",
      "A Google Business Profile that appears in the local map pack",
      "Reviews arriving as a routine, not a one-off request",
      "Enquiries landing somewhere they cannot be lost",
    ],
    services: ["business-website", "dynamic-website", "maps-and-seo"],
    seoTitle: "Get Found Online — Website & Local Search Visibility",
    keywords: [
      "business website development india",
      "local seo services india",
      "google business profile ranking",
    ],
    intro:
      "Being findable is not one thing — it is a website fast enough to survive a mid-range phone on patchy data, a Google Business Profile that actually appears in the map pack, and structured data that holds up when an AI answers the question instead of a results page. Most businesses have built one of these three and assumed the other two would follow. They don't.",
    faqs: [
      {
        q: "Do we need all three — website, Maps profile and SEO — or can we start with one?",
        a: "Start with whichever one is currently costing you the most enquiries. A business with zero web presence usually starts with the website; one with a website but no Maps visibility usually starts there instead. They compound, but they don't have to launch together.",
      },
      {
        q: "How is 'get found' different from just buying SEO?",
        a: "SEO is one lever inside this. The others are speed (a slow site loses rankings and visitors regardless of content) and structured data (which decides whether an AI search answer cites you at all). Buying only the SEO lever while the site is slow and unstructured wastes most of the spend.",
      },
    ],
  },
  {
    key: "capture",
    index: "02",
    name: "Capture demand",
    question: "What happens to an enquiry after it arrives?",
    summary:
      "Every enquiry — call, form, WhatsApp, walk-in, marketplace — into one pipeline with an owner and a next action, so nothing depends on somebody remembering.",
    outcomes: [
      "One inbox for every lead source you have",
      "An owner and a dated next action on every record",
      "Overdue follow-ups escalating, not sitting silently",
      "Quotations produced from your rate card in seconds",
    ],
    services: ["crm", "integrations", "ai-automation"],
    seoTitle: "Capture Demand — CRM & Enquiry Pipeline Software",
    keywords: [
      "lead management software india",
      "crm for small business india",
      "enquiry tracking software",
    ],
    intro:
      "An enquiry that lands in a WhatsApp group, a phone notebook and a website form is not three enquiries — it's one lead with three chances to be lost. This layer puts every source into one pipeline with an owner and a next action on every record, so a follow-up that goes overdue escalates instead of quietly disappearing off someone's list.",
    faqs: [
      {
        q: "We already get enough enquiries. Why do we need a pipeline for them?",
        a: "Volume is usually the reason this breaks, not the reason it doesn't matter — the more enquiries arrive, the easier it is for one to fall through a gap nobody notices until the customer has already bought elsewhere.",
      },
      {
        q: "Can this replace WhatsApp as how we talk to leads?",
        a: "No, and it shouldn't try to — WhatsApp usually stays the channel. What changes is that every conversation is logged against a record with an owner, instead of living only in someone's personal chat history.",
      },
    ],
  },
  {
    key: "operate",
    index: "03",
    name: "Run operations",
    question: "Do the books, the shelf and the software agree?",
    summary:
      "The operational core — stock, purchase, production, jobs, projects, people — modelled the way your business actually works instead of the way a generic template assumes it does.",
    outcomes: [
      "Stock that matches a physical count, continuously",
      "Purchase, production and dispatch on one timeline",
      "Approvals and roles enforced by the system",
      "An audit trail: who changed what, and when",
    ],
    services: ["erp-system", "business-digitisation", "ecommerce"],
    seoTitle: "Run Operations — ERP & Inventory Software for Indian Businesses",
    keywords: [
      "erp software development india",
      "inventory management software india",
      "operations management software",
    ],
    intro:
      "The books, the shelf and the software agreeing is not a bookkeeping outcome — it's an operational one. Most disagreement traces back to a generic template assuming your business works a way it doesn't: one SKU, one batch, one price, when the real shelf has three of each. This layer models stock, purchase, production and jobs the way your operation actually runs, with an audit trail attached.",
    faqs: [
      {
        q: "Our stock discrepancy is small. Is it worth fixing with software?",
        a: "A small discrepancy that's discovered every month is a recurring cost, not a one-off — the arithmetic usually favours fixing it once the write-offs are added up over a year rather than a single stock-take.",
      },
      {
        q: "Do you replace our accounting software, like Tally?",
        a: "Usually not — Tally typically stays the accounting book of record, and this layer sits above it as the operational system, posting summarised entries across so your accountant's workflow doesn't change.",
      },
    ],
  },
  {
    key: "money",
    index: "04",
    name: "Collect the money",
    question: "Does every invoice reconcile without an argument?",
    summary:
      "Billing, invoicing, payments and ledgers that close cleanly — GST-correct documents, part payments, credit control, and a payment integration that cannot double-charge.",
    outcomes: [
      "GST-correct invoices, credit notes and returns exports",
      "Credit limits enforced at the point of sale",
      "Online payments wired idempotently — no double charges",
      "Receivables ageing you can act on, not compile",
    ],
    services: ["billing-platform-app", "ecommerce", "erp-system"],
    seoTitle: "Collect the Money — GST Billing & Payments Software India",
    keywords: [
      "gst billing software india",
      "invoicing software for business india",
      "payment gateway integration india",
    ],
    intro:
      "An invoice that reconciles without an argument is rarer than it sounds — GST-correct documents, part payments tracked against the right invoice, credit limits enforced before a sale rather than reviewed after, and an online payment integration that genuinely cannot double-charge. This layer is the billing, invoicing and ledger work that closes cleanly every time, not most of the time.",
    faqs: [
      {
        q: "Isn't billing just a feature inside an ERP, not its own thing?",
        a: "In a full build it usually is bundled in — this pillar is listed separately because a business can need correct billing and payments long before it needs a full operations system, and buying just that first is often the right call.",
      },
      {
        q: "How do you actually prevent a payment gateway from double-charging?",
        a: "Idempotent request handling — every payment attempt carries a unique reference the gateway and our system both check before processing, so a retried request (a flaky connection, a double-tap) is recognised and ignored rather than charged twice.",
      },
    ],
  },
  {
    key: "mobile",
    index: "05",
    name: "Work off the desk",
    question: "Does any of this work where the work happens?",
    summary:
      "Apps for the people who are not sitting at a computer — technicians, drivers, sales staff, site supervisors — built to keep working when the network does not.",
    outcomes: [
      "Android and iOS from one codebase, on both stores",
      "Offline-first capture that syncs when signal returns",
      "Photo, signature and location proof at the point of work",
      "Managers seeing the field in real time, not at 7pm",
    ],
    services: ["mobile-apps", "billing-platform-app", "crm"],
    seoTitle: "Work Off the Desk — Mobile Apps for Field Teams India",
    keywords: [
      "field service mobile app india",
      "offline first app development india",
      "android ios app for business india",
    ],
    intro:
      "Most business software is designed for someone sitting at a desk, and most work isn't done there. Technicians, drivers, sales staff and site supervisors need capture that works with no signal, syncs when it returns, and never loses what somebody already typed — because the network dropping is the normal case in a basement or a warehouse, not the exception.",
    faqs: [
      {
        q: "Do we need a native app, or does a mobile website work?",
        a: "If the work happens with patchy or no connectivity, a native offline-first app is the honest answer — a mobile website generally needs a live connection to function, which is exactly the condition field work doesn't have.",
      },
      {
        q: "Android or iOS — do we have to pick one?",
        a: "No — the usual build is one React Native codebase shipping to both stores, so the choice is which store the app appears in, not which platform gets built.",
      },
    ],
  },
  {
    key: "know",
    index: "06",
    name: "Know what is happening",
    question: "Can you answer a question without asking three people?",
    summary:
      "Dashboards, reporting and the AI automation layer that removes the copying between systems — so the numbers arrive on their own and the mechanical work stops being somebody's morning.",
    outcomes: [
      "The three reports you would actually open on a Monday",
      "Documents read and entered without retyping",
      "Systems talking to each other instead of to a person",
      "Alerts when something drifts, not a quarter later",
    ],
    services: ["dashboards", "ai-automation", "integrations"],
    seoTitle: "Know What's Happening — Dashboards & AI Automation India",
    keywords: [
      "business intelligence dashboard india",
      "ai automation services india",
      "custom reporting software india",
    ],
    intro:
      "Answering a question without asking three people is what a dashboard is actually for — not a decoration, a replacement for the Monday-morning round of calls. This layer is the reporting and the AI automation that removes the copying between systems, so the three reports you would genuinely open arrive on their own, and drift raises an alert instead of surfacing a quarter later.",
    faqs: [
      {
        q: "We already have spreadsheets someone updates weekly. Isn't that a dashboard?",
        a: "It's a report, not a dashboard — the distinction is whether the numbers update themselves. A spreadsheet someone maintains is a standing manual task with a delay built in; a dashboard reads the same source systems directly.",
      },
      {
        q: "Is AI automation here the same as a chatbot?",
        a: "No — this is automation aimed at specific manual work (document extraction, enquiry triage, report generation), not a chatbot bolted onto a homepage. The chatbot pattern is usually the least useful application of the technology for a business like yours.",
      },
    ],
  },
];

/* --------------------------------------------------------------------------
   OUTCOME PROOFS — what changes, stated as a before/after rather than as a
   percentage nobody can verify. Used on the home page under the pillars.
   -------------------------------------------------------------------------- */

export type Shift = { before: string; after: string; where: string };

export const shifts: Shift[] = [
  {
    before: "Stock counted on Sunday, argued about on Monday",
    after: "Stock that matches the shelf, continuously",
    where: "Retail · Pharmacy · Distribution",
  },
  {
    before: "Enquiries across three phones and a notebook",
    after: "One pipeline, one owner, one next action",
    where: "Services · Education · Real estate",
  },
  {
    before: "Invoices retyped from PDFs every morning",
    after: "Read, validated and posted automatically",
    where: "Distribution · Manufacturing",
  },
  {
    before: "Reports compiled by hand at month end",
    after: "The same numbers, live, on one screen",
    where: "Every sector we have worked in",
  },
];

/* --------------------------------------------------------------------------
   ENGINEERING STACK — shown as a ticker. Not decoration: it tells a technical
   buyer we are not assembling this from page-builder plugins.
   -------------------------------------------------------------------------- */

export const stackMarks = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "MariaDB",
  "Prisma",
  "React Native",
  "Expo",
  "Frappe / ERPNext",
  "Tailwind CSS",
  "Docker",
  "Redis",
  "REST & GraphQL",
  "Razorpay / Stripe",
  "WhatsApp Business API",
  "AWS",
  "Vercel",
  "OpenAI / Claude",
  "Google Business Profile API",
] as const;
