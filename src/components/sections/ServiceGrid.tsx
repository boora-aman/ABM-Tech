import { Card, Label, Chip, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Expandable } from "@/components/ui/Expandable";
import { inrShort } from "@/lib/utils";
import type { Service } from "@/lib/content/services";
import { pick } from "@/lib/content/repo";

/* ==========================================================================
   SERVICES
   Plain card grid — the format a business visitor can scan without learning a
   new interface. Each card answers the same four questions in the same place:
   what it is, who it's for, what it includes, what it costs.

   Server component. Hover lift is CSS.
   ========================================================================== */

/* Extracted so the collapsed remainder renders identical cards to the visible
   ones — duplicating this markup is how the two halves of a disclosure drift
   apart. */
function ServiceCard({ s }: { s: Service }) {
  return (
    <Card as="article" lift className="flex flex-col p-6">
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
          <li
            key={d}
            className="flex gap-2.5 text-[0.8125rem] leading-snug text-ink-dim"
          >
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
  );
}

export function ServiceGrid({
  services,
  heading = true,
  /** Cards shown before the disclosure. 0 shows everything. */
  initial = 0,
  settings = {},
}: {
  services: Service[];
  heading?: boolean;
  initial?: number;
  settings?: Record<string, unknown>;
}) {
  const eyebrow = pick(settings, "services.eyebrow", "What we do");
  const title = pick(settings, "services.heading", ["Everything you need to run"]);
  const titleAccent = pick(
    settings,
    "services.headingAccent",
    "and grow the business.",
  );
  const collapse = initial > 0 && services.length > initial;
  const first = collapse ? services.slice(0, initial) : services;
  const rest = collapse ? services.slice(initial) : [];
  return (
    <section id="services" className="defer-paint page-x py-20 sm:py-24">
      <div className="bay">
        {heading && (
          <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Label className="mb-4">{eyebrow}</Label>
              <h2 className="t-h1 max-w-lg">
                {title.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                <span className="brand-text">{titleAccent}</span>
              </h2>
            </div>
            <p className="t-lead lg:pb-1">
              {services.length} services with published starting prices — from a
              ₹6,000 website to a full platform with a mobile app. Each page
              lists what is included, what is deliberately not, and the
              realistic timeline.
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {first.map((s) => (
            <ServiceCard key={s.slug} s={s} />
          ))}
        </div>

        {collapse && (
          <Expandable
            hidden={rest.length}
            total={services.length}
            noun="services"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((s) => (
                <ServiceCard key={s.slug} s={s} />
              ))}
            </div>
          </Expandable>
        )}

        {/* Honest exclusions — reads as confidence, not as a disclaimer */}
        <Card className="mt-6 p-6 sm:p-8">
          <Label className="mb-4">What we don&apos;t do</Label>
          <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-dim">
            We don&apos;t run paid ad campaigns, buy backlinks or reviews, do
            print or brand identity design, or sell per-seat licences. We
            don&apos;t take on projects we cannot staff properly, and we
            don&apos;t quote a number before we understand the scope. And if an
            off-the-shelf tool would genuinely serve you better than a custom
            build — Shopify, Zoho, ERPNext, Power BI — we&apos;ll name it on the
            first call rather than three weeks in.
          </p>
        </Card>
      </div>
    </section>
  );
}
