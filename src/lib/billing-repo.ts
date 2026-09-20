import { Types } from "mongoose";
import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { BillingDocModel, PaymentModel, ClientModel, CounterModel } from "@/lib/db/models";
import { computeTotals, financialYear, type Line } from "@/lib/billing";
import type { Section } from "@/lib/billing-sections";
import { getSiteConfig } from "@/lib/content/repo";
import type { PdfBiz } from "@/lib/pdf/InvoiceDoc";

/* ==========================================================================
   BILLING REPOSITORY

   Unlike the content repo there is NO seed fallback here. Content degrades to
   the committed copy when the database is away; an invoice cannot. Showing a
   plausible-looking invoice from stale data would be worse than showing an
   error, so every function here requires a live connection and says so.
   ========================================================================== */

export type DocKind = "quotation" | "invoice" | "proposal" | "agreement";

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
  return plain<{ id: string; amount: number; date: string; method: string; reference?: string; note?: string }>(rows);
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
    gstin: extra.gstin,
    udyam: extra.udyam,
    pan: extra.pan,
    bankName: extra.bankName,
    bankAccount: extra.bankAccount,
    bankIfsc: extra.bankIfsc,
    upi: extra.upi,
  };
}

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
