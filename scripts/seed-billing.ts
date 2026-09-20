/**
 * npm run seed:billing — sample clients, quotations, invoices, proposals and
 * agreements, so the billing screens have something in them.
 *
 *   npm run seed:billing            # add the sample set
 *   npm run seed:billing -- --clear # remove it again
 *
 * Every record it writes is tagged, and --clear deletes exactly what the tag
 * matches and nothing else. That matters: this runs against whatever database
 * MONGODB_URI points at, and a seeder that guesses which rows are disposable
 * is a seeder that eventually deletes a real invoice.
 *
 * Numbers come from the same atomic counter the app uses, so the sample
 * documents occupy real positions in the sequence. Clearing them leaves gaps,
 * which is correct — a number that has been issued is spent.
 */
import { connectDb, isDbConfigured } from "../src/lib/db/mongoose.ts";
import {
  BillingDocModel,
  ClientModel,
  PaymentModel,
} from "../src/lib/db/models.ts";
import { nextNumber } from "../src/lib/billing-numbering.ts";
import { computeTotals } from "../src/lib/billing.ts";
import { composeTerms } from "../src/lib/billing-terms.ts";
import { presetSections } from "../src/lib/billing-sections.ts";

const TAG = "[sample data — safe to delete]";

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

/* ------------------------------- Clients -------------------------------- */

const CLIENTS = [
  {
    name: "Ravi Sharma",
    company: "Sharma Motors",
    email: "accounts@sharmamotors.example",
    phone: "+91 98765 43210",
    line1: "12 Rajpur Road",
    city: "Dehradun",
    state: "Uttarakhand",
    postalCode: "248001",
  },
  {
    name: "Dr. Neha Kulkarni",
    company: "Sanjeevani Pharmacy",
    email: "billing@sanjeevani.example",
    phone: "+91 90040 11223",
    line1: "Shop 4, Ballupur Chowk",
    city: "Dehradun",
    state: "Uttarakhand",
    postalCode: "248001",
  },
  {
    name: "Imran Qureshi",
    company: "Doon Cargo Movers",
    email: "ops@dooncargo.example",
    phone: "+91 99110 77441",
    line1: "Transport Nagar, Plot 27",
    city: "Haridwar",
    state: "Uttarakhand",
    postalCode: "249401",
  },
  {
    name: "Anita Rawat",
    company: "Himalaya Public School",
    email: "admin@himalayaschool.example",
    phone: "+91 94120 55667",
    line1: "Sahastradhara Road",
    city: "Dehradun",
    state: "Uttarakhand",
    postalCode: "248013",
  },
];

/* ---------------------------- Document recipes --------------------------- */

type Recipe = {
  kind: "quotation" | "invoice" | "proposal" | "agreement";
  client: number;
  issue: number;
  due?: number;
  valid?: number;
  status?: string;
  lines: { description: string; qty: number; unit: string; rate: number; discountPct?: number }[];
  /** Fraction of the total already received. Invoices only. */
  paidShare?: number;
  termsIds?: string[];
  notes?: string;
};

const RECIPES: Recipe[] = [
  /* ------------------------------ Quotations ---------------------------- */
  {
    kind: "quotation", client: 0, issue: -12, valid: 3, status: "sent",
    termsIds: ["advance-50", "scope-fixed", "client-inputs", "quote-validity", "no-ranking"],
    lines: [
      { description: "Custom CRM — lead capture, pipeline stages, assignment rules", qty: 1, unit: "nos", rate: 12000 },
      { description: "WhatsApp Business API integration", qty: 1, unit: "nos", rate: 8000 },
    ],
  },
  {
    kind: "quotation", client: 1, issue: -6, valid: 9, status: "sent",
    termsIds: ["advance-50", "scope-fixed", "quote-validity"],
    notes: "Batch and expiry handling is the part worth getting right first.",
    lines: [
      { description: "Pharmacy ERP — batch stock, FEFO dispensing, expiry alerts", qty: 1, unit: "nos", rate: 40000 },
      { description: "Historical stock migration", qty: 1, unit: "lot", rate: 6000, discountPct: 10 },
    ],
  },
  {
    kind: "quotation", client: 3, issue: -2, status: "draft",
    valid: 13,
    termsIds: ["advance-50", "scope-fixed", "client-inputs", "quote-validity"],
    lines: [
      { description: "Admission pipeline and fee collection module", qty: 1, unit: "nos", rate: 28000 },
      { description: "Parent portal with attendance and test reports", qty: 1, unit: "nos", rate: 16000 },
    ],
  },
  {
    kind: "quotation", client: 2, issue: -20, valid: -5, status: "expired",
    termsIds: ["scope-fixed", "quote-validity"],
    lines: [{ description: "Driver mobile app — trip capture and proof of delivery", qty: 1, unit: "nos", rate: 25000 }],
  },

  /* -------------------------------- Invoices ---------------------------- */
  {
    kind: "invoice", client: 0, issue: -34, due: -20, paidShare: 1,
    termsIds: ["pay-14", "handover"],
    lines: [
      { description: "Google Business Profile setup and verification", qty: 1, unit: "nos", rate: 2499 },
      { description: "Local SEO retainer", qty: 3, unit: "month", rate: 6500, discountPct: 10 },
    ],
  },
  {
    kind: "invoice", client: 1, issue: -18, due: -4, paidShare: 0.4,
    termsIds: ["pay-14", "late-fee"],
    lines: [
      { description: "Pharmacy billing web app — phase 1", qty: 1, unit: "nos", rate: 35000 },
      { description: "Staff training, on site", qty: 2, unit: "day", rate: 3500 },
    ],
  },
  {
    kind: "invoice", client: 2, issue: -45, due: -31, paidShare: 0,
    termsIds: ["pay-14", "late-fee", "bank-charges"],
    notes: "Second reminder sent. Call before the month closes.",
    lines: [{ description: "Logistics dispatch board and LR/bilty module", qty: 1, unit: "nos", rate: 42000 }],
  },
  {
    kind: "invoice", client: 3, issue: -3, due: 11, paidShare: 0,
    termsIds: ["pay-14"],
    lines: [
      { description: "Hosting, SSL, backups and monitoring", qty: 1, unit: "month", rate: 4000 },
      { description: "Support retainer — 4 hours", qty: 4, unit: "hour", rate: 1200 },
    ],
  },

  /* ------------------------------- Proposals ---------------------------- */
  {
    kind: "proposal", client: 1, issue: -8, valid: 7, status: "sent",
    termsIds: ["advance-50", "scope-fixed", "client-inputs", "no-ranking"],
    lines: [
      { description: "Pharmacy ERP — batch stock, FEFO, expiry, GST billing", qty: 1, unit: "nos", rate: 40000 },
      { description: "Dynamic website with admin panel", qty: 1, unit: "nos", rate: 15000 },
      { description: "Hosting, cloud and support", qty: 12, unit: "month", rate: 4000, discountPct: 8 },
    ],
  },
  {
    kind: "proposal", client: 2, issue: -15, valid: 1, status: "accepted",
    termsIds: ["advance-50", "scope-fixed", "client-inputs"],
    lines: [
      { description: "Logistics operations core — booking, dispatch, trip costing", qty: 1, unit: "nos", rate: 42000 },
      { description: "Driver mobile app, Android and iOS", qty: 1, unit: "nos", rate: 25000 },
      { description: "Tally integration", qty: 1, unit: "nos", rate: 8000 },
    ],
  },
  {
    kind: "proposal", client: 3, issue: -1, valid: 14, status: "draft",
    termsIds: ["advance-50", "scope-fixed", "client-inputs", "no-ranking"],
    lines: [
      { description: "School management system — admissions, fees, attendance, reports", qty: 1, unit: "nos", rate: 55000 },
      { description: "Parent mobile app", qty: 1, unit: "nos", rate: 25000 },
    ],
  },

  /* ------------------------------ Agreements ---------------------------- */
  { kind: "agreement", client: 1, issue: -7, status: "sent", lines: [] },
  { kind: "agreement", client: 2, issue: -14, status: "accepted", lines: [] },
  { kind: "agreement", client: 0, issue: -33, status: "accepted", lines: [] },
];

/* --------------------------------- Run ----------------------------------- */

async function clear() {
  const clients = await ClientModel.find({ notes: TAG }).lean();
  const ids = clients.map((c) => c._id);
  const docs = await BillingDocModel.find({ clientId: { $in: ids } }).lean();
  const docIds = docs.map((d) => d._id);

  const pays = await PaymentModel.deleteMany({ docId: { $in: docIds } });
  const dd = await BillingDocModel.deleteMany({ _id: { $in: docIds } });
  const cc = await ClientModel.deleteMany({ _id: { $in: ids } });

  console.log(
    `Removed ${cc.deletedCount} sample clients, ${dd.deletedCount} documents, ${pays.deletedCount} payments.`,
  );
  console.log("Numbers they consumed are not reused — an issued number is spent.");
}

async function seed() {
  const existing = await ClientModel.countDocuments({ notes: TAG });
  if (existing > 0) {
    console.error(
      `There are already ${existing} sample clients. Run with --clear first, or you will get two of everything.`,
    );
    process.exit(1);
  }

  const clients = await ClientModel.insertMany(
    CLIENTS.map((c) => ({ ...c, country: "India", notes: TAG })),
  );
  console.log(`Created ${clients.length} clients.`);

  const made: Record<string, number> = {};

  for (const r of RECIPES) {
    const c = clients[r.client];
    const { number, seq, fy } = await nextNumber(r.kind);
    const lines = r.lines.map((l) => ({ discountPct: 0, ...l }));

    const doc = await BillingDocModel.create({
      kind: r.kind,
      number,
      seq,
      fy,
      clientId: c._id,
      client: {
        name: c.name, company: c.company, email: c.email, phone: c.phone,
        line1: c.line1, city: c.city, state: c.state,
        postalCode: c.postalCode, country: "India",
      },
      issueDate: day(r.issue),
      validUntil: r.valid === undefined ? undefined : day(r.valid),
      dueDate: r.due === undefined ? undefined : day(r.due),
      lines,
      discountPct: 0,
      taxRate: 0,
      taxMode: "none",
      notes: r.notes,
      termsIds: r.termsIds ?? [],
      terms: composeTerms(r.termsIds ?? []),
      sections: r.kind === "proposal" || r.kind === "agreement" ? presetSections(r.kind) : [],
      status: r.status ?? "sent",
    });

    if (r.paidShare) {
      const { total } = computeTotals(lines, 0, 0, "none");
      /* Rounded to the rupee. A part payment of 14,266.394 is not a payment
         anybody ever made. */
      const amount = Math.round(total * r.paidShare);
      await PaymentModel.create({
        docId: doc._id,
        amount,
        date: day(r.issue + 5),
        method: r.paidShare === 1 ? "neft" : "upi",
        reference: `UTR${String(Math.abs(r.issue)).padStart(4, "0")}${r.client}`,
      });
      await BillingDocModel.updateOne(
        { _id: doc._id },
        { $set: { status: r.paidShare >= 1 ? "paid" : "partial" } },
      );
    } else if (r.kind === "invoice" && r.due !== undefined && r.due < 0) {
      await BillingDocModel.updateOne({ _id: doc._id }, { $set: { status: "overdue" } });
    }

    made[r.kind] = (made[r.kind] ?? 0) + 1;
  }

  for (const [kind, n] of Object.entries(made)) console.log(`Created ${n} ${kind}s.`);
  console.log("\nOpen /admin/billing. Run with --clear to remove all of it.");
}

async function main() {
  if (!isDbConfigured()) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }
  const conn = await connectDb();
  if (!conn) {
    console.error("Database unreachable.");
    process.exit(1);
  }

  if (process.argv.includes("--clear")) await clear();
  else await seed();

  await conn.connection.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
