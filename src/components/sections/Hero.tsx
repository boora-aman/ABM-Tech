import Link from "next/link";
import { Telemetry } from "./Telemetry";
import { Viewport } from "./Viewport";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal, Magnetic } from "@/components/motion";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Rule, Status, Datum } from "@/components/ui/Panel";
import { services } from "@/lib/content/services";
import { site, whatsappLink } from "@/lib/site.config";
import { inrShort } from "@/lib/utils";

/* ==========================================================================
   COMMAND CENTER HERO
   Not a centred title with two buttons. A strict three-column multi-axis grid:

     LEFT  (~22%)  telemetry rail — live engine metadata
     CENTRE(~48%)  the structural headline
     RIGHT (~30%)  a working pipeline viewport, overlapping the headline

   The overlap is the point: the glass module sits ON the type, so the layout
   reads as layered planes rather than stacked rows. Below 1024px the columns
   collapse to headline → viewport → rail, because the rail is supporting
   detail and should never be the first thing a phone shows.
   ========================================================================== */

export function Hero() {
  const entry = [...services]
    .filter((s) => s.from > 0)
    .sort((a, b) => a.from - b.from)[0];

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
      {/* Blueprint grid, fading out downward */}
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-70"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 75%)",
        }}
      />

      <div className="page-x relative">
        <div className="bay">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)_minmax(0,1.35fr)] lg:gap-8 lg:items-start">
            {/* ---------------------- LEFT: telemetry rail --------------- */}
            <Reveal
              immediate
              delay={0.3}
              className="order-3 border-t border-hair pt-6 lg:order-1 lg:border-t-0 lg:border-r lg:pt-0 lg:pr-7"
            >
              <Telemetry />
            </Reveal>

            {/* ------------------------ CENTRE: headline ----------------- */}
            <div className="order-1 min-w-0 lg:order-2">
              <Reveal immediate delay={0.04}>
                <div className="mb-7 flex flex-wrap items-center gap-2.5">
                  <Status>Taking work · next cycle</Status>
                  <span className="meta hidden sm:inline">
                    Est. {site.founded} · India
                  </span>
                </div>
              </Reveal>

              <h1 className="t-mega mb-8 font-display">
                <SplitText text="We build the" delay={0.06} />
                <br />
                {/* The gradient is applied per WORD, not on a wrapper:
                    background-clip:text does not survive SplitText's nested
                    overflow-hidden + animated spans, which each establish
                    their own paint context and swallow the parent's clip. */}
                <SplitText
                  text="software you"
                  delay={0.2}
                  wordClassName="flare-text"
                />
                <br />
                <SplitText text="actually run on." delay={0.34} />
              </h1>

              <Reveal immediate delay={0.42}>
                <p className="t-lead mb-9 max-w-lg">
                  CRM, ERP, billing platforms, admin-driven websites and the AI
                  automation between them. Fixed scope, fixed price, and the code
                  is yours from the first commit.
                </p>
              </Reveal>

              <Reveal immediate delay={0.5}>
                <div className="mb-10 flex flex-wrap gap-3">
                  <Magnetic strength={0.16}>
                    <ButtonLink href="/contact" variant="flare" size="lg">
                      Start a project
                      <Arrow />
                    </ButtonLink>
                  </Magnetic>
                  <Magnetic strength={0.16}>
                    <ButtonLink href="/pricing" variant="glass" size="lg">
                      See pricing
                      <Arrow />
                    </ButtonLink>
                  </Magnetic>
                </div>
              </Reveal>

              {/* Price floor strip — the single most useful fact above the fold */}
              <Reveal immediate delay={0.58}>
                <Rule className="mb-5" />
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                  {services
                    .filter((s) => s.from > 0)
                    .slice(0, 4)
                    .map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="group block"
                      >
                        <dd className="font-display text-xl tracking-[-0.02em] transition-colors group-hover:text-flare-hi sm:text-2xl">
                          {inrShort(s.from)}
                          <span className="text-ink-faint">+</span>
                        </dd>
                        <dt className="meta mt-1.5 leading-snug">{s.short}</dt>
                      </Link>
                    ))}
                </dl>
              </Reveal>
            </div>

            {/* --------------------- RIGHT: live viewport ---------------- */}
            <Reveal
              immediate
              delay={0.16}
              className="order-2 min-w-0 lg:order-3 lg:-ml-16 lg:mt-10 xl:-ml-24"
            >
              <Viewport />
              <p className="meta mt-3 flex items-start gap-2 leading-relaxed normal-case tracking-normal">
                <Datum className="mt-1.5 shrink-0" />
                <span>
                  Illustrative pipeline, running live. Client deployments are
                  under NDA — this is the shape, not a screenshot.
                </span>
              </p>
              {entry && (
                <p className="meta mt-4">
                  Entry point · {inrShort(entry.from)} · {entry.short}
                </p>
              )}
            </Reveal>
          </div>

          {/* Bottom rail */}
          <Reveal immediate delay={0.66}>
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-5">
              <span className="meta">
                Fixed price · No lock-in · Code in your Git org
              </span>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-bright transition-colors hover:text-flare-hi"
              >
                WhatsApp {site.contact.phoneDisplay} →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
