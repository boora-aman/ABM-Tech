export type Faq = { q: string; a: string };

/** Site-wide FAQs. Emitted as FAQPage schema on the home page. */
export const globalFaqs: Faq[] = [
  {
    q: "What does ABM Tech actually build?",
    a: "Business software: custom CRM, ERP and inventory systems, billing platforms, business websites with real admin panels, mobile apps, and the AI automation layer that removes manual work between them. We also handle Google Business Profile optimisation and technical SEO, because a system nobody can find is a cost centre.",
  },
  {
    q: "How do you price work?",
    a: "Fixed price against a written scope — no hourly meter. Every service page lists a starting figure and what that figure includes, along with what it deliberately excludes. If discovery reveals work outside the scope we quote it separately in writing before starting.",
  },
  {
    q: "Are your published prices real, or a starting hook?",
    a: "They are genuine floors, and we say plainly on each page where a real project typically lands above them. A ₹15,000 ERP is a single-location system with inventory, billing and reporting; a multi-branch build with approval hierarchies is ₹40,000 upward. You get the actual number before committing, not after.",
  },
  {
    q: "Who owns the code?",
    a: "You do, from the first commit. It lives in your Git organisation, deploys to your accounts, and handover includes documented environment variables, a seed script and a runbook. If you hire in-house later or move to another vendor, nothing about our work holds you hostage.",
  },
  {
    q: "Will you tell us if we don't need custom software?",
    a: "Yes, and it happens regularly. If your process is standard enough that ERPNext or an off-the-shelf CRM fits, we say so — even though it means a smaller project or none at all. The alternative is building something you resent paying for.",
  },
  {
    q: "What happens after launch?",
    a: "Thirty days of bug fixing is included with every build. After that a support retainer covering monitoring, dependency updates, security patches and a monthly allowance of change requests is optional — the software works whether or not you buy it.",
  },
  {
    q: "How quickly can you start?",
    a: "Audits and website builds usually begin within a week. Application and ERP builds start at the next discovery slot, typically two to three weeks out. If something is genuinely urgent, say so and we will tell you honestly whether it fits.",
  },
  {
    q: "Do you work with businesses outside India?",
    a: "Yes, remotely. Pricing is quoted in INR and time zones from Europe to Southeast Asia are straightforward. On-site phases for ERP rollouts would be scoped separately.",
  },
];

/** The delivery commitments shown on the home page and /about. */
export const commitments = [
  {
    index: "01",
    title: "Scope written down, price fixed",
    body: "A written scope with a fixed price, listing what is excluded as plainly as what is included. No hourly meter, no discovery that quietly becomes the project.",
  },
  {
    index: "02",
    title: "Deployed weekly, not revealed at the end",
    body: "Vertical slices — schema, API, interface and permissions together — pushed to a preview URL you can open every week. You never wait eight weeks to see something real.",
  },
  {
    index: "03",
    title: "Migration and training are part of it",
    body: "Your existing records imported and reconciled against a physical count, and your staff trained at their own workstation before go-live. This is the step that decides whether a rollout survives.",
  },
  {
    index: "04",
    title: "Handover assumes we might leave",
    body: "Documented environment variables, a seed script, a deployment runbook and a recorded walkthrough. Code in your Git organisation, deploys to your accounts.",
  },
  {
    index: "05",
    title: "We say the unprofitable thing",
    body: "If an off-the-shelf tool fits better than a custom build, we tell you and the project gets smaller. A smaller honest engagement earns more referrals than a padded proposal.",
  },
  {
    index: "06",
    title: "No lock-in, ever",
    body: "Retainers cancel with 30 days' notice. There is no licence, no per-seat fee and no contract that makes leaving expensive.",
  },
];
