import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { resolveResource } from "@/lib/resources";
import { ok, fail, bump, authenticateToken, hasScope, rateLimited } from "@/lib/api";

/* ==========================================================================
   MACHINE API — /api/v1/[resource]

   The surface an automation, a cron job or an MCP server authenticates
   against. Deliberately separate from /api/admin:

     • different credential (bearer token, not a browser session cookie)
     • scoped per key, so a token can be read-only or limited to one resource
     • rate limited per key
     • versioned, so the admin UI can evolve without breaking a script

   It resolves through the same RESOURCES registry and the same zod schemas as
   the admin, so anything writable here is writable there and validated
   identically. Writes revalidate the same pages, which is what keeps the
   statically generated HTML correct after a machine edit.

     Authorization: Bearer abm_xxxxxxxx

   Scopes are `resource:action`, e.g. "services:read", "posts:write", "*:read".
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

async function guard(req: Request, resource: string, action: "read" | "write") {
  const key = await authenticateToken(req);
  if (!key) return { error: fail("Invalid or missing bearer token.", 401) };
  if (rateLimited(key.id)) return { error: fail("Rate limit exceeded.", 429) };

  const def = resolveResource(resource);
  if (!def) return { error: fail(`Unknown resource "${resource}".`, 404) };

  if (!hasScope(key, resource, action)) {
    return { error: fail(`Token lacks scope "${resource}:${action}".`, 403) };
  }

  if (!isDbConfigured()) return { error: fail("No database configured.", 503) };
  const conn = await connectDb();
  if (!conn) return { error: fail("Database unreachable.", 503) };

  return { def, key };
}

export async function GET(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const g = await guard(req, resource, "read");
  if (g.error) return g.error;
  const def = g.def!;

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100) || 100, 500);
  const skip = Math.max(Number(url.searchParams.get("skip") ?? 0) || 0, 0);

  // Only the resource's own unique key is filterable, so a caller cannot
  // craft an arbitrary Mongo query through the query string.
  const filter: Record<string, unknown> = {};
  if (def.uniqueKey) {
    const v = url.searchParams.get(def.uniqueKey);
    if (v) filter[def.uniqueKey] = v;
  }

  const [docs, total] = await Promise.all([
    def.model.find(filter).sort(def.sort).skip(skip).limit(limit).lean(),
    def.model.countDocuments(filter),
  ]);

  return ok({ items: plain(docs), total, limit, skip });
}

export async function POST(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const g = await guard(req, resource, "write");
  if (g.error) return g.error;
  const def = g.def!;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }

  const parsed = def.schema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
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
    console.error(`[v1:${resource}] write failed:`, err);
    return fail("Could not save. A unique field may already be in use.", 409);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const g = await guard(req, resource, "write");
  if (g.error) return g.error;
  const def = g.def!;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const uniq = def.uniqueKey ? url.searchParams.get(def.uniqueKey) : null;
  if (!id && !uniq) {
    return fail(`Provide ?id= or ?${def.uniqueKey ?? "id"}=.`);
  }

  try {
    const removed = id
      ? await def.model.findByIdAndDelete(id)
      : await def.model.findOneAndDelete({ [def.uniqueKey!]: uniq });
    if (!removed) return fail("Not found.", 404);
    bump(def.revalidate);
    return ok({ deleted: true });
  } catch (err) {
    console.error(`[v1:${resource}] delete failed:`, err);
    return fail("Could not delete.", 500);
  }
}
