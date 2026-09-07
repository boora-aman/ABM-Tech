<!-- Generated 2026-09-07 · skill: seo-plan · template: agency.md + local-service.md (hybrid) -->
# ABM Tech — Site Structure & Internal Linking

## 0. Where we are

**26 indexable URLs today.** 10 static + 13 services + 3 posts.

The technical foundation is not the problem. `sitemap.ts` is generated from
real routes, `robots.ts` deliberately allows AI crawlers, every page ships a
connected JSON-LD graph via `graph()`, and content is served from ISR'd server
components so crawlers get rendered markup. That is better than every
competitor found in the SERP.

**The problem is that the site has data for pages it never renders.**

| Data file | Entries | Route that renders them | Status |
| --- | --- | --- | --- |
| `content/industries.ts` | **12** | `/industries` (list only) | ❌ **no detail route** |
| `content/work.ts` | **4** | `/work` (list only) | ❌ **no detail route** |
| `content/pillars.ts` | 6 | none | ❌ **no route at all** |
| `content/faq.ts` | global FAQs | inlined only | ❌ **no `/faq`** |
| `content/services.ts` | 13 | `/services/[slug]` | ✅ |

**Twelve industry pages are written, typed, keyword-rich, and invisible to
Google.** Each one carries a sector-specific `pain` line and 5 `builds` bullets
in that sector's own vocabulary — which is exactly what "erp software for
pharmacy" needs to rank. That is the single highest-ROI move available and it
requires no new content.

---

## 1. Target architecture

```
/                                     Home
├── /services                         hub · ItemList schema
│   └── /services/{13 slugs}          ✅ exists
├── /systems                          NEW · 6 pillars hub (found/capture/operate/money/mobile/know)
│   └── /systems/{6 slugs}            NEW · the conceptual layer above services
├── /industries                       hub · ItemList schema
│   └── /industries/{12 slugs}        NEW ⭐ data already exists
├── /work                             hub
│   └── /work/{4 slugs}               NEW ⭐ data already exists
├── /google-business-profile-setup    NEW ⭐ money page, split from /services/maps-and-seo
├── /locations
│   ├── /locations/dehradun           NEW · primary city hub
│   ├── /locations/haridwar           NEW
│   ├── /locations/rishikesh          NEW
│   └── /locations/haldwani           NEW
├── /dehradun/{5 service slugs}       NEW · service × city, Dehradun only
├── /compare
│   ├── /compare/custom-crm-vs-zoho          NEW ⭐
│   ├── /compare/custom-erp-vs-tally         NEW ⭐
│   ├── /compare/custom-erp-vs-erpnext       NEW
│   ├── /compare/wordpress-vs-custom-website NEW
│   └── /compare/shopify-vs-custom-ecommerce NEW
├── /pricing                          ✅ add Offer schema + per-service anchors
├── /process                          NEW · HowTo schema
├── /faq                              NEW · data exists in faq.ts
├── /about                            ✅
│   └── /about/team                    NEW · E-E-A-T, Person schema
├── /reviews                          NEW · only if real reviews exist
├── /blog                             ✅
│   └── /blog/{slug}                  ✅ 3 → 40 over 12 months
├── /contact  /privacy  /terms        ✅
└── /llms.txt  /sitemap.xml  /robots.txt  /feed.xml   ✅
```

**26 → 89 indexable URLs** by month 12, none of it invented filler.

### Location page quality gate

The `local-service` template warns at 30+ location pages. We are deliberately
at **9** (4 city hubs + 5 Dehradun service pages).

**Rules, non-negotiable:**
- A city page ships only if it has ≥400 unique words: a named local reference, a real sector mix for that city, and a distinct FAQ.
- Service × city pages exist for **Dehradun only** — that is where the office and the GBP are. Haridwar/Rishikesh/Haldwani get one hub page each, no service split.
- **No programmatic city × service matrix.** 4 cities × 13 services = 52 near-duplicate pages is index bloat and a manual-action risk.
- If a city page cannot be written honestly, it does not ship. An empty "we serve Roorkee too" page costs more than it earns.

### The 5 Dehradun service pages

Chosen by genuine local search intent — someone searching these wants a person
they can meet:

`/dehradun/software-development` · `/dehradun/crm-software` ·
`/dehradun/website-design` · `/dehradun/billing-software` ·
`/dehradun/google-business-profile`

Not `/dehradun/ai-automation` or `/dehradun/integrations` — nobody searches
those with a city attached.

---

## 2. Why `/google-business-profile-setup` must be its own page

Right now the ₹2,499 one-time setup and the ₹5,000/month retainer both live
inside `/services/maps-and-seo`. That page is trying to rank for two different
intents with two different price points, and does neither well.

| Page | Intent | Offer | Primary keyword |
| --- | --- | --- | --- |
| `/google-business-profile-setup` | transactional, one-time, price-led | ₹2,499 one time | `google my business setup service` |
| `/services/maps-and-seo` | retainer, ongoing, outcome-led | ₹5,000/month | `local seo services dehradun` |

This is also the page the Instagram posters point to. Right now they point at
nothing specific — that traffic lands on a page where the ₹2,499 is one bullet
among twenty.

**Compliance carries into the page copy, not just the captions:** no ranking
promises, no verification-bypass claims, "built and submitted same day" only.
Same rules as `social/README.md` §6.

---

## 3. Internal linking architecture

### The graph already exists in the data

Two fields make almost all of this automatic:

- `Industry.services: string[]` — already maps each of 12 industries to its service slugs
- `Project.serviceSlug` — already maps each of 4 projects to its service

**`/services/[slug]` already consumes `serviceSlug` to show related projects.
Nothing consumes `Industry.services`.** Rendering `/industries/[slug]` turns
that one field into ~36 contextual internal links pointing straight at the
money pages, with sector-relevant anchor text.

### Required data additions

| File | Add | Why |
| --- | --- | --- |
| `content/industries.ts` | `keywords: string[]` | type has none; `generateMetadata` needs it |
| `content/industries.ts` | `intro`, `faqs`, `outcome` | detail page needs ≥600 words to not be thin |
| `content/posts.ts` | `serviceSlug?`, `industrySlug?` | lets every post auto-link to its money page |
| `content/work.ts` | `industrySlug`, `problem`, `approach`, `result` | case study page needs a narrative |
| `content/services.ts` | `pillar` ✅ already there | powers `/systems/[slug]` |

### Link rules

1. **Every money page needs ≥5 internal inbound links.** Money pages: the 13 services, `/google-business-profile-setup`, `/pricing`, the 5 comparison pages.
2. **Descriptive anchors only.** `custom CRM development` — never `read more`, `click here`, or a bare `/services/crm`.
3. **Bidirectional service ↔ industry.** Industry page lists its services; service page lists the industries it serves. Both derived from the same `Industry.services` array, so they can never drift.
4. **Every blog post links to exactly one service and one industry**, in the body, not just a footer widget. Footer-only links get discounted.
5. **≤3 clicks from home to any page.** Home → hub → detail. The mega-menu (`content/megamenu.ts` already exists) is what guarantees this — make sure it renders real `<a href>`, not JS-only handlers.
6. **Comparison pages link up to the service, never sideways to each other.** `/compare/custom-crm-vs-zoho` → `/services/crm`. Cross-linking comparisons creates a low-value cluster.
7. **`/pricing` links out to all 13 services; each service links back to its `/pricing#anchor`.**
8. **No sitewide footer link dump.** 89 links in the footer dilutes every one of them.

### Flow diagram

```
                          Home
                            │
        ┌──────────┬────────┼─────────┬────────────┐
    /systems   /services /industries /work     /pricing
        │          │          │         │           │
   6 pillars ──▶ 13 svc ◀──▶ 12 ind   4 cases ──────┘
                    │  ▲        │
                    │  └────────┘  (bidirectional, from Industry.services)
                    │
              ┌─────┴─────┬──────────────┐
          /compare    /locations      /blog
          5 pages     4 + 5 pages    40 posts
                          │               │
                          └──▶ /google-business-profile-setup ◀──┘
```

---

## 4. Sitemap changes

`src/app/sitemap.ts` today lists 10 hardcoded static routes plus generated
services and posts. It needs:

```ts
// add, in priority order
{ url: "/google-business-profile-setup", priority: 0.95, changeFrequency: "monthly" }
{ url: "/systems",   priority: 0.85 }   + 6 × /systems/[slug]      @ 0.8
{ url: "/industries/[slug]" × 12,       priority: 0.9  }  // ⬅ highest-value addition
{ url: "/work/[slug]" × 4,              priority: 0.75 }
{ url: "/compare/[slug]" × 5,           priority: 0.85 }
{ url: "/locations/[city]" × 4,         priority: 0.8  }
{ url: "/dehradun/[service]" × 5,       priority: 0.85 }
{ url: "/process", priority: 0.7 } { url: "/faq", priority: 0.7 }
{ url: "/about/team", priority: 0.6 }  { url: "/reviews", priority: 0.7 }
```

**Fix while you are in there:** `lastModified: now` is set to build time for
every static route. That tells Google all 10 pages change on every deploy,
which trains it to ignore the signal. Use a real per-page date — the content
file's `updatedAt`, or a committed constant.

`priority` is also a hint Google has said it ignores; keep it for Bing, but
don't spend time tuning it.

**Do not split the sitemap.** 89 URLs is nowhere near the 50,000 limit.

---

## 5. Two NAP problems to fix before any local work

Both are in `src/lib/site.config.ts` and both are already flagged TODO there:

1. **`address.street` is empty and `address.mapsUrl` is empty.** LocalBusiness schema without a street address is a weak entity claim, and the config's own comment says these values must be byte-identical to the Google Business Profile. A local SEO push on top of an incomplete NAP wastes the push.

2. **`socials` are shared with "Google IT Solution" by choice.** The config comment already identifies the risk correctly: `sameAs` is an entity-identity claim, and if two sites claim the same profiles you are telling Google the two Organizations are one entity. Pick one site to own the `sameAs` block. Given the brand focus is ABM Tech, it should be this one — and the other site's `sameAs` should be removed, not both left as-is.

**Also:** nothing in `src/` actually emits LocalBusiness JSON-LD. The config
comment says it feeds "LocalBusiness JSON-LD" and `seo.ts` exports
`organizationLd`, `websiteLd`, `breadcrumbLd`, `faqLd`, `serviceLd`,
`articleLd` — but no `localBusinessLd`. For a Dehradun local play that is the
one schema type you cannot skip.
