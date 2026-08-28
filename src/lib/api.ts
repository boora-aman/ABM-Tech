import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { ApiKeyModel } from "@/lib/db/models";

/* ==========================================================================
   API PLUMBING — shared by /api/admin and /api/v1.
   ========================================================================== */

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json({ ok: false, error: message, detail: extra }, { status });
}

/**
 * Regenerate the static HTML for every page a write could have changed.
 *
 * A path containing a `[param]` segment is a ROUTE PATTERN, not a URL, and
 * must be revalidated with the "page" type — `revalidatePath("/services")`
 * does nothing for `/services/crm`, because they are different cache entries.
 * Missing that is why a price edit updated the listing pages while the detail
 * page kept serving stale output.
 */
export function bump(paths: string[]) {
  for (const p of paths) {
    try {
      if (p.includes("[")) revalidatePath(p, "page");
      else revalidatePath(p);
    } catch (err) {
      // A failed revalidation must not fail the write — the content is saved
      // either way and the page refreshes on its next ISR interval.
      console.error(`[revalidate] ${p} failed:`, err);
    }
  }
}

/* ------------------------------- API keys -------------------------------- */

const TOKEN_PREFIX = "abm_";

/** Only the hash is ever stored, so a database dump yields no usable tokens. */
export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateToken() {
  const token = `${TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
  return { token, tokenHash: hashToken(token), prefix: token.slice(0, 12) };
}

export type ApiKeyRecord = {
  id: string;
  name: string;
  scopes: string[];
  revoked?: boolean;
  expiresAt?: string;
};

/**
 * Resolve a bearer token to its key record.
 *
 * The hash comparison is constant-time. It is a defensive habit more than a
 * strict necessity here — the value compared is already a SHA-256 digest — but
 * it costs nothing and removes the question entirely.
 */
export async function authenticateToken(req: Request): Promise<ApiKeyRecord | null> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
  if (!isDbConfigured()) return null;

  const conn = await connectDb();
  if (!conn) return null;

  const digest = hashToken(token);
  const doc = await ApiKeyModel.findOne({ tokenHash: digest, revoked: { $ne: true } })
    .lean()
    .exec();
  if (!doc) return null;

  const stored = Buffer.from(String(doc.tokenHash), "utf8");
  const given = Buffer.from(digest, "utf8");
  if (stored.length !== given.length || !timingSafeEqual(stored, given)) return null;

  const expires = doc.expiresAt ? new Date(String(doc.expiresAt)) : null;
  if (expires && expires.getTime() < Date.now()) return null;

  // Fire-and-forget: last-used tracking must never delay or fail a request.
  void ApiKeyModel.updateOne({ _id: doc._id }, { $set: { lastUsedAt: new Date() } })
    .exec()
    .catch(() => {});

  return plain<ApiKeyRecord>([doc])[0];
}

/**
 * Scope check. A scope is `resource:action`; `*` matches any resource.
 * `write` implies `read` on the same resource, since a caller that can change
 * a record can trivially read it back.
 */
export function hasScope(key: ApiKeyRecord, resource: string, action: "read" | "write") {
  return key.scopes.some((s) => {
    const [res, act] = s.split(":");
    if (res !== "*" && res !== resource) return false;
    return act === action || (act === "write" && action === "read");
  });
}

/* ------------------------------ Rate limit ------------------------------- */

/**
 * Per-key sliding window, in memory. A speed bump against a runaway script,
 * not a security control — it resets on deploy and is per-process. If the API
 * is ever genuinely targeted, move this to Redis.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;

export function rateLimited(keyId: string) {
  const now = Date.now();
  const recent = (HITS.get(keyId) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(keyId, recent);
  if (HITS.size > 2000) {
    for (const [k, v] of HITS) {
      if (!v.some((t) => now - t < WINDOW_MS)) HITS.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}
