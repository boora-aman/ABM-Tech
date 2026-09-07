<!-- Generated 2026-09-07 · skill: seo-plan -->
# ABM Tech — SEO Strategy

## 1. Positioning the SEO has to carry

From `site.config.ts`, the promise is *"Whatever your business is, we build the
software that runs it — and we tell you when you don't need us."*

That is a **hard positioning to rank for and an easy one to convert on.**
Nobody searches "software that runs my business." They search
`billing software for pharmacy` and `crm software company in dehradun`.

So the strategy is a funnel of vocabularies:

| Layer | Visitor's words | Page type | Volume | Intent |
| --- | --- | --- | --- | --- |
| **Local commercial** | "software company in dehradun" | `/dehradun/*`, `/locations/*` | low | very high |
| **Service commercial** | "custom crm development" | `/services/[slug]` | medium | high |
| **Sector commercial** | "erp software for pharmacy" | `/industries/[slug]` | low-medium | **very high** |
| **Comparison** | "tally alternative custom" | `/compare/*` | medium | **very high** |
| **Transactional offer** | "google my business setup service" | `/google-business-profile-setup` | medium | very high |
| **Informational** | "cost of custom software india" | `/blog/*` | high | low-medium |

**The sector and comparison layers are where this site wins.** They are
specific enough that the national SEO firms ignore them, and commercial enough
that the traffic is worth having. The informational layer is for links and AI
citations, not for leads.

---

## 2. Keyword map

Volumes are **unvalidated** — no DataForSEO or GSC connection was available.
Treat the bands as relative priority, not as data. See §7 for how to validate.

### Primary — one per money page

| Page | Primary keyword | Secondary | Band |
| --- | --- | --- | --- |
| `/` | custom software development company india | software studio india | med |
| `/dehradun/software-development` | software company in dehradun | software development dehradun | low-med |
| `/dehradun/crm-software` | crm software company in dehradun | crm development dehradun | low |
| `/dehradun/website-design` | website designing company in dehradun | website development dehradun | low-med |
| `/dehradun/billing-software` | billing software dehradun | gst billing software uttarakhand | low |
| `/dehradun/google-business-profile` | google my business dehradun | gmb setup dehradun | low |
| `/google-business-profile-setup` | **google my business setup service** | gmb verification service, google business profile setup india | **med** |
| `/services/crm` | custom crm development | crm software development company | med |
| `/services/erp-system` | custom erp software development | erp development company india | med |
| `/services/billing-platform-app` | gst billing software development | custom billing software | med |
| `/services/mobile-apps` | mobile app development company india | react native development india | med |
| `/services/ecommerce` | ecommerce website development india | custom online store development | med |
| `/services/ai-automation` | business process automation india | workflow automation services | med |
| `/services/maps-and-seo` | local seo services india | google maps seo services | med |
| `/services/integrations` | api integration services india | third party integration development | low-med |
| `/services/dashboards` | business intelligence dashboard development | custom reporting dashboard | low-med |
| `/services/business-website` | business website design india | static website development | med |
| `/services/dynamic-website` | website with admin panel | cms website development india | low-med |
| `/services/business-digitisation` | business digitisation services | paper to software migration | low |
| `/services/cloud-support` | application support and maintenance india | software amc services | low |
| `/pricing` | custom software development cost india | software development price india | med |

### Industry layer — the underused asset

Each of the 12 industries already carries a `pain` line and 5 `builds` bullets
written in that sector's own nouns. Target pattern: `{software type} for
{sector}` and `{sector} software india`.

| Industry slug | Primary keyword | Feeds services |
| --- | --- | --- |
| `retail-wholesale` | retail billing software with inventory | erp-system, billing-platform-app, dashboards |
| `healthcare-pharmacy` | **pharmacy billing software with expiry management** | erp-system, billing-platform-app |
| `manufacturing` | production planning software for small manufacturers | erp-system, dashboards |
| `logistics-transport` | transport management software india | erp-system, mobile-apps |
| `construction-realestate` | real estate crm india | crm, dashboards |
| `education` | coaching institute management software | crm, dynamic-website |
| `hospitality-food` | restaurant billing and order software | billing-platform-app, mobile-apps |
| `professional-services` | practice management software for consultants | crm, integrations |
| `field-home-services` | **field service management app india** | mobile-apps, crm |
| `ecommerce-d2c` | d2c order management system | ecommerce, integrations |
| `finance-insurance` | loan management software india | crm, dashboards |
| `institutions-nonprofit` | ngo donor management software | crm, dynamic-website |

Bolded three have the clearest commercial intent and the weakest SERPs — ship
those first.

### Comparison layer — highest conversion per visit

Indian SMBs do not compare you against other agencies. They compare **custom
software against the product they already have a licence for.** That is the
search nobody in Dehradun is targeting.

| Page | Primary keyword | Why it converts |
| --- | --- | --- |
| `/compare/custom-erp-vs-tally` | tally alternative for manufacturing | reader has already hit Tally's ceiling |
| `/compare/custom-crm-vs-zoho` | zoho crm alternative india | reader is paying per-seat and resenting it |
| `/compare/custom-erp-vs-erpnext` | erpnext vs custom erp | technical buyer, high budget |
| `/compare/wordpress-vs-custom-website` | wordpress vs custom website for business | reader has a slow site |
| `/compare/shopify-vs-custom-ecommerce` | shopify alternative custom store india | reader is paying transaction fees |

**Write these honestly.** The `promise` in `site.config.ts` says you tell
people when they don't need you — so each page must have a "when Tally is the
right answer" section. That section is what makes the page rank and what makes
the reader trust the rest of it. A comparison page that concludes "buy custom"
in every scenario reads as an ad and Google treats it as one.

---

## 3. Keyword placement rules

**The `keywords` meta tag does nothing.** `pageMeta()` accepts and emits it —
harmless, keep it for internal documentation, but it is not a ranking factor
for Google or Bing. Placement that matters, in order:

| Position | Rule |
| --- | --- |
| **URL slug** | primary keyword, hyphenated, no stop words. `/services/crm` is short but weak — consider `/services/custom-crm-development` with a 301. |
| **`<title>`** | primary keyword **first**, brand last, ≤60 chars. `Custom CRM Development \| ABM Tech` — not `ABM Tech \| Services \| CRM`. |
| **H1** | one per page, contains the primary keyword, **different wording from the title** |
| **First 100 words** | primary keyword once, naturally. This is what AI search extracts as the answer passage. |
| **H2s** | secondary keywords and the actual questions people ask |
| **Meta description** | ≤155 chars, contains the keyword *and a reason to click* (the price, the timeline). Not a summary. |
| **Internal anchor text** | the keyword, from other pages. The strongest on-page signal you control. |
| **Image filename + alt** | `abm-tech-custom-crm-dehradun.jpg`. Text baked into an image is invisible — the filename and alt are the only indexable part. |
| **FAQ block** | the long-tail questions, verbatim as people type them |

### Current title pattern is a problem

`generateMetadata` on `/services/[slug]` passes `s.title` straight through, and
`services.ts` titles are **brand-voice, not search-voice**: `"Custom CRM"`,
`"Static Business Website"`, `"Website + Billing Web App + Mobile App"`.

`"Custom CRM"` as a title tag is 10 characters and competes with nothing.

**Fix:** add a `seoTitle?: string` field to the `Service` type and fall back to
`title` when absent. Keeps the on-page H1 in ABM's voice while the `<title>`
does its job.

```ts
{ slug: "crm",
  title: "Custom CRM",                                    // H1, brand voice
  seoTitle: "Custom CRM Development for Indian Businesses", // <title>, search voice
  ... }
```

Do the same for industries.

### The one-page-one-keyword rule

Two pages targeting `crm software company in dehradun` will split their own
signal and Google will pick the wrong one. `/services/crm` targets the national
term; `/dehradun/crm-software` targets the local one. **They must not overlap**
— different titles, different H1s, and each canonicalised to itself.

---

## 4. Schema plan

`seo.ts` has `pageMeta`, `organizationLd`, `websiteLd`, `breadcrumbLd`,
`faqLd`, `serviceLd`, `articleLd`, `graph`. The `graph()` helper joining nodes
by `@id` is the right pattern and already better than most.

### Missing helpers to add

| Helper | Used on | Priority |
| --- | --- | --- |
| **`localBusinessLd()`** | home, `/contact`, `/locations/*`, `/dehradun/*` | 🔴 **critical** — the config claims it exists, nothing emits it |
| `itemListLd()` | `/services`, `/industries`, `/work`, `/compare` | 🔴 high — makes hub pages eligible for carousels |
| `offerLd()` | `/pricing`, `/google-business-profile-setup` | 🔴 high — puts ₹2,499 in the SERP |
| `personLd()` | `/about/team` | 🟡 E-E-A-T |
| `howToLd()` | `/process`, GBP setup page | 🟡 |
| `reviewLd()` / `AggregateRating` | `/reviews` | 🟡 **only with real, verifiable reviews** |
| `articleLd` with `author` as `Person` @id | `/blog/*` | 🟡 currently likely Organization-authored |

**On AggregateRating:** do not emit it until there are real reviews with real
names. Fabricated ratings in schema is a structured-data manual action, and it
is the same mistake as the ★★★★ on the Instagram poster mockup. Related:
`social/README.md` §6 rule 3.

### Per-page schema matrix

| Page type | Nodes |
| --- | --- |
| Home | Organization + WebSite + **LocalBusiness** + ItemList (services) |
| `/services/[slug]` | Service + Offer + BreadcrumbList + FAQPage ✅ mostly done |
| `/industries/[slug]` | Service (`audience` = the sector) + BreadcrumbList + FAQPage |
| `/work/[slug]` | Article + CreativeWork + BreadcrumbList |
| `/compare/[slug]` | Article + FAQPage + ItemList (the two options) |
| `/dehradun/[service]` | Service + **LocalBusiness** + `areaServed: City` |
| `/pricing` | ItemList of Offer, each with `priceCurrency: "INR"` |
| `/google-business-profile-setup` | Service + Offer (₹2,499) + FAQPage + HowTo |
| `/about/team` | ItemList of Person |
| `/process` | HowTo |

---

## 5. Technical foundation

Most of this is already right. What is left:

| Item | Status | Action |
| --- | --- | --- |
| Sitemap from real routes | ✅ | add the 63 new URLs (§4 of SITE-STRUCTURE) |
| `lastModified` accuracy | ⚠️ | static routes all use build time — use real dates |
| robots.txt + AI crawlers | ✅ | correct and deliberate, leave alone |
| `llms.txt` | ✅ | regenerate after new pages ship |
| Canonicals | ✅ via `pageMeta` | verify the new dynamic routes self-canonicalise |
| JSON-LD graph | ✅ | add the 7 missing node types |
| ISR / rendered markup | ✅ | `revalidate = 3600` throughout |
| `/admin` noindex | ✅ | three independent gates, good |
| NAP completeness | 🔴 | `address.street` and `mapsUrl` are empty |
| `sameAs` entity conflict | 🔴 | shared with Google IT Solution — pick one owner |
| LocalBusiness schema | 🔴 | not emitted anywhere |
| Core Web Vitals | ❓ | no field data; needs CrUX once traffic exists |
| GSC / GA4 | ❓ | verify both are connected before Phase 1 ends |
| Image alt + filenames | ❓ | audit `public/showcase` — likely generic names |

### Core Web Vitals targets

| Metric | Target | Notes |
| --- | --- | --- |
| LCP | < 2.0s | mobile, 4G India — most traffic will be mobile |
| INP | < 200ms | the motion components (`Reveal`, `Stagger`) are the risk |
| CLS | < 0.05 | reserve height on the showcase slides |

The `Reveal`/`Stagger` motion wrappers are on nearly every section. Check they
are not deferring content paint — an animation that fades in the H1 delays LCP
by its own duration.

---

## 6. AI search / GEO

Already ahead here: AI crawlers explicitly allowed, `llms.txt` published, and
the reasoning documented in `robots.ts`. For a services business that is the
right call — an AI citation is a qualified referral.

To convert that access into citations:

1. **Answer-first paragraphs.** Every page's first 100 words should stand alone as the answer to its own question. AI extracts passages, not pages.
2. **Prices in plain text.** `₹2,499 one time` as text, never only inside an image. This is currently the single biggest AI-visibility gap — the poster carries the price, the page may not.
3. **FAQ blocks with real questions.** The `faqs` on each service are already good raw material.
4. **One factual claim per sentence** in the comparison pages. `Tally does not support multi-warehouse batch expiry` is citable; `Tally is limiting` is not.
5. **Keep `llms.txt` current.** It is a manifest; a stale one is worse than none.

---

## 7. Validating the keyword bands

Everything in §2 is derived from your own service vocabulary plus the SERP
inspection in COMPETITOR-ANALYSIS.md. **None of it has volume data.** Before
committing 12 months of content:

1. **Connect Google Search Console** and export 90 days of queries. Your own impression data beats any tool for a site that already has some traffic.
2. **Run `seo-dataforseo`** for real volume and difficulty on the ~60 keywords in §2 (`kw_data_google_ads_search_volume`, `dataforseo_labs_bulk_keyword_difficulty`), location India. This needs the DataForSEO extension installed.
3. **Run `seo-cluster`** on the validated set to confirm the hub/spoke grouping matches actual SERP overlap rather than my assumed grouping.
4. **Re-cut §2** and only then start Phase 2 content.

If step 2 is not available, the honest fallback is: ship the industry and
comparison pages anyway (they cost nothing new to write and the intent is
obvious), and let GSC tell you where the volume actually is by month 3.

---

## 8. KPI targets

**Baselines are unknown** — no GSC access in this session. `abmtech.in`, founded
2024, 26 indexed URLs. Assume near-zero organic. Fill the baseline column in
week 1 and treat these as first-pass targets to revise.

| Metric | Baseline | 3 mo | 6 mo | 12 mo |
| --- | --- | --- | --- | --- |
| Indexed pages | ~26 | 55 | 75 | 89 |
| Organic sessions / mo | TBD | 150 | 600 | 2,000 |
| Keywords in top 10 | TBD | 8 | 35 | 100 |
| Keywords in top 3 | TBD | 2 | 10 | 30 |
| Local pack appearances (Dehradun) | 0 | present | top 10 | top 3 |
| GBP calls + direction requests / mo | TBD | 15 | 50 | 120 |
| Referring domains | TBD | 8 | 20 | 45 |
| AI citations (ChatGPT/Perplexity, tracked monthly) | 0 | 1 | 5 | 15 |
| Qualified enquiries / mo from organic | TBD | 3 | 10 | 25 |
| LCP (mobile, CrUX p75) | TBD | < 2.5s | < 2.0s | < 2.0s |

**The metric that actually matters is the last-but-one.** 2,000 sessions on
`cost of custom software` is worth less than 200 on `pharmacy billing software
with expiry management`. Report enquiries per page, not sessions per site.

---

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| **Thin industry pages.** 12 pages from a `pain` line and 5 bullets is ~150 words each. | Gate at 600 words. Add `intro`, `outcome`, `faqs` to the type before shipping any. Ship 3, measure, then the rest. |
| **Location page bloat.** The tempting move is 4 cities × 13 services. | Hard cap at 9. Written by hand, gated at 400 unique words. |
| **`sameAs` entity split** with Google IT Solution. | Resolve before local work starts. Two sites claiming one identity halves both. |
| **Price inconsistency.** ₹2,499 on the posters, ₹2,500 in `social/`, neither on `/pricing`. | Publish one figure on `/pricing`, then propagate. Own rule: `social/README.md` §6.5. |
| **GBP compliance in page copy.** "Instant live" language migrating from posters to the site. | The site is the higher-risk surface. No ranking or verification-timeline promises anywhere. |
| **Content debt.** 40 blog posts at this quality bar is real work. | 3/month sustainable beats 12/month for one month. Cut the target before cutting the quality. |
| **Fabricated trust signals.** Poster mockups already show fake ★★★★. | No AggregateRating schema, no testimonial, no logo without written permission. `social/README.md` §6.4. |
