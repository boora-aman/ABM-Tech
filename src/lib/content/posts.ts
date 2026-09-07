/* ==========================================================================
   JOURNAL

   Written answer-first: an explicit question as the heading, then a
   self-contained answer under it. That shape is what gets lifted verbatim
   into an AI answer and what a reader scanning on a phone actually needs.

   Deliberately no CMS, for the same reason the service catalogue has none —
   this changes a few times a quarter, and a database round-trip to render an
   article buys nothing. Editing this file and redeploying is the workflow.

   These posts stay on ABM Tech's own subject: choosing, scoping and owning
   business software. Google Business Profile and local-search content lives
   on Google IT Solution, which is the brand that sells it — splitting it
   across both would put two of our own sites in the same search results
   competing with each other.
   ========================================================================== */

export type Post = {
  slug: string;
  title: string;
  /** Deck shown under the headline and in cards. Also the meta description. */
  excerpt: string;
  /** One-sentence answer placed above the article for LLM extraction. */
  keyTakeaway: string;
  /** Markdown body. Supports ##, ###, bold, inline code, links and lists. */
  body: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  published: boolean;
  featured?: boolean;
  /** Emitted as FAQPage schema alongside the article. */
  faqs?: { q: string; a: string }[];
  /** Service slugs this article should route a convinced reader towards. */
  related?: string[];
};

export const posts: Post[] = [
  /* ------------------------------------------------------------------- */
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "When custom software is the wrong answer",
    excerpt:
      "We talk clients out of builds regularly. Here is the actual test for whether your process justifies custom software, and the four cases where buying something wins outright.",
    keyTakeaway:
      "Custom software earns its cost only where your process is genuinely non-standard — an unusual pricing rule, a document only your regulator wants, or a workflow spanning roles no product anticipated. If none of those apply, an off-the-shelf tool will beat a custom build on cost, time and reliability.",
    tags: ["Buying software", "Scoping"],
    author: "Aman Boora",
    publishedAt: "2026-08-28",
    published: true,
    featured: true,
    related: ["crm", "erp-system", "ecommerce"],
    body: `Every software studio has a commercial incentive to tell you that you need custom software. We do too. This article exists because the incentive is worth resisting — a smaller honest engagement produces more referrals than a padded proposal, and a client who resents what they paid for tells more people than one who does not.

## The test, in one question

**Is there something about how your business works that no product anticipated?**

Not "we do things our own way" — everyone believes that. Something specific and nameable:

- A pricing rule nobody else has. Slab rates that change mid-order, customer-specific rates negotiated per account, a unit of measure that converts partway through the process.
- A document only your regulator or your industry wants, in a format that must match exactly.
- A workflow that spans four roles and three systems, where the handoffs are the hard part.
- A data model the product simply does not hold — batch-level MRP in a pharmacy, per-shift reconciliation at a fuel station, volume-based quoting from a physical survey.

If you can name one of those in a sentence, custom is probably worth costing. If you cannot, keep reading, because the honest answer is likely to save you a lot of money.

## Four cases where buying wins outright

### Your process is standard and you just have not configured the tool

The most common case by far. A business buys a CRM, never maps their stages onto it, and concludes the tool is wrong. It usually is not — it is unconfigured. Two days of proper setup on something you already pay for beats eight weeks of building something new.

### You need breadth, not depth

If you want marketing automation and sequences and a partner ecosystem and a mobile app and an integrations marketplace, buy the product that has all of them. A custom build gives you the twelve things you actually do, done exactly right. It does not give you a hundred things done adequately, and it never will at a price you would accept.

### The domain is a compliance minefield you do not want to own

Payroll with statutory deductions. Full accounting with audit trails. Tax filing. These are heavily regulated, they change every budget cycle, and the maintenance cost of keeping up is real and permanent. Buy the product whose entire business is staying current, and integrate it.

### The volume does not justify the build

A task that takes four minutes and happens twice a week is not an automation candidate. The same task sixty times a day is. Multiply honestly before you scope anything: minutes saved × frequency × the cost of the person doing it. If the payback is longer than about eighteen months, it is not a project yet.

## Where custom genuinely wins

### The tool enforces a process that is not yours

This is the failure mode that produces the private spreadsheet. Your team adopts the tool, discovers it will not let them record the thing they actually need to record, and starts keeping a sheet alongside it. Within a quarter the sheet is the real system and the software is a licence fee.

Custom does not mean better. It means the data model matches what is physically true in your business, which is what makes people use it.

### You are paying per seat for something you use a tenth of

Twelve users on a per-seat product for four years is a large number. If you are using a fraction of the product, a one-off build you own often costs less than the licence over the same horizon — and the comparison should be made with actual numbers on a first call, not asserted.

### The integration is the product

Sometimes you do not need new software at all: you need the six things you already run to stop needing a person as the connector between them. That is usually the cheapest project available and the fastest to pay back, and it is worth checking before anyone proposes a build.

## How to have this conversation with a vendor

Ask three questions, and listen to how they are answered.

1. **"What off-the-shelf tool would do this, and why is it wrong for us?"** A vendor who cannot name one has not looked.
2. **"What is deliberately excluded from this scope?"** If the proposal has no exclusion list, the price is not fixed — the argument has just been postponed.
3. **"If we hired a developer next month, could they take over without calling you?"** The honest answer requires code in your Git organisation, documented environment variables, a seed script and a runbook.

## The uncomfortable conclusion

Most businesses that ask for custom software do not need it yet. What they need is one process digitised properly, or two systems connected, or an existing tool configured by someone who bothered to map their workflow first.

Those are smaller projects. They are also the ones that work.`,
    faqs: [
      {
        q: "How do I know if my business needs custom software?",
        a: "Ask whether there is something specific about how you operate that no product anticipated — an unusual pricing rule, a document only your regulator wants, a data model like batch-level MRP or per-shift reconciliation, or a workflow spanning several roles and systems. If you can name one in a sentence, custom is worth costing. If you cannot, an off-the-shelf tool configured properly will almost certainly beat a custom build on cost, time and reliability.",
      },
      {
        q: "Is custom software cheaper than paying per user per month?",
        a: "Sometimes, and it should be checked with real numbers rather than asserted. Twelve seats over four years is a large figure, and if you use a fraction of the product a one-off build you own can cost less over the same horizon. But the comparison must include maintenance, hosting and the fact that a product ships improvements you would otherwise pay to build.",
      },
      {
        q: "What is the most common mistake businesses make when buying software?",
        a: "Replacing an unconfigured tool instead of configuring it. A CRM nobody filled in is usually not the wrong CRM — it is one where nobody mapped the team's actual stages onto it. Two days of proper setup on something you already pay for frequently beats eight weeks of building a replacement.",
      },
    ],
  },

  /* ------------------------------------------------------------------- */
  {
    slug: "fixed-price-software-scope",
    title: "What a fixed price actually means, and how to check you have one",
    excerpt:
      "Everyone says fixed price. Almost nobody writes the exclusion list — which is the half that decides whether the number holds. Here is what a real fixed-price scope contains.",
    keyTakeaway:
      "A fixed price is only fixed if the scope document itemises what is excluded as clearly as what is included. Without the exclusion list, the price has not been fixed — the argument about it has simply been postponed until after you have paid the first instalment.",
    tags: ["Buying software", "Pricing"],
    author: "Aman Boora",
    publishedAt: "2026-08-28",
    published: true,
    featured: true,
    related: ["crm", "billing-platform-app", "mobile-apps"],
    body: `"Fixed price" is the most common phrase in software proposals and the least examined. Here is how to tell whether the one you are holding is real.

## The four things a real fixed-price scope contains

### 1. What gets built, itemised

Not "a CRM". A list: pipeline with named stages, lead capture from these three sources, role-based access for these three roles, these four dashboards. Countable things you could tick off on delivery.

### 2. What is excluded, itemised as clearly

This is the half that is almost always missing, and it is the half that decides whether the number holds. A scope that lists twenty inclusions and no exclusions has not defined a boundary — it has defined a starting point.

The exclusions should be specific enough to sting slightly to read. "Does not include WhatsApp automation, multi-branch support, or migration of historical data beyond the current financial year." That sentence is worth more to you than another paragraph of features.

### 3. The delivery sequence, with dates

What exists at the end of each week or milestone, and what you will be able to open and click. A schedule made of internal phases — "development", "testing" — tells you nothing. A schedule made of things you can look at tells you whether the project is on track without asking.

### 4. What happens when scope changes

Because it will. The correct answer is: quoted separately, in writing, before the work starts. Not absorbed silently, which sounds generous and means the vendor is now losing money on your project and will make it back somewhere you cannot see.

## The questions that expose a soft price

**"What is deliberately not in this?"**
A vendor who has thought about the boundary answers immediately. One who has not will describe more features.

**"What happens if we ask for something outside the scope in week five?"**
You want to hear a process, not reassurance. "We quote it as a change, in writing, and you decide" is a process. "We will look after you" is not.

**"Which of these figures moves if discovery goes badly?"**
Honest answer: some of them, and here is which ones and why. A price with no acknowledged risk is a price that has not been thought about.

## Payment terms that align incentives

The structure matters more than the total. Something like 40% on signing, 40% at an agreed midpoint milestone, 20% on handover keeps both sides interested through the whole project. Terms that front-load payment shift all the risk to you at exactly the point where you have the least information.

The midpoint milestone should be a thing, not a date. "40% when the billing flow is working end to end on a preview link" is a milestone. "40% at week four" is a calendar entry.

## Where fixed pricing genuinely does not work

It is worth being honest about the exception. Fixed pricing needs a scope, and a scope needs enough understanding of the problem to write one. There are projects — a large digitisation where nobody knows how many processes exist yet, or a platform where the requirements genuinely emerge — where fixing a price up front means one of two things: the vendor has padded it heavily, or they will discover the gap later and the relationship will absorb the damage.

The correct answer there is a paid discovery with a fixed price of its own, producing a written scope you own and can take anywhere. Then the build is fixed against that.

A vendor who offers this is not avoiding commitment. They are avoiding a number that would be fiction.

## The single best test

Read the proposal and ask yourself: **could a different vendor price this same document?**

If yes, it is a scope. If the proposal only makes sense in the presence of the person who wrote it, it is a conversation with a number attached, and the number will move.`,
    faqs: [
      {
        q: "What should a fixed-price software quote include?",
        a: "Four things: an itemised list of what gets built, an equally itemised list of what is excluded, a delivery sequence expressed as things you can open and click rather than internal phases, and a written process for what happens when scope changes. The exclusion list is the one most often missing and the one that decides whether the price actually holds.",
      },
      {
        q: "Are software projects ever genuinely unpriceable up front?",
        a: "Yes, and it is worth respecting when a vendor says so. A large digitisation where nobody yet knows how many processes exist, or a platform whose requirements genuinely emerge, cannot be fixed honestly without heavy padding. The correct answer is a paid discovery with its own fixed price, producing a written scope you own and could take to any vendor, and then a fixed build against that scope.",
      },
      {
        q: "What payment terms are normal for a custom software project?",
        a: "A common structure is 40% on signing, 40% at an agreed midpoint milestone and 20% on handover. What matters more than the split is that the midpoint is defined as a working thing you can open — not a calendar date — so payment tracks delivery rather than elapsed time.",
      },
    ],
  },

  /* ------------------------------------------------------------------- */
  {
    slug: "software-handover-checklist",
    title: "Handover: the checklist that proves you own your software",
    excerpt:
      "A zip file and a phone call is not handover. Eight things you should receive at the end of any build, and the one question that tests whether you actually got them.",
    keyTakeaway:
      "You own your software only if a developer you hire next month could take it over without contacting the original vendor. That requires code in your Git organisation, documented environment variables, a seed script, a deployment runbook and every account in your business's name.",
    tags: ["Buying software", "Handover"],
    author: "Aman Boora",
    publishedAt: "2026-08-28",
    published: true,
    related: ["cloud-support", "integrations", "dynamic-website"],
    body: `Most lock-in is not contractual. It is the quiet kind: the code lives in the vendor's account, the deployment steps exist only in one person's head, and nobody else can get a working copy running. No clause created that situation, and no clause will fix it.

## The checklist

Print this and use it on any vendor, including us.

### 1. Source code in your Git organisation

Not a zip file, not a shared drive, not their GitHub with you added as a collaborator. Your organisation, your billing, your ability to revoke access. The full history should be there — a squashed single commit on handover day tells you nothing about how the thing was built.

### 2. Documented environment variables

Every key the application reads, what it is for, and where the value comes from. A \`.env.example\` with a comment per line. This is the single most common reason a new developer cannot get a project running.

### 3. A seed script

Something that creates a working environment from nothing: schema, reference data, one admin user. Without it, "set up a local copy" becomes a week of archaeology.

### 4. A deployment runbook

The actual steps, written for someone who was not there. Which service, which branch deploys, what the build command is, how migrations run, what to do when a deploy fails. If the answer is "we just push and it works", ask what happens when it does not.

### 5. Database schema documentation

Tables, relationships, and — more usefully — the two or three modelling decisions that are not obvious. Why invoices and invoice lines are separate. Why the status field is an enum and not a boolean.

### 6. A recorded walkthrough

Screen and voice, thirty to sixty minutes. Both the admin interface and the code structure. This survives staff turnover on your side, which written documentation often does not because nobody reads it until they urgently need it.

### 7. Every account in your business's name

Hosting, domain registrar, DNS, database, payment gateway, email service, error monitoring, Play Console, Apple Developer. Registered to your business, billed to your card, with you as owner and the vendor as a collaborator you can remove.

This is the one people discover too late, usually when a domain is about to expire and nobody can reach the person who registered it.

### 8. Signing keys, for anything mobile

The Android keystore and the Apple credentials. Lose these and you cannot ship an update to your own app — you have to publish a new listing and ask every user to reinstall.

## The one question that tests all eight

**"If we hired a developer next month, could they take over without calling you?"**

Ask it before you sign, not at the end. The answer shapes how the project is built, and a vendor who intends to deliver all eight will say so immediately because they have done it before.

## What good vendors do differently

They treat handover as a thing that happens continuously rather than an event at the end. The code is in your organisation from the first commit, not moved there on the last day. The runbook is written as the deployment is set up, because that is when the details are known. The environment variables are documented as they are added.

Handover assembled at the end is always thinner than handover accumulated throughout, because by then nobody remembers why the odd configuration value was needed.

## Why a vendor would want this

The obvious objection: does this not make it easy to leave?

Yes. That is the point, and it is not altruism. A client who can leave at any time is a client whose vendor has to keep earning the work every month, and that produces better work than a contract that makes leaving expensive. It also removes the conversation about lock-in from every future decision, which is worth more than the leverage it gives up.`,
    faqs: [
      {
        q: "What should I receive when a software project is handed over?",
        a: "Eight things: source code in your own Git organisation with full history, documented environment variables, a seed script that builds a working environment from nothing, a deployment runbook, database schema documentation, a recorded walkthrough of the admin and the code, every account registered in your business's name, and the signing keys for any mobile app.",
      },
      {
        q: "How do I know if I am locked in to my software vendor?",
        a: "Ask whether a developer you hired next month could take over without contacting them. If the code lives in the vendor's account, the deployment steps exist only in someone's head, or the domain and hosting are registered to them, you are locked in regardless of what the contract says. Most lock-in is operational rather than contractual.",
      },
      {
        q: "Why do mobile app signing keys matter?",
        a: "Without the Android keystore and Apple credentials you cannot publish an update to your own app. The only remedy is creating a new store listing and asking every existing user to find and reinstall it, which loses your ratings, your install base and your reviews. The keys should be handed to you at release, not held by the developer.",
      },
    ],
  },
  /* ------------------------------------------------------------------- */
  {
    slug: "custom-software-development-cost-india-2026",
    title: "What custom software actually costs in India in 2026",
    excerpt:
      "Real starting figures for CRM, ERP, billing, mobile apps and websites, and the four things that move a project above the floor — so you can tell whether a quote is honest before you've paid anything.",
    keyTakeaway:
      "Floors in 2026: a static website from ₹6,000, a dynamic site with an admin panel from ₹15,000, a CRM from ₹12,000, an ERP from ₹15,000, an e-commerce store from ₹18,000, a mobile app from ₹25,000. What moves a real project above the floor is migration from an existing system, multi-branch or multi-role complexity, and integrations with third-party APIs — ask about all three before you compare two quotes.",
    tags: ["Pricing", "Buying software"],
    author: "Aman Boora",
    publishedAt: "2026-09-01",
    published: true,
    featured: true,
    related: ["crm", "erp-system", "mobile-apps", "ecommerce"],
    body: `Most software quotes in India are a range, delivered after a sales call, with no explanation for why your project sits where it does in that range. That's not because pricing custom software is impossible to do transparently — it's because an unpublished number is easier to move once you're already invested in the conversation.

## The actual floors, published

These are starting figures for a single-location, single-branch build with a standard process. Not a ceiling — a floor, for the smallest version of each category:

- **Static business website** — from ₹6,000, delivered in 5–8 days
- **Dynamic website with admin panel** — from ₹15,000, delivered in 2–3 weeks
- **Custom CRM** — from ₹12,000, delivered in 3–5 weeks
- **ERP / inventory system** — from ₹15,000, delivered in 4–8 weeks
- **E-commerce store** — from ₹18,000, delivered in 4–6 weeks
- **Mobile app (Android + iOS)** — from ₹25,000, delivered in 4–8 weeks
- **Google Business Profile setup** — ₹2,499 one time, built and submitted the same day

All figures are one-off project costs, exclusive of GST, against a written scope. A support retainer afterward — monitoring, patching, a change-request allowance — starts separately from ₹4,000 a month, and is optional.

## Four things that move a project above the floor

**Migration.** If you're moving off an existing system — a spreadsheet, Tally, another CRM — the data has to be mapped, imported and reconciled against a physical count or an existing report before go-live. This is real work, usually priced as its own line, and it's the single most common reason a quote lands above the floor.

**Multi-branch or multi-role complexity.** A single-counter retail build and a three-branch operation with approval hierarchies are different projects, even though both are "an ERP." Ask specifically what the floor figure assumes — one location, one role, or several.

**Third-party integrations.** A payment gateway, a WhatsApp Business API connection, an SMS gateway, a marketplace API — each is a real scoping item with its own edge cases (what happens when the gateway times out mid-transaction, for instance), not a checkbox.

**Design and content depth.** A five-page static site and a fifty-page catalogue site are not the same project even if both are "a website." Page count and content volume move a static build's price more than almost anything else.

## How to read a quote against this

Ask three things on the first call, regardless of who you're talking to:

1. **What does this specific figure assume?** One branch, one role, standard categories — or does it already account for your actual complexity?
2. **What's excluded?** A quote with no exclusion list isn't fixed — it's a starting point for negotiation once you're already committed.
3. **Is GST included or added?** Most published figures, including ours, are exclusive of GST — confirm which convention you're being quoted under before comparing two numbers.

## Why publish this at all

A published floor means the first call is about whether the work is right for you, not whether you can afford to ask. It also means a vendor can't quote the same scope differently to two different clients — which is the actual reason most software pricing stays hidden.

See the [full published list with what each figure includes and excludes](/pricing).`,
    faqs: [
      {
        q: "Are these prices negotiable?",
        a: "The floor is fixed for the scope listed. If your requirement is genuinely smaller than the floor assumes, say so — sometimes the honest answer is a smaller, cheaper scope. What doesn't happen is the same scope quoted differently to two different people.",
      },
      {
        q: "Why is a CRM cheaper than an ERP at these floors?",
        a: "Data model complexity. A CRM's core data model — leads, stages, activities — is simpler than an ERP's, which typically spans inventory, purchasing, production and multi-role approvals from day one.",
      },
      {
        q: "Do these figures include ongoing support after launch?",
        a: "Thirty days of bug fixing is included in every project figure. Ongoing monitoring, patching and a change-request allowance beyond that is a separate, optional retainer starting from ₹4,000 a month.",
      },
    ],
  },
  /* ------------------------------------------------------------------- */
  {
    slug: "saas-vs-custom-software-cost-comparison",
    title: "Per-seat SaaS vs owning the code: the three-year arithmetic",
    excerpt:
      "A per-seat SaaS subscription and a one-off custom build look like different categories of spend until you actually run the three-year numbers side by side. Here's the arithmetic, and where it genuinely favours the subscription.",
    keyTakeaway:
      "At 10 seats, a mid-tier CRM subscription commonly runs ₹1.5–4 lakh over three years and keeps rising with headcount; a one-off custom build with no per-seat fee is often cheaper past year one, and stays flat as the team grows. The subscription wins when you need its breadth (marketing automation, a large app ecosystem) or you're validating a process that isn't settled yet.",
    tags: ["Pricing", "Buying software"],
    author: "Aman Boora",
    publishedAt: "2026-09-03",
    published: true,
    related: ["crm", "erp-system"],
    body: `A ₹12,000 one-off quote and a ₹1,200-per-user-per-month subscription look incomparable at first glance — one's a project, one's an ongoing expense. They're comparable the moment you pick a time horizon and multiply.

## The arithmetic, worked through

Ten users on a mid-tier CRM at roughly ₹1,200/user/month:

- Year 1: ₹1,44,000
- Year 3 cumulative: ₹4,32,000
- And that's before any per-user growth — hire two more people and the number moves immediately, with no new capability unlocked.

A one-off custom build at ₹12,000, plus an optional ₹4,000/month support retainer:

- Year 1: ₹12,000 + (₹4,000 × 12) = ₹60,000, or ₹12,000 alone if you skip the retainer
- Year 3 cumulative: ₹1,56,000 with the retainer, or ₹12,000 without it
- Adding five more users costs nothing — there's no per-seat fee to trigger

The crossover point depends on your actual subscription tier and seat count, but for most mid-tier per-seat tools at ten or more users, it lands somewhere in year one.

## What the subscription is actually buying

This isn't an argument that SaaS is a bad deal — it's a genuinely different trade:

- **Breadth.** A large per-seat product typically ships marketing automation, a partner ecosystem, prebuilt integrations and continuous feature releases you didn't have to commission.
- **Zero implementation risk.** It works today, configured, not built — which matters if you need something live this week, not in three to five weeks.
- **Someone else's maintenance burden.** Version upgrades, security patching and infrastructure are the vendor's problem entirely.

If you'll genuinely use that breadth, the per-seat cost is the price of not building and maintaining it yourself — a fair trade, not a bad one.

## Where the arithmetic actually flips

The multiplication favours custom specifically when:

- **Seat count is ten or more** and growing, so the per-seat fee compounds rather than staying flat.
- **You're using a fraction of the product** — four modules out of forty, with the rest as sunk licence cost.
- **Your process has already settled** — you know your pipeline stages, your approval chain, your reporting needs, so there's no discovery risk in building to them directly.
- **You want to leave without losing your data model** — a subscription's data lives in its schema; a custom build's data model is yours from the first migration.

## A worked example, not a rule

We ran exactly this arithmetic for a services firm choosing between staying on a per-seat CRM at 14 seats and commissioning a custom build. At their seat count and growth rate, the subscription was already costing more per year than the custom build's total cost including a support retainer — the honest recommendation was to switch, and we said so on the first call rather than after taking the project.

The point isn't that custom always wins this comparison — see our [Zoho CRM comparison](/compare/custom-crm-vs-zoho) for the cases where it genuinely doesn't. The point is that the comparison is worth running with your actual numbers before assuming either answer.`,
    faqs: [
      {
        q: "How do I find our actual seat cost to run this comparison?",
        a: "Check your current subscription invoice for the per-seat rate and multiply by your seat count and 36 months — that's your three-year baseline. Compare it against a custom build's one-off cost plus an optional support retainer over the same period.",
      },
      {
        q: "Does this arithmetic apply to any SaaS product, or just CRMs?",
        a: "The same multiplication works for any per-seat tool — helpdesk software, project management, HR systems. The crossover point moves with the specific per-seat rate, but the method is identical.",
      },
      {
        q: "What if we're not sure our process will stay stable?",
        a: "That's a real reason to stay on a subscription a little longer — a custom build assumes your process is settled enough to build to directly. If it's still changing month to month, the flexibility of a configurable SaaS tool is worth its premium.",
      },
    ],
  },
  /* ------------------------------------------------------------------- */
  {
    slug: "pharmacy-expiry-losses-discovered-too-late",
    title: "Why pharmacy expiry losses are discovered too late",
    excerpt:
      "The write-off isn't the problem — discovering it after the supplier return window has closed is. Here's why generic billing software misses this, and what actually catches it in time.",
    keyTakeaway:
      "Generic billing treats a medicine as one product, when the same SKU sits on the shelf in multiple batches at multiple expiry dates. Batch-level stock with expiry alerts grouped by supplier, fired in tiers (90/60/30 days), is what turns an expiry loss discovered at stock-take into a return filed in time.",
    tags: ["Healthcare", "Inventory"],
    author: "Aman Boora",
    publishedAt: "2026-09-05",
    published: true,
    related: ["erp-system", "billing-platform-app"],
    body: `Ask a pharmacy owner when they discover an expired batch, and the answer is almost always "at stock-take" — which is also almost always after the supplier's return window has closed. The loss isn't a surprise by then. It's a cost that was locked in weeks earlier and only became visible late.

## Why this happens with standard billing software

Generic billing software models a medicine as one product with one stock count. The physical reality is different: the same SKU commonly sits on the shelf in two or three batches, at two or three expiry dates, sometimes at two or three printed MRPs after a price revision. If the software can't represent that, batch tracking moves to a paper notebook beside the till — and a paper notebook doesn't send an alert.

## What actually catches it in time

**Batch-level stock from the point of purchase entry.** Every GRN records the batch number and expiry date against the item, not just a quantity added to a single running total.

**First-expiry-first-out dispensing, enforced at billing.** The system offers the oldest batch first automatically, so newer stock doesn't get sold ahead of older stock by default — which is what quietly turns a batch into a write-off in the first place.

**Tiered alerts, grouped by supplier.** A single alert 90 days out is easy to ignore. Alerts at 90, 60 and 30 days, grouped by which supplier issued the batch, mean one return call can cover a dozen items instead of being filed one SKU at a time — which is often why the return doesn't get filed at all.

**Reorder points from actual velocity, not a fixed minimum.** Overstocking a slow-moving item is how a batch outlives its own shelf life in the first place. Reorder points calculated from real sales velocity against supplier lead time reduce how often that happens.

## The compliance layer this also has to carry

Schedule H and H1 medicines need a prescription reference captured before dispensing — not as a paper trail kept separately, but gated at the point of sale so the sale itself cannot complete without it. That's the same system doing two jobs: catching expiry losses, and making an inspection defensible.

## What this looks like running

We built exactly this for a retail pharmacy running 100–150 transactions a day — batch-level inventory, supplier-grouped expiry tiers, and server-enforced prescription gating. [Read the full case study](/work/pharmacy-erp).

If your pharmacy's discrepancy is currently small, the honest test is whether it's discovered every stock-take or only occasionally — a recurring small loss is still a recurring cost, and it's usually worth running the numbers on what a year of it actually adds up to before deciding whether to fix it.`,
    faqs: [
      {
        q: "Does this replace our accounting software?",
        a: "No — this is the operational and billing layer specific to pharmacy stock; your accounting software (commonly Tally) typically stays the book of record, with summarised entries posting across.",
      },
      {
        q: "Can it handle a price revision on an existing batch already on the shelf?",
        a: "Yes — batch-level modelling means a price revision applies to new purchase entries without changing the recorded cost or MRP of batches already in stock, which is exactly the case generic software collapses into one number.",
      },
      {
        q: "Is this only useful for standalone pharmacies?",
        a: "It applies anywhere batch and expiry genuinely matter — a clinic's in-house dispensary, a distributor, or a hospital pharmacy all hit the same underlying problem, even though the surrounding workflow differs.",
      },
    ],
  },
  /* ------------------------------------------------------------------- */
  {
    slug: "field-technician-app-what-they-actually-need",
    title: "What a field technician actually needs on their phone",
    excerpt:
      "Not a slimmed-down version of the office dashboard. A field app has to work with no signal, capture proof in seconds, and never lose what someone already typed — here's the actual list, in order of what breaks first.",
    keyTakeaway:
      "In order of what breaks a field app first: offline capture that syncs later, not a live connection requirement; photo proof that attaches directly to the job and the invoice; a job list simple enough to use one-handed; and a manager view that updates from the field in near real time instead of at 7pm when everyone's back.",
    tags: ["Field services", "Mobile apps"],
    author: "Aman Boora",
    publishedAt: "2026-09-06",
    published: true,
    related: ["mobile-apps", "crm"],
    body: `Most field-service software is designed by someone sitting at a desk, for someone who isn't. The gap shows up immediately: a beautifully designed dashboard that requires a live connection, on a phone that's about to lose signal in a basement.

## What actually breaks first

**A live connection requirement.** This is the single most common design mistake. A technician standing in a basement, a lift shaft, or a rural service area with patchy coverage needs the app to keep working — capturing job status, notes and photos locally, and syncing automatically the moment signal returns. An app that blocks on a spinner until connectivity comes back is an app that doesn't get used.

**Losing what was already typed.** A form that clears itself on a dropped connection, forcing a technician to retype job notes from memory, trains people to stop using the app at all — they'll go back to a paper pad, which is the exact problem the app was meant to solve.

**Too many taps for a one-handed job.** A technician holding a tool in one hand needs a job status update in one or two taps, not a multi-screen form. Complexity that would be fine at a desk is friction that gets skipped in the field.

**Photo proof that doesn't attach to anything.** A photo taken and saved to the phone's gallery, separate from the job record, is a photo that never makes it into the invoice or the customer's file. Proof capture has to write directly into the job it belongs to.

## What a manager actually needs, which is different

The manager's problem isn't the technician's problem. A manager needs to know, in near real time, which jobs are open, which technician is free, and which job has gone quiet — not a summary compiled at 7pm from technicians reporting in. That's a dispatch view built from the same job records the technician's app is writing to, not a separate report generated later.

## Why this is usually the highest-value part of a CRM build for field services

When we describe field-service builds, the enquiry pipeline and the dispatch view get most of the attention in a proposal — but the actual daily friction a business feels is almost always at the technician's end: a job assigned in a WhatsApp group that scrolls past, with nobody able to say why a customer from ten days ago never got called back. Fixing that specific gap is often the highest-return single change in the whole system.

We built exactly this for a home-services business — enquiry pipeline, area-based dispatch, and a technician app built to work offline in basements and stairwells. [Read the full case study](/work/field-service-crm).`,
    faqs: [
      {
        q: "Do technicians need training to use an offline-first app?",
        a: "Less than you'd expect — the interface is deliberately simple because offline-first design forces simplicity anyway (fewer screens, fewer live lookups). Most rollouts include a short on-site session rather than formal training.",
      },
      {
        q: "What happens if two technicians edit the same job while both are offline?",
        a: "The sync logic resolves this by timestamp and by which fields actually changed, rather than one edit silently overwriting the other — this is scoped and tested explicitly during the build, not left to chance.",
      },
      {
        q: "Does this work on older or budget Android phones, not just recent ones?",
        a: "Yes — this is a deliberate design constraint, since field teams commonly use older or shared devices rather than the newest hardware. The build targets that reality rather than assuming a high-end phone.",
      },
    ],
  },
  /* ------------------------------------------------------------------- */
  {
    slug: "google-business-profile-verification-explained",
    title: "How Google Business Profile verification actually works",
    excerpt:
      "Postcard, phone, video call, or instant — verification methods, real timelines, and why nobody, including us, can promise you a date. The honest version most GBP setup services won't publish.",
    keyTakeaway:
      "Postcard verification typically takes 5 to 12 business days from request to arrival; phone or instant verification, where Google offers it for your business, is faster but not something you can request — Google decides which method you're offered. Anyone quoting a fixed go-live date is guessing.",
    tags: ["Local SEO", "Google Business Profile"],
    author: "Aman Boora",
    publishedAt: "2026-09-02",
    published: true,
    featured: true,
    related: ["google-business-profile-setup", "maps-and-seo"],
    body: `Almost every Google Business Profile setup offer promises speed. Almost none of them own the part that actually determines the timeline — because that part belongs to Google, not the agency.

## The methods Google actually uses

**Postcard verification.** Google mails a physical postcard to your business address with a verification code. This typically takes 5 to 12 business days to arrive, and the clock only starts once the profile is submitted correctly — an error in the address restarts it.

**Phone or SMS verification.** Faster, sometimes instant, but only offered to some businesses and categories. You can't request this method; Google decides which option your submission is offered based on signals we don't control and can't influence.

**Video verification.** Increasingly used for certain categories, requiring a short recorded walkthrough of the business premises and signage. Available only where Google offers it.

**Instant verification via a linked Google Search Console account.** Rare, and only available where the business website is already verified in Search Console under the same account.

## Why nobody can promise you a date

Which method you're offered is decided by Google, based on category, business signals and location — not by anything an agency does. A setup service claiming "verified in 48 hours" is either offering a method Google hasn't guaranteed, or quietly hoping you don't ask what happens when it isn't instant.

What we do instead: build and submit the profile the same day, tell you plainly which method Google is likely to offer based on your category, and set expectations before you pay — not after.

## What actually determines whether verification passes the first time

The verification step itself is usually mechanical. What causes rejections and delays is upstream of it:

- **An address that doesn't match how it's registered elsewhere** — with your GST registration, other directories, or a previous claim on the same location.
- **A category that doesn't match the business type Google can verify** at that address.
- **Missing or inconsistent business details** submitted alongside the verification request.

Preparing the profile correctly before submission is what "prepared to pass first time" actually means — not a claim about the verification method itself.

## What we publish instead of a promise

Our [Google Business Profile setup service](/services/google-business-profile-setup) is built and submitted the same day, for ₹2,499 one time — and the invoice goes out once the listing is actually live, not before. That's the risk we take on instead of promising a timeline we don't control.`,
    faqs: [
      {
        q: "Can I request postcard verification instead of waiting to see what I'm offered?",
        a: "No — Google's system decides which verification method to offer at submission time, based on your business category and other signals. You can't select a method in advance.",
      },
      {
        q: "What happens if the postcard never arrives?",
        a: "You can request a new one after a waiting period, or in some cases switch to an alternative method if Google offers one. This is a genuine failure mode worth planning for rather than assuming won't happen.",
      },
      {
        q: "Does paying more speed up verification?",
        a: "No — no agency, including us, can pay Google to expedite a specific business's verification. Anyone implying otherwise is describing something they don't control.",
      },
    ],
  },
  /* ------------------------------------------------------------------- */
  {
    slug: "google-business-profile-categories-explained",
    title: "Primary vs secondary categories: the setting that decides the most",
    excerpt:
      "Category selection affects your Google Business Profile's visibility more than any other single field — and most businesses pick the closest-sounding option in the dropdown instead of the one competitors ranking for their terms actually use.",
    keyTakeaway:
      "Your primary category should match what the businesses already ranking for your target searches use, not the label that sounds closest to what you do. Secondary categories add coverage for adjacent searches but never override the primary category's weight — most profiles need one correct primary category more than five approximate secondary ones.",
    tags: ["Local SEO", "Google Business Profile"],
    author: "Aman Boora",
    publishedAt: "2026-09-04",
    published: true,
    related: ["google-business-profile-setup", "maps-and-seo"],
    body: `Ask ten business owners how they picked their Google Business Profile's primary category, and most will describe scrolling the dropdown until something sounded close enough. That single choice affects visibility more than reviews, photos, or posting frequency combined.

## Why primary category matters this much

Google's Maps ranking weighs category as one of its strongest signals for matching a search to a business — arguably stronger than the business description, the services listed, or even proximity within a reasonable radius. Two businesses with identical quality and identical distance from a searcher can rank completely differently if one has the category the search actually maps to and the other has an adjacent, approximate one.

## How to actually choose it

Don't start from what you'd call your own business. Start from what's already ranking:

1. **Search your actual target terms** — not your business name, the phrases a customer would type.
2. **Open the top few Maps results** and check their listed category (visible on the profile itself).
3. **Match your primary category to the pattern you see**, not to the label that sounds most accurate to how you'd describe your own business.

A restaurant that also does catering, for instance, might be tempted to set "Caterer" as primary because catering is the higher-margin service — but if the searches that actually reach you are "restaurant near me," the primary category needs to reflect the search, not the internal business priority.

## What secondary categories are actually for

Secondary categories extend which additional searches you can appear for — a restaurant might add "Caterer" and "Event venue" as secondary categories to also surface in those searches. But they don't compensate for a wrong primary category; Google weighs the primary far more heavily; a business with the right secondary categories and the wrong primary still underperforms one with just the right primary and no secondaries at all.

**A common mistake:** stacking five or six secondary categories hoping for broader visibility. Beyond a handful of genuinely applicable categories, this dilutes rather than helps — Google's own guidance is to add categories only where they're accurate, not exhaustive.

## What we actually do differently

When we set up or audit a Google Business Profile, category research means checking who's actually ranking for your target searches first — not filling in the dropdown from memory. It's the single highest-leverage part of the whole setup, and the part most setup services skip past to get to photos and posting schedules faster.

See the [full Google Business Profile setup service](/services/google-business-profile-setup) for what a proper setup includes, or the [ongoing Maps & SEO service](/services/maps-and-seo) if you already have a profile and want the ranking work done as a retainer.`,
    faqs: [
      {
        q: "Can I change my primary category after the profile is already live?",
        a: "Yes — category changes can be made at any time without restarting verification. It's worth revisiting if your business's focus has shifted or if the original category was chosen without checking competitors.",
      },
      {
        q: "How many secondary categories should we actually use?",
        a: "As many as are genuinely accurate, and no more — a handful applicable to real parts of your business is normal; a long list added hoping for broader reach usually dilutes rather than helps.",
      },
      {
        q: "Does the category affect anything besides search ranking?",
        a: "Yes — it also determines which attributes and features are available on your profile (menu for restaurants, service options for home services), so an inaccurate category can hide relevant fields customers expect to see.",
      },
    ],
  },
];

export const allTags = () =>
  Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
