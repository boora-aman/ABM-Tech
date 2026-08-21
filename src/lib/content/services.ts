/* ==========================================================================
   SERVICES — the whole catalogue, in one typed file.

   Deliberately no CMS: this content changes a few times a year, and a database
   round-trip to render a price list buys nothing. Editing this file and
   redeploying is the workflow.
   ========================================================================== */

export type Service = {
  slug: string;
  /** Two-digit index used across the UI as a structural label. */
  index: string;
  title: string;
  /** Short label for nav, cards and breadcrumbs. */
  short: string;
  /** One line. Feeds cards, meta description and Service schema. */
  summary: string;
  /** Opening paragraph on the service page. */
  intro: string;
  /** Price floor in INR. 0 = quote only. */
  from: number;
  /** How the price is expressed: one-off project or monthly retainer. */
  priceMode: "project" | "retainer" | "quote";
  /** Realistic delivery window. */
  timeline: string;
  /** Who it is for — the single most useful line on the card. */
  bestFor: string;
  /** What is delivered. Keep concrete and countable. */
  deliverables: string[];
  /** Deliberately excluded. Honesty converts better than a longer list. */
  excludes?: string[];
  /** Deeper capability blocks for the service page. */
  capabilities: { title: string; body: string }[];
  /** The build sequence. */
  phases: { step: string; detail: string; when: string }[];
  faqs: { q: string; a: string }[];
  /** Search terms this page should own. */
  keywords: string[];
  /** For the X-ray showcase: what sits under the interface. */
  stack: string[];
  featured?: boolean;
};

export const services: Service[] = [
  /* ------------------------------------------------------------------- 01 */
  {
    slug: "crm",
    index: "01",
    title: "Custom CRM",
    short: "CRM",
    from: 12000,
    priceMode: "project",
    timeline: "3–5 weeks",
    bestFor: "Sales teams running on spreadsheets and WhatsApp",
    featured: true,
    summary:
      "A CRM shaped around how your team actually sells — pipeline, follow-ups, quotations and ownership — instead of a generic tool you have to bend to fit.",
    intro:
      "Off-the-shelf CRM fails for the same reason every time: it enforces a sales process that is not yours, so your team keeps a private spreadsheet alongside it and the CRM slowly becomes a place where data goes to die. We build the pipeline you already run, with the fields you actually fill in, and nothing you do not need.",
    deliverables: [
      "Lead capture from website forms, calls and imported lists",
      "Custom pipeline stages with per-stage required fields",
      "Assignment rules and clear record ownership",
      "Follow-up scheduling with overdue escalation",
      "Quotation builder with your rate card and PDF output",
      "Activity timeline — every call, note and status change attributed",
      "Role-based access: rep, manager, admin",
      "Dashboards: funnel, conversion by source, rep performance",
      "WhatsApp and email templates fired from stage changes",
      "CSV export of everything, always",
    ],
    excludes: ["Call recording hardware", "Paid ad management", "Cold-lead data"],
    capabilities: [
      {
        title: "Your pipeline, not a template's",
        body: "We map the stages your team names out loud, including the awkward ones — 'site visit pending', 'waiting on their accountant'. Required fields are enforced per stage, so a deal cannot advance without the information the next stage depends on.",
      },
      {
        title: "Follow-ups that escalate",
        body: "Every open lead carries a next action and a date. Miss it and it surfaces on the manager's board, not just the rep's. That single mechanic is the difference between a CRM and a list.",
      },
      {
        title: "Attribution you can act on",
        body: "Which source produced revenue, not just enquiries. Which rep discounts hardest. Where deals stall by stage. Reports built from the three questions you would actually ask on a Monday.",
      },
      {
        title: "Nothing locked in",
        body: "Full CSV export of every table, an API for anything downstream, and the code in your Git organisation. If you outgrow us, you leave with the whole thing.",
      },
    ],
    phases: [
      {
        step: "Process mapping",
        detail:
          "Two sessions to write down your real stages, roles and required fields — plus the reports you will look at weekly. Output is a fixed scope.",
        when: "Week 1",
      },
      {
        step: "Core build",
        detail:
          "Data model, pipeline, permissions and lead capture, deployed to a preview URL you can open and click through.",
        when: "Week 2–3",
      },
      {
        step: "Automation & reporting",
        detail: "Follow-up rules, templates, quotation output and dashboards.",
        when: "Week 4",
      },
      {
        step: "Migration & training",
        detail:
          "Your existing leads imported and reconciled, then a session with the team who has to use it every day.",
        when: "Week 5",
      },
    ],
    faqs: [
      {
        q: "How is this better than Zoho or HubSpot at ₹12,000?",
        a: "It is not broader — it is narrower on purpose. Zoho does a hundred things adequately and charges per user per month forever. This does the twelve things your team does, exactly the way they do them, as a one-off build you own. If you need marketing automation, sequences and a partner ecosystem, buy Zoho; we will tell you so.",
      },
      {
        q: "What does ₹12,000 actually include?",
        a: "The core build: data model, custom pipeline, lead capture, assignment, follow-ups, role-based access and the standard dashboards, for a single team. Quotation builder, WhatsApp automation, multi-branch and heavy integrations are scoped on top — and quoted before anything starts.",
      },
      {
        q: "Can it import our existing spreadsheet?",
        a: "Yes, and migration is part of the rollout rather than an add-on. We map your columns, import, and reconcile the count against your sheet before go-live so the opening data is trustworthy.",
      },
      {
        q: "Who hosts it?",
        a: "Your cloud account, handed over with credentials and a runbook — or we manage hosting on a small monthly retainer. Either way the deployment and the data are yours.",
      },
    ],
    keywords: [
      "custom crm development india",
      "affordable crm for small business india",
      "crm software development company",
      "sales pipeline software india",
      "crm with quotation builder",
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Auth.js", "REST API", "Recharts"],
  },

  /* ------------------------------------------------------------------- 02 */
  {
    slug: "business-website",
    index: "02",
    title: "Static Business Website",
    short: "Static Site",
    from: 6000,
    priceMode: "project",
    timeline: "5–8 days",
    bestFor: "Businesses that need to look credible and be findable, fast",
    summary:
      "A fast, properly built marketing site — real design, real technical SEO, real performance. Not a page builder, not a template with your logo dropped in.",
    intro:
      "Most small-business websites fail on two counts: they take five seconds to load on a mid-range Android, and they are invisible in search because nobody did the technical work. This is the fix — hand-built pages, complete structured data, and a Lighthouse score that holds up on a real phone on real mobile data.",
    deliverables: [
      "Up to 6 pages, designed for your business (no template)",
      "Fully responsive, tested from 320px upward",
      "Complete technical SEO: metadata, sitemap, robots, canonical",
      "Structured data: Organization, LocalBusiness, Service, FAQ",
      "Open Graph and social share cards",
      "Contact form with email + WhatsApp notification",
      "Google Analytics and Search Console wired up",
      "90+ Lighthouse on mobile",
      "Deployed on your domain with SSL",
    ],
    excludes: ["Admin panel or CMS", "User accounts", "Payments", "Blog"],
    capabilities: [
      {
        title: "Performance as a requirement",
        body: "Server-rendered, images optimised at build, fonts subset, no render-blocking scripts. Measured on a mid-range device over throttled mobile data, because that is what your customers are holding.",
      },
      {
        title: "The SEO nobody else does",
        body: "Structured data as one connected graph, a real sitemap, correct canonicals, and an llms.txt so AI search can read you. This is the difference between a site that exists and a site that gets found.",
      },
      {
        title: "Content you can hand over",
        body: "Copy structured around what your customers actually search for, with the phone number and address consistent across every page and your Google Business Profile.",
      },
    ],
    phases: [
      { step: "Brief & content", detail: "One call, then we write the page structure and collect your assets.", when: "Day 1–2" },
      { step: "Design & build", detail: "Pages built and deployed to a preview link you review.", when: "Day 3–6" },
      { step: "Launch", detail: "Domain, SSL, analytics, Search Console, sitemap submitted.", when: "Day 7–8" },
    ],
    faqs: [
      {
        q: "Why ₹6,000–8,000 rather than a flat price?",
        a: "Page count and whether you have copy and photos ready. Four pages with content supplied is ₹6,000; six pages where we structure the copy and source imagery is ₹8,000. You get the exact figure before anything starts.",
      },
      {
        q: "Can I edit it myself afterwards?",
        a: "Not on this tier — content lives in code, which is what keeps it fast and cheap. If you want to edit pages yourself, that is the dynamic tier with an admin panel at ₹15,000.",
      },
      {
        q: "Is hosting included?",
        a: "Deployment is included and it runs on a free tier that comfortably handles a business site. You pay only for your domain, around ₹900 a year.",
      },
    ],
    keywords: [
      "business website design india",
      "cheap website design india price",
      "static website development",
      "fast seo optimized website india",
      "small business website 6000",
    ],
    stack: ["Next.js", "Tailwind", "Schema.org JSON-LD", "Vercel", "Resend"],
  },

  /* ------------------------------------------------------------------- 03 */
  {
    slug: "dynamic-website",
    index: "03",
    title: "Dynamic Website + Admin Panel",
    short: "Dynamic Site",
    from: 15000,
    priceMode: "project",
    timeline: "2–3 weeks",
    bestFor: "Businesses that need to update the site without calling a developer",
    featured: true,
    summary:
      "Everything in the static build, plus a real admin panel — edit pages, publish posts, manage products, services and enquiries yourself.",
    intro:
      "The moment you need to change a price, add a product or publish an update, a static site becomes a support ticket. This tier puts you in control: an admin panel built around the things you actually change, with a database behind it and no monthly platform fee.",
    deliverables: [
      "Everything in the static tier",
      "Admin panel with secure login and roles",
      "Editable pages, services, products and gallery",
      "Blog or updates section with drafts and scheduling",
      "Enquiry inbox with status tracking, plus email notification",
      "Image upload with automatic optimisation",
      "Testimonials and FAQ management",
      "SEO fields per page — title, description, OG image",
      "Database on your account, with automated backups",
    ],
    excludes: ["Payments / checkout", "Customer accounts", "Mobile app"],
    capabilities: [
      {
        title: "An admin built for your nouns",
        body: "Not a generic CMS with 'Posts' and 'Pages'. If your business has Branches, Menus, Batches or Routes, those are the things in the sidebar — which is why people actually use it instead of asking you to make the change.",
      },
      {
        title: "Draft, preview, publish",
        body: "Nothing goes live by accident. Every item has a published state, and unpublished content is never exposed on the public site or in the sitemap.",
      },
      {
        title: "Enquiries in one place",
        body: "Form submissions land in the panel with a status you can move — new, contacted, won, lost — plus email notification. No more digging through an inbox.",
      },
    ],
    phases: [
      { step: "Scope & model", detail: "We define the entities your admin manages and the fields each one needs.", when: "Week 1" },
      { step: "Build", detail: "Public site and admin panel built together against real data, on a preview URL.", when: "Week 1–2" },
      { step: "Handover", detail: "Your admin account, a walkthrough recording, and a one-page guide.", when: "Week 3" },
    ],
    faqs: [
      {
        q: "Why not just use WordPress?",
        a: "You can, and for a pure blog it is a reasonable choice. The trade is maintenance: plugin updates, security patches, and a performance floor that is hard to beat. This is faster, has no plugin surface to exploit, and the admin only contains fields that apply to your business — but it does need a developer for structural changes, and we say so upfront.",
      },
      {
        q: "What are the running costs?",
        a: "A domain (~₹900/year) and a database. The free MongoDB Atlas tier handles a business site comfortably; a paid tier starts around ₹700/month if you outgrow it. No licence fees, no per-seat charges.",
      },
      {
        q: "Can I add more sections later?",
        a: "Yes. New entity types are quoted as small change requests, usually a day or two each. The architecture is designed for it.",
      },
    ],
    keywords: [
      "dynamic website with admin panel india",
      "website with cms development india",
      "custom cms website price india",
      "business website admin panel 15000",
    ],
    stack: ["Next.js", "MongoDB", "Auth.js", "Zod", "Blob storage", "ISR"],
  },

  /* ------------------------------------------------------------------- 04 */
  {
    slug: "erp-system",
    index: "04",
    title: "ERP System",
    short: "ERP",
    from: 15000,
    priceMode: "project",
    timeline: "4–8 weeks",
    bestFor: "Operations running on registers, Excel and memory",
    featured: true,
    summary:
      "Inventory, purchasing, billing and reporting in one system, modelled on how your operation actually works — including the parts generic ERP quietly ignores.",
    intro:
      "Generic ERP fails at the specifics. A pharmacy needs the same SKU tracked across three batches at three expiry dates. A fuel station reconciles per shift, per nozzle, per attendant. A distributor needs credit limits enforced at the point of sale, not reviewed monthly. Those specifics are the entire job, and they are what we build around.",
    deliverables: [
      "Inventory with the granularity your stock actually has (batch, serial, variant)",
      "Purchase orders with goods receipt and supplier reconciliation",
      "GST-compliant billing with HSN, credit notes and GSTR exports",
      "Multi-user roles with an approval chain where you need one",
      "Stock alerts: low stock, expiry, dead stock, reorder suggestions",
      "Customer and supplier ledgers with outstanding ageing",
      "Reports built from what you ask for each morning",
      "Print formats matching the documents you already issue",
      "Complete audit trail — every change attributed and timestamped",
      "Data migration from Excel or your existing software",
    ],
    excludes: ["Accounting/Tally replacement", "Payroll", "Hardware supply"],
    capabilities: [
      {
        title: "Modelled on your constraints",
        body: "Batch-level stock with per-batch expiry and MRP. FEFO issue order. Shift-close reconciliation. Credit limits enforced at billing. Whichever of these applies to you is the reason the system gets used instead of abandoned.",
      },
      {
        title: "Migration is the job",
        body: "We import your existing stock, ledgers and outstanding balances and reconcile against a physical count before go-live. This is the step other vendors skip, and it is why their rollouts fail in week three.",
      },
      {
        title: "Print formats that match",
        body: "Your invoice, your letterhead, your terms on the reverse, your copy count. Staff and customers judge an ERP by its paperwork, so the output has to be right on day one.",
      },
      {
        title: "Auditable by default",
        body: "Every state change carries who and when. When someone asks why stock does not match, the answer is a query rather than an argument.",
      },
    ],
    phases: [
      { step: "Operations study", detail: "We sit with your team for two days and map how the business actually runs, not how the org chart says it does.", when: "Week 1" },
      { step: "Core modules", detail: "Inventory, purchasing and billing built first — the spine everything else hangs off.", when: "Week 2–4" },
      { step: "Reports & print", detail: "Your reports and document formats, reviewed against real data.", when: "Week 5–6" },
      { step: "Migrate, train, go live", detail: "Stock imported and reconciled, staff trained at the counter, then cutover with a rollback plan.", when: "Week 7–8" },
    ],
    faqs: [
      {
        q: "₹15,000 for an ERP sounds too low. What's the catch?",
        a: "No catch, but be clear on scope: ₹15,000 is a single-location system with inventory, billing and reporting for one business type. Multi-branch, manufacturing BOMs, approval hierarchies and heavy integrations push it to ₹40,000–1,50,000. We quote the real number after the operations study, and the study tells you which tier you are in before you commit.",
      },
      {
        q: "Do you build on ERPNext or from scratch?",
        a: "Whichever actually fits. If your process is recognisably standard accounting, inventory and purchasing, ERPNext gives you years of edge-case handling for free and we customise it. If the core workflow is unusual, custom is faster and cleaner. We give a straight recommendation even when it means a smaller project.",
      },
      {
        q: "Will it work offline?",
        a: "Billing can, with transactions queued locally and synced when the connection returns. Multi-branch views and reporting need connectivity. For sites with genuinely unreliable power and internet we deploy on-premise with cloud backup instead.",
      },
      {
        q: "Does it replace Tally?",
        a: "No, and we would not recommend it did. This runs operations; Tally runs your books. We export in the formats your accountant expects so the two stay in sync without double entry.",
      },
    ],
    keywords: [
      "erp software development india price",
      "custom erp for small business india",
      "inventory billing software development",
      "erpnext customization company india",
      "gst billing erp system",
    ],
    stack: ["Next.js / Frappe", "PostgreSQL / MariaDB", "Redis", "Jinja print", "REST"],
  },

  /* ------------------------------------------------------------------- 05 */
  {
    slug: "billing-platform-app",
    index: "05",
    title: "Website + Billing Web App + Mobile App",
    short: "Full Platform",
    from: 20000,
    priceMode: "project",
    timeline: "6–10 weeks",
    bestFor: "Businesses that need to sell, bill and be used on a phone",
    summary:
      "The full stack: public website, billing and operations web app, and a mobile app for staff or customers — one system, one login, one source of truth.",
    intro:
      "This is the tier where the software becomes the business. A site that brings enquiries, a web app where your team bills and manages them, and a mobile app for the people who are not at a desk — drivers, technicians, field staff, or your customers. Built as one system so nothing has to be re-entered anywhere.",
    deliverables: [
      "Public marketing website with admin-managed content",
      "Billing web app: invoices, payments, receipts, GST",
      "Customer or staff mobile app (Android + iOS)",
      "Single sign-on across web and mobile",
      "Payment gateway integration with reconciliation",
      "Push notifications and WhatsApp Business API messaging",
      "Offline-capable mobile flows that sync when back online",
      "Role-based permissions across every surface",
      "Owner dashboard: revenue, outstanding, activity",
      "App store submission handled",
    ],
    excludes: ["App store developer fees", "Ongoing ad spend", "Content writing"],
    capabilities: [
      {
        title: "One system, three surfaces",
        body: "The same data model powers the website, the billing app and the mobile app. A price changed once is changed everywhere — which is the entire argument for building them together rather than buying three tools that need reconciling.",
      },
      {
        title: "Billing that reconciles",
        body: "GST-correct invoices, credit notes, part-payments, and a payment gateway wired with idempotency and retries so a provider outage cannot double-charge or lose a transaction.",
      },
      {
        title: "Built for patchy networks",
        body: "The mobile app works in a basement, a warehouse or a village with one bar. Actions queue locally and sync when signal returns — because 'requires internet' is not a feature your field staff can work around.",
      },
      {
        title: "Handover assumes we might leave",
        body: "Documented environment variables, a seed script, a deployment runbook and a recorded walkthrough. Code in your Git organisation, apps under your store accounts.",
      },
    ],
    phases: [
      { step: "Discovery", detail: "Data model, role matrix, and the states a record moves through. Fixed scope and price out.", when: "Week 1" },
      { step: "Web app core", detail: "Billing, records and admin built first — the mobile app consumes the same API.", when: "Week 2–5" },
      { step: "Mobile app", detail: "Built against the live API, with offline queueing and push.", when: "Week 5–8" },
      { step: "Harden & ship", detail: "Load testing, security pass, store submission, staff training, launch with monitoring.", when: "Week 9–10" },
    ],
    faqs: [
      {
        q: "Is ₹20,000 realistic for a website, web app and mobile app?",
        a: "It is the floor, and it buys a focused single-role app on a well-defined billing flow. Realistically most platforms at this scope land between ₹45,000 and ₹1,50,000 once you count the number of user roles, the integrations and the app store work. We publish ₹20,000 as the entry point because some genuinely fit it — and we tell you within the first call if yours does not.",
      },
      {
        q: "Native or cross-platform for the app?",
        a: "React Native, so Android and iOS share one codebase and your business logic is not written twice. If a feature genuinely needs native modules we write those natively and keep the rest shared.",
      },
      {
        q: "Which payment gateway?",
        a: "Razorpay by default for India — best UPI coverage and the cleanest reconciliation API. Cashfree, PhonePe and Stripe are all supported if you have a reason to prefer one.",
      },
    ],
    keywords: [
      "billing software with mobile app india",
      "web app and mobile app development price india",
      "custom billing platform development",
      "react native app development india price",
    ],
    stack: ["Next.js", "React Native", "PostgreSQL", "Razorpay", "WhatsApp API", "Expo"],
  },

  /* ------------------------------------------------------------------- 06 */
  {
    slug: "ai-automation",
    index: "06",
    title: "AI Automation",
    short: "AI Automation",
    from: 15000,
    priceMode: "project",
    timeline: "2–4 weeks",
    bestFor: "Teams losing hours a day to copying data between things",
    featured: true,
    summary:
      "Automation aimed at the specific manual work costing you hours — document extraction, enquiry triage, WhatsApp responders, report generation — not a chatbot bolted onto your homepage.",
    intro:
      "Most 'AI for business' is a chatbot nobody asked for. The work worth automating is duller and far more valuable: someone retyping invoice figures into Excel, someone triaging the same forty enquiries every morning, someone assembling the same report every Monday. We find those, measure the hours, and remove them.",
    deliverables: [
      "Automation audit: the tasks, hours and rupee cost of each",
      "Document extraction — invoices, POs, forms to structured data",
      "Enquiry triage and routing with intent classification",
      "WhatsApp and email auto-responders with human handoff",
      "Scheduled report generation and distribution",
      "Data entry pipelines between systems that do not talk",
      "Human-in-the-loop review for anything financial or legal",
      "Accuracy monitoring with an alert when it drifts",
      "Fallback path for every automation, so failure is graceful",
    ],
    excludes: ["Model training from scratch", "Ongoing LLM API costs (billed at cost)"],
    capabilities: [
      {
        title: "We measure before we automate",
        body: "The audit puts hours and a rupee figure against each manual task. Usually two or three are worth automating and the rest are not — and saying so is more useful than automating everything badly.",
      },
      {
        title: "Human-in-the-loop where it matters",
        body: "Anything touching money, contracts or a customer's record goes to a person for one-click approval. Full autonomy is reserved for work where being wrong is cheap.",
      },
      {
        title: "Accuracy is monitored, not assumed",
        body: "Extraction confidence is logged and low-confidence items are routed for review. If accuracy drifts, you get an alert — not a quarter of quietly corrupted data.",
      },
      {
        title: "Every automation has a fallback",
        body: "When the model is unsure or the API is down, the task lands in a human queue instead of failing silently. Automation that breaks invisibly is worse than no automation.",
      },
    ],
    phases: [
      { step: "Automation audit", detail: "We shadow the work, list every repetitive task, and put hours and cost against each. You keep the document either way.", when: "Week 1" },
      { step: "Build the top two", detail: "The highest-return automations, built with review queues and monitoring.", when: "Week 2–3" },
      { step: "Measure & extend", detail: "Compare real hours saved against the audit, then decide what is next.", when: "Week 4" },
    ],
    faqs: [
      {
        q: "What's the most common thing you automate?",
        a: "Document to spreadsheet. Someone opens a PDF invoice or purchase order and retypes the figures into Excel, dozens of times a week. It is high-volume, well-defined, and extraction handles it with a review step for anything low-confidence.",
      },
      {
        q: "Will AI make mistakes on our data?",
        a: "Yes, sometimes — which is why nothing financial runs unattended. Low-confidence extractions go to a review queue, accuracy is logged, and you get an alert if it drops. Any vendor claiming zero error rate is either not measuring or not telling you.",
      },
      {
        q: "Do we pay for the AI usage?",
        a: "The API cost is billed at actuals with no markup, and it is usually small — a few hundred rupees a month for typical document volumes. We tell you the expected figure during the audit.",
      },
      {
        q: "Can you automate our WhatsApp enquiries?",
        a: "Yes, on the official WhatsApp Business API — never an unofficial automation library, which gets numbers banned. The responder handles common questions and hands off to a person the moment it is unsure or the customer asks.",
      },
    ],
    keywords: [
      "ai automation for business india",
      "document data extraction automation india",
      "whatsapp business api automation",
      "business process automation company india",
      "ai integration services india",
    ],
    stack: ["Next.js", "Vercel AI SDK", "Queues", "Vision OCR", "WhatsApp API", "Cron"],
  },

  /* ------------------------------------------------------------------- 07 */
  {
    slug: "business-digitisation",
    index: "07",
    title: "Business Digitisation",
    short: "Digitisation",
    from: 0,
    priceMode: "quote",
    timeline: "Scoped after audit",
    bestFor: "Businesses still running on registers, files and memory",
    summary:
      "The full move from paper to systems — a staged plan, executed in the order that pays for itself fastest, without stopping the business while it happens.",
    intro:
      "Digitisation fails when it is attempted all at once. Six months of work, staff who never adopted it, and a register still open on the counter. We stage it instead: find the one process where paper costs the most, replace that, prove the saving, then move to the next. The business keeps running throughout.",
    deliverables: [
      "Current-state audit of every manual process",
      "A staged roadmap ordered by return, not by convenience",
      "Digitisation of historical records where it is worth doing",
      "Systems replacing paper, one process at a time",
      "Staff training per stage, at their workstation",
      "Parallel running until each stage is trusted",
      "Access control and backups from day one",
      "Written runbook per process, in plain language",
    ],
    capabilities: [
      {
        title: "Staged, never big-bang",
        body: "One process at a time, each proving its own saving before the next starts. You can stop after any stage and still be better off than when you began.",
      },
      {
        title: "Adoption is the real deliverable",
        body: "Software nobody uses is a cost. Training happens at the counter, in the person's own workflow, and each stage runs in parallel with the paper process until the team stops reaching for the register on their own.",
      },
      {
        title: "The register stays until it is redundant",
        body: "We never remove the fallback before the replacement has earned trust. That is what makes staff willing to try the new thing.",
      },
    ],
    phases: [
      { step: "Audit", detail: "Every manual process listed, with time cost and error rate.", when: "Week 1–2" },
      { step: "Roadmap", detail: "Stages ordered by payback, each with a fixed price you approve individually.", when: "Week 2" },
      { step: "Execute in stages", detail: "Build, parallel run, train, adopt. Repeat.", when: "Ongoing" },
    ],
    faqs: [
      {
        q: "Why is this quote-only?",
        a: "Because the honest answer depends entirely on what we find. A single-counter business might need one ₹15,000 system; a three-location operation with fifteen years of paper records is a different project. The audit produces a staged plan with a fixed price per stage, and you approve them one at a time.",
      },
      {
        q: "Our staff aren't comfortable with computers.",
        a: "That is the normal starting point and it shapes the design: large touch targets, minimal typing, Hindi labels where they help, and no feature a counter person does not need. The training happens at their workstation, not in a classroom.",
      },
      {
        q: "Do we have to digitise old records?",
        a: "Usually only the ones you still refer to — outstanding balances, active customers, current stock. Digitising a decade of closed transactions is a cost with no return, and we will say so rather than bill for it.",
      },
    ],
    keywords: [
      "business digitization services india",
      "paper to digital business india",
      "digital transformation small business india",
      "computerize your business india",
    ],
    stack: ["Process audit", "Next.js", "MongoDB", "Offline-first", "Training"],
  },

  /* ------------------------------------------------------------------- 08 */
  {
    slug: "maps-and-seo",
    index: "08",
    title: "Google Maps Profile & SEO",
    short: "Maps & SEO",
    from: 5000,
    priceMode: "retainer",
    timeline: "Movement in 30–60 days",
    bestFor: "Local businesses invisible in search and on the map",
    summary:
      "Google Business Profile optimisation and technical SEO — categories, citations, reviews and the site-side signals that decide whether you appear in local results.",
    intro:
      "Almost every local business has a Google Business Profile and almost none of them rank. The difference is rarely the listing itself: it is category selection, review velocity, citation consistency and whether your website supports the profile with matching structured data. We handle those as one system.",
    deliverables: [
      "Profile claim or creation, with verification handled",
      "Primary and secondary category research against ranking competitors",
      "Name, address, phone consistency across major Indian directories",
      "Keyword-mapped business description, services and products",
      "Photo optimisation and a posting calendar",
      "Review request system — QR, WhatsApp template, SMS",
      "Review responses written for every review",
      "LocalBusiness and Service schema on your website",
      "Technical SEO fixes: speed, crawlability, canonicals, sitemap",
      "Monthly report on position, calls and direction requests",
    ],
    excludes: ["Paid ads", "Bought backlinks", "Guaranteed rankings"],
    capabilities: [
      {
        title: "Category engineering",
        body: "Primary category is the highest-leverage field on the whole profile and most businesses pick the obvious wrong one. We reverse-engineer what the businesses currently ranking for your keywords actually use.",
      },
      {
        title: "Review velocity as a system",
        body: "A steady arrival of reviews beats a large stale count. We install the asking mechanism — counter QR, one-tap WhatsApp template, post-service SMS — rather than reminding you to ask.",
      },
      {
        title: "Site and profile in agreement",
        body: "Your website's structured data mirrors the profile exactly. Conflicting details across directories do not merely fail to help; they actively suppress the listing.",
      },
      {
        title: "No ranking guarantees, ever",
        body: "Maps results are personalised by the searcher's distance from you, so there is no single 'position one' to promise. We report measured movement instead, and anyone guaranteeing a position does not understand the product.",
      },
    ],
    phases: [
      { step: "Audit & baseline", detail: "Current profile state, citation audit, and the competitors holding your target results. You get the baseline before any changes.", when: "Week 1" },
      { step: "Foundation fixes", detail: "Categories, attributes, services, description and the citation correction pass. Most movement originates here.", when: "Week 1–2" },
      { step: "Content & reviews", detail: "Photos, posts, Q&A seeding, and the review system handed to your staff.", when: "Week 3" },
      { step: "Compound & report", detail: "Ongoing posting, review responses and monthly reporting against the baseline.", when: "Monthly" },
    ],
    faqs: [
      {
        q: "How long until we rank?",
        a: "Foundation fixes usually show movement in 30 to 60 days. Competitive urban categories need three to six months of sustained review velocity and content. Anyone quoting a fixed date is guessing.",
      },
      {
        q: "Can you guarantee number one?",
        a: "No, and nobody honestly can — Maps rankings are personalised by how far the searcher is from your premises, so there is no single position to hold. What we guarantee is a measured baseline and a monthly report showing exactly what moved.",
      },
      {
        q: "Do you buy reviews or backlinks?",
        a: "No. Bought reviews are the fastest route to a suspended profile and bought links take the domain down with them eventually. Both are a bad trade on a business you intend to keep.",
      },
    ],
    keywords: [
      "google business profile optimization india",
      "local seo services india price",
      "google maps ranking service",
      "gmb optimization company india",
      "technical seo services india",
    ],
    stack: ["GBP API", "Search Console", "Schema.org", "Rank tracking", "PageSpeed"],
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

export const featuredServices = () => services.filter((s) => s.featured);
