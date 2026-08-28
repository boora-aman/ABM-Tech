import { RESOURCES, resourceNames } from "@/lib/resources";
import { absoluteUrl } from "@/lib/site.config";
import { authenticateToken, ok, fail } from "@/lib/api";

/* ==========================================================================
   GET /api/v1 — machine-readable index of the API.

   An MCP server, or any agent, can call this once and discover every
   resource, its unique key and the scopes it needs, without a human writing
   a tool definition by hand. That is the whole reason this exists.
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const key = await authenticateToken(req);
  if (!key) return fail("Invalid or missing bearer token.", 401);

  return ok({
    version: "1",
    baseUrl: absoluteUrl("/api/v1"),
    authentication: {
      type: "bearer",
      header: "Authorization: Bearer <token>",
      note: "Tokens are created in the admin under Settings → API keys. Only the hash is stored; a token is shown once.",
    },
    yourKey: { name: key.name, scopes: key.scopes },
    scopeFormat: "<resource>:<read|write>, or *:<read|write>. write implies read.",
    rateLimit: { requests: 120, windowSeconds: 60, per: "api key" },
    resources: resourceNames.map((name) => {
      const def = RESOURCES[name];
      return {
        name,
        label: def.label,
        uniqueKey: def.uniqueKey ?? null,
        path: `/api/v1/${name}`,
        methods: {
          GET: `List. Query: limit (max 500), skip${def.uniqueKey ? `, ${def.uniqueKey}` : ""}.`,
          POST: def.uniqueKey
            ? `Create or update, upserted on "${def.uniqueKey}".`
            : "Create.",
          DELETE: def.uniqueKey
            ? `Delete by ?id= or ?${def.uniqueKey}=.`
            : "Delete by ?id=.",
        },
        scopes: [`${name}:read`, `${name}:write`],
      };
    }),
    notes: [
      "Writes revalidate the affected static pages automatically, so published changes appear immediately without a redeploy.",
      "Every write is validated against the same schema the admin UI uses; unknown fields are rejected rather than stored.",
      "Call GET /api/v1/openapi.json for a full OpenAPI 3.1 document.",
    ],
  });
}
