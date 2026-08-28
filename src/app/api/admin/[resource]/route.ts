import { requireSession } from "@/lib/auth";
import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { resolveResource } from "@/lib/resources";
import { ok, fail, bump } from "@/lib/api";

/* ==========================================================================
   ADMIN CRUD — /api/admin/[resource]

   Session-authenticated, used by the admin UI. Every write:
     1. requires a valid admin session
     2. resolves the resource against an explicit allow-list
     3. validates the body with the resource's zod schema
     4. upserts on the resource's unique key
     5. revalidates the pages that render it

   Step 2 matters: the resource name comes from the URL, so a lookup against
   an allow-list rather than dynamic model resolution is what stops
   /api/admin/adminusers from being a valid route.
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

async function guard(resource: string) {
  const session = await requireSession();
  if (!session) return { error: fail("Not signed in.", 401) };
  if (!isDbConfigured()) {
    return {
      error: fail(
        "No database configured. Set MONGODB_URI to enable editing; the site is serving bundled seed content.",
        503,
      ),
    };
  }
  const conn = await connectDb();
  if (!conn) return { error: fail("Database unreachable.", 503) };

  const def = resolveResource(resource);
  if (!def) return { error: fail(`Unknown resource "${resource}".`, 404) };

  return { def, session };
}

export async function GET(_req: Request, { params }: Ctx) {
  const { resource } = await params;
  const g = await guard(resource);
  if (g.error) return g.error;

  const docs = await g.def!.model.find().sort(g.def!.sort).lean();
  return ok(plain(docs));
}

export async function POST(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const g = await guard(resource);
  if (g.error) return g.error;
  const def = g.def!;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }

  const parsed = def.schema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed.", 422, parsed.error.issues);
  }
  const data = parsed.data as Record<string, unknown>;

  try {
    let saved;
    if (def.uniqueKey && data[def.uniqueKey]) {
      saved = await def.model.findOneAndUpdate(
        { [def.uniqueKey]: data[def.uniqueKey] },
        { $set: data },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    } else {
      saved = await def.model.create(data);
    }
    bump(def.revalidate);
    return ok(plain([saved])[0], { status: 201 });
  } catch (err) {
    console.error(`[admin:${resource}] create failed:`, err);
    return fail("Could not save. A unique field may already be in use.", 409);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const g = await guard(resource);
  if (g.error) return g.error;
  const def = g.def!;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return fail("Missing ?id.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }

  // Partial updates are validated against a partial of the same schema, so a
  // single-field edit does not have to resend the whole document.
  const partial =
    "partial" in def.schema && typeof def.schema.partial === "function"
      ? (def.schema as unknown as { partial: () => typeof def.schema }).partial()
      : def.schema;

  const parsed = partial.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  try {
    const saved = await def.model.findByIdAndUpdate(
      id,
      { $set: parsed.data as Record<string, unknown> },
      { new: true },
    );
    if (!saved) return fail("Not found.", 404);
    bump(def.revalidate);
    return ok(plain([saved])[0]);
  } catch (err) {
    console.error(`[admin:${resource}] update failed:`, err);
    return fail("Could not update.", 409);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const g = await guard(resource);
  if (g.error) return g.error;
  const def = g.def!;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return fail("Missing ?id.");

  try {
    const removed = await def.model.findByIdAndDelete(id);
    if (!removed) return fail("Not found.", 404);
    bump(def.revalidate);
    return ok({ id });
  } catch (err) {
    console.error(`[admin:${resource}] delete failed:`, err);
    return fail("Could not delete.", 500);
  }
}
