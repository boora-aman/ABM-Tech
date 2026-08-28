import { RESOURCES, resourceNames } from "@/lib/resources";
import { absoluteUrl, site } from "@/lib/site.config";

/* ==========================================================================
   GET /api/v1/openapi.json

   A full OpenAPI 3.1 description, generated from the same registry the routes
   resolve through — so it cannot describe an endpoint that does not exist.

   Deliberately unauthenticated: it documents the shape of the API, not any
   data. Being readable without a token is what lets an MCP server, a client
   generator or a developer discover the contract before they have one.
   ========================================================================== */

export const dynamic = "force-dynamic";

const envelope = (dataSchema: object) => ({
  type: "object",
  properties: { ok: { type: "boolean" }, data: dataSchema },
  required: ["ok"],
});

export function GET() {
  const paths: Record<string, unknown> = {
    "/": {
      get: {
        summary: "API index and capability discovery",
        operationId: "getApiIndex",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Resource list and scope format" } },
      },
    },
  };

  for (const name of resourceNames) {
    const def = RESOURCES[name];
    const key = def.uniqueKey;

    paths[`/${name}`] = {
      get: {
        summary: `List ${def.label.toLowerCase()}`,
        operationId: `list${name[0].toUpperCase()}${name.slice(1)}`,
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 100, maximum: 500 },
          },
          { name: "skip", in: "query", schema: { type: "integer", default: 0 } },
          ...(key
            ? [{ name: key, in: "query", schema: { type: "string" }, description: `Filter by ${key}` }]
            : []),
        ],
        responses: {
          "200": {
            description: "Paged list",
            content: {
              "application/json": {
                schema: envelope({
                  type: "object",
                  properties: {
                    items: { type: "array", items: { type: "object" } },
                    total: { type: "integer" },
                    limit: { type: "integer" },
                    skip: { type: "integer" },
                  },
                }),
              },
            },
          },
          "401": { description: "Missing or invalid token" },
          "403": { description: `Token lacks ${name}:read` },
          "429": { description: "Rate limited" },
        },
      },
      post: {
        summary: key
          ? `Create or update a record, upserted on ${key}`
          : `Create a record`,
        operationId: `upsert${name[0].toUpperCase()}${name.slice(1)}`,
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: {
          "201": { description: "Saved" },
          "422": { description: "Validation failed; `detail` lists the offending paths" },
          "403": { description: `Token lacks ${name}:write` },
        },
      },
      delete: {
        summary: `Delete a record`,
        operationId: `delete${name[0].toUpperCase()}${name.slice(1)}`,
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "query", schema: { type: "string" } },
          ...(key ? [{ name: key, in: "query", schema: { type: "string" } }] : []),
        ],
        responses: {
          "200": { description: "Deleted" },
          "404": { description: "Not found" },
        },
      },
    };
  }

  const doc = {
    openapi: "3.1.0",
    info: {
      title: `${site.name} Content API`,
      version: "1.0.0",
      description:
        "Read and write the content that renders abmtech.in. Every write is validated against the same schema the admin UI uses and revalidates the affected static pages, so published changes appear without a redeploy.",
      contact: { email: site.contact.email },
    },
    servers: [{ url: absoluteUrl("/api/v1") }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description:
            "Token from the admin under Settings → API keys. Scopes are <resource>:<read|write>, or *:<read|write>.",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths,
  };

  return new Response(JSON.stringify(doc, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600",
    },
  });
}
