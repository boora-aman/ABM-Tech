import { requireSession } from "@/lib/auth";
import { PaymentModel } from "@/lib/db/models";
import { sendDocSchema } from "@/lib/validators";
import { inrMoney } from "@/lib/billing";
import { getReceipt, billingIdentity, requireDb, BillingUnavailable } from "@/lib/billing-repo";
import { renderReceiptPdf, pdfFilename } from "@/lib/pdf/render";
import { sendDocumentEmail, isMailConfigured } from "@/lib/mail";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string; paymentId: string }> };

async function guard() {
  if (!(await requireSession())) return fail("Not signed in.", 401);
  try {
    await requireDb();
  } catch (e) {
    return fail((e as BillingUnavailable).message, 503);
  }
  return null;
}

/** The receipt as a PDF. `?download=1` saves it; without, it opens in the viewer. */
export async function GET(req: Request, { params }: Ctx) {
  const bad = await guard();
  if (bad) return bad;
  const { id, paymentId } = await params;

  const receipt = await getReceipt(id, paymentId);
  if (!receipt) return fail("No such payment on this invoice.", 404);

  const pdf = await renderReceiptPdf(receipt, await billingIdentity());
  const download = new URL(req.url).searchParams.get("download") === "1";

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${pdfFilename({ kind: "receipt", number: receipt.number })}"`,
      "Cache-Control": "no-store",
    },
  });
}

/** Email the receipt, PDF attached. */
export async function POST(req: Request, { params }: Ctx) {
  const bad = await guard();
  if (bad) return bad;
  if (!isMailConfigured())
    return fail("Email is not configured on the server — set RESEND_API_KEY.", 503);

  const { id, paymentId } = await params;
  const receipt = await getReceipt(id, paymentId);
  if (!receipt) return fail("No such payment on this invoice.", 404);

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
  const settled = receipt.balanceAfter <= 0;

  try {
    const pdf = await renderReceiptPdf(receipt, biz);
    await sendDocumentEmail({
      to,
      subject: subject || `Payment received — ${receipt.number} — ${biz.name}`,
      message,
      heading: settled ? "Payment received — thank you" : "Part payment received — thank you",
      number: `${receipt.number}  ·  against ${receipt.invoice.number}`,
      amount: `₹${inrMoney(receipt.amount)}`,
      dueLabel: settled
        ? "Invoice status|Paid in full"
        : `Balance still due|₹${inrMoney(receipt.balanceAfter)}`,
      replyTo: biz.email,
      fromName: biz.name,
      filename: pdfFilename({ kind: "receipt", number: receipt.number }),
      pdf,
    });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Sending failed.", 502);
  }

  /* Recorded only after the send actually succeeded. */
  await PaymentModel.updateOne(
    { _id: paymentId },
    { $set: { receiptSentAt: new Date(), receiptSentTo: to } },
  );

  return ok(await getReceipt(id, paymentId));
}
