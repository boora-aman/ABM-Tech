import { RESOURCES, resourceNames } from "@/lib/resources";
import { ok, fail, bump, authenticateToken, hasScope } from "@/lib/api";

/* ==========================================================================
   POST /api/v1/revalidate

   Force-refresh the cached HTML for every page, or for the pages one resource
   renders into.

   Writes through the admin and the API already revalidate on their own, so
   this is not needed for normal editing. It exists for the cases that bypass
   those paths and therefore bypass the cache invalidation:

     • `npm run seed`, which writes to MongoDB directly
     • a `mongorestore` from backup
     • a bulk import script talking to the database rather than the API

   Without it, content changed underneath the app keeps serving the previously
   rendered HTML until the hourly ISR window expires.

   Body (optional): { "resource": "services" } to limit the scope.
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = await authenticateToken(req);
  if (!key) return fail("Invalid or missing bearer token.", 401);

  let body: { resource?: string } = {};
  try {
    body = (await req.json()) as { resource?: string };
  } catch {
    // An empty body is valid and means "everything".
  }

  if (body.resource) {
    const def = RESOURCES[body.resource];
    if (!def) return fail(`Unknown resource "${body.resource}".`, 404);
    if (!hasScope(key, body.resource, "write")) {
      return fail(`Token lacks scope "${body.resource}:write".`, 403);
    }
    bump(def.revalidate);
    return ok({ revalidated: def.revalidate, resource: body.resource });
  }

  // A full refresh touches every resource, so it needs write on all of them.
  const missing = resourceNames.filter((n) => !hasScope(key, n, "write"));
  if (missing.length) {
    return fail(
      `Token lacks write scope for: ${missing.join(", ")}. Pass {"resource":"<name>"} to refresh one.`,
      403,
    );
  }

  const paths = Array.from(
    new Set(resourceNames.flatMap((n) => RESOURCES[n].revalidate)),
  );
  bump(paths);
  return ok({ revalidated: paths });
}
