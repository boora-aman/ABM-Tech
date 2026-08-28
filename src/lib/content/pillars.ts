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

/* --------------------------------------------------------------------------
   CATALOGUE GROUPS — the six loops plus `run`, which is not a business loop
   but is where hosting and support belong. Used to group 13 services into
   something scannable; a flat grid of 13 cards is a wall, not a menu.
   -------------------------------------------------------------------------- */

export const catalogueGroups: {
  key: string;
  name: string;
  blurb: string;
}[] = [
  ...pillars.map((p) => ({
    key: p.key,
    name: p.name,
    blurb: p.question,
  })),
  {
    key: "run",
    name: "Keep it running",
    blurb: "Who is responsible once it is live?",
  },
];
