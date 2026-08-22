import { Card, Label, Rule } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { site } from "@/lib/site.config";

/* ==========================================================================
   HERO

   Deliberately NOT a product or price list. A hero has one job — say what you
   do, for whom, and what happens if the visitor is interested. Prices and
   services are one click away on /pricing and /services, and repeating them
   here made the first screen read as a catalogue index rather than a
   proposition.

   The right column answers the question the CTA raises — "what actually
   happens if I get in touch?" — which is what moves someone to click it.

   Entirely a server component: no hooks, no timers, no scroll listeners, no
   client JS. The entrance is CSS with staggered delays, so it runs from the
   server HTML and cannot be stranded invisible.
   ========================================================================== */

const STEPS = [
  {
    n: "1",
    t: "A conversation",
    d: "Twenty minutes on what is slowing the business down. No brief needed, no obligation.",
  },
  {
    n: "2",
    t: "A written scope and a fixed price",
    d: "Exactly what gets built, what it costs, and what is deliberately left out. Free.",
  },
  {
    n: "3",
    t: "Something you can click, weekly",
    d: "Working slices on a preview link every week — never an eight-week wait for a reveal.",
  },
];

export function Hero() {
  return (
    <section className="page-x pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div className="bay">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:items-center">
          {/* ---------------------------- Statement ------------------------ */}
          <div>
            <div className="rise mb-7" style={{ animationDelay: "0.04s" }}>
              <Label>Software built for Indian businesses</Label>
            </div>

            <h1 className="t-hero rise mb-7" style={{ animationDelay: "0.1s" }}>
              Stop running your
              <br />
              business on
              <br />
              <span className="brand-text">spreadsheets and memory.</span>
            </h1>

            <p className="t-lead rise mb-9 max-w-xl" style={{ animationDelay: "0.18s" }}>
              We build the systems that hold it together — sales, stock, billing,
              your website — shaped around how you already work. Fixed price,
              written scope, and the code is yours from day one.
            </p>

            <div
              className="rise flex flex-wrap gap-3"
              style={{ animationDelay: "0.26s" }}
            >
              <ButtonLink href="/contact" variant="primary" size="lg">
                Get a free quote
                <Arrow />
              </ButtonLink>
              <ButtonLink href="/work" variant="outline" size="lg">
                See our work
                <Arrow />
              </ButtonLink>
            </div>
          </div>

          {/* -------------------- What happens next ------------------------ */}
          <Card raised className="rise p-6 sm:p-8" style={{ animationDelay: "0.16s" }}>
            <Label className="mb-6">How we start</Label>
            <ol className="space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-tint font-display text-[0.8125rem] font-semibold text-brand-ink"
                  >
                    {s.n}
                  </span>
                  <div>
                    <h2 className="mb-1 font-display text-[1rem] font-semibold">
                      {s.t}
                    </h2>
                    <p className="text-[0.875rem] leading-relaxed text-ink-dim">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Rule className="my-6" />

            <p className="text-[0.8125rem] leading-relaxed text-ink-dim">
              And if an off-the-shelf tool would genuinely serve you better than
              a custom build, we&apos;ll tell you — on the first call, not three
              weeks in.
            </p>
          </Card>
        </div>

        {/* ------------------------- Trust strip ------------------------- */}
        <div className="rise mt-16" style={{ animationDelay: "0.34s" }}>
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
