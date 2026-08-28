# ABM Tech Content API

A versioned REST API over the same content the site renders, designed so an
MCP server or any automation can read and write it without a human in the loop.

**Base URL:** `https://abmtech.in/api/v1`

---

## Why this exists separately from `/api/admin`

`/api/admin` is authenticated by a browser session cookie and exists to serve
the admin UI. `/api/v1` is authenticated by a bearer token, is scoped per key,
is rate limited, and is versioned so the admin can change without breaking a
script.

Both resolve through the **same resource registry and the same zod schemas**,
so an automation cannot write a shape the admin would have rejected, and both
trigger the same page revalidation.

---

## Authentication

Create a token in the admin under **API keys** (owner only).

```
Authorization: Bearer abm_xxxxxxxxxxxxxxxxxxxx
```

Only the SHA-256 hash is stored. The token is shown **once** at creation — if
it is lost, revoke it and issue another.

### Scopes

`<resource>:<read|write>`, or `*:<read|write>` for all resources.
`write` implies `read` on the same resource.

```
services:read       read services only
posts:write         read and write posts
*:read              read everything
```

Give a key the narrowest scope that does the job. A key that only publishes
blog posts should be `posts:write`, not `*:write`.

### Rate limit

120 requests per minute per key. Exceeding it returns `429`.

---

## Discovery

Two endpoints exist so tooling can configure itself rather than being
hand-written:

```bash
# Resource list, unique keys, scopes, methods
curl -H "Authorization: Bearer $TOKEN" https://abmtech.in/api/v1

# Full OpenAPI 3.1 document (no token needed — it describes shape, not data)
curl https://abmtech.in/api/v1/openapi.json
```

---

## Resources

| Resource | Unique key | What it controls |
| --- | --- | --- |
| `services` | `slug` | The 13 services, their prices, deliverables, FAQs |
| `posts` | `slug` | Journal articles |
| `industries` | `slug` | The 12 sectors |
| `pillars` | `key` | The six systems |
| `projects` | `slug` | Case studies on /work |
| `slides` | `slug` | Homepage showcase |
| `settings` | `key` | Page copy overrides (hero headline, section leads) |
| `faqs` | — | Site-wide FAQs |
| `commitments` | — | The "how we work" commitments |

---

## Response envelope

Every response is wrapped:

```json
{ "ok": true, "data": … }
{ "ok": false, "error": "Validation failed.", "detail": [ … ] }
```

On a `422`, `detail` is the zod issue list — each entry names the exact failing
path, so a script can report precisely what it got wrong.

---

## Examples

### Read

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://abmtech.in/api/v1/services?limit=50"

# One record by its unique key
curl -H "Authorization: Bearer $TOKEN" \
  "https://abmtech.in/api/v1/services?slug=crm"
```

```json
{
  "ok": true,
  "data": { "items": [ … ], "total": 13, "limit": 50, "skip": 0 }
}
```

### Update a price

`POST` upserts on the unique key, and uses `$set`, so you only send the fields
you are changing — everything else on the record is left alone.

```bash
curl -X POST https://abmtech.in/api/v1/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "crm",
    "title": "Custom CRM",
    "short": "CRM",
    "from": 14000,
    "priceMode": "project",
    "pillar": "capture"
  }'
```

The pricing page, the service page, the sitemap and `llms.txt` all reflect this
within a second — the write calls `revalidatePath` on every page that renders
it.

### Publish a post

```bash
curl -X POST https://abmtech.in/api/v1/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "why-fixed-price-works",
    "title": "Why fixed price works",
    "excerpt": "The commercial case for writing scope down.",
    "keyTakeaway": "A fixed price is only fixed if the exclusions are itemised.",
    "body": "## The problem\n\nMarkdown body…",
    "tags": ["Pricing"],
    "publishedAt": "2026-09-01",
    "published": true
  }'
```

### Change page copy

```bash
curl -X POST https://abmtech.in/api/v1/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "hero.headlineAccent",
    "group": "hero",
    "value": "We build all six."
  }'
```

Settings keys read by the site. Every group takes the same four keys, plus
`cta.points`:

| Group | Section | Where it renders |
| --- | --- | --- |
| `hero` | Home hero | `/` |
| `systems` | "The whole business" | `/`, `/industries` |
| `services` | "What we do" | `/` |
| `industries` | "Who we build for" | `/`, `/industries` |
| `approach` | "How we work" | `/`, `/about` |
| `cta` | Closing call to action | every page |

Per group:

| Key | Type | Example |
| --- | --- | --- |
| `<group>.eyebrow` | string | `"What we do"` |
| `<group>.heading` | string[] | `["Everything you need to run"]` — one entry per line |
| `<group>.headingAccent` | string | `"and grow the business."` — the orange line |
| `<group>.lead` | string | the paragraph beside the heading |
| `cta.points` | string[] | the four ticks in the CTA panel |

Deleting a key restores the committed copy — it never blanks the page.

### Forcing a cache refresh

Writes through the admin and this API revalidate the affected pages
automatically. Changes made **around** them — `npm run seed`, a
`mongorestore`, a script writing to MongoDB directly — do not, and the site
keeps serving previously rendered HTML until the hourly ISR window expires.

```bash
# Everything (needs write scope on all resources)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  https://abmtech.in/api/v1/revalidate

# Just the pages one resource renders into
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resource":"services"}' \
  https://abmtech.in/api/v1/revalidate
```

### Delete

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  "https://abmtech.in/api/v1/posts?slug=old-post"
```

---

## Wiring it to MCP

The API is deliberately shaped so an MCP server is thin:

- `GET /api/v1` returns the resource list, unique keys and scopes — enough to
  generate tool definitions at runtime rather than hardcoding them.
- `GET /api/v1/openapi.json` is a complete OpenAPI 3.1 document, so any
  OpenAPI-to-MCP bridge can consume it directly with no custom code.
- The response envelope is uniform, so error handling is written once.
- `422` responses carry machine-readable issue paths, so an agent can correct
  its own payload and retry instead of failing opaquely.

A reasonable first setup is one token scoped `*:read` for a research or
reporting agent, and a second scoped to exactly the resources an authoring
agent is allowed to change.

---

## Security notes

- Tokens are stored as SHA-256 hashes; a database dump yields no usable
  credentials.
- Keys are **revoked**, never deleted, so a token seen in a log later can still
  be identified.
- Only the resource's own unique key is filterable via the query string, so a
  caller cannot craft an arbitrary Mongo query.
- Unknown fields are rejected rather than stored — every schema is `.strict()`.
- `/api/` is disallowed in `robots.txt` and the admin is `noindex` at three
  independent layers.
