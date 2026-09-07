<!-- Generated 2026-09-07 · skill: seo-plan -->
# ABM Tech — Content Calendar

## Cadence

**3 posts a month.** Not 12. The existing three posts
(`custom-software-vs-off-the-shelf`, `fixed-price-software-scope`,
`software-handover-checklist`) are long, specific and written in a real voice.
That bar is the asset. 40 thin posts would be worth less than the 3 you have.

3/month × 12 = 36 new posts → **39 total.**

Publishing day: **Tuesday**, one post. The other two land mid-month. Keep it
boring and keep it going.

> **This is separate from the social calendar.** `social/CONTENT-CALENDAR-30-DAY.md`
> runs 2 posts/day on Instagram and Facebook. Blog posts feed that machine —
> each one is 4–6 social posts — but the two calendars have different jobs and
> different quality bars. Do not cross-post blog intros as captions.

---

## Priority order — pages before posts

**Months 1–3 are page work, not blog work.** A blog post pointing at an
industry page that doesn't exist is wasted. Ship the pages first.

| Order | What | Count | New writing needed |
| --- | --- | --- | --- |
| 1 | `/industries/[slug]` route | 12 | `intro`, `outcome`, 3 `faqs` per industry (~600 words each) |
| 2 | `/google-business-profile-setup` | 1 | full page (~900 words) |
| 3 | `/work/[slug]` route | 4 | `problem`, `approach`, `result` per case |
| 4 | `/compare/*` | 5 | full pages (~1,200 words each) |
| 5 | `/systems/[slug]` | 6 | pillar copy exists in `pillars.ts`, needs expansion |
| 6 | `/locations/*` + `/dehradun/*` | 9 | ~400–600 words each, hand-written |
| 7 | `/faq`, `/process`, `/about/team`, `/reviews` | 4 | `/faq` is free (data exists) |

**Total new page copy: ~41 pages.** At 3 pages/week that is Phase 1 + 2.

---

## Blog clusters

Each post must name **one service and one industry** it links to, in the body.
That is the internal-linking rule from SITE-STRUCTURE §3, and it is the reason
posts exist at all.

### Cluster A — Cost & buying (feeds `/pricing`, `/compare/*`)

| # | Title | Primary keyword | Links to |
| --- | --- | --- | --- |
| A1 | What custom software actually costs in India in 2026 | custom software development cost india | `/pricing` |
| A2 | Why we quote fixed price against a written scope | fixed price software development | `/services/*` (exists ✅) |
| A3 | Per-seat SaaS vs owning the code: the 3-year arithmetic | saas vs custom software cost | `/compare/custom-crm-vs-zoho` |
| A4 | The hidden cost of the "free" ERP | erpnext hidden costs | `/compare/custom-erp-vs-erpnext` |
| A5 | What you should get on handover | software handover checklist | exists ✅ |
| A6 | Reading a software quote: eight things to check | how to evaluate software quote | `/process` |

### Cluster B — Sector problems (feeds `/industries/*`)

One post per industry, in that sector's vocabulary. **This is the highest-value
cluster** because each post has an obvious money page to point at.

| # | Title | Industry |
| --- | --- | --- |
| B1 | Why your pharmacy's expiry losses don't show up until stock-take | healthcare-pharmacy |
| B2 | Counter stock vs godown stock: where retail inventory actually breaks | retail-wholesale |
| B3 | The job card is on paper and the invoice is in Tally. That's the problem. | manufacturing |
| B4 | What a field technician needs on their phone (and what they don't) | field-home-services |
| B5 | Coaching institute enquiries: from register to follow-up that escalates | education |
| B6 | Trip sheets, fuel logs and the reconciliation nobody does | logistics-transport |
| B7 | Real estate site visits: the follow-up that decides the sale | construction-realestate |
| B8 | Restaurant billing when the kitchen and the counter disagree | hospitality-food |
| B9 | Billable hours for consultants without a timesheet nobody fills | professional-services |
| B10 | D2C orders across three marketplaces and one warehouse | ecommerce-d2c |
| B11 | Loan files, documents and the follow-up window | finance-insurance |
| B12 | Donor records, receipts and the 80G report | institutions-nonprofit |

### Cluster C — Local & Maps (feeds `/google-business-profile-setup`, `/services/maps-and-seo`, `/dehradun/*`)

| # | Title | Primary keyword |
| --- | --- | --- |
| C1 | How Google Business Profile verification actually works (and how long each method takes) | gmb verification process |
| C2 | Why your listing shows for some people and not others | google maps ranking distance |
| C3 | Getting reviews without buying them | how to get google reviews |
| C4 | Primary vs secondary categories: the setting that decides the most | google business profile categories |
| C5 | NAP consistency: why the same address must be byte-identical everywhere | nap consistency local seo |
| C6 | What a Dehradun business should expect from local search | local seo dehradun |

**C1 and C4 are the two strongest posts on this list.** C1 is the honest
timeline table that no competitor will publish (see COMPETITOR-ANALYSIS §3) —
it is a trust asset, a citable passage for AI search, and it removes the exact
objection that stalls the ₹2,499 sale.

### Cluster D — Technical / E-E-A-T (feeds authority, links, AI citations)

| # | Title |
| --- | --- |
| D1 | Structured data as a connected graph, not four disconnected blocks |
| D2 | Why we allow GPTBot and ClaudeBot in robots.txt |
| D3 | Migrating from Tally without losing five years of ledgers |
| D4 | What we build on and why (Next.js, Mongo, React Native) |
| D5 | The six systems every business runs on |
| D6 | When you don't need us |

**D6 is the most on-brand post you can write** — it's the `promise` from
`site.config.ts` as an article, and it is the kind of page that earns links
because it's the opposite of what everyone else publishes.

### Cluster E — Comparisons (the `/compare/*` pages themselves)

These are **pages, not posts** — they live at `/compare/*`, get Article +
FAQPage schema, and are maintained, not dated. Listed here because they're
writing work: 5 × ~1,200 words.

Each needs a genuine "when {Tally/Zoho/ERPNext/WordPress/Shopify} is the right
answer" section. Without it the page reads as an ad and won't rank.

---

## 12-month schedule

| Month | Page work | Posts |
| --- | --- | --- |
| **1** | industry route + 3 industry pages (pharmacy, field-service, retail) · GSC/GA4 verified · NAP fixed · `localBusinessLd` | C1, B1, A1 |
| **2** | 5 more industry pages · `/google-business-profile-setup` · `/faq` | B4, C4, A3 |
| **3** | last 4 industry pages · `/work/[slug]` × 4 · `/process` | B2, C2, D5 |
| **4** | `/compare/custom-erp-vs-tally` · `/compare/custom-crm-vs-zoho` | B3, A4, C3 |
| **5** | `/compare` remaining 3 | B5, D3, A6 |
| **6** | `/systems` + 6 pillar pages | B6, C5, D1 |
| **7** | `/locations/dehradun` · `/dehradun/software-development` · `/dehradun/crm-software` | B7, A5-refresh, D2 |
| **8** | `/dehradun/website-design` · `/dehradun/billing-software` · `/dehradun/google-business-profile` | B8, C6, D4 |
| **9** | `/locations/haridwar` · `/locations/rishikesh` · `/locations/haldwani` | B9, D6, A2-refresh |
| **10** | `/about/team` · `/reviews` (if real reviews exist) | B10, + 2 gap-fill from GSC |
| **11** | refresh the 6 lowest-performing pages from GSC data | B11, + 2 gap-fill |
| **12** | audit · `llms.txt` regen · re-cut keyword map from 12 months of real data | B12, + 2 gap-fill |

**Months 10–12 posts are deliberately unspecified.** By then GSC will show
which queries are getting impressions without clicks — that list is better than
anything planned in month 1.

---

## Quality gates

Every page ships only if:

- [ ] ≥600 words of genuinely unique content (≥400 for location pages, ≥1,200 for comparisons)
- [ ] One primary keyword, in URL / `<title>` / H1 / first 100 words
- [ ] `<title>` in search voice, ≤60 chars, keyword first, brand last
- [ ] Meta description ≤155 chars with a reason to click, not a summary
- [ ] ≥3 descriptive internal links out, ≥1 to a money page
- [ ] Correct JSON-LD nodes per the SEO-STRATEGY §4 matrix
- [ ] First paragraph answers the page's own question standalone (AI extraction)
- [ ] Every image has a keyword-bearing filename and real alt text
- [ ] Prices as plain text, matching `/pricing` exactly
- [ ] No ranking promise, no verification-timeline promise, no unpermitted client name, no fabricated rating

That last line is `social/README.md` §6 applied to the website. **The site is
the higher-risk surface** — a caption gets scrolled past, a page gets cited.
