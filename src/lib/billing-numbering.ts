/* ==========================================================================
   DOCUMENT NUMBERING

   Its own module, and deliberately using RELATIVE imports rather than the
   "@/" alias used everywhere else in src. scripts/seed-billing.ts runs under
   plain `node --env-file`, which strips types but does not resolve tsconfig
   path aliases — an aliased import here makes the seeder fail to load. Leaving
   these relative — and extension-bearing, which Node's ESM resolver also
   requires — is what lets the seeder consume real numbers from the same
   counter the app uses, instead of inventing its own format and drifting.
   ========================================================================== */
import { CounterModel } from "./db/models.ts";
import { financialYear } from "./billing.ts";

export type DocKind = "quotation" | "invoice" | "proposal" | "agreement";

const PREFIX = {
  quotation: "QT",
  invoice: "INV",
  proposal: "PROP",
  agreement: "MSA",
} as const;

/**
 * Reserve the next number for a kind and financial year.
 *
 * Atomic `$inc` with upsert, so two simultaneous creates get 7 and 8 rather
 * than both getting 7. Counting existing documents instead would race, and a
 * duplicate invoice number is not something you can quietly fix later.
 *
 * The number is consumed even if the caller then fails — a gap is a far
 * smaller problem than a repeat, and the alternative (releasing numbers) is
 * how you end up with two invoices sharing one.
 */
export async function nextNumber(
  kind: DocKind,
  fy = financialYear(),
): Promise<{ number: string; seq: number; fy: string }> {
  const counter = await CounterModel.findOneAndUpdate(
    { key: `${kind}-${fy}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  const seq = Number((counter as { seq?: number } | null)?.seq ?? 1);
  return {
    number: `ABM/${PREFIX[kind]}/${fy}/${String(seq).padStart(3, "0")}`,
    seq,
    fy,
  };
}
