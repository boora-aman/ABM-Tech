# ABM Tech

Professional business site for a studio that builds CRM, ERP, billing systems,
business websites and AI automation for Indian companies.

Next.js 16 (App Router) · React 19 · Tailwind v4 · MongoDB (optional)

```bash
npm install
npm run dev
```

No configuration required to run it.

---

## Performance is a design constraint

The first iteration of this site was laggy. The causes were specific, and all
four are now banned by the design system:

| Cause | Fix |
| --- | --- |
| `backdrop-filter: blur(20px)` on **every** card — forces a full-surface readback per painted element | Cards are opaque. Blur appears on exactly one element: the fixed header |
| `background-attachment: fixed` on a gradient body — repaints the whole viewport every scroll frame | Background is a flat colour |
| Three `setInterval` timers driving layout animations | Removed |
| `setState` on every scroll event (progress ring, scroll spine, telemetry) | One passive listener flipping one boolean |
| Framer Motion on ~50 elements, each with its own intersection observer | **Dependency removed entirely.** Entrances are CSS |

Result: **no animation library in the bundle**, 146 KB of JS transferred on the
home page (almost all of it the React/Next runtime), and only 7 client
components on the whole site. Everything else is a server component.

Two structural helpers do the rest:

- `.defer-paint` — `content-visibility: auto` on below-fold sections, so the
  browser skips their layout and paint until they are near the viewport.
- `.snap-row` — the carousel is **native CSS scroll-snap**. The browser scrolls
  it on the compositor with real momentum, so it is as smooth as ordinary page
  scrolling because it *is* ordinary page scrolling.

### Rules to keep it fast

- No `backdrop-filter` outside the header.
- No `background-attachment: fixed`, ever.
- Animate only `transform` and `opacity` — properties the compositor handles
  without touching layout or paint.
- No timers driving visuals.
- Any new scroll listener must be `{ passive: true }` and must not call
  `setState` more than once per rAF.
- Prefer a server component. Reach for `"use client"` only when there is real
  interaction.

---

## Theme

**Light is the default for everyone**, including on dark-OS machines — there is
deliberately no `prefers-color-scheme` override, which is what makes "light by
default" actually true. Dark is opt-in via the header toggle and remembered in
`localStorage`. An inline `<head>` script stamps `data-theme` before first
paint, so there is no flash.

Both themes come from one set of custom properties, so switching re-materialises
every surface without a single component re-render.

| Token | Light | Dark |
| --- | --- | --- |
| Page | `#f6f5f2` | `#0f1115` |
| Card | `#ffffff` | `#161a20` |
| Ink | `#14161a` | `#f4f6f8` |
| Brand | `#f4501a` → `#ff8c00` | same |

Type: **Syne** (headings) · **Inter** (body) · **JetBrains Mono** (small labels).

---

## The carousel

`src/components/sections/Showcase.tsx`, driven by
`src/lib/content/showcase.ts`.

**One large frame plus a tab strip**, not a peeking scroll-snap row. The
scroll-snap version had real problems: `mandatory` snapping combined with large
edge padding made the first and last cards awkward to rest on, partial cards at
the viewport edge read as clipped rather than as a hint, and dimming inactive
cards looked like a rendering fault. A single frame also gives a screenshot the
full width instead of two-thirds.

Trade-off: no swipe gesture. Acceptable — the controls are explicit and the tab
strip scrolls horizontally on a phone. Switching is a state change with a CSS
crossfade; no JS animation loop.

**Adding a screenshot:**

1. Drop the image in `public/showcase/`
2. Set `image: "/showcase/your-file.webp"` on that slide

Recommended **1600×1000 (16:10), WebP, under 250 KB**.

Until a slide has an image it renders **designed placeholder art** — browser
chrome, the product name set large, a soft brand wash and skeleton rows. Six
empty grey boxes read as a broken build; six of these read as a section pending
its assets.

Slides currently queued, awaiting screenshots:

| Slide | Waiting on |
| --- | --- |
| Frappe CRM | screenshot |
| ERPNext deployment | screenshot |
| MoveEasy — movers platform | screenshot |
| Pharmacare | screenshot |
| Herbal Care | screenshot + confirm the real product name |
| Billing web app | screenshot |

## Content

Everything lives in typed files under `src/lib/content/` — no CMS, because this
changes a few times a year and a database round-trip to render a price list
buys nothing.

```
services.ts   8 services — deliverables, capabilities, phases, FAQs, keywords
showcase.ts   carousel slides
work.ts       4 case studies
faq.ts        site-wide FAQs + the six delivery commitments
```

### Published prices

| Service | From | Billing |
| --- | --- | --- |
| Google Maps profile & SEO | ₹5,000 | monthly |
| Static business website | ₹6,000 | one-off |
| Custom CRM | ₹12,000 | one-off |
| Dynamic website + admin panel | ₹15,000 | one-off |
| ERP system | ₹15,000 | one-off |
| AI automation | ₹15,000 | one-off |
| Website + billing app + mobile app | ₹20,000 | one-off |
| Business digitisation | Quote | after audit |

Each service page states where a real project lands **above** its floor — a
₹15,000 ERP is single-location; multi-branch is ₹40,000–1,50,000. Publishing a
floor without that caveat is bait and poisons the first call.

## Configuration

Contact details default to the established ones in
`src/lib/site.config.ts` (`+91 91197 56710`, `b00raaman@gmail.com`, Dehradun).
Any of them can be overridden per environment with the matching
`NEXT_PUBLIC_*` variable — see `.env.example`.

> Env vars **must** be read as static literals (`process.env.NEXT_PUBLIC_FOO`).
> Next only inlines them into the client bundle when it can see the key as a
> literal at build time; a dynamic `process.env[key]` lookup works on the server
> and silently returns `undefined` in every client component.

Optional: `MONGODB_URI` to store enquiries, `RESEND_API_KEY` to email them.
Without either, a lead is still written to the deployment log — a missing
integration never loses a lead.

## SEO

One connected `@graph` per page (`Organization`, `WebSite`, `Service` + `Offer`,
`FAQPage`, `BreadcrumbList`), a generated `/llms.txt` built from the same
content modules the pages render from so it cannot drift, per-page OG cards at
`/api/og`, and a dynamic sitemap. `robots.txt` allows AI crawlers deliberately —
for a services business a citation is a qualified referral.

## Security

The contact form validates with the same zod schema on both sides (server is the
authority), plus a honeypot, a time-to-submit floor and per-IP rate limiting. No
CAPTCHA — those cost real users more than they cost bots. The rate limit is
in-memory and per-instance: a speed bump, not a guarantee. Move it to Upstash or
the Vercel Firewall if it is ever targeted.

## Deploying

Vercel. Push, import, add env vars. Everything except `/api/lead` and `/api/og`
is statically prerendered.

---

## A note on the shared social accounts

Instagram and Facebook are shared with **Google IT Solution** — the handles are
established and ABM Tech is the brand being focused on, so the accounts are
being repurposed rather than started from scratch.

Sharing the accounts operationally is fine. One thing is worth getting right:

**Only one site should list them in `sameAs`.** Those URLs appear in the
Organization structured data on both this site and the Google IT Solution site.
`sameAs` is an entity-identity claim — it says "this profile is this
organisation". Two different Organizations claiming the same profiles tells a
search engine the two brands are one entity, which muddles both.

Since ABM Tech is the focus, the recommended split is:

- **abmtech.in** — lists them (already configured)
- **Google IT Solution** — removes them from `socials` in its `site.config.ts`

Two follow-ups that make the claim truthful rather than just declared:

1. Set the account **display name** and bio to ABM Tech. The `@handle` can stay
   — handles carry the followers and the history, and changing one costs more
   than it gains.
2. Point the **link in bio** at `abmtech.in`.

Until the display name matches, a profile called "Google IT Solution" being
claimed by ABM Tech is a weak signal — not harmful, just not doing any work.
