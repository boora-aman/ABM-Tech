import { requireOwner } from "@/lib/auth";
import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { ApiKeyModel } from "@/lib/db/models";
import { apiKeyWriteSchema } from "@/lib/validators";
import { ok, fail, generateToken } from "@/lib/api";

/* ==========================================================================
   API KEY MANAGEMENT — /api/admin/keys

   Owner-only, and outside the generic RESOURCES registry for one reason: the
   plaintext token is returned exactly once, at creation, and never again.
   Only its SHA-256 hash is stored, so there is no "show key" endpoint to
   build and no database dump that yields working credentials.

   Keys are revoked rather than deleted, so a token that appears in an access
   log later can still be identified.
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  const session = await requireOwner();
  if (!session) return fail("Owner access required.", 403);
  if (!isDbConfigured()) return fail("No database configured.", 503);
  const conn = await connectDb();
  if (!conn) return fail("Database unreachable.", 503);
  return null;
}

export async function GET() {
  const bad = await guard();
  if (bad) return bad;

  const docs = await ApiKeyModel.find().sort({ createdAt: -1 }).lean();
  // tokenHash is never returned — the prefix is enough to identify a key.
  const rows = plain<Record<string, unknown>>(docs).map(({ tokenHash, ...rest }) => {
    void tokenHash;
    return rest;
  });
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

  const parsed = apiKeyWriteSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  const { token, tokenHash, prefix } = generateToken();
  const created = await ApiKeyModel.create({
    name: parsed.data.name,
    scopes: parsed.data.scopes,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    tokenHash,
    prefix,
  });

  return ok(
    {
      id: String(created._id),
      name: parsed.data.name,
      scopes: parsed.data.scopes,
      prefix,
      /** Shown once. There is no way to retrieve it again. */
      token,
    },
    { status: 201 },
  );
}

export async function DELETE(req: Request) {
  const bad = await guard();
  if (bad) return bad;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("Missing ?id.");

  const revoked = await ApiKeyModel.findByIdAndUpdate(
    id,
    { $set: { revoked: true } },
    { new: true },
  );
  if (!revoked) return fail("Not found.", 404);
  return ok({ id, revoked: true });
}
