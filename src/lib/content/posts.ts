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
];

export const allTags = () =>
  Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
