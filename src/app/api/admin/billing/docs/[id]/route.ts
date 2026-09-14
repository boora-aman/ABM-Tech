import { requireSession } from "@/lib/auth";
import { plain } from "@/lib/db/mongoose";
import { BillingDocModel, PaymentModel } from "@/lib/db/models";
import { billingDocWriteSchema } from "@/lib/validators";
import { getDoc, listPayments, syncStatus, requireDb, BillingUnavailable } from "@/lib/billing-repo";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function guard() {
  if (!(await requireSession())) return fail("Not signed in.", 401);
  try {
    await requireDb();
  } catch (e) {
    return fail((e as BillingUnavailable).message, 503);
  }
  return null;
}

export async function GET(_req: Request, { params }: Ctx) {
  const bad = await guard();
  if (bad) return bad;
  const { id } = await params;
  const doc = await getDoc(id);
  if (!doc) return fail("Not found.", 404);
  return ok({ ...doc, payments: await listPayments(id) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const bad = await guard();
  if (bad) return bad;
  const { id } = await params;

  const existing = await BillingDocModel.findById(id).lean();
  if (!existing) return fail("Not found.", 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }
  const parsed = billingDocWriteSchema.partial().safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  /* A document that has been paid against is a record of a transaction, not a
     draft. Editing the lines under a recorded payment makes the payment refer
     to something that never existed. Cancel and reissue instead. */
  const payments = await PaymentModel.countDocuments({ docId: id });
  const touchesMoney =
    parsed.data.lines !== undefined ||
    parsed.data.discountPct !== undefined ||
    parsed.data.taxRate !== undefined ||
    parsed.data.taxMode !== undefined;

  if (payments > 0 && touchesMoney) {
    return fail(
      "This invoice has payments recorded against it, so its amounts are locked. Cancel it and issue a new one.",
      409,
    );
  }

  // The number and the client snapshot are never editable.
  const { ...safe } = parsed.data;
  const saved = await BillingDocModel.findByIdAndUpdate(id, { $set: safe }, { new: true }).lean();
  await syncStatus(id);
  return ok(plain([saved])[0]);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const bad = await guard();
  if (bad) return bad;
  const { id } = await params;

  const doc = await BillingDocModel.findById(id).lean();
  if (!doc) return fail("Not found.", 404);

  /* Only an untouched draft can be deleted. Once a document carries a number
     it has been issued against a gapless sequence, and deleting it leaves a
     hole an auditor will ask about. Everything else is cancelled. */
  if (doc.status !== "draft") {
    return fail(
      "Only a draft can be deleted. Issued documents are cancelled so the numbering stays gapless.",
      409,
    );
  }
  const payments = await PaymentModel.countDocuments({ docId: id });
  if (payments > 0) return fail("There are payments recorded against this.", 409);

  await BillingDocModel.findByIdAndDelete(id);
  return ok({ id, deleted: true });
}
