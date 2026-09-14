
/* ==========================================================================
   BILLING ARITHMETIC AND FORMATTING

   Deliberately free of any database import — the admin editor imports
   computeTotals and inrMoney into the BROWSER so that what the operator sees
   while typing and what the PDF prints come from one function. A lazy
   `await import` of the models was not enough: the bundler still traced
   mongoose into the client graph. Numbering therefore lives in billing-repo.

   Money is handled in whole paise as integers wherever a total is derived.
   Floating point rupees accumulate error across a dozen lines — 0.1 + 0.2
   famously is not 0.3 — and an invoice that is one paisa out from the sum of
   its own lines is an invoice somebody has to explain.
   ========================================================================== */

export type Line = {
  description: string;
  hsn?: string;
  qty: number;
  unit?: string;
  rate: number;
  discountPct: number;
};

export type Totals = {
  /** Every figure in RUPEES, already rounded, safe to render. */
  lineTotals: number[];
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  total: number;
};

const paise = (rupees: number) => Math.round((Number(rupees) || 0) * 100);
const rupees = (p: number) => Math.round(p) / 100;

/**
 * Compute a document's totals.
 *
 * Order matters and follows the way an Indian invoice is read top to bottom:
 * line discount first, then the document-level discount on the sum, then tax
 * on what remains, then a round-off to whole rupees on the grand total.
 */
export function computeTotals(
  lines: Line[],
  discountPct = 0,
  taxRate = 0,
  taxMode: "none" | "cgst_sgst" | "igst" = "none",
): Totals {
  const linePaise = lines.map((l) => {
    const gross = paise(l.rate) * (Number(l.qty) || 0);
    const off = Math.round((gross * (Number(l.discountPct) || 0)) / 100);
    return gross - off;
  });

  const subtotalP = linePaise.reduce((a, b) => a + b, 0);
  const discountP = Math.round((subtotalP * (Number(discountPct) || 0)) / 100);
  const taxableP = subtotalP - discountP;

  const taxP = taxMode === "none" ? 0 : Math.round((taxableP * (Number(taxRate) || 0)) / 100);
  // Split halves so the two halves always sum back to the whole, even on an
  // odd number of paise — the naive `tax/2` twice loses a paisa.
  const halfA = Math.floor(taxP / 2);
  const halfB = taxP - halfA;

  const grossP = taxableP + taxP;
  const roundedP = Math.round(grossP / 100) * 100;
  const roundOffP = roundedP - grossP;

  return {
    lineTotals: linePaise.map(rupees),
    subtotal: rupees(subtotalP),
    discount: rupees(discountP),
    taxable: rupees(taxableP),
    tax: rupees(taxP),
    cgst: taxMode === "cgst_sgst" ? rupees(halfA) : 0,
    sgst: taxMode === "cgst_sgst" ? rupees(halfB) : 0,
    igst: taxMode === "igst" ? rupees(taxP) : 0,
    roundOff: rupees(roundOffP),
    total: rupees(roundedP),
  };
}

/* ------------------------------ Numbering -------------------------------- */

/** Indian financial year for a date: April to March. "26-27" for Sep 2026. */
export function financialYear(d = new Date()): string {
  const y = d.getFullYear();
  const startYear = d.getMonth() >= 3 ? y : y - 1; // month 3 = April
  return `${String(startYear).slice(-2)}-${String(startYear + 1).slice(-2)}`;
}


/* ------------------------------ Formatting ------------------------------- */

export const inrMoney = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

/** Amount in words, Indian system — required on many invoice formats and
 *  expected on most. Handles up to 99,99,99,999.99. */
export function amountInWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
    "Eighty", "Ninety"];

  const two = (n: number): string =>
    n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`;

  const three = (n: number): string =>
    n >= 100
      ? `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${two(n % 100)}` : ""}`
      : two(n);

  const whole = Math.floor(amount);
  const fraction = Math.round((amount - whole) * 100);
  if (whole === 0 && fraction === 0) return "Zero Rupees Only";

  const parts: string[] = [];
  const crore = Math.floor(whole / 10000000);
  const lakh = Math.floor((whole % 10000000) / 100000);
  const thousand = Math.floor((whole % 100000) / 1000);
  const rest = whole % 1000;

  if (crore) parts.push(`${three(crore)} Crore`);
  if (lakh) parts.push(`${three(lakh)} Lakh`);
  if (thousand) parts.push(`${three(thousand)} Thousand`);
  if (rest) parts.push(three(rest));

  const rupeeWords = parts.join(" ").trim();
  const paiseWords = fraction ? ` and ${two(fraction)} Paise` : "";
  return `${rupeeWords} Rupees${paiseWords} Only`;
}
