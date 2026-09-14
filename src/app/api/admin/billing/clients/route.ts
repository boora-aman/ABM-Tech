import { requireSession } from "@/lib/auth";
import { plain } from "@/lib/db/mongoose";
import { ClientModel } from "@/lib/db/models";
import { clientWriteSchema } from "@/lib/validators";
import { ok, fail } from "@/lib/api";
import { requireDb, BillingUnavailable } from "@/lib/billing-repo";

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

export async function GET() {
  const bad = await guard();
  if (bad) return bad;
  const rows = await ClientModel.find().sort({ company: 1, name: 1 }).lean();
  return ok(plain(rows));
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
  const parsed = clientWriteSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  const created = await ClientModel.create(parsed.data);
  return ok(plain([created])[0], { status: 201 });
}

export async function PATCH(req: Request) {
  const bad = await guard();
  if (bad) return bad;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("Missing ?id.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }
  const parsed = clientWriteSchema.partial().safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  const saved = await ClientModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!saved) return fail("Not found.", 404);
  return ok(plain([saved])[0]);
}

export async function DELETE(req: Request) {
  const bad = await guard();
  if (bad) return bad;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("Missing ?id.");

  /* Archived, never deleted. Documents hold a snapshot of the client, but the
     clientId link is what lets you see everything billed to one company —
     and a client with history is a record, not a row to throw away. */
  const saved = await ClientModel.findByIdAndUpdate(id, { $set: { archived: true } }, { new: true }).lean();
  if (!saved) return fail("Not found.", 404);
  return ok({ id, archived: true });
}
