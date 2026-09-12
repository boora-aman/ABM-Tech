import { requireSession } from "@/lib/auth";
import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { SiteDetailsModel } from "@/lib/db/models";
import { siteDetailsWriteSchema } from "@/lib/validators";
import { ok, fail, bumpEverything } from "@/lib/api";

/* ==========================================================================
   SITE DETAILS — /api/admin/site

   A singleton, not a collection: one document keyed "site". Kept out of the
   generic RESOURCES registry because that path upserts by a unique key and
   would happily create a second row, and a second row would silently win.

   Contact and address changes touch nearly every page — the footer is on all
   of them, and the Organization/LocalBusiness schema is emitted from the root
   layout — so a write revalidates broadly rather than surgically.
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  const session = await requireSession();
  if (!session) return fail("Not signed in.", 401);
  if (!isDbConfigured()) {
    return fail(
      "No database configured. Set MONGODB_URI to edit site details; the site is serving the values committed in site.config.ts.",
      503,
    );
  }
  const conn = await connectDb();
  if (!conn) return fail("Database unreachable.", 503);
  return null;
}

export async function GET() {
  const bad = await guard();
  if (bad) return bad;

  const doc = await SiteDetailsModel.findOne({ key: "site" }).lean();
  return ok(doc ? plain<Record<string, unknown>>([doc])[0] : {});
}

export async function PUT(req: Request) {
  const bad = await guard();
  if (bad) return bad;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }

  const parsed = siteDetailsWriteSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  /* A cleared field must be REMOVED from the document, not set to undefined.
     Mongoose silently drops undefined values from $set, so `{ email: undefined }`
     is a no-op and the old value survives — which made "clear a field to
     restore the default" quietly do nothing at all. Cleared keys therefore go
     into $unset. */
  const set: Record<string, unknown> = { key: "site" };
  const unset: Record<string, ""> = {};

  for (const [k, v] of Object.entries(parsed.data)) {
    if (v === "" || v === undefined) unset[k] = "";
    else set[k] = v;
  }

  const saved = await SiteDetailsModel.findOneAndUpdate(
    { key: "site" },
    {
      $set: set,
      ...(Object.keys(unset).length ? { $unset: unset } : {}),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  // The header, footer and Organization/LocalBusiness schema are rendered by
  // the ROOT LAYOUT, so a list of page paths does not refresh them — the
  // layout is a separate cache entry. Invalidating the layout cascades to
  // every route beneath it.
  bumpEverything();
  return ok(plain<Record<string, unknown>>([saved])[0]);
}
