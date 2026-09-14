import { requireSession } from "@/lib/auth";
import { getDoc, billingIdentity, requireDb, BillingUnavailable } from "@/lib/billing-repo";
import { renderDocPdf, pdfFilename } from "@/lib/pdf/render";
import { fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  if (!(await requireSession())) return fail("Not signed in.", 401);
  try {
    await requireDb();
  } catch (e) {
    return fail((e as BillingUnavailable).message, 503);
  }

  const { id } = await params;
  const doc = await getDoc(id);
  if (!doc) return fail("Not found.", 404);

  const biz = await billingIdentity();
  const pdf = await renderDocPdf(doc, biz);

  /* `inline` opens it in the browser's viewer, `attachment` forces the save
     dialog. The list view links with ?download=1 so the button does what the
     label says, while the preview button just shows it. */
  const download = new URL(req.url).searchParams.get("download") === "1";

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${pdfFilename(doc)}"`,
      "Cache-Control": "no-store",
    },
  });
}
