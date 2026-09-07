/* ==========================================================================
   COMPARE — the search Indian SMBs actually run.

   Nobody compares us against another software studio. They compare custom
   against the licence they already pay for — Tally, Zoho, ERPNext, WordPress,
   Shopify. That is the highest-intent, least-served search in this market
   (see docs/seo/COMPETITOR-ANALYSIS.md), and it only works if every page is
   honest about when the incumbent is the right answer. A page that concludes
   "buy custom" in every case reads as an ad and Google treats it as one.
   ========================================================================== */

export type Comparison = {
  slug: string;
  index: string;
  /** e.g. "Custom CRM vs Zoho" — brand-voice H1. */
  title: string;
  /** Search-voice <title>. */
  seoTitle: string;
  short: string;
  incumbent: string;
  summary: string;
  keywords: string[];
  intro: string;
  rows: { dimension: string; incumbent: string; custom: string }[];
  whenIncumbentWins: string;
  whenCustomWins: string;
  faqs: { q: string; a: string }[];
  serviceSlug: string;
};

export const comparisons: Comparison[] = [
  {
    slug: "custom-crm-vs-zoho",
    index: "01",
    title: "Custom CRM vs Zoho",
    seoTitle: "Zoho CRM Alternative — Custom CRM for Indian Businesses",
    short: "vs Zoho",
    incumbent: "Zoho CRM",
    summary:
      "Zoho charges per seat, forever, for a hundred features you'll use twelve of. A custom CRM builds those twelve exactly the way your team already sells them, as a one-off you own.",
    keywords: [
      "zoho crm alternative india",
      "custom crm vs zoho",
      "zoho crm too expensive alternative",
    ],
    intro:
      "Zoho CRM is a genuinely capable product, and the reason people leave it is rarely a missing feature — it's that the pipeline stages, the required fields and the approval rules are Zoho's idea of a sales process, bent as far as the configuration screens allow. A custom CRM starts from your actual stages instead, and the licence stops compounding per seat, per month, forever.",
    rows: [
      { dimension: "Pricing model", incumbent: "Per user, per month, indefinitely", custom: "One fixed price, owned outright" },
      { dimension: "Pipeline stages", incumbent: "Configured within Zoho's data model", custom: "Modelled on your actual stages, including the awkward ones" },
      { dimension: "3-year cost at 10 users", incumbent: "₹1.5–4L+ depending on tier, and rising", custom: "₹12,000 build, no recurring licence" },
      { dimension: "Breadth", incumbent: "Marketing automation, sequences, a large ecosystem", custom: "Exactly what your team uses, nothing else" },
      { dimension: "Data ownership", incumbent: "Lives in Zoho's cloud, exportable but not yours", custom: "Your database, your Git organisation, from day one" },
      { dimension: "Time to first use", incumbent: "Days, with configuration overhead", custom: "3–5 weeks, built to your process from the start" },
    ],
    whenIncumbentWins:
      "If you genuinely need marketing automation sequences, a large app marketplace, or a sales process that is close enough to Zoho's assumptions that configuration (not a rebuild) fixes it — buy Zoho. Ten users on the entry tier, properly configured, is cheaper and faster than any custom build for the first year, and the breadth is real if you'll use it.",
    whenCustomWins:
      "If your team already keeps a private spreadsheet next to Zoho because it won't record something they actually need, or you're paying for twelve users when four modules get used, the maths flips: a one-off build at a fraction of the multi-year licence cost, matching your real process instead of the closest configurable approximation.",
    faqs: [
      {
        q: "Can you migrate our existing Zoho data?",
        a: "Yes — Zoho exports to CSV, and migration is part of the rollout: columns mapped, imported, and reconciled against your existing count before go-live, not an afterthought.",
      },
      {
        q: "What do we lose by leaving Zoho?",
        a: "Its app marketplace and any Zoho-ecosystem integrations (Zoho Books, Zoho Campaigns) you rely on. If those matter to you, that's a real reason to stay — we'll say so on the first call rather than talk you out of it.",
      },
      {
        q: "Is a custom CRM actually cheaper over time, or is that just at the start?",
        a: "It depends on your seat count and how long you keep it. At 10 users over 3 years, Zoho's professional tier typically runs well past ₹1.5 lakh; a ₹12,000 one-off build with no recurring licence is cheaper for as long as you use it, with no per-seat penalty for growing the team.",
      },
    ],
    serviceSlug: "crm",
  },
  {
    slug: "custom-erp-vs-tally",
    index: "02",
    title: "Custom ERP vs Tally",
    seoTitle: "Tally Alternative for Manufacturing & Retail — Custom ERP India",
    short: "vs Tally",
    incumbent: "Tally",
    summary:
      "Tally is real accounting software, not an operations system. The gap shows up the moment you need batch-level stock, job cards or multi-branch approvals — and most businesses hit it eventually.",
    keywords: [
      "tally alternative for manufacturing",
      "tally vs custom erp",
      "tally limitations inventory",
    ],
    intro:
      "Tally does one job extremely well — statutory-compliant accounting — and was never built to be an operations system. The businesses that outgrow it aren't doing anything unusual: batch-level pharmacy stock, multi-level manufacturing bills of materials, and branch-wise approval hierarchies are all common needs Tally simply doesn't model, which is why they end up in a parallel spreadsheet the accountant never sees.",
    rows: [
      { dimension: "Core strength", incumbent: "GST-compliant accounting and statutory filing", custom: "Operations modelled on your actual process" },
      { dimension: "Batch/expiry tracking", incumbent: "Not natively supported", custom: "Batch-level, FEFO dispensing, supplier-grouped alerts" },
      { dimension: "Multi-level BOM", incumbent: "Limited", custom: "Multi-level assemblies with actual costing" },
      { dimension: "Multi-branch approvals", incumbent: "Manual reconciliation across company files", custom: "Role and branch hierarchies enforced by the system" },
      { dimension: "Statutory filing", incumbent: "Best-in-class, actively maintained by Tally Solutions", custom: "Not attempted — kept on Tally, integrated alongside" },
      { dimension: "Cost", incumbent: "₹18,000–₹90,000+ licence tiers, per location", custom: "From ₹15,000 one-off for the operations layer" },
    ],
    whenIncumbentWins:
      "For statutory accounting and GST filing, Tally is the right tool and we would never propose replacing it — it's actively maintained by a company whose entire business is staying current with tax law, which a custom build should not try to compete with.",
    whenCustomWins:
      "For the operational layer above accounting — batch inventory, job cards, multi-branch stock, approval chains — a custom build fills exactly the gap Tally leaves, and it's built to sit alongside Tally, posting summarised entries across so your accountant's workflow doesn't change.",
    faqs: [
      {
        q: "Are you replacing our Tally installation?",
        a: "No — in nearly every engagement Tally stays the accounting book of record. We build the operational system above it and keep the two reconciled, rather than proposing a wholesale replacement of software that's doing its job correctly.",
      },
      {
        q: "How does data move between the two systems?",
        a: "Summarised ledger entries post across on a schedule — daily or per shift, depending on volume — so your accountant sees consolidated figures without re-entering operational detail by hand.",
      },
      {
        q: "We only have one location and simple stock. Do we need this at all?",
        a: "Possibly not yet. If Tally alone is keeping your books straight and stock discrepancies are rare, the honest answer is to wait until the gap actually costs you something measurable.",
      },
    ],
    serviceSlug: "erp-system",
  },
  {
    slug: "custom-erp-vs-erpnext",
    index: "03",
    title: "Custom ERP vs ERPNext",
    seoTitle: "ERPNext vs Custom ERP — Which Fits Your Business",
    short: "vs ERPNext",
    incumbent: "ERPNext",
    summary:
      "ERPNext is free, open-source and genuinely powerful. The real cost is configuring and maintaining it against your specific process — which is where most ERPNext rollouts actually stall.",
    keywords: [
      "erpnext vs custom erp",
      "erpnext hidden costs",
      "erpnext implementation india",
    ],
    intro:
      "ERPNext has no licence fee, which makes the comparison look one-sided until the implementation starts. It is a genuinely capable, actively developed open-source ERP — the honest question isn't whether ERPNext is good, it's whether your process fits its Frappe-based data model closely enough that configuration gets you there, or whether you'll spend more customising ERPNext into a shape it wasn't built for than building the shape directly.",
    rows: [
      { dimension: "Licence cost", incumbent: "Free (self-hosted) or paid cloud tier", custom: "One fixed project price" },
      { dimension: "Implementation cost", incumbent: "Consultant-dependent, frequently the larger real cost", custom: "Fixed against a written scope, quoted upfront" },
      { dimension: "Fit to unusual process", incumbent: "Customised via Frappe framework — real skill required", custom: "Built to the process directly, no framework constraint" },
      { dimension: "Ongoing maintenance", incumbent: "Version upgrades, your responsibility or a retainer", custom: "Support retainer, optional, from ₹4,000/month" },
      { dimension: "Community & modules", incumbent: "Large open-source ecosystem", custom: "Built and owned specifically for you" },
      { dimension: "Time to value", incumbent: "Weeks to months, implementation-dependent", custom: "4–8 weeks, scoped upfront" },
    ],
    whenIncumbentWins:
      "If your operation is close to standard manufacturing, distribution or services workflows and you have (or can hire) Frappe/ERPNext expertise in-house, ERPNext's zero licence cost and mature module set is hard to beat — especially at a scale where per-seat SaaS pricing would be expensive.",
    whenCustomWins:
      "If your process has genuine departures from ERPNext's model — a costing method, an approval chain, a document format the framework fights you on — a custom build removes the 'customise a general system' tax entirely and is often cheaper once real implementation hours are counted honestly.",
    faqs: [
      {
        q: "Is ERPNext really free, or is that misleading?",
        a: "The software licence is genuinely free if self-hosted. Implementation, customisation and hosting are not — and for a non-standard process, those costs are frequently the larger number, which is the part worth pricing out before deciding.",
      },
      {
        q: "Can you migrate data out of an existing ERPNext instance?",
        a: "Yes — ERPNext's data is accessible via its own APIs and database, and migration is scoped as part of the build the same way any other system migration is.",
      },
      {
        q: "Would you ever recommend ERPNext over building custom?",
        a: "Yes, regularly, if your process is standard enough that configuration — not a rebuild — gets you there. We'll say so on the first call if that's what we think fits, even though it means no project for us.",
      },
    ],
    serviceSlug: "erp-system",
  },
  {
    slug: "wordpress-vs-custom-website",
    index: "04",
    title: "WordPress vs Custom Website",
    seoTitle: "WordPress vs Custom Website — Which Is Right for Your Business",
    short: "vs WordPress",
    incumbent: "WordPress",
    summary:
      "WordPress is the fastest way to a website that looks fine. A custom build is the way to a website that's fast, secure and structured for search from the first commit — which matters more the longer you keep it.",
    keywords: [
      "wordpress vs custom website for business",
      "wordpress alternative for business website",
      "wordpress slow website fix",
    ],
    intro:
      "WordPress runs a large share of the web because it's genuinely quick to get something live — a theme, a page builder, a plugin for whatever feature you need next. The trade-off shows up over time: plugin-stacked sites accumulate load weight and security surface with every addition, and 'add a plugin' is rarely the fastest path once the site has fifteen of them fighting for the same page.",
    rows: [
      { dimension: "Time to first launch", incumbent: "Days, with a theme and page builder", custom: "5–8 days for a static build, similar order" },
      { dimension: "Ongoing plugin/security patching", incumbent: "Continuous, and easy to fall behind on", custom: "Included in an optional support retainer" },
      { dimension: "Page speed as plugins accumulate", incumbent: "Degrades — each plugin adds render weight", custom: "Stays constant — no plugin stack to accumulate" },
      { dimension: "Structured data / schema", incumbent: "Plugin-dependent, often incomplete", custom: "Built into every page as a connected graph" },
      { dimension: "Content editing", incumbent: "Familiar WP admin, large ecosystem", custom: "Custom admin panel built around your actual content" },
      { dimension: "Hosting cost", incumbent: "Shared or managed WP hosting", custom: "Static hosting, typically lower ongoing cost" },
    ],
    whenIncumbentWins:
      "If you need a large content team publishing constantly, rely on a specific WordPress plugin ecosystem (memberships, forums, a particular booking plugin), or the site is genuinely a side project rather than the business's primary storefront — WordPress's ecosystem and familiarity are real advantages worth keeping.",
    whenCustomWins:
      "If page speed is costing you rankings, a plugin update has broken the site before, or you want structured data and search visibility built in rather than bolted on via plugin — a custom build removes the entire plugin-security-patching cycle and starts faster by design, not by configuration.",
    faqs: [
      {
        q: "Can our existing content migrate from WordPress?",
        a: "Yes — WordPress exports content in a standard format, and migrating text, images and URLs (with redirects, so existing rankings aren't lost) is part of the build.",
      },
      {
        q: "Will we be able to edit the site ourselves without calling a developer?",
        a: "Yes, if you choose the dynamic build with an admin panel — it's designed around your actual content types, not a generic page builder, so editing is usually simpler than WordPress's admin for your specific content.",
      },
      {
        q: "Is WordPress actually less secure, or is that overstated?",
        a: "The platform itself is fine; the risk is almost entirely in an accumulating plugin stack, each one a potential vulnerability, on a site nobody is actively auditing. A lean custom build with fewer moving parts has a smaller attack surface by construction.",
      },
    ],
    serviceSlug: "dynamic-website",
  },
  {
    slug: "shopify-vs-custom-ecommerce",
    index: "05",
    title: "Shopify vs Custom E-commerce",
    seoTitle: "Shopify Alternative — Custom Ecommerce Store for India",
    short: "vs Shopify",
    incumbent: "Shopify",
    summary:
      "Shopify's transaction fees and app costs compound with volume. A custom store removes the per-order tax and unifies inventory across every channel you actually sell on, not just the storefront.",
    keywords: [
      "shopify alternative custom store india",
      "shopify vs custom ecommerce",
      "shopify transaction fees india",
    ],
    intro:
      "Shopify is a well-built, fast way to launch a store, and for a business just starting to sell online it's frequently the right first move. The economics change once volume is real: transaction fees on every order, app subscriptions stacking for features that should be standard, and — the part that actually costs D2C sellers the most — inventory that lives in Shopify while your marketplace and Instagram orders reconcile in a spreadsheet three people edit.",
    rows: [
      { dimension: "Launch speed", incumbent: "Fast — live in days on a theme", custom: "3–6 weeks, built to your catalogue" },
      { dimension: "Transaction fees", incumbent: "Per-order fee unless using Shopify Payments exclusively", custom: "None — you own the checkout" },
      { dimension: "App costs at scale", incumbent: "Multiple subscriptions for inventory, reviews, upsells", custom: "Built in, no recurring app fees" },
      { dimension: "Multi-channel inventory", incumbent: "Requires app-based syncing, often imperfect", custom: "One inventory count across web, marketplace and social, by design" },
      { dimension: "Storefront ownership", incumbent: "Rented — theme and platform lock-in", custom: "Owned outright, code in your Git organisation" },
      { dimension: "Best for", incumbent: "Fast launch, low-to-medium order volume", custom: "Established D2C sellers on multiple channels" },
    ],
    whenIncumbentWins:
      "If you're launching for the first time, order volume is modest, and you want to validate demand before investing in a custom build — Shopify is the right call, and we'd tell you so on the first call rather than propose a custom store you don't need yet.",
    whenCustomWins:
      "Once you're selling across your own site, a marketplace and Instagram DMs, and three people are reconciling stock on a shared sheet, the per-order fee and app-subscription stack usually cost more than a one-off build — and the multi-channel inventory sync is the specific problem Shopify's app ecosystem handles imperfectly at best.",
    faqs: [
      {
        q: "Can you migrate our product catalogue from Shopify?",
        a: "Yes — Shopify exports products, variants and order history in standard formats, and catalogue migration is part of the build, including redirects so existing product-page rankings aren't lost.",
      },
      {
        q: "Do we lose Shopify's app ecosystem — reviews, upsells, abandoned cart?",
        a: "Those specific features get built directly instead of purchased as separate app subscriptions — abandoned-cart and re-order nudges, in particular, are standard in a custom D2C build.",
      },
      {
        q: "Is this only worth it above a certain order volume?",
        a: "As a rough honest guide: if per-order fees and app subscriptions are running into real monthly money, or multi-channel stock reconciliation is a manual daily task, the maths is worth doing on a first call.",
      },
    ],
    serviceSlug: "ecommerce",
  },
];
