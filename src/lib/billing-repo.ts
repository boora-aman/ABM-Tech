import { Types } from "mongoose";
import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { BillingDocModel, PaymentModel, ClientModel } from "@/lib/db/models";
import { computeTotals, type Line } from "@/lib/billing";
import type { Section } from "@/lib/billing-sections";
import { nextNumber, type DocKind } from "@/lib/billing-numbering";

export { nextNumber };
export type { DocKind };
import { getSiteConfig } from "@/lib/content/repo";
import { site } from "@/lib/site.config";
import type { PdfBiz } from "@/lib/pdf/InvoiceDoc";

/* ==========================================================================
   BILLING REPOSITORY

   Unlike the content repo there is NO seed fallback here. Content degrades to
   the committed copy when the database is away; an invoice cannot. Showing a
   plausible-looking invoice from stale data would be worse than showing an
   error, so every function here requires a live connection and says so.
   ========================================================================== */

export class BillingUnavailable extends Error {
  constructor() {
    super("Billing needs a database. Set MONGODB_URI.");
  }
}

export async function requireDb() {
  if (!isDbConfigured()) throw new BillingUnavailable();
  const conn = await connectDb();
  if (!conn) throw new BillingUnavailable();
}

export type DocRow = {
  id: string;
  kind: DocKind;
  number: string;
  fy: string;
  clientId?: string;
  client: Record<string, string | undefined>;
  issueDate: string;
  validUntil?: string;
  dueDate?: string;
  lines: Line[];
  discountPct: number;
  taxRate: number;
  taxMode: "none" | "cgst_sgst" | "igst";
  status: string;
  notes?: string;
  terms?: string;
  sections?: Section[];
  sowRef?: string;
  convertedToId?: string;
  convertedFromId?: string;
  sentAt?: string;
  lastSentTo?: string;
  createdAt?: string;
};

/** Totals plus what has been paid — the shape every list and detail view wants. */
export async function withMoney(doc: DocRow) {
  const t = computeTotals(doc.lines, doc.discountPct, doc.taxRate, doc.taxMode);
  const paid =
    doc.kind === "invoice"
      ? (
          await PaymentModel.aggregate([
            { $match: { docId: toObjectId(doc.id) } },
            { $group: { _id: null, sum: { $sum: "$amount" } } },
          ])
        )[0]?.sum ?? 0
      : 0;
  return { ...doc, totals: t, paid, balance: Math.max(0, t.total - paid) };
}

const toObjectId = (id: string) => new Types.ObjectId(id);

export async function listDocs(kind?: DocKind) {
  await requireDb();
  const docs = await BillingDocModel.find(kind ? { kind } : {})
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  const rows = plain<DocRow>(docs);
  return Promise.all(rows.map(withMoney));
}

export async function getDoc(id: string) {
  await requireDb();
  const doc = await BillingDocModel.findById(id).lean();
  if (!doc) return null;
  return withMoney(plain<DocRow>([doc])[0]);
}

export async function listPayments(docId: string) {
  await requireDb();
  const rows = await PaymentModel.find({ docId: toObjectId(docId) })
    .sort({ date: -1 })
    .lean();
  return plain<{
    id: string;
    amount: number;
    date: string;
    method: string;
    reference?: string;
    note?: string;
    number?: string;
    receiptSentAt?: string;
    receiptSentTo?: string;
  }>(rows);
}

export async function listClients() {
  await requireDb();
  const rows = await ClientModel.find({ archived: { $ne: true } })
    .sort({ company: 1, name: 1 })
    .lean();
  return plain<Record<string, unknown>>(rows);
}

/**
 * Recompute an invoice's status from its payments.
 *
 * Derived rather than set by hand: a status that is typed in drifts from the
 * payments beneath it, and then the receivables total disagrees with the list.
 * Draft and cancelled are left alone — they are decisions, not arithmetic.
 */
export async function syncStatus(docId: string) {
  await requireDb();
  const doc = await BillingDocModel.findById(docId).lean();
  if (!doc || doc.kind !== "invoice") return;
  if (doc.status === "draft" || doc.status === "cancelled") return;

  const row = plain<DocRow>([doc])[0];
  const { total } = computeTotals(row.lines, row.discountPct, row.taxRate, row.taxMode);
  const agg = await PaymentModel.aggregate([
    { $match: { docId: toObjectId(docId) } },
    { $group: { _id: null, sum: { $sum: "$amount" } } },
  ]);
  const paid = agg[0]?.sum ?? 0;

  let status: string;
  if (paid >= total && total > 0) status = "paid";
  else if (paid > 0) status = "partial";
  else if (row.dueDate && new Date(row.dueDate) < new Date(new Date().toDateString()))
    status = "overdue";
  else status = "sent";

  if (status !== doc.status) {
    await BillingDocModel.updateOne({ _id: docId }, { $set: { status } });
  }
}

/** The business block printed on every document, from the live site config. */
export async function billingIdentity(): Promise<PdfBiz> {
  const cfg = await getSiteConfig();
  const extra = await (async () => {
    if (!isDbConfigured()) return {} as Record<string, string>;
    const conn = await connectDb();
    if (!conn) return {} as Record<string, string>;
    const { SiteDetailsModel } = await import("@/lib/db/models");
    const d = await SiteDetailsModel.findOne({ key: "site" }).lean();
    return (d ?? {}) as Record<string, string>;
  })();

  return {
    name: cfg.name,
    legalName: cfg.legalName,
    url: cfg.url,
    tagline: cfg.tagline,
    email: cfg.contact.email,
    phoneDisplay: cfg.contact.phoneDisplay,
    line1: cfg.address.street,
    city: cfg.address.locality,
    region: cfg.address.region,
    postalCode: cfg.address.postalCode,
    /* Per-field fallback to the committed defaults, the same way the rest of
       the business identity resolves: a value cleared in the admin returns to
       what is in site.config rather than vanishing off the document. */
    gstin: extra.gstin || site.registration.gstin || undefined,
    udyam: extra.udyam || site.registration.udyam || undefined,
    pan: extra.pan || site.registration.pan || undefined,
    bankName: extra.bankName,
    bankAccount: extra.bankAccount,
    bankIfsc: extra.bankIfsc,
    upi: extra.upi,
  };
}

/* ==========================================================================
   RECEIPTS
   ========================================================================== */

export type ReceiptData = {
  /** ABM/RCT/26-27/001 */
  number: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  note?: string;
  invoice: {
    id: string;
    number: string;
    issueDate: string;
    dueDate?: string;
    total: number;
    client: Record<string, string | undefined>;
  };
  /** Received against this invoice before this payment. */
  paidBefore: number;
  /** Including this payment. */
  paidToDate: number;
  /** Left to pay once this payment is counted. */
  balanceAfter: number;
  sentAt?: string;
  sentTo?: string;
};

/**
 * Give a payment its receipt number if it has none.
 *
 * Payments recorded before receipts existed have no number. Rather than a
 * migration that numbers them all at once — in whatever order the database
 * happens to return them — each gets the next number the first time a receipt
 * is asked for. The conditional update means two simultaneous requests cannot
 * both assign one: the loser's number is simply spent, which is the same rule
 * the documents follow.
 */
export async function ensureReceiptNumber(paymentId: string): Promise<string | null> {
  await requireDb();
  const current = await PaymentModel.findById(paymentId).lean();
  if (!current) return null;
  if (current.number) return current.number as string;

  const { number } = await nextNumber("receipt");
  await PaymentModel.updateOne(
    { _id: paymentId, number: { $exists: false } },
    { $set: { number } },
  );
  const after = await PaymentModel.findById(paymentId).lean();
  return (after?.number as string) ?? null;
}

/**
 * Everything a receipt prints, as of the moment that payment was made.
 *
 * A receipt is a snapshot. If three part payments arrive and the first
 * receipt is reprinted after the third, it must still say what the balance
 * was after the FIRST payment — not today's balance. So "before" and "after"
 * are worked out from the payments that precede this one, in the order they
 * were received, and never from the invoice's current state.
 */
export async function getReceipt(docId: string, paymentId: string): Promise<ReceiptData | null> {
  await requireDb();
  const doc = await getDoc(docId);
  if (!doc || doc.kind !== "invoice") return null;

  const number = await ensureReceiptNumber(paymentId);
  const all = await PaymentModel.find({ docId: toObjectId(docId) })
    .sort({ date: 1, createdAt: 1, _id: 1 })
    .lean();
  const at = all.findIndex((p) => String(p._id) === paymentId);
  if (at === -1 || !number) return null;

  const pay = all[at];
  const paidBefore = all.slice(0, at).reduce((sum, p) => sum + Number(p.amount), 0);
  const paidToDate = paidBefore + Number(pay.amount);

  return {
    number,
    date: pay.date as string,
    amount: Number(pay.amount),
    method: pay.method as string,
    reference: (pay.reference as string) || undefined,
    note: (pay.note as string) || undefined,
    invoice: {
      id: doc.id,
      number: doc.number,
      issueDate: doc.issueDate,
      dueDate: doc.dueDate,
      total: doc.totals.total,
      client: doc.client,
    },
    paidBefore,
    paidToDate,
    balanceAfter: Math.max(0, Math.round((doc.totals.total - paidToDate) * 100) / 100),
    sentAt: pay.receiptSentAt ? new Date(pay.receiptSentAt as Date).toISOString() : undefined,
    sentTo: (pay.receiptSentTo as string) || undefined,
  };
}
