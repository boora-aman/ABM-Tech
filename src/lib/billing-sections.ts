/* ==========================================================================
   SECTION LIBRARY — the prose half of a proposal or an agreement.

   A quotation is a table of numbers. A proposal is an argument, and a service
   agreement is a contract; both are mostly words, and writing those words from
   scratch every time is how the scope you promised in January stops matching
   the scope you promised in March.

   So each kind has a set of prefilled sections. Creating a document COPIES
   them onto it, where every heading and every line is editable. Nothing here
   is a pointer: once a document is issued it keeps the words it was issued
   with, and editing this file changes the next one only.

   Free of imports on purpose — the editor loads this into the browser.

   NOTE ON THE AGREEMENT. These clauses are a working draft assembled from a
   template, not legal advice, and they have not been reviewed by a lawyer.
   Have counsel read them before they go under a signature that binds you.
   ========================================================================== */

export type SectionKind = "text" | "bullets" | "table" | "checklist";

export type Section = {
  /** Stable key, so the library can be re-offered without duplicating. */
  id: string;
  heading: string;
  kind: SectionKind;
  /** `text` — paragraphs, blank line between them. */
  body?: string;
  /** `bullets` and `checklist`. */
  items?: string[];
  /** `table`. First entry is the header row. */
  columns?: string[];
  rows?: string[][];
  /** Copied onto a new document of this kind. The rest are offered. */
  preset?: boolean;
  /** One line under the heading in the editor, never printed. */
  note?: string;
};

/* ==========================================================================
   PROPOSAL
   ========================================================================== */

const PROPOSAL: Section[] = [
  {
    id: "summary",
    heading: "Executive summary",
    kind: "text",
    preset: true,
    note: "Rewrite the second paragraph for this client — it is the part they read.",
    body:
      "We build practical business systems around the way you actually operate. The engagement runs on a written scope, a fixed price, visible weekly progress, migration and training where they apply, and a handover that leaves the code and the infrastructure in your control.\n\n" +
      "[Two or three lines on this client specifically: what is slow or manual today, and what the delivered system changes about it.]",
  },
  {
    id: "requirement",
    heading: "Requirement and proposed solution",
    kind: "table",
    preset: true,
    columns: ["Area", "Your requirement", "What we propose"],
    rows: [
      ["Business objective", "[What you are trying to achieve]", "[The measurable or operational outcome]"],
      ["Current process", "[How it works today]", "[How it works once delivered]"],
      ["Users and roles", "[Who uses it]", "[Roles and permissions]"],
      ["Integrations", "[Systems it must talk to]", "[API or sync plan]"],
      ["Reports", "[What you need to see]", "[Dashboards and metric definitions]"],
    ],
  },
  {
    id: "scope",
    heading: "Scope of work and deliverables",
    kind: "table",
    preset: true,
    columns: ["Workstream", "Included deliverables", "Your sign-off"],
    rows: [
      ["Discovery and scope", "Requirements, process map, assumptions, exclusions", "Written scope approval"],
      ["UX and UI", "Screen flows, responsive layouts, agreed design direction", "Design sign-off"],
      ["Development", "Modules, database, APIs, roles, permissions", "Milestone review"],
      ["Integrations", "Named APIs and platforms, field mapping, sync rules", "Integration test"],
      ["Migration", "Agreed source datasets, import and reconciliation", "Data validation"],
      ["Testing and QA", "Functional, responsive, basic security and performance checks", "Defect review"],
      ["Training", "Admin and staff sessions at your own workstations", "Training completion"],
      ["Deployment", "Production deployment to your accounts", "Go-live confirmation"],
      ["Handover", "Code, credentials, documentation, runbook, walkthrough", "Handover sign-off"],
    ],
  },
  {
    id: "method",
    heading: "How we deliver",
    kind: "bullets",
    preset: true,
    items: [
      "Scope is written down with inclusions, exclusions and assumptions, and priced as a fixed number rather than an hourly meter.",
      "The build arrives in vertical slices, so there is something real to look at during the project rather than only at the end.",
      "Existing records are migrated and reconciled wherever migration is in the scope.",
      "Staff are trained at their own workstations, or in an agreed remote session, before go-live.",
      "Production is deployed to accounts you control wherever that is technically possible.",
      "Handover is documented, and the 30-day bug-fix period starts from the agreed go-live date.",
    ],
  },
  {
    id: "stack",
    heading: "Technology",
    kind: "text",
    preset: true,
    body:
      "We build on standard, hireable technology: Next.js, React, TypeScript, Node.js, Python, PostgreSQL, MongoDB, MariaDB, React Native, Frappe/ERPNext, Tailwind CSS, Docker, REST and GraphQL APIs, Razorpay and Stripe, the WhatsApp Business API, AWS and Vercel.\n\n" +
      "Nothing here is exotic. If we stop working together, the next developer you hire will recognise the stack. The exact selection follows the approved scope.",
  },
  {
    id: "timeline",
    heading: "Timeline",
    kind: "table",
    columns: ["Phase", "Working days", "Ends with"],
    rows: [
      ["Discovery and scope", "[__]", "Signed scope"],
      ["Design", "[__]", "Design sign-off"],
      ["Build", "[__]", "Milestone demos"],
      ["Migration and testing", "[__]", "Defect review"],
      ["Training and go-live", "[__]", "Acceptance"],
    ],
    note: "Timelines assume content, access and approvals arrive when asked for.",
  },
  {
    id: "milestones",
    heading: "Payment milestones",
    kind: "table",
    preset: true,
    columns: ["Milestone", "Share", "Falls due"],
    rows: [
      ["Advance / kick-off", "[__%]", "On acceptance of this proposal"],
      ["Milestone 1", "[__%]", "[Acceptance trigger]"],
      ["Milestone 2", "[__%]", "[Acceptance trigger]"],
      ["Final / handover", "[__%]", "Before production handover"],
    ],
  },
  {
    id: "inclusions",
    heading: "What is included",
    kind: "bullets",
    preset: true,
    items: [
      "Project management and milestone coordination.",
      "Development of the features listed in the signed scope.",
      "Testing against the agreed acceptance criteria.",
      "Deployment and basic production configuration.",
      "Initial training and handover documentation.",
      "30 days of bug fixing after launch, for defects in the delivered scope.",
      "Your ownership of the project code, and a handover built to avoid lock-in.",
    ],
  },
  {
    id: "exclusions",
    heading: "What is not included",
    kind: "bullets",
    preset: true,
    items: [
      "Paid advertising, purchased backlinks or reviews, print design, and brand identity work, unless quoted separately.",
      "Third-party API, cloud, payment gateway, app-store, domain, messaging and subscription charges.",
      "Features, integrations, reports or migration volumes not listed in the approved scope.",
      "New features or material changes after scope approval, unless accepted through written change control.",
      "Guaranteed search rankings, lead volume, revenue or conversion rates. Those depend on factors outside the delivered system.",
    ],
  },
  {
    id: "support",
    heading: "After handover",
    kind: "table",
    preset: true,
    columns: ["Area", "What you get"],
    rows: [
      ["Bug fixing", "30 days after launch, for defects in the delivered scope"],
      ["New features", "By change request, quoted separately or against a support allowance"],
      ["Hosting", "Optional, and configurable on your own cloud account"],
      ["Backups", "Automated backups with a documented restore, where support is included"],
      ["Security", "Dependency and security updates under a support arrangement"],
      ["Training", "Initial training included; further sessions scheduled separately"],
      ["Code", "Yours, in your Git organisation"],
      ["Transition", "No intentional lock-in. Support retainers cancel on 30 days' notice"],
    ],
  },
  {
    id: "acceptance",
    heading: "Acceptance and handover checklist",
    kind: "checklist",
    items: [
      "Scope delivered against the approved SOW",
      "Production deployment completed",
      "Admin credentials transferred",
      "Git repository and code ownership transferred",
      "Environment variables and secrets handed over",
      "Seed or setup script supplied, where applicable",
      "Deployment runbook supplied",
      "Backup and restore documented, where applicable",
      "Training completed",
      "Recorded walkthrough supplied, where applicable",
      "Migration reconciliation completed",
      "Client acceptance received",
    ],
  },
  {
    id: "assumptions",
    heading: "Assumptions",
    kind: "bullets",
    items: [
      "Content, brand assets, access credentials and source data are supplied when requested.",
      "One named person on your side can approve designs and scope decisions.",
      "Review feedback arrives within [__] working days of each milestone demo.",
      "Third-party accounts required by the build already exist, or can be opened in your name.",
    ],
  },
  {
    id: "next",
    heading: "Next steps",
    kind: "bullets",
    preset: true,
    items: [
      "Confirm the scope in this document, or tell us what to change in it.",
      "Sign below, or reply in writing that you accept.",
      "Pay the kick-off milestone; we schedule the discovery session on the same day.",
    ],
  },
];

/* ==========================================================================
   MASTER SERVICE AGREEMENT
   ========================================================================== */

const AGREEMENT: Section[] = [
  {
    id: "purpose",
    heading: "Purpose",
    kind: "text",
    preset: true,
    body:
      "This Master Service Agreement sets the general terms under which the Provider supplies software, website, application, automation, integration, digitisation, SEO, hosting, cloud and support services to the Client. Each individual project is governed by a signed Statement of Work, proposal or quotation, referred to here as the SOW.",
  },
  {
    id: "precedence",
    heading: "Scope and order of precedence",
    kind: "text",
    preset: true,
    body:
      "The SOW defines the deliverables, assumptions, exclusions, milestones, fees and acceptance criteria for a given project. On project-specific matters the signed SOW controls. This Agreement controls the general commercial and operational relationship, unless the SOW expressly says otherwise.",
  },
  {
    id: "change-control",
    heading: "Fixed scope and change control",
    kind: "bullets",
    preset: true,
    items: [
      "Projects are priced against a written scope rather than an hourly meter.",
      "Anything materially outside the approved scope needs a written change request, and price and timeline approval, before it is built.",
      "Discovery does not automatically become additional billable scope unless the SOW says so.",
      "A verbal discussion is not approval of additional chargeable work.",
    ],
  },
  {
    id: "client-duties",
    heading: "Client responsibilities",
    kind: "bullets",
    preset: true,
    items: [
      "Provide accurate requirements, content, brand assets, credentials, access and source data.",
      "Nominate one authorised contact for reviews and approvals.",
      "Give feedback in reasonable time. Client-side delay moves the delivery milestones by the same amount.",
      "Hold lawful rights to all data, images, text, trademarks and third-party material supplied.",
      "Pay third-party charges that are not expressly included in the SOW.",
    ],
  },
  {
    id: "provider-duties",
    heading: "Provider responsibilities",
    kind: "bullets",
    preset: true,
    items: [
      "Deliver the approved scope with reasonable professional skill and care.",
      "Give the agreed milestone previews and demonstrations.",
      "Carry out the migration, testing, training and deployment work that is included.",
      "Supply the agreed handover material.",
      "Raise material blockers and scope risks as soon as they are identified.",
    ],
  },
  {
    id: "ip",
    heading: "Intellectual property and code ownership",
    kind: "text",
    preset: true,
    body:
      "Subject to payment of the applicable project fees, the Client owns the project-specific source code and deliverables created for the Client under the SOW. The intended operating model is that project code lives in the Client's Git organisation and that deployments use Client-controlled accounts wherever feasible.\n\n" +
      "The Provider retains ownership of pre-existing tools, generic know-how, reusable libraries, methods and non-client-specific material. Third-party software remains subject to its own licence terms.",
  },
  {
    id: "confidentiality",
    heading: "Confidentiality and data",
    kind: "text",
    preset: true,
    body:
      "Each party will use reasonable care to protect non-public information received from the other, and will use it only for the engagement. The Client remains responsible for ensuring that personal and business data supplied to the Provider may lawfully be processed. Where appropriate the parties may sign a separate NDA or data-processing agreement.",
  },
  {
    id: "hosting",
    heading: "Hosting, cloud and third-party services",
    kind: "text",
    preset: true,
    body:
      "Where hosting or support is included, the Provider may configure infrastructure on Client-controlled cloud accounts, including SSL, domains and DNS, as agreed.\n\n" +
      "Third-party outages, API changes, rate limits, payment-gateway rules, app-store decisions and vendor pricing are outside the Provider's control.",
  },
  {
    id: "acceptance-terms",
    heading: "Testing and acceptance",
    kind: "text",
    preset: true,
    body:
      "The Client has the review period stated in the SOW to identify material deviations from the agreed acceptance criteria. The Provider will correct confirmed defects in the delivered scope. Acceptance does not turn a new feature request into a defect.",
  },
  {
    id: "warranty",
    heading: "Post-launch bug-fix warranty",
    kind: "text",
    preset: true,
    body:
      "Thirty days of bug fixing after launch is included with every build. The period covers defects in the delivered scope. It does not cover new functionality, third-party platform changes, Client-side infrastructure changes, misuse, or modifications made by anyone else.",
  },
  {
    id: "support-terms",
    heading: "Optional support and maintenance",
    kind: "table",
    preset: true,
    columns: ["Area", "What it covers"],
    rows: [
      ["Monitoring", "Application and infrastructure monitoring where technically available"],
      ["Security and updates", "Security patches and dependency updates, subject to compatibility and testing"],
      ["Backups", "Automated backups, with a documented restore and periodic restore testing"],
      ["Change requests", "New features against an agreed monthly allowance or a separate quotation"],
      ["Incident response", "Production issue support within the agreed hours and channel"],
      ["Escalation", "Critical issues prioritised under the applicable support plan"],
    ],
    note: "Support retainers are optional unless the SOW includes one. They cancel on 30 days' notice.",
  },
  {
    id: "fees",
    heading: "Fees, taxes and payment",
    kind: "text",
    preset: true,
    body:
      "Fees, milestones and any applicable taxes are stated in the relevant SOW or quotation. Third-party costs are payable by the Client unless expressly included. The Provider may pause work where an undisputed payment milestone is overdue.",
  },
  {
    id: "termination",
    heading: "Suspension and termination",
    kind: "text",
    preset: true,
    body:
      "Either party may terminate an ongoing support retainer on thirty days' written notice, subject to the SOW. For fixed projects, termination rights and their payment consequences are stated in the SOW.\n\n" +
      "On termination the Client pays for accepted work, and for approved work completed up to the effective date.",
  },
  {
    id: "no-lockin",
    heading: "No lock-in and transition",
    kind: "text",
    preset: true,
    body:
      "The Provider will not withhold Client-owned source code or documentation in order to prevent a transition to another vendor or to an internal team. A normal handover includes documented environment variables, a seed or setup script, a deployment runbook and a recorded walkthrough, as applicable to the project.",
  },
  {
    id: "boundaries",
    heading: "Exclusions and professional boundaries",
    kind: "bullets",
    preset: true,
    items: [
      "Paid advertising, purchased backlinks, purchased reviews, print or brand identity design, and per-seat licensing are excluded unless separately agreed.",
      "The Provider may recommend an off-the-shelf tool — Shopify, Zoho, ERPNext, Power BI — where it genuinely fits better than a custom build.",
      "The Provider does not guarantee search rankings, revenue, lead volume, conversion rates or any other outcome that depends on external factors.",
    ],
  },
  {
    id: "warranties",
    heading: "Warranties and disclaimer",
    kind: "text",
    preset: true,
    body:
      "The Provider warrants that services will be performed with reasonable professional skill and care. Beyond the express warranties in the SOW, both parties acknowledge that software and integrations depend on third-party services and cannot be guaranteed to run without interruption.",
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    kind: "text",
    preset: true,
    note: "Fill the cap in before this is signed. A blank here is the clause that hurts.",
    body:
      "The parties agree a liability cap of [________________________]. Neither party is responsible for indirect, incidental, special or consequential losses, to the extent permitted by law.",
  },
  {
    id: "force-majeure",
    heading: "Force majeure",
    kind: "text",
    preset: true,
    body:
      "Neither party is responsible for delay caused by events beyond reasonable control, including major infrastructure outages, natural disasters, government action, war, widespread cyber incidents or third-party platform outages, provided reasonable steps are taken to mitigate.",
  },
  {
    id: "law",
    heading: "Governing law and disputes",
    kind: "text",
    preset: true,
    note: "Name the state and the court or arbitration seat before signature.",
    body:
      "Governing law: [____________________]. Jurisdiction, or the arbitration mechanism and seat: [____________________].",
  },
  {
    id: "notices",
    heading: "Notices",
    kind: "text",
    preset: true,
    body:
      "Formal notices go to the authorised contacts named in the SOW, and to the Provider at the address on this document, unless another address is expressly agreed.",
  },
  {
    id: "entire",
    heading: "Entire agreement and amendments",
    kind: "text",
    preset: true,
    body:
      "This Agreement, together with each signed SOW, is the agreement between the parties for the services it covers. Amendments must be in writing and approved by authorised representatives of both parties.",
  },
];

export const SECTION_LIBRARY: Record<"proposal" | "agreement", Section[]> = {
  proposal: PROPOSAL,
  agreement: AGREEMENT,
};

/** Deep copy — the caller edits these, and a shared array would edit the library. */
export function presetSections(kind: "proposal" | "agreement"): Section[] {
  return SECTION_LIBRARY[kind]
    .filter((s) => s.preset)
    .map((s) => JSON.parse(JSON.stringify(s)) as Section);
}

export function librarySection(kind: "proposal" | "agreement", id: string) {
  const found = SECTION_LIBRARY[kind].find((s) => s.id === id);
  return found ? (JSON.parse(JSON.stringify(found)) as Section) : null;
}

/** True where a document of this kind is written prose rather than a table of money. */
export const isLongForm = (k: string): k is "proposal" | "agreement" =>
  k === "proposal" || k === "agreement";
