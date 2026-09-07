<!-- Generated 2026-09-07 · skill: seo-plan · SERP inspection, no paid tools -->
# ABM Tech — Competitor Analysis

## Method and its limits

Two live SERP inspections were run (software development Dehradun / CRM / ERP,
and Google Business Profile setup pricing in India). **No DataForSEO, Moz, or
Search Console access was available**, so there is no domain authority, traffic,
or backlink data here. Every authority estimate below is inferred from SERP
position and site quality, not measured.

To upgrade this from inference to data: install the DataForSEO extension and
run `seo-dataforseo` / `seo-backlinks`.

---

## 1. The finding that matters

**Page one for "software development company Dehradun custom CRM ERP" is
mostly not software companies.** It is:

- a **Sulekha directory page** (aggregator)
- a **"Top 10 Premier Custom Software Development Companies in Dehradun"
  listicle** on `levontechno.com` — a company writing a listicle about its own
  market
- a **WordPress blog post** (`duplextechservices.wordpress.com`) ranking for a
  commercial term
- a `?city=Dehradun` **query-string page** on `websoftex.com` — a template page
  with the city swapped in
- a **blog post** on `aksoftsol.com/blog/custom-software-development-company`
  ranking instead of a service page

Only **Evon Tech** (A-5 IT Park, Dehradun 248001) and **Duplex Technologies**
have genuine local service pages competing.

**This is a weak SERP.** A properly structured service page with real
LocalBusiness schema, a filled NAP, and honest sector content should outrank a
Sulekha listing and a self-serving listicle. That does not happen in a
competitive market — it happens here because nobody has done the basics.

---

## 2. Competitor table

| Competitor | Local? | Est. authority | What they do well | Where they're open |
| --- | --- | --- | --- | --- |
| **Evon Tech** (evontech.com) | ✅ real Dehradun office, IT Park, PIN 248001 | Medium-high | Established, real address, broad ERP/CRM solutions pages, national reach | Corporate/generic voice. Solution pages, not sector pages. No visible pricing. |
| **Duplex Technologies** (duplextech.com) | ⚠️ Lucknow-based, targets Dehradun | Medium | Explicit city-targeted pages, names verticals (real estate, education), mentions CRM↔ERP integration | Not actually local — no Dehradun NAP. Ranking a **wordpress.com blog** alongside, which splits their own signal. |
| **AK Software Solutions** (aksoftsol.com) | ✅ Dehradun | Low-medium | Claims 150+ customers — a real proof number | Ranking a **blog post** for a commercial term instead of a service page. Basic site. |
| **Xform Technologies** (xform.in) | ⚠️ programmatic | Low-medium | Genuinely sector-specific: "custom CRM manufacturing" | URL is `/custom-crm-manufacturing-software-development/custom-crm-manufacturing-software-development-dehradun-india.php` — keyword-stuffed, duplicated path segment, `.php`. Programmatic city × sector matrix at scale. |
| **Websoftex** (websoftex.com) | ❌ Bangalore | Low-medium | Wide keyword net | `?city=Dehradun` query-param templating. Leads on "best price" — competes on cheapness. |
| **Levon Techno** (levontechno.com) | ❌ | Low | Owns the "Top 10" listicle slot | It's a listicle, not a service. Beatable with better content, and it's a link target. |

### Nobody in this set has

- ❌ Published prices (you already publish 13 price floors — that is a genuine differentiator and an AI-citation magnet)
- ❌ Sector pages written in the sector's own vocabulary (your 12 industries, unrendered, already beat all of them)
- ❌ Comparison content against Tally / Zoho / ERPNext / Busy
- ❌ `llms.txt` or any AI-search consideration
- ❌ A connected JSON-LD graph
- ❌ Case studies with a problem → approach → result narrative
- ❌ "We'll tell you when you don't need us" positioning

**Your competitive moat is honesty made machine-readable.** Published prices,
honest exclusions (`Service.excludes` already exists in your type), and a
"when the off-the-shelf product is the right answer" section are exactly what
AI search prefers to cite, and exactly what none of these six will publish.

---

## 3. The GBP setup market

| Provider | Price | Model |
| --- | --- | --- |
| Various Indian agencies | **₹5,000 + tax** one-time, ₹9,000 for 3-month maintenance | typical |
| Another | **₹5,999** — "setup in 48 hours" | speed-led |
| Some listings | ₹2,500 | floor |
| **ABM Tech** | **₹2,499 one time, pay after live, 3 months support** | ⬅ |

**Two observations:**

1. **You are at the bottom of the market on price** while including 3 months of support that others charge ₹9,000 for. That is not a positioning advantage — it's leaving money on the table and it signals "cheap" to a business buyer. ₹2,499 is defensible as a loss-leader into the ₹5,000/month retainer, but only if the page says so. Otherwise consider ₹3,499–3,999.

2. **"Pay after your listing is live" is not offered by anyone found.** Competitors lead on speed ("48 hours") — which is the one thing nobody controls, because Google owns the verification clock. Your differentiator is risk reversal, and it is both more honest and more persuasive. **It should be the headline of `/google-business-profile-setup`, not a bullet.**

Also note the market's honest framing of verification: postcard takes 5–12
business days, instant phone/text is available only to select businesses.
Publishing that timeline table on your page — plainly, as the thing you don't
control — is a trust asset *and* a citable passage. Competitors won't publish
it because it undercuts their "48 hours" claim.

---

## 4. Keyword gaps to take

Ranked by (intent × weakness of current SERP):

| Priority | Gap | Why it's open |
| --- | --- | --- |
| 🔴 1 | **`{software} for {sector}`** — pharmacy expiry billing, field service app, coaching institute management | Competitors have generic "solutions" pages. Your 12 industry entries are already written in sector vocabulary. Zero new content needed to start. |
| 🔴 2 | **`tally alternative` / `zoho crm alternative india` / `erpnext vs custom`** | Nobody in this SERP has a single comparison page. Highest commercial intent available. |
| 🔴 3 | **`google my business setup service` + `gmb verification service`** | Real volume, and you have both a price and a unique offer. |
| 🟡 4 | **`custom software development cost india`** | You publish 13 price floors. Competitors publish none. Own the cost query outright. |
| 🟡 5 | **`software company in dehradun`** | Currently held by a directory and a listicle. Winnable with LocalBusiness schema + complete NAP + a real Dehradun page. |
| 🟡 6 | **`{service} in dehradun`** long tail | Xform is doing this programmatically and badly. Nine hand-written pages beat fifty templated ones. |
| 🟢 7 | **`software handover checklist` / `fixed price software scope`** | Your 3 existing posts already target these. Low volume, near-zero competition, strong link and AI-citation potential. |

---

## 5. What not to copy

- **Xform's URL pattern.** `/custom-crm-manufacturing-software-development/custom-crm-manufacturing-software-development-dehradun-india.php` — duplicated segment, stuffed, and a programmatic matrix. Do not build the city × service grid.
- **Websoftex's `?city=` templating.** Query-param city pages are near-duplicates that dilute crawl budget.
- **Duplex's split signal.** They rank a `wordpress.com` post and their own domain for the same term, competing with themselves. Keep all content on `abmtech.in`.
- **Levon's "Top 10" self-listicle.** Transparent, and it ages badly.
- **"Best price" as positioning** (Websoftex). You publish fixed prices against written scope — that is a *credibility* claim, not a cheapness claim. Don't let the ₹2,499 poster drag the brand toward the second one.
- **"48 hours" / "instant live" speed claims.** Whoever is making them cannot keep them, and they are a GBP policy risk. Already flagged in `social/README.md` §6.

---

## 6. Link opportunities visible from here

| Target | Approach |
| --- | --- |
| `levontechno.com` "Top 10 companies in Dehradun" | Ask for inclusion. These listicles accept submissions; it's a real local citation. |
| Sulekha, Justdial, IndiaMART | Directory citations. Low link value, **high NAP-consistency value** — required for local pack. Must be byte-identical to `site.config.ts`. |
| Uttarakhand / Dehradun business associations, IT Park directory | Genuinely local, genuinely relevant, and a real trust signal. |
| Frappe / ERPNext community | You have real ERPNext-adjacent work (`frappe-bench` in the environment). Contributions and forum answers earn organic links from a high-authority technical domain. |
| Client sites | "Built by ABM Tech" footer link, **with written permission only** (`social/README.md` §6.4). |

**Do not buy links.** `services.ts` already commits publicly to never buying
backlinks — breaking that is both a policy risk and a stated-promise problem.
