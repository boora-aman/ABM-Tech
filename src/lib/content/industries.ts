/* ==========================================================================
   INDUSTRIES — who this is for.

   The single biggest gap in the old site: a visitor arrived, read "CRM, ERP,
   billing platform" and had to work out for themselves whether any of it
   applied to a coaching institute, a hotel or a machine shop. This file makes
   that translation explicit — one entry per sector, written in that sector's
   own vocabulary.

   Deliberately broad. A business that does not see itself here is told so
   plainly at the bottom of the section rather than being left to guess.
   ========================================================================== */

export type Industry = {
  slug: string;
  index: string;
  name: string;
  /** Two or three words for compact chips and the ticker. */
  short: string;
  /** The sector's own words for what is going wrong. */
  pain: string;
  /** What we typically build for this sector, in their nouns. */
  builds: string[];
  /** Service slugs that usually make up the engagement. */
  services: string[];
  featured?: boolean;
};

export const industries: Industry[] = [
  {
    slug: "retail-wholesale",
    index: "01",
    name: "Retail & Wholesale",
    short: "Retail",
    featured: true,
    pain: "Stock on the shelf and stock in the software stopped agreeing months ago, and nobody can say which items actually make money.",
    builds: [
      "Barcode billing with multi-rate and multi-unit pricing",
      "Purchase orders, GRN and supplier ledgers",
      "Counter, godown and branch stock in one view",
      "Credit customers with limits enforced at the till",
      "Fast/slow-moving and margin-by-item reporting",
    ],
    services: ["erp-system", "billing-platform-app", "dashboards"],
  },
  {
    slug: "healthcare-pharmacy",
    index: "02",
    name: "Healthcare & Pharmacy",
    short: "Healthcare",
    featured: true,
    pain: "Batches, expiries and prescriptions live in a register beside the till, so write-offs are discovered after the supplier return window has closed.",
    builds: [
      "Batch-level stock with first-expiry-first-out dispensing",
      "Tiered expiry alerts grouped by supplier",
      "Prescription capture gated on scheduled medicines",
      "Appointments, patient records and visit history",
      "GST invoicing with DPCO ceiling checks",
    ],
    services: ["erp-system", "billing-platform-app", "ai-automation"],
  },
  {
    slug: "manufacturing",
    index: "03",
    name: "Manufacturing & Fabrication",
    short: "Manufacturing",
    pain: "Job cards are on paper, raw material consumption is an estimate, and the true cost of a finished unit is somebody's opinion.",
    builds: [
      "Bill of materials with multi-level assemblies",
      "Work orders, job cards and machine-wise output",
      "Raw material issue, consumption and wastage tracking",
      "Batch and lot traceability from input to dispatch",
      "Actual costing per unit, not a standing estimate",
    ],
    services: ["erp-system", "dashboards", "business-digitisation"],
  },
  {
    slug: "logistics-transport",
    index: "04",
    name: "Logistics & Transport",
    short: "Logistics",
    pain: "Bookings arrive on three phone numbers, paperwork is retyped four times, and a customer asking 'where is my consignment' costs a phone call.",
    builds: [
      "Booking, consignment and LR/bilty generation",
      "Dispatch board with real vehicle and crew capacity",
      "Driver app with proof of delivery and photos",
      "Customer-facing tracking links, self-serve",
      "Trip costing, fuel and per-route profitability",
    ],
    services: ["billing-platform-app", "mobile-apps", "crm"],
  },
  {
    slug: "construction-realestate",
    index: "05",
    name: "Construction & Real Estate",
    short: "Real estate",
    pain: "Site material, labour attendance and client payment stages sit in three different books that only reconcile at the end of a project — when it is too late.",
    builds: [
      "Project, phase and site-wise material issue",
      "Labour attendance and contractor bill certification",
      "Client payment milestones with demand letters",
      "Unit/inventory booking with allotment status",
      "Site progress capture from a phone",
    ],
    services: ["erp-system", "mobile-apps", "dynamic-website"],
  },
  {
    slug: "education",
    index: "06",
    name: "Education & Training",
    short: "Education",
    pain: "Admissions, fees, batches and attendance are four spreadsheets, and a parent asking about a pending instalment triggers a search.",
    builds: [
      "Admission enquiry pipeline through to enrolment",
      "Fee plans, instalments, receipts and dues reminders",
      "Batch, timetable and faculty allocation",
      "Attendance, tests and progress reports to parents",
      "Course pages and online enquiry capture",
    ],
    services: ["crm", "dynamic-website", "billing-platform-app"],
  },
  {
    slug: "hospitality-food",
    index: "07",
    name: "Hospitality & Food",
    short: "Hospitality",
    pain: "Bookings come from six platforms, the kitchen runs on shouted orders, and food cost is calculated once a month by hand.",
    builds: [
      "Table, room or slot booking with a live availability view",
      "Order capture, KOT routing and billing",
      "Recipe-level costing against actual purchase rates",
      "Google profile, menu and review pipeline",
      "Repeat-customer offers over WhatsApp",
    ],
    services: ["maps-and-seo", "billing-platform-app", "dynamic-website"],
  },
  {
    slug: "professional-services",
    index: "08",
    name: "Professional & Consulting",
    short: "Professional",
    pain: "Client work, deadlines and unbilled hours live in individual heads, so realisation is discovered at invoice time rather than managed.",
    builds: [
      "Client, matter and engagement records in one place",
      "Task, deadline and compliance-calendar tracking",
      "Time capture with billable/non-billable split",
      "Retainer and milestone invoicing with reminders",
      "Document vault with version and access control",
    ],
    services: ["crm", "dashboards", "ai-automation"],
  },
  {
    slug: "field-home-services",
    index: "09",
    name: "Field & Home Services",
    short: "Field services",
    featured: true,
    pain: "Jobs are assigned in a WhatsApp group, nobody knows which technician is free, and a customer from ten days ago was never called back.",
    builds: [
      "Enquiry pipeline with owner and next action on every job",
      "Area-based auto-assignment and a dispatch view",
      "Technician app that works offline in basements",
      "Photo proof on completion, feeding the invoice",
      "AMC/warranty renewals that surface before they lapse",
    ],
    services: ["crm", "mobile-apps", "maps-and-seo"],
  },
  {
    slug: "ecommerce-d2c",
    index: "10",
    name: "E-commerce & D2C",
    short: "D2C",
    pain: "Orders arrive from a website, a marketplace and Instagram DMs, and inventory is reconciled by three people editing the same sheet.",
    builds: [
      "Storefront with catalogue, variants and offers",
      "Single order inbox across web, marketplace and social",
      "Inventory synced so nothing oversells",
      "Payment gateway, shipping and returns flow",
      "Abandoned-cart and re-order nudges",
    ],
    services: ["ecommerce", "integrations", "ai-automation"],
  },
  {
    slug: "finance-insurance",
    index: "11",
    name: "Finance & Insurance",
    short: "Finance",
    pain: "Policies, renewals and client documents sit in email folders, so a lapsed renewal is noticed by the client before it is noticed by you.",
    builds: [
      "Client, policy and product records with renewal dates",
      "Renewal and premium-due escalation ladders",
      "Commission and payout reconciliation",
      "KYC/document collection with an audit trail",
      "Portfolio and persistency dashboards",
    ],
    services: ["crm", "dashboards", "ai-automation"],
  },
  {
    slug: "institutions-nonprofit",
    index: "12",
    name: "Institutions & Non-profit",
    short: "Non-profit",
    pain: "Donations, beneficiaries and grant reporting are compiled from scratch every quarter because nothing records them as they happen.",
    builds: [
      "Donor records, receipts and 80G documentation",
      "Beneficiary registry with programme participation",
      "Grant milestones and funder reporting packs",
      "Volunteer and event coordination",
      "Public site with an online donation flow",
    ],
    services: ["dynamic-website", "dashboards", "business-digitisation"],
  },
];
