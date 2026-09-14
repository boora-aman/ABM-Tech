import { requireSession } from "@/lib/auth";
import { BillingDocModel } from "@/lib/db/models";
import { sendDocSchema } from "@/lib/validators";
import { inrMoney } from "@/lib/billing";
import { getDoc, billingIdentity, syncStatus, requireDb, BillingUnavailable } from "@/lib/billing-repo";
import { renderDocPdf, pdfFilename } from "@/lib/pdf/render";
import { sendDocumentEmail, isMailConfigured } from "@/lib/mail";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  if (!(await requireSession())) return fail("Not signed in.", 401);
  if (!isMailConfigured())
    return fail("Email is not configured on the server — set RESEND_API_KEY.", 503);
  try {
    await requireDb();
  } catch (e) {
    return fail((e as BillingUnavailable).message, 503);
  }

  const { id } = await params;
  const doc = await getDoc(id);
  if (!doc) return fail("Not found.", 404);
  if (doc.status === "cancelled") return fail("This document is cancelled.", 409);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }
  const parsed = sendDocSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  const { to, subject, message } = parsed.data;

  const biz = await billingIdentity();
  const isQuote = doc.kind === "quotation";
  const heading = isQuote ? "Your quotation" : "Your invoice";

  try {
    const pdf = await renderDocPdf(doc, biz);
    await sendDocumentEmail({
      to,
      subject: subject || `${heading} ${doc.number} — ${biz.name}`,
      message,
      heading,
      number: doc.number,
      amount: `₹${inrMoney(doc.totals.total)}`,
      dueLabel: isQuote
        ? doc.validUntil && `Valid until|${doc.validUntil}`
        : doc.dueDate && `Due|${doc.dueDate}`,
      replyTo: biz.email,
      fromName: biz.name,
      filename: pdfFilename(doc),
      pdf,
    });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Sending failed.", 502);
  }

  /* Recorded only after the send actually succeeded — "sent at" that is set
     optimistically is the one field nobody thinks to doubt. */
  await BillingDocModel.updateOne(
    { _id: id },
    {
      $set: {
        sentAt: new Date(),
        lastSentTo: to,
        ...(doc.status === "draft" ? { status: "sent" } : {}),
      },
    },
  );
  await syncStatus(id);

  return ok(await getDoc(id));
}
