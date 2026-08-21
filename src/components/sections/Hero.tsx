import Link from "next/link";
import { Card, Label, Rule, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { services } from "@/lib/content/services";
import { site, whatsappLink } from "@/lib/site.config";
import { inrShort } from "@/lib/utils";

/* ==========================================================================
   HERO

   A professional business opening: what we do, who it's for, what it costs,
   and how to start. Two columns — statement on the left, a plain-language
   price list on the right, because "what does it cost" is the first question
   a business owner actually has.

   Entirely a SERVER component. No hooks, no timers, no scroll listeners, no
   client JS at all. Entrance animation is CSS with staggered delays, so it
   runs from the server HTML and can never be stranded invisible.
   ========================================================================== */

export function Hero() {
  const priced = services.filter((s) => s.from > 0).sort((a, b) => a.from - b.from);

  return (
    <section className="page-x pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="bay">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:items-start">
          {/* ---------------------------- Statement ------------------------ */}
          <div>
            <div className="rise mb-7" style={{ animationDelay: "0.04s" }}>
              <Label>Software for growing businesses</Label>
            </div>

            <h1
              className="t-hero rise mb-7"
              style={{ animationDelay: "0.1s" }}
            >
              Software that runs
              <br />
              your business,
              <br />
              <span className="brand-text">not the other way round.</span>
            </h1>

            <p className="t-lead rise mb-9 max-w-xl" style={{ animationDelay: "0.18s" }}>
              We build CRM, ERP, billing systems and business websites for
              companies in India — shaped around how you already work. Fixed
              price, written scope, and the code is yours from day one.
            </p>

            <div
              className="rise mb-10 flex flex-wrap gap-3"
              style={{ animationDelay: "0.26s" }}
            >
              <ButtonLink href="/contact" variant="primary" size="lg">
                Get a free quote
                <Arrow />
              </ButtonLink>
              <ButtonLink href="/services" variant="outline" size="lg">
                Browse services
                <Arrow />
              </ButtonLink>
            </div>

            {/* Trust points — facts about how we work, not unverifiable counts */}
            <div className="rise" style={{ animationDelay: "0.34s" }}>
              <Rule className="mb-6" />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {site.proof.map((p) => (
                  <div key={p.k}>
                    <dd className="font-display text-lg font-semibold">{p.v}</dd>
                    <dt className="label mt-1.5 normal-case tracking-normal!">
                      {p.k}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* ----------------------- Plain price list ---------------------- */}
          <Card
            raised
            className="rise overflow-hidden"
            style={{ animationDelay: "0.16s" }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-4">
              <Label tick={false}>Starting prices</Label>
              <span className="label normal-case tracking-normal!">ex-GST</span>
            </div>

            <ul>
              {priced.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-center gap-4 border-b border-line px-6 py-4 transition-colors last:border-0 hover:bg-tint"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-medium">
                        {s.short}
                      </span>
                      <span className="label mt-1 block truncate normal-case tracking-normal!">
                        {s.timeline}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-display text-[1.0625rem] font-semibold tabular-nums">
                        {inrShort(s.from)}
                        <span className="text-ink-faint">+</span>
                      </span>
                      {s.priceMode === "retainer" && (
                        <span className="label block normal-case tracking-normal!">
                          per month
                        </span>
                      )}
                    </span>
                    <span className="text-ink-faint transition-transform duration-250 group-hover:translate-x-0.5 group-hover:text-brand">
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-line bg-tint px-6 py-5">
              <ul className="space-y-2.5">
                {[
                  "No hourly billing — one fixed figure",
                  "No monthly licence or per-seat fees",
                  "Honest answer if you don't need us",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5 text-[0.875rem] text-ink-dim">
                    <Tick />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="ul-draw mt-5 inline-block text-[0.875rem] font-medium brand-text"
              >
                Or ask on WhatsApp — {site.contact.phoneDisplay}
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
