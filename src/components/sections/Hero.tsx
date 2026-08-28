import { Card, Label, Rule } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { site, whatsappLink } from "@/lib/site.config";
import type { Pillar } from "@/lib/content/pillars";
import type { Industry } from "@/lib/content/industries";
import { pick } from "@/lib/content/repo";

/* ==========================================================================
   HERO

   The old hero addressed one reader: an Indian SMB running on spreadsheets.
   That is a real customer and a narrow door — a hotel, a machine shop or a
   coaching institute read "CRM, ERP, billing platform" and had to work out
   for themselves whether any of it applied to them.

   This version leads with the structural claim instead: every business runs
   the same six systems, and we build all six. The right column is that claim
   made visible — the six loops as a stack you can read in one glance — which
   does more work than a generic screenshot ever would.

   Still entirely a server component: no hooks, no timers, no scroll
   listeners, no client JS. The entrance is CSS with staggered delays, so it
   renders from server HTML and can never be stranded invisible. The aura
   behind the heading is a single static radial gradient on an absolutely
   positioned element — it composites once and never repaints on scroll.
   ========================================================================== */

export function Hero({
  pillars,
  industries,
  serviceCount,
  settings = {},
}: {
  pillars: Pillar[];
  industries: Industry[];
  serviceCount: number;
  /** Copy overrides from the CMS. Every read carries the committed wording as
   *  its fallback, so a missing or deleted key restores the original text
   *  rather than rendering an empty heading. */
  settings?: Record<string, unknown>;
}) {
  const headline = pick(settings, "hero.headline", [
    "Every business runs",
    "on six systems.",
  ]);
  const headlineAccent = pick(settings, "hero.headlineAccent", "We build all six.");
  const eyebrow = pick(settings, "hero.eyebrow", "Software for every kind of business");
  const lead = pick(
    settings,
    "hero.lead",
    "A shop, a clinic, a factory, a school, a transport fleet — the software looks different, the six loops never change. Get found, catch demand, run operations, collect the money, work off the desk, and know what is happening. We design, build and run all of it.",
  );

  return (
    <section className="relative page-x pt-32 pb-14 sm:pt-40 sm:pb-20">
      {/* Static brand aura. Decorative, pointer-events-none, paints once. */}
      <div aria-hidden className="aura" />

      <div className="bay relative">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_1fr] lg:gap-14 xl:gap-20">
          {/* ---------------------------- Statement ------------------------ */}
          <div>
            <div className="rise mb-7" style={{ animationDelay: "0.04s" }}>
              <Label>{eyebrow}</Label>
            </div>

            <h1 className="t-hero rise mb-7" style={{ animationDelay: "0.1s" }}>
              {headline.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
              <span className="brand-text">{headlineAccent}</span>
            </h1>

            <p className="t-lead rise mb-8 max-w-xl" style={{ animationDelay: "0.18s" }}>
              {lead}
            </p>

            <div
              className="rise mb-9 flex flex-wrap gap-3"
              style={{ animationDelay: "0.26s" }}
            >
              <ButtonLink href="/contact" variant="primary" size="lg">
                Get a free quote
                <Arrow />
              </ButtonLink>
              <ButtonLink href="/services" variant="outline" size="lg">
                See all {serviceCount} services
                <Arrow />
              </ButtonLink>
              <ButtonLink
                href={whatsappLink()}
                variant="whatsapp"
                size="lg"
                external
              >
                <WhatsAppGlyph />
                WhatsApp
              </ButtonLink>
            </div>

            <p
              className="rise text-[0.8125rem] leading-relaxed text-ink-faint"
              style={{ animationDelay: "0.32s" }}
            >
              {site.promise}
            </p>
          </div>

          {/* ------------------ The six systems, as a stack ---------------- */}
          <Card
            raised
            className="rise overflow-hidden p-0"
            style={{ animationDelay: "0.16s" }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-5 sm:px-7">
              <Label tick={false}>The six systems</Label>
              <span className="text-[0.6875rem] text-ink-faint">
                Pick the one that hurts
              </span>
            </div>

            <ol>
              {pillars.map((p) => (
                <li
                  key={p.key}
                  className="group/row flex items-start gap-4 border-b border-line px-6 py-4 transition-colors last:border-0 hover:bg-tint sm:px-7"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm bg-tint font-display text-[0.6875rem] font-semibold text-brand-ink"
                  >
                    {p.index}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-[0.9375rem] font-semibold">
                      {p.name}
                    </h2>
                    <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-dim">
                      {p.question}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* --------------------- Sectors, as a ticker --------------------- */}
        <div className="rise mt-14" style={{ animationDelay: "0.36s" }}>
          <Rule className="mb-6" />
          <div className="ticker overflow-hidden" style={{ ["--ticker-duration" as string]: "48s" }}>
            <div className="ticker-track gap-3 pr-3">
              {[...industries, ...industries].map((ind, i) => (
                <span
                  key={`${ind.slug}-${i}`}
                  aria-hidden={i >= industries.length}
                  className="whitespace-nowrap rounded-sm border border-line px-3.5 py-2 text-[0.8125rem] text-ink-dim"
                >
                  {ind.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------- Trust strip ------------------------- */}
        <div className="rise mt-12" style={{ animationDelay: "0.4s" }}>
          <Rule className="mb-8" />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {site.proof.map((p) => (
              <div key={p.k}>
                <dd className="font-display text-xl font-semibold sm:text-2xl">
                  {p.v}
                </dd>
                <dt className="mt-1.5 text-[0.875rem] font-medium">{p.k}</dt>
                <p className="mt-1 text-[0.75rem] leading-snug text-ink-faint">
                  {p.note}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
