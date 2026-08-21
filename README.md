# ABM Tech

Marketing site for an engineering studio building CRM, ERP, billing platforms,
admin-driven websites and AI automation for Indian businesses.

Next.js 16 (App Router) · React 19 · Tailwind v4 · Motion · MongoDB (optional)

---

## Running it

```bash
npm install
npm run dev
```

**No configuration required.** The site is static content in typed files; the
database and email provider exist only to handle contact-form enquiries, and
without them a lead is still emailed or written to the deployment log.

```bash
npm run build      # production build
npm run start      # serve the build
npm run typecheck
npm run lint
```

## Configuration

Copy `.env.example` to `.env.local`. Everything is optional:

| Variable | Enables |
| --- | --- |
| `MONGODB_URI` | Storing enquiries. Without it they go to email + logs |
| `RESEND_API_KEY` + `RESEND_FROM` | Email notification on new enquiries |
| `NEXT_PUBLIC_*` | Overriding business details per environment |

Values marked `TODO` in **`src/lib/site.config.ts`** are placeholders — phone,
email, city. That file is the only place any of it is stored, and it feeds the
header, footer, contact page, Organization JSON-LD, sitemap, OG cards, llms.txt
and the email templates.

> `site.telemetry` currently reads "20+ engagements shipped". **Confirm or
> change that figure before launch** — it is the one unverified claim on the
> site.

---

## Design system — "Kinetic Structure"

Built to avoid the default AI-agency look (dark navy, purple neon, bento grid,
floating abstract shapes). Three rules do the work:

1. **Structure over decoration.** Asymmetric multi-axis grids with visible
   rails, bracketed index numerals and hairline rules. Nothing is centred by
   default; emptiness is load-bearing.
2. **Glass is architectural, not glowy.** Panels are sheets of dark glass with a
   dual-tone border — warm on the top-left edge, cool on the opposite — the way
   real glazing behaves under a single light source. One vast warm bloom is
   anchored top-right, so every panel edge below it is lit consistently.
3. **One hot colour, one cold pixel.** The volcanic gradient
   (`#ff4500 → #ff8c00`) carries every action. Electric teal `#00f5d4` appears
   *only* at single-pixel data points and success markers — if teal ever fills
   an area, it has been misused.

| Token | Value |
| --- | --- |
| Ground | `#0d0e12` |
| Panel fill | `rgba(22,24,30,0.55)` + `blur(20px) saturate(140%)` |
| Hot | `#ff4500` → `#ff8c00` |
| Cold datum | `#00f5d4` |
| Ink / dim / faint | `#f4f5f7` / `#9ba1ad` / `#6b7280` |

**Type:** Syne (display) · Inter (body) · JetBrains Mono (all technical
micro-data). Syne stands in for Monument Extended — the closest freely-licensed
structural grotesque.

**Dark only.** The direction is explicitly obsidian; a light mode would fight
the entire light-source premise.

### Utilities worth knowing

`panel` `panel-solid` `inset-panel` · `meta` `meta-bright` · `flare-text`
`flare-fill` · `rule` `rail` `blueprint` · `leak` `xray` `regmarks` · `datum` ·
`t-mega` `t-h1` `t-h2` `t-h3` `t-lead`

---

## Signature interactions

- **Command Center hero** — a three-column multi-axis grid: telemetry rail,
  headline, and a live pipeline viewport that *overlaps* the type so the layout
  reads as layered planes rather than stacked rows.
- **Live pipeline viewport** (`Viewport.tsx`) — a working miniature CRM board
  where cards advance between stages on a timer and the chart reflects the same
  data. Built rather than screenshotted because the claim is "we build systems
  like this", and it is the only honest way to show product when every client
  deployment is under NDA.
- **X-ray showcase** (`XRayShowcase.tsx`) — hovering or tapping a showcase
  dissolves the interface and exposes the real collections, endpoints and
  scheduled jobs underneath. A screenshot asks to be believed; a schema can be
  evaluated — and a table list gives nothing away about the client.
- **Light leak** (`.leak`) — a warm band travelling along a panel's top edge on
  hover. The brand's core motion: light moving across glass.
- **Scroll spine** — the grid's third axis made permanent: a fixed right-hand
  rail with a progress filament, section names and a percentage readout.
- **Commitments rail** — one scroll-driven value fills a filament and latches
  each station in turn, so the section reads as one mechanism rather than six
  independent triggers.

---

## Motion rules encoded here

Each of these exists because the alternative broke something:

- **`SplitText` is a server component using a CSS animation.** Headlines are the
  most important text on a page; a JS- or scroll-driven reveal that fails leaves
  a blank gap where the title should be.
- **The accent gradient is applied per WORD, not on a wrapper.**
  `background-clip: text` does not survive `SplitText`'s nested
  `overflow-hidden` + animated spans — each animated span establishes its own
  paint context and swallows the parent's clip, rendering the line invisible.
- **`Reveal` takes `immediate`.** Above-the-fold content animates on mount, not
  on scroll-into-view.
- **`Ticker` is pure CSS.** A `requestAnimationFrame` loop writing transforms
  janks scrolling. It pauses on hover and focus-within.
- **`Magnetic` is gated on `useFinePointer()`**, which subscribes via
  `useSyncExternalStore`. On touch, pointer-following fires on tap and makes
  controls shift under the finger.
- **`Counter` initialises to its target**, so the server HTML carries the real
  figure and crawlers never read "0+".
- **Reduced motion zeroes delays as well as durations.** Collapsing only the
  duration leaves staggered elements holding their `from` state for the full
  delay — which renders as missing content.
- **Responsive visibility is switched on wrapper elements**, never by adding
  `hidden` to a component that already sets its own `display`. Two competing
  display utilities on one element resolve by stylesheet order, not by which you
  wrote last — which silently renders both variants at once.

## Brand mark

`src/components/brand/Logo.tsx` — three sheared bars ascending, reading as a
layered stack, a growth curve and the diagonal of an "A", with one teal datum at
the apex.

Uses **no `<defs>` and no gradient ids.** SVG ids are document-global and the
mark renders several times per page; a shared gradient id collides and every
reference resolves to whichever instance appears first — possibly one inside a
`display:none` responsive wrapper, leaving an unfilled mark. The gradient is
reproduced by stepping three flat fills instead, which is also crisper at
favicon size.

---

## Content

Eight services and four engagements live in typed files under
`src/lib/content/`. No CMS: this content changes a few times a year, and a
database round-trip to render a price list buys nothing. Edit and redeploy.

```
services.ts   8 services — tiers, capabilities, phases, FAQs, keywords
work.ts       4 engagements, anonymised, each with its `guts` for the X-ray
faq.ts        site-wide FAQs + the six delivery commitments
```

### Published prices

| Service | From | Billing |
| --- | --- | --- |
| Static business website | ₹6,000 | one-off |
| Custom CRM | ₹12,000 | one-off |
| Dynamic website + admin | ₹15,000 | one-off |
| ERP system | ₹15,000 | one-off |
| AI automation | ₹15,000 | one-off |
| Website + billing app + mobile app | ₹20,000 | one-off |
| Google Maps profile & SEO | ₹5,000 | monthly |
| Business digitisation | Quote | after audit |

Each service page states plainly where a real project lands **above** its floor
— a ₹15,000 ERP is single-location; multi-branch is ₹40,000–1,50,000. Publishing
a floor without that caveat is bait, and it poisons the first call.

---

## SEO / GEO

- One connected `@graph` per page: `Organization`, `WebSite`, `Service` +
  `Offer` + `PriceSpecification`, `FAQPage`, `BreadcrumbList`, `ContactPage` —
  interlinked by `@id`.
- `robots.txt` **allows** AI crawlers deliberately: for a services business a
  citation is a qualified referral.
- `/llms.txt` is generated from the same content modules the pages render from,
  so it cannot drift. Includes a full price table and explicit notes on what we
  do *not* guarantee.
- Per-page OG cards at `/api/og`.
- Dynamic `sitemap.xml` with priorities weighted to commercial intent.

## Security

- Contact form: zod on both sides with the server as authority, a honeypot, a
  time-to-submit floor, and per-IP rate limiting. No CAPTCHA — those cost real
  users more than they cost bots.
- The rate limit is in-memory and per-instance: a speed bump, not a guarantee.
  Move it to Upstash Redis or the Vercel Firewall if it is ever targeted.
- No admin surface, so there is no auth surface to attack. If you later want a
  leads inbox, that is a small addition — ask.

## Deploying

Built for Vercel. Push, import, add environment variables, deploy. Everything
except `/api/lead` and `/api/og` is statically prerendered.
