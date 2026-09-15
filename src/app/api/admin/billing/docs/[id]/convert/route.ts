import { requireSession } from "@/lib/auth";
import { BillingDocModel } from "@/lib/db/models";
import { getDoc, nextNumber, requireDb, BillingUnavailable } from "@/lib/billing-repo";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Turn an accepted quotation into an invoice.
 *
 * A copy, not a change of `kind`: the quotation is what the client agreed to
 * and has to stay readable afterwards, with its own number, under its own
 * sequence. The two are linked both ways so either one leads to the other.
 */
export async function POST(_req: Request, { params }: Ctx) {
  if (!(await requireSession())) return fail("Not signed in.", 401);
  try {
    await requireDb();
  } catch (e) {
    return fail((e as BillingUnavailable).message, 503);
  }

  const { id } = await params;
  const quote = await BillingDocModel.findById(id).lean();
  if (!quote) return fail("Not found.", 404);
  if (quote.kind !== "quotation") return fail("That is already an invoice.", 409);
  if (quote.convertedToId)
    return fail("This quotation has already been invoiced.", 409, { invoiceId: String(quote.convertedToId) });

  const { number, seq, fy } = await nextNumber("invoice");
  const today = new Date().toISOString().slice(0, 10);

  const invoice = await BillingDocModel.create({
    kind: "invoice",
    number,
    seq,
    fy,
    clientId: quote.clientId,
    client: quote.client,
    issueDate: today,
    lines: quote.lines,
    discountPct: quote.discountPct,
    taxRate: quote.taxRate,
    taxMode: quote.taxMode,
    notes: quote.notes,
    terms: quote.terms,
    termsIds: quote.termsIds,
    customTerms: quote.customTerms,
    status: "draft",
    convertedFromId: quote._id,
  });

  await BillingDocModel.updateOne(
    { _id: id },
    { $set: { convertedToId: invoice._id, status: "accepted" } },
  );

  return ok(await getDoc(String(invoice._id)), { status: 201 });
}
