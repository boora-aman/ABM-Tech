import { Card, Label, Chip, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { inrShort } from "@/lib/utils";
import { catalogueGroups } from "@/lib/content/pillars";
import type { Service } from "@/lib/content/services";

/* ==========================================================================
   SERVICE CATALOGUE — the grouped view.

   Thirteen cards in one flat grid is a wall, not a menu. Grouping them by the
   business loop each one serves means a visitor scans seven short headings
   instead of thirteen product names, and lands in the right group before
   reading a single price.

   Every service is filed under exactly one group via `service.pillar`, so
   nothing is duplicated and nothing is orphaned — the orphan check runs below
   and renders anything unmatched rather than silently dropping it.
   ========================================================================== */

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
      <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-dim">
        {s.summary}
      </p>

      <p className="mb-5 text-[0.8125rem] leading-snug text-ink-faint">
        <span className="font-medium text-ink-dim">Best for:</span> {s.bestFor}
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

export function ServiceCatalogue({ services }: { services: Service[] }) {
  const grouped = catalogueGroups
    .map((g) => ({ ...g, items: services.filter((s) => s.pillar === g.key) }))
    .filter((g) => g.items.length > 0);

  // Safety net: a service whose pillar key does not match any group would
  // otherwise vanish from the catalogue entirely rather than fail loudly.
  const filed = new Set(grouped.flatMap((g) => g.items.map((s) => s.slug)));
  const orphans = services.filter((s) => !filed.has(s.slug));

  return (
    <section id="services" className="page-x py-16 sm:py-20">
      <div className="bay space-y-16">
        {grouped.map((g) => (
          <div key={g.key}>
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-5">
              <div>
                <Label className="mb-2">{g.blurb}</Label>
                <h2 className="t-h2">{g.name}</h2>
              </div>
              <span className="text-[0.8125rem] text-ink-faint">
                {g.items.length} {g.items.length === 1 ? "service" : "services"}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((s) => (
                <ServiceCard key={s.slug} s={s} />
              ))}
            </div>
          </div>
        ))}

        {orphans.length > 0 && (
          <div>
            <h2 className="t-h2 mb-8 border-b border-line pb-5">Also available</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {orphans.map((s) => (
                <ServiceCard key={s.slug} s={s} />
              ))}
            </div>
          </div>
        )}

        <Card className="p-6 sm:p-8">
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
