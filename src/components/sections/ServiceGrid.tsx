import { Card, Label, Chip, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { inrShort } from "@/lib/utils";
import type { Service } from "@/lib/content/services";

/* ==========================================================================
   SERVICES
   Plain card grid — the format a business visitor can scan without learning a
   new interface. Each card answers the same four questions in the same place:
   what it is, who it's for, what it includes, what it costs.

   Server component. Hover lift is CSS.
   ========================================================================== */

export function ServiceGrid({
  services,
  heading = true,
}: {
  services: Service[];
  heading?: boolean;
}) {
  return (
    <section id="services" className="defer-paint page-x py-20 sm:py-24">
      <div className="bay">
        {heading && (
          <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Label className="mb-4">What we do</Label>
              <h2 className="t-h1 max-w-lg">
                Everything you need to run
                <br />
                <span className="brand-text">and grow the business.</span>
              </h2>
            </div>
            <p className="t-lead lg:pb-1">
              {services.length} services with published starting prices — from a
              ₹6,000 website to a full platform with a mobile app. Each page
              lists what is included, what is deliberately not, and the realistic
              timeline.
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card
              as="article"
              key={s.slug}
              lift
              className="flex flex-col p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-sm bg-tint font-display text-[0.8125rem] font-semibold text-brand-ink"
                >
                  {s.index}
                </span>
                {s.featured && <Chip brand>Popular</Chip>}
              </div>

              <h3 className="t-h3 mb-2.5">{s.title}</h3>
              <p className="mb-5 text-[0.9375rem] leading-relaxed text-ink-dim">
                {s.summary}
              </p>

              <ul className="mb-6 space-y-2">
                {s.deliverables.slice(0, 3).map((d) => (
                  <li key={d} className="flex gap-2.5 text-[0.8125rem] leading-snug text-ink-dim">
                    <Tick className="size-3.5!" />
                    <span className="line-clamp-2">{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-5">
                <div>
                  <div className="label mb-1 normal-case tracking-normal!">
                    {s.from > 0 ? "Starting at" : "Pricing"}
                  </div>
                  <div className="font-display text-xl font-semibold tabular-nums">
                    {s.from > 0 ? (
                      <>
                        {inrShort(s.from)}
                        <span className="text-ink-faint">+</span>
                        {s.priceMode === "retainer" && (
                          <span className="ml-1 text-[0.75rem] font-normal text-ink-faint">
                            /mo
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-ink-dim">On request</span>
                    )}
                  </div>
                </div>
                <ButtonLink href={`/services/${s.slug}`} variant="outline" size="sm">
                  Details
                  <Arrow />
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>

        {/* Honest exclusions — reads as confidence, not as a disclaimer */}
        <Card className="mt-6 p-6 sm:p-8">
          <Label className="mb-4">What we don&apos;t do</Label>
          <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-dim">
            We don&apos;t run paid ad campaigns, buy backlinks or reviews, do print
            or brand identity design, or sell per-seat licences. We don&apos;t
            take on projects we cannot staff properly, and we don&apos;t quote a
            number before we understand the scope. And if an off-the-shelf tool
            would genuinely serve you better than a custom build — Shopify,
            Zoho, ERPNext, Power BI — we&apos;ll name it on the first call rather
            than three weeks in.
          </p>
        </Card>
      </div>
    </section>
  );
}
