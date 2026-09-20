import { requireSession } from "@/lib/auth";
import { BillingDocModel, ClientModel } from "@/lib/db/models";
import { billingDocWriteSchema } from "@/lib/validators";
import { composeTerms } from "@/lib/billing-terms";
import { isLongForm, presetSections } from "@/lib/billing-sections";
import { getDoc, listDocs, nextNumber, requireDb, BillingUnavailable } from "@/lib/billing-repo";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  if (!(await requireSession())) return fail("Not signed in.", 401);
  try {
    await requireDb();
  } catch (e) {
    return fail((e as BillingUnavailable).message, 503);
  }
  return null;
}

export async function GET(req: Request) {
  const bad = await guard();
  if (bad) return bad;
  const kind = new URL(req.url).searchParams.get("kind");
  const rows = await listDocs(
    kind === "quotation" || kind === "invoice" ? kind : undefined,
  );
  return ok(rows);
}

export async function POST(req: Request) {
  const bad = await guard();
  if (bad) return bad;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }
  const parsed = billingDocWriteSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  const d = parsed.data;

  const client = await ClientModel.findById(d.clientId).lean();
  if (!client) return fail("That client no longer exists.", 404);

  /* A quotation or an invoice without a line is an empty promise; the schema
     cannot enforce it because an agreement legitimately has none. */
  if (!isLongForm(d.kind) && d.lines.length === 0)
    return fail("Add at least one line.", 422);

  const { number, seq, fy } = await nextNumber(d.kind);

  const c = client as Record<string, string>;
  const created = await BillingDocModel.create({
    ...d,
    /* Composed here, not accepted from the client: the printed terms must be
       the clauses that were actually ticked. */
    terms: composeTerms(d.termsIds ?? [], d.customTerms),
    /* A long document created without prose gets the standard set, so an
       empty proposal is never what lands on a client's desk. */
    sections:
      d.sections ?? (isLongForm(d.kind) ? presetSections(d.kind) : []),
    number,
    seq,
    fy,
    /* A snapshot, not a join. An invoice records what was sent; if the client
       moves office next year this document must still show where it went. */
    client: {
      name: c.name, company: c.company, email: c.email, phone: c.phone,
      gstin: c.gstin, line1: c.line1, line2: c.line2, city: c.city,
      state: c.state, postalCode: c.postalCode, country: c.country,
    },
  });

  /* Returned the same shape as GET — totals and balance included — so the
     caller never has to guess which endpoint gives the enriched row. */
  return ok(await getDoc(String(created._id)), { status: 201 });
}
