/* ==========================================================================
   INDUSTRIES — who this is for.

   The single biggest gap in the old site: a visitor arrived, read "CRM, ERP,
   billing platform" and had to work out for themselves whether any of it
   applied to a coaching institute, a hotel or a machine shop. This file makes
   that translation explicit — one entry per sector, written in that sector's
   own vocabulary.

   Deliberately broad. A business that does not see itself here is told so
   plainly at the bottom of the section rather than being left to guess.

   `intro`, `outcome` and `faqs` back the standalone /industries/[slug] page —
   `pain` and `builds` alone are too thin to index on their own; the detail
   page needs its own paragraph of unique content plus real questions to earn
   FAQPage schema and rank on `{software} for {sector}` searches.
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
  /** Search-voice <title>, kept separate from the brand-voice H1 (`name`). */
  seoTitle: string;
  /** Search terms this page should own. */
  keywords: string[];
  /** Opening paragraph on the industry detail page. */
  intro: string;
  /** One sentence: what changes once this is running. */
  outcome: string;
  faqs: { q: string; a: string }[];
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
    seoTitle: "Retail & Wholesale Billing Software with Inventory Control",
    keywords: [
      "retail billing software with inventory",
      "wholesale erp software india",
      "gst billing software for shop",
      "multi branch stock management software",
    ],
    intro:
      "Most retail and wholesale software starts as a billing counter and never becomes an inventory system, so the till agrees with the customer and disagrees with the godown. What we build closes that gap at the point of entry: every purchase, transfer and sale updates one stock ledger, split by counter and branch but reconciled centrally, with margin visible per item rather than discovered at year-end.",
    outcome:
      "A stock figure you can trust without a physical count, and a margin report by item instead of by guess.",
    faqs: [
      {
        q: "We already use Tally for accounts. Does this replace it?",
        a: "Usually not — it sits alongside it. Tally stays the accounting book of record; we build the operational layer above it (barcode billing, multi-branch stock, credit limits) and post summarised entries across, so your accountant's workflow does not change.",
      },
      {
        q: "Can it handle multiple pricing tiers for wholesale vs retail customers?",
        a: "Yes — rate lists per customer category, quantity-break pricing and scheme discounts are standard in the billing module, applied automatically at the till rather than calculated by hand.",
      },
      {
        q: "What about a shop with one counter and no warehouse?",
        a: "The same system scales down — a single-location build without the branch-transfer layer is priced from the ERP floor on /pricing, not the multi-branch figure.",
      },
    ],
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
    seoTitle: "Pharmacy Billing Software with Batch & Expiry Management",
    keywords: [
      "pharmacy billing software with expiry management",
      "pharmacy erp software india",
      "batch wise medicine stock software",
      "clinic management software india",
    ],
    intro:
      "A pharmacy's real loss is rarely theft — it is a batch that expired quietly behind a faster-moving one, discovered at the next stock-take rather than inside the supplier's return window. We build billing that dispenses first-expiry stock automatically, alerts grouped by supplier so a return can actually be filed in time, and DPCO ceiling checks built into the invoice itself, not left to the counter staff's memory.",
    outcome:
      "Expiry write-offs caught with weeks of runway instead of discovered at stock-take, and every invoice DPCO-compliant by default.",
    faqs: [
      {
        q: "Does it handle Schedule H / H1 prescription requirements?",
        a: "Yes — scheduled medicines can be gated on a prescription reference before sale, with the record retained against that invoice, which is what an inspection actually asks for.",
      },
      {
        q: "Can it flag a batch before it becomes a write-off, not after?",
        a: "That's the specific problem it's built to solve — expiry alerts are grouped by supplier and surfaced with enough lead time to return stock inside the supplier's window, not just at the next physical count.",
      },
      {
        q: "Is this only for standalone pharmacies, or does it fit a clinic too?",
        a: "Both — a clinic adds appointment scheduling and patient visit history on the same base; a pure retail pharmacy can skip that module entirely and pay for less.",
      },
    ],
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
    seoTitle: "Production Planning Software for Small Manufacturers",
    keywords: [
      "production planning software for small manufacturers",
      "manufacturing erp software india",
      "job card software for factory",
      "batch traceability software manufacturing",
    ],
    intro:
      "A standing cost estimate is a guess repeated until someone believes it. We replace the paper job card with a work order that consumes real raw material against a real bill of materials, so wastage shows up as a number on the job rather than a shrug at month-end, and the cost of a finished unit is calculated from what actually went in, not what was supposed to.",
    outcome:
      "Per-unit cost calculated from actual consumption, and a batch you can trace back to the raw material lot that went into it.",
    faqs: [
      {
        q: "We make dozens of product variants. Can the BOM handle that?",
        a: "Multi-level bills of materials with assembly-within-assembly are standard — a variant is typically a different BOM referencing shared sub-assemblies, not a separate system.",
      },
      {
        q: "Do we need to scrap our existing paper job cards on day one?",
        a: "No — the usual rollout runs both in parallel for two to three weeks so the shop floor trusts the numbers before paper stops, which is also when we catch data-entry habits that need adjusting.",
      },
      {
        q: "Can it show machine-wise output, not just factory-wise?",
        a: "Yes, if job cards are logged against a machine or line — that is the input the reporting needs, and it is usually a training question, not a technical one.",
      },
    ],
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
    seoTitle: "Transport & Logistics Management Software India",
    keywords: [
      "transport management software india",
      "logistics erp software india",
      "bilty software for transporters",
      "fleet dispatch software india",
    ],
    intro:
      "A consignment retyped four times between booking, LR, dispatch and delivery is where transport businesses lose both time and accuracy — a digit transposed on the third retype is the claim nobody can explain later. We build a single booking that generates the LR/bilty once, feeds a dispatch board against real vehicle and crew capacity, and closes with a driver's photo proof of delivery, so a customer's tracking link answers the phone call before it happens.",
    outcome:
      "One booking entry instead of four re-typed documents, and per-route profitability calculated instead of assumed.",
    faqs: [
      {
        q: "Do drivers need a smartphone and data connection at all times?",
        a: "The driver app is built to work offline in low-signal stretches and syncs proof of delivery and photos once connectivity returns — it does not block a delivery on a signal bar.",
      },
      {
        q: "Can customers track their own consignment without calling us?",
        a: "Yes — a self-serve tracking link is generated per consignment; that link is usually the single highest-value feature because it removes the 'where is my shipment' call entirely.",
      },
      {
        q: "We run mixed owned and hired vehicles. Does capacity planning account for that?",
        a: "Yes — the dispatch board treats both the same way operationally, with hired-vehicle costing kept separate for per-route profitability.",
      },
    ],
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
    seoTitle: "Real Estate CRM & Construction Project Software India",
    keywords: [
      "real estate crm india",
      "construction project management software india",
      "unit booking software real estate",
      "contractor bill certification software",
    ],
    intro:
      "Three books that reconcile only at project close means the discrepancy is discovered when it can no longer be fixed cheaply. We tie material issue, labour attendance and client payment milestones to the same project and phase, so a demand letter goes out when a milestone is actually met, a contractor's bill is certified against logged attendance rather than a verbal count, and unit allotment status is one screen, not a spreadsheet three people are editing.",
    outcome:
      "Payment milestones tied to verified progress, and a unit-booking status that never contradicts itself across two people's spreadsheets.",
    faqs: [
      {
        q: "Can site engineers log progress without a laptop on site?",
        a: "Yes — progress capture, including photos, is built for a phone; that is the interface site staff actually have with them.",
      },
      {
        q: "Does this handle RERA-related disclosure requirements?",
        a: "It structures the underlying data — unit status, payment milestones, project phase — in a form that supports RERA reporting; the specific disclosure format is scoped explicitly with your compliance requirement, not assumed.",
      },
      {
        q: "We run multiple projects with different contractors. Does it separate them cleanly?",
        a: "Each project and phase is its own record with its own material issue and labour ledger, so nothing bleeds across projects unless you explicitly want a consolidated view.",
      },
    ],
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
    seoTitle: "Coaching Institute & School Management Software India",
    keywords: [
      "coaching institute management software",
      "school management software india",
      "fee management software india",
      "student enquiry crm india",
    ],
    intro:
      "An institute running admissions, fees, batches and attendance as four separate spreadsheets is one where a parent's question about a pending instalment turns into a search across all four. We tie the enquiry pipeline, the fee plan and the batch timetable to one student record, so a dues reminder goes out automatically against the actual instalment schedule, and a progress report to a parent pulls from attendance and test data that is already there rather than compiled specially.",
    outcome:
      "One student record instead of four spreadsheets, and dues reminders that go out on schedule without someone checking manually.",
    faqs: [
      {
        q: "Can it manage multiple batches with overlapping faculty schedules?",
        a: "Yes — timetable and faculty allocation is built to flag a clash before it is scheduled, not after a faculty member is double-booked.",
      },
      {
        q: "Do parents need to install an app to see fee dues and attendance?",
        a: "No — a web link with a login is the usual approach; a native app is only worth building if your institute wants push notifications specifically, which is scoped as an add-on.",
      },
      {
        q: "Can the website's course pages feed enquiries directly into the same pipeline?",
        a: "Yes — that connection is usually the highest-value part of the build, since it removes the manual step of copying a website enquiry into a spreadsheet.",
      },
    ],
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
    services: ["maps-and-seo", "google-business-profile-setup", "billing-platform-app", "dynamic-website"],
    seoTitle: "Restaurant Billing & Hotel Booking Software India",
    keywords: [
      "restaurant billing and order software",
      "hotel booking management software india",
      "kot software for restaurant",
      "recipe costing software restaurant",
    ],
    intro:
      "Food cost calculated once a month by hand is always calculated too late to act on — the margin has already been lost by the time the number appears. We build order capture that routes a KOT to the kitchen the moment it's taken, a live availability view across tables, rooms or slots so double-booking stops being a weekly apology, and recipe-level costing against the purchase rate you're actually paying this week, not the one from three months ago.",
    outcome:
      "Recipe-level food cost visible in near real time, and a booking calendar that stops double-booking a table or room by accident.",
    faqs: [
      {
        q: "We take bookings from our own counter, Instagram DMs and a booking platform. Can it unify these?",
        a: "Central availability is the usual fix — every channel checks and books against the same calendar, so a table or room booked on one channel is instantly unavailable on the others.",
      },
      {
        q: "Does recipe costing update automatically when purchase rates change?",
        a: "Yes — costing is calculated against actual purchase entries, so a rate change on tomatoes shows up in the recipe cost the next time it's checked, not at the next manual recalculation.",
      },
      {
        q: "Is Google Business Profile management part of this or a separate service?",
        a: "It's listed as a separate service (see /services/maps-and-seo and /google-business-profile-setup) because it has its own pricing and timeline, but the two are commonly built together for hospitality businesses.",
      },
    ],
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
    seoTitle: "Practice Management Software for Consultants & Firms India",
    keywords: [
      "practice management software for consultants",
      "law firm management software india",
      "billable hours tracking software india",
      "compliance calendar software firm",
    ],
    intro:
      "Realisation discovered at invoice time is realisation managed too late — by then the unbilled hours are already spent and the client relationship already has an expectation set. We build one client and matter record that captures time as billable or non-billable at the point of work, tracks a compliance calendar that surfaces a deadline before it's missed, and generates retainer or milestone invoices from time actually logged, not from memory reconstructed at month-end.",
    outcome:
      "Billable hours captured as they happen instead of reconstructed from memory, and an invoice that matches what was actually logged.",
    faqs: [
      {
        q: "Our consultants resist logging time. Does this make that easier?",
        a: "Time capture is built to be a single tap against an open matter rather than a form to fill — the friction of logging time is usually what causes resistance, and that's the specific thing addressed.",
      },
      {
        q: "Can it track statutory or compliance deadlines specific to our practice?",
        a: "Yes — a compliance calendar with escalating reminders is standard; the specific deadlines (filing dates, renewal dates, court dates) are configured to your practice area during discovery.",
      },
      {
        q: "Is client data access controlled per team member?",
        a: "Yes — the document vault and client records support role-based access, so a matter is visible only to the team members actually assigned to it.",
      },
    ],
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
    services: ["crm", "mobile-apps", "maps-and-seo", "google-business-profile-setup"],
    seoTitle: "Field Service Management App for Indian Businesses",
    keywords: [
      "field service management app india",
      "home service booking software india",
      "technician dispatch app india",
      "amc renewal tracking software",
    ],
    intro:
      "A job assigned in a WhatsApp group has no owner once the message scrolls past — that is why a customer from ten days ago never gets called back. We build an enquiry pipeline where every job has an owner and a next action, area-based assignment that shows which technician is actually free, and a technician app built to work offline in a basement or a lift shaft, because that's where the job usually is.",
    outcome:
      "Every enquiry has a named owner and a next action, and an AMC renewal surfaces weeks before it lapses instead of after the customer complains.",
    faqs: [
      {
        q: "Our technicians have basic Android phones with patchy signal. Will the app work?",
        a: "That's the specific condition it's built for — the technician app queues photo proof and job updates locally and syncs when signal returns, rather than requiring a live connection to function.",
      },
      {
        q: "Can it auto-assign jobs by area without a dispatcher manually deciding every time?",
        a: "Yes — area-based auto-assignment against technician availability is standard, with a dispatch view for the cases that need manual override.",
      },
      {
        q: "How does this help renewals we currently track in a diary?",
        a: "AMC and warranty dates are attached to the job record at completion, and reminders escalate weeks ahead — the diary is where renewals get missed; this is built specifically so they don't.",
      },
    ],
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
    seoTitle: "D2C Order Management & E-commerce Software India",
    keywords: [
      "d2c order management system",
      "ecommerce website development india",
      "multi channel inventory sync software",
      "shopify alternative custom store india",
    ],
    intro:
      "Three people editing the same stock sheet is not a process, it's a race, and overselling is what happens when it's lost. We build a single order inbox that pulls from the website, marketplace listings and DM-based orders into one queue, synced against one inventory count so a sale on Instagram actually decrements the same stock a marketplace order draws from — and abandoned-cart and re-order nudges that run without a person triggering them.",
    outcome:
      "One inventory count across every channel instead of three people editing a sheet, and overselling stops being a recurring apology.",
    faqs: [
      {
        q: "We sell on our own site, Amazon/Flipkart and Instagram. Can one system really unify all three?",
        a: "Yes, via API integration to each marketplace — orders and stock levels sync into one inbox and one count, which is the specific problem a spreadsheet across three channels can't solve.",
      },
      {
        q: "Is this a Shopify replacement, or does it work alongside Shopify?",
        a: "Either — some clients want a fully custom storefront and checkout; others keep Shopify for the storefront and use this for order and inventory unification across channels. Scoped based on what you already have.",
      },
      {
        q: "How is COD reconciliation handled against marketplace payouts?",
        a: "COD collections and marketplace payout reports are reconciled against the order record, which is usually the specific manual task this replaces first.",
      },
    ],
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
    seoTitle: "Loan & Insurance Policy Management Software India",
    keywords: [
      "loan management software india",
      "insurance policy management software india",
      "renewal tracking software agents",
      "kyc document collection software",
    ],
    intro:
      "A lapsed renewal noticed by the client before the agent is a trust problem before it's a revenue problem. We build client and policy records with renewal dates that escalate ahead of the due date rather than after, KYC document collection with an audit trail that stands up to a compliance check, and commission reconciliation against actual payouts instead of a running estimate in a spreadsheet.",
    outcome:
      "Renewal escalation that reaches the client before the policy lapses, and commission reconciled against actual payout rather than estimated.",
    faqs: [
      {
        q: "Can this track renewal dates across multiple insurers and products?",
        a: "Yes — each policy record carries its own renewal date and product type regardless of insurer, with the escalation ladder applying uniformly across all of them.",
      },
      {
        q: "How is KYC data kept audit-ready?",
        a: "Document collection is logged with a timestamped audit trail per client, which is the specific thing a compliance review asks for and a shared drive folder doesn't provide.",
      },
      {
        q: "We have agents on commission working across a large client book. Can payout be reconciled per agent?",
        a: "Yes — commission and payout are reconciled against logged policies per agent, replacing a manual spreadsheet cross-check at payout time.",
      },
    ],
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
    seoTitle: "NGO Donor Management & Grant Reporting Software India",
    keywords: [
      "ngo donor management software",
      "80g receipt software india",
      "grant reporting software nonprofit",
      "beneficiary management software india",
    ],
    intro:
      "Compiling a quarterly grant report from scratch means the data was never actually captured as the work happened — it's reconstructed under deadline instead. We build donor records that generate an 80G receipt at the point of donation, a beneficiary registry tied to programme participation as it occurs, and a funder reporting pack that assembles from records already logged rather than a scramble the week a report is due.",
    outcome:
      "A grant report assembled from records already logged, and an 80G receipt generated the moment a donation is received.",
    faqs: [
      {
        q: "Can donors give directly through our website, not just offline?",
        a: "Yes — an online donation flow with a payment gateway and automatic 80G receipt generation is a standard part of the build.",
      },
      {
        q: "We report to multiple funders with different formats. Can one system serve all of them?",
        a: "Yes — the underlying records (beneficiaries, spend, milestones) are captured once; funder-specific reporting packs are templated views over the same data, not separate systems.",
      },
      {
        q: "Do you offer any pricing consideration for registered non-profits?",
        a: "Ask during discovery — pricing is quoted case by case for registered non-profits and depends on scope, but we're generally willing to discuss it honestly rather than quote the standard commercial rate by default.",
      },
    ],
  },
];
