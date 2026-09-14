import { requireSession } from "@/lib/auth";
import { plain } from "@/lib/db/mongoose";
import { BillingDocModel, PaymentModel } from "@/lib/db/models";
import { paymentWriteSchema } from "@/lib/validators";
import { listPayments, syncStatus, getDoc, requireDb, BillingUnavailable } from "@/lib/billing-repo";
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
  return ok(await listPayments(id));
}

export async function POST(req: Request, { params }: Ctx) {
  const bad = await guard();
  if (bad) return bad;
  const { id } = await params;

  const doc = await BillingDocModel.findById(id).lean();
  if (!doc) return fail("Not found.", 404);
  if (doc.kind !== "invoice")
    return fail("Payments are recorded against invoices, not quotations.", 409);
  if (doc.status === "cancelled") return fail("This invoice is cancelled.", 409);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }
  const parsed = paymentWriteSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  await PaymentModel.create({ ...parsed.data, docId: id });
  /* A draft that has been paid against is no longer a draft, and syncStatus
     deliberately leaves drafts alone — so lift it here before recomputing. */
  if (doc.status === "draft")
    await BillingDocModel.updateOne({ _id: id }, { $set: { status: "sent" } });
  await syncStatus(id);

  return ok(await getDoc(id), { status: 201 });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const bad = await guard();
  if (bad) return bad;
  const { id } = await params;
  const paymentId = new URL(req.url).searchParams.get("paymentId");
  if (!paymentId) return fail("Which payment?");

  const removed = await PaymentModel.findOneAndDelete({ _id: paymentId, docId: id }).lean();
  if (!removed) return fail("Not found.", 404);
  await syncStatus(id);
  return ok(plain([removed])[0]);
}
