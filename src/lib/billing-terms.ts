/* ==========================================================================
   TERMS LIBRARY

   The clauses that go on a quotation or an invoice, as a list you tick rather
   than a paragraph you retype. Retyping is how two documents end up promising
   different things about the same work.

   Free of imports on purpose — the editor loads this into the browser.

   Ticking a clause copies its TEXT onto the document at save time; it does not
   store a pointer to this file. An issued document has to keep saying what it
   said when it was sent, so editing a clause here changes the next document
   and never a past one. The ids are kept alongside only so the checkboxes can
   be re-ticked when you reopen a draft.
   ========================================================================== */

export type TermsClause = {
  id: string;
  /** Shown beside the checkbox. */
  label: string;
  /** Printed on the document. */
  text: string;
  appliesTo: "quotation" | "invoice" | "both";
  /** Ticked on a new document. */
  preset?: boolean;
};

export const TERMS_CLAUSES: TermsClause[] = [
  /* ------------------------------ Payment ------------------------------- */
  {
    id: "advance-50",
    label: "50% advance",
    text: "50% of the total is payable in advance. Work begins on receipt of the advance; the balance falls due on delivery.",
    appliesTo: "both",
    preset: true,
  },
  {
    id: "pay-14",
    label: "Payment within 14 days",
    text: "Payment is due within 14 days of the invoice date.",
    appliesTo: "invoice",
    preset: true,
  },
  {
    id: "pay-on-receipt",
    label: "Payment on receipt",
    text: "Payment is due on receipt of this invoice.",
    appliesTo: "invoice",
  },
  {
    id: "late-fee",
    label: "Late payment interest",
    text: "Amounts outstanding beyond the due date carry interest at 1.5% per month.",
    appliesTo: "invoice",
  },
  {
    id: "bank-charges",
    label: "Transfer charges on payer",
    text: "Bank or gateway charges on the transfer are borne by the payer.",
    appliesTo: "invoice",
  },

  /* ------------------------------- Scope -------------------------------- */
  {
    id: "scope-fixed",
    label: "Scope is what is listed",
    text: "This covers exactly the items listed above. Anything outside them is quoted separately before any work on it starts.",
    appliesTo: "both",
    preset: true,
  },
  {
    id: "revisions-2",
    label: "Two rounds of revisions",
    text: "Two rounds of revisions are included per deliverable. Further rounds are billed at the agreed hourly rate.",
    appliesTo: "both",
  },
  {
    id: "client-inputs",
    label: "Client inputs",
    text: "Timelines assume content, access and approvals are provided when requested. Delays in these move the delivery date by the same amount.",
    appliesTo: "both",
    preset: true,
  },
  {
    id: "third-party",
    label: "Third-party costs excluded",
    text: "Domains, hosting, licences, paid plugins and ad spend are billed at cost and are not included above unless listed.",
    appliesTo: "both",
  },

  /* ----------------------------- Quotation ------------------------------ */
  {
    id: "quote-validity",
    label: "Valid until the date shown",
    text: "This quotation is valid until the date shown above. Prices are re-confirmed after that.",
    appliesTo: "quotation",
    preset: true,
  },
  {
    id: "quote-estimate",
    label: "Timelines are estimates",
    text: "Delivery timelines are working estimates, not guarantees, and are confirmed once the scope is signed off.",
    appliesTo: "quotation",
  },

  /* ------------------------------ Delivery ------------------------------ */
  {
    id: "handover",
    label: "Handover on full payment",
    text: "Source files, accounts and credentials are handed over once payment has been received in full.",
    appliesTo: "both",
  },
  {
    id: "support-30",
    label: "30 days of support",
    text: "30 days of support for defects in the delivered work is included from the date of delivery. It does not cover new features or third-party changes.",
    appliesTo: "both",
  },
  {
    id: "no-ranking",
    label: "No ranking or approval guarantee",
    text: "Search rankings, listing approvals and platform verifications are decided by the platform. We do the work correctly and to their guidelines; we do not control or guarantee their outcome.",
    appliesTo: "both",
    preset: true,
  },
  {
    id: "cancellation",
    label: "Cancellation",
    text: "On cancellation, work completed up to that date is payable and the advance is not refundable.",
    appliesTo: "both",
  },
];

export function clausesFor(kind: "quotation" | "invoice") {
  return TERMS_CLAUSES.filter((c) => c.appliesTo === kind || c.appliesTo === "both");
}

export function presetIdsFor(kind: "quotation" | "invoice") {
  return clausesFor(kind).filter((c) => c.preset).map((c) => c.id);
}

/**
 * Build the terms block that gets printed.
 *
 * Numbered, because a clause somebody has to refer to later ("point 3") needs
 * a number. Custom text goes last so it reads as an addition to the standard
 * terms rather than a contradiction buried among them.
 */
export function composeTerms(ids: string[], custom?: string) {
  const picked = ids
    .map((id) => TERMS_CLAUSES.find((c) => c.id === id))
    .filter(Boolean) as TermsClause[];

  const lines = picked.map((c, i) => `${i + 1}. ${c.text}`);
  const extra = (custom ?? "").trim();
  if (extra) lines.push(picked.length ? `${picked.length + 1}. ${extra}` : extra);
  return lines.join("\n");
}
