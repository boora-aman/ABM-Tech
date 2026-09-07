<!-- Generated 2026-09-07 · skill: seo-plan -->
# ABM Tech — Implementation Roadmap

Four phases. Each has a dependency you cannot skip and a gate you must pass
before the next one starts.

---

## Phase 0 — Before anything (this week)

Small, unglamorous, and everything downstream depends on it.

| # | Task | File | Blocker for |
| --- | --- | --- | --- |
| 0.1 | Fill `address.street` | `src/lib/site.config.ts` | all local SEO |
| 0.2 | Fill `address.mapsUrl` with the GBP share link | `site.config.ts` | LocalBusiness schema |
| 0.3 | Resolve the `sameAs` conflict — ABM Tech owns the social profiles, remove them from the Google IT Solution site | `site.config.ts` + other site | entity identity |
| 0.4 | Decide the GBP setup price. **₹2,499 or ₹2,500 — one number.** Publish it on `/pricing` | `pricing/page.tsx`, `services.ts` | posters, GBP page |
| 0.5 | Verify Google Search Console **and** GA4 are connected; export a 90-day query baseline | — | every KPI in this plan |
| 0.6 | Fix the posters: `amanboora.in` → `abmtech.in`, phone → the `site.config` number | Canva files | brand consistency |

**Gate:** NAP is complete and identical across `site.config.ts`, the GBP, and
every directory listing. One published price. GSC exporting data.

> 0.4 and 0.6 are the ones that will bite. The posters currently say
> `amanboora.in` and `+91 63984 05386`; `site.config.ts` says `abmtech.in` and
> `+91 91197 56710`. Two different businesses as far as Google is concerned.

---

## Phase 1 — Foundation (weeks 1–4)

### Engineering

| # | Task | Effort |
| --- | --- | --- |
| 1.1 | Add `localBusinessLd()` to `src/lib/seo.ts`; emit on `/`, `/contact` | S |
| 1.2 | Add `itemListLd()`; emit on `/services`, `/industries`, `/work` | S |
| 1.3 | Add `offerLd()`; emit on `/pricing` with `priceCurrency: "INR"` | S |
| 1.4 | Add `seoTitle?: string` to `Service` and `Industry` types; `pageMeta` prefers it, falls back to `title` | S |
| 1.5 | Extend `Industry` type: `keywords`, `intro`, `outcome`, `faqs`, `seoTitle` | S |
| 1.6 | **Build `/industries/[slug]`** — `generateStaticParams` from the seed, `generateMetadata`, Service + Breadcrumb + FAQ schema, bidirectional service links from `Industry.services` | M |
| 1.7 | Add the industries → service reverse links on `/services/[slug]` | S |
| 1.8 | Build `/faq` from `content/faq.ts` with FAQPage schema | S |
| 1.9 | Fix `sitemap.ts`: real `lastModified` per route, add `/industries/[slug]`, `/faq` | S |
| 1.10 | Audit `public/showcase` image filenames and alt text | S |
| 1.11 | Check the `Reveal`/`Stagger` motion wrappers are not delaying LCP | M |

### Content

Write `intro` + `outcome` + 3 `faqs` for **3 industries**:
`healthcare-pharmacy`, `field-home-services`, `retail-wholesale`. ~600 words
each. These three have the clearest commercial intent and the weakest SERPs.

Posts: C1 (GBP verification timeline), B1 (pharmacy expiry), A1 (what custom
software costs).

**Gate:** 3 industry pages live and indexed. LocalBusiness schema validating in
Rich Results Test. GSC showing impressions for at least one sector query.

---

## Phase 2 — Expansion (weeks 5–12)

| # | Task |
| --- | --- |
| 2.1 | Remaining **9 industry pages** (the Phase 1 gate proved the template works) |
| 2.2 | **`/google-business-profile-setup`** — Service + Offer + FAQPage + HowTo. Headline is *"Pay after your listing goes live"*, not the price. Include the honest verification-timeline table from C1. |
| 2.3 | Split `/services/maps-and-seo` to retainer-only intent; cross-link the two, distinct titles and H1s |
| 2.4 | Extend `Project` type (`industrySlug`, `problem`, `approach`, `result`); build **`/work/[slug]`** × 4 with Article schema |
| 2.5 | Add `serviceSlug?` / `industrySlug?` to `Post`; render contextual in-body links on every post |
| 2.6 | `/process` with HowTo schema |
| 2.7 | Rewrite all 13 service `seoTitle`s in search voice |
| 2.8 | Point every Instagram/GBP post CTA at `/google-business-profile-setup` |
| 2.9 | Directory citations: Justdial, Sulekha, IndiaMART, Bing Places, Apple Business Connect — **byte-identical NAP** |
| 2.10 | Regenerate `llms.txt` |

Posts: B4, C4, A3, B2, C2, D5.

**Gate:** 12 industry pages + 4 case studies + GBP page live. ≥8 keywords in
top 10. Local pack appearance for at least one Dehradun query. All directory
NAPs consistent.

---

## Phase 3 — Scale (weeks 13–24)

| # | Task |
| --- | --- |
| 3.1 | **5 `/compare/*` pages** — each with a real "when the incumbent is right" section |
| 3.2 | `/systems` + 6 `/systems/[slug]` pillar pages from `content/pillars.ts` |
| 3.3 | `/locations/dehradun` + the 5 `/dehradun/[service]` pages |
| 3.4 | `/locations/haridwar`, `/rishikesh`, `/haldwani` — **hubs only, no service split** |
| 3.5 | Enforce the ≥5-inbound-internal-links rule on every money page; audit with a crawl |
| 3.6 | GEO pass: answer-first opening paragraphs on all money pages, prices as plain text everywhere |
| 3.7 | Link outreach — Levon listicle inclusion, Uttarakhand business associations, IT Park directory, ERPNext/Frappe community contributions |
| 3.8 | Client footer links, **written permission only** |
| 3.9 | CrUX field data review once traffic supports it; fix whatever LCP/INP shows |

Posts: B3, A4, C3, B5, D3, A6, B6, C5, D1, B7, D2.

**Gate:** 75+ indexed pages. ≥35 keywords in top 10. First AI citations
appearing. ≥20 referring domains. Every money page at ≥5 internal inbound links.

**Hard stop:** location pages capped at **9**. If someone asks for Roorkee and
Kotdwar too, the answer is no until Dehradun is in the top 3.

---

## Phase 4 — Authority (months 7–12)

| # | Task |
| --- | --- |
| 4.1 | `/about/team` with Person schema; give blog posts a real `Person` author, not Organization |
| 4.2 | `/reviews` — **only if real, attributable reviews exist.** No AggregateRating without them. |
| 4.3 | Refresh the 6 lowest-CTR pages using GSC query data |
| 4.4 | Re-cut the keyword map from 12 months of real impressions — most of SEO-STRATEGY §2 will turn out to be partly wrong, and that's fine |
| 4.5 | Run `seo-audit` end to end; run `seo-drift` to baseline before every deploy after that |
| 4.6 | Monthly AI-citation tracking (ChatGPT / Perplexity / AI Overviews) |
| 4.7 | Consider one free tool (e.g. a manual-process cost calculator) as a link asset |

**Gate:** 89 pages. 100 keywords top 10, 30 top 3. Dehradun local pack top 3.
25 qualified organic enquiries/month.

---

## Effort summary

| Phase | Engineering | Content | Duration |
| --- | --- | --- | --- |
| 0 | ~3 h | — | this week |
| 1 | ~3 days | 3 industry pages + 3 posts | 4 weeks |
| 2 | ~5 days | 9 industry pages + GBP page + 4 cases + 6 posts | 8 weeks |
| 3 | ~6 days | 5 comparisons + 6 pillars + 9 location pages + 11 posts | 12 weeks |
| 4 | ~3 days | refreshes + 12 posts | 24 weeks |

**~17 engineering days over 12 months.** The content is the real cost, and it
is roughly 41 pages plus 36 posts. That is the honest number. If it has to be
cut, cut Phase 3's location pages and Phase 4's `/reviews` — **never** the 12
industry pages, because they are already 80% written.

---

## Dependency graph

```
Phase 0 (NAP + price + GSC)
   ├──▶ localBusinessLd ──▶ /dehradun/* ──▶ local pack
   ├──▶ one published price ──▶ /google-business-profile-setup ──▶ poster CTAs
   └──▶ GSC baseline ──▶ every KPI, every month-10+ content decision

Industry type extension ──▶ /industries/[slug] ──▶ 36 internal links
                                    │              to money pages
                                    └──▶ Cluster B posts have somewhere to point

Project type extension ──▶ /work/[slug] ──▶ proof for the comparison pages
```

**The critical path runs through Phase 0.** Building `/dehradun/*` before the
NAP is complete, or pointing posters at a price that isn't on `/pricing`, means
redoing the work.

---

## Skills to use as you go

| When | Skill |
| --- | --- |
| Validating the keyword bands | `seo-dataforseo`, then `seo-cluster` |
| Before writing each page | `seo-content-brief` |
| Writing the 5 comparison pages | `seo-competitor-pages` |
| Adding the missing schema helpers | `seo-schema` |
| The `/dehradun/*` and GBP work | `seo-local`, `seo-maps` |
| Answer-first / AI-citation pass | `seo-geo` |
| Baseline before every deploy | `seo-drift` |
| Quarterly full check | `seo-audit` |
| Real GSC/CrUX numbers | `seo-google` |
