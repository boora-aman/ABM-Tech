import Link from "next/link";
import { Card, Label, Chip } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Expandable } from "@/components/ui/Expandable";
import type { Industry } from "@/lib/content/industries";
import type { Service } from "@/lib/content/services";
import { pick } from "@/lib/content/repo";

/* ==========================================================================
   INDUSTRIES

   Translation layer. A visitor should find their own sector's vocabulary on
   the page — "bilty", "batch expiry", "job card", "instalment" — because that
   is the signal that we have built something like their business before,
   and it is the thing a generic "we serve all industries" line cannot fake.

   `compact` renders the scan-only version used on the home page; the full
   version with pains and builds is for /industries.
   ========================================================================== */

function IndustryCard({
  ind,
  bySlug,
}: {
  ind: Industry;
  bySlug: Map<string, Service>;
}) {
  return (
    <Card as="article" lift className="flex flex-col p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-sm bg-tint font-display text-[0.75rem] font-semibold text-brand-ink"
        >
          {ind.index}
        </span>
        {ind.featured && <Chip brand>Shipped</Chip>}
      </div>

      <h3 className="t-h3 mb-3">{ind.name}</h3>

      <p className="mb-5 border-l-2 border-brand/30 pl-3.5 text-[0.875rem] leading-relaxed text-ink-dim italic">
        {ind.pain}
      </p>

      <div className="label mb-2.5 normal-case tracking-normal!">
        What we build
      </div>
      <ul className="mb-6 space-y-1.5">
        {ind.builds.map((b) => (
          <li
            key={b}
            className="flex gap-2.5 text-[0.8125rem] leading-snug text-ink-dim"
          >
            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-x-2 gap-y-1.5 border-t border-line pt-5">
        {ind.services.map((slug) => {
          const s = bySlug.get(slug);
          if (!s) return null;
          return (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="ul-draw text-[0.8125rem] text-ink-dim hover:text-brand-ink"
            >
              {s.short}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

export function IndustriesSection({
  industries,
  services,
  heading = true,
  /** Cards shown before the disclosure. 0 shows everything. */
  initial = 0,
  settings = {},
}: {
  industries: Industry[];
  services: Service[];
  heading?: boolean;
  initial?: number;
  settings?: Record<string, unknown>;
}) {
  const eyebrow = pick(settings, "industries.eyebrow", "Who we build for");
  const title = pick(settings, "industries.heading", [
    "Your sector has its own words.",
  ]);
  const titleAccent = pick(settings, "industries.headingAccent", "We build in them.");
  const lead = pick(
    settings,
    "industries.lead",
    "Knowing that a pharmacy needs batch-level MRP, that a transporter needs a bilty, and that a fuel station reconciles per shift is the difference between software that gets used and software that gets abandoned in month two.",
  );
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const collapse = initial > 0 && industries.length > initial;
  const first = collapse ? industries.slice(0, initial) : industries;
  const rest = collapse ? industries.slice(initial) : [];

  return (
    <section id="industries" className="defer-paint page-x py-20 sm:py-24">
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
            <p className="t-lead lg:pb-1">{lead}</p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {first.map((ind) => (
            <IndustryCard key={ind.slug} ind={ind} bySlug={bySlug} />
          ))}
        </div>

        {collapse && (
          <Expandable hidden={rest.length} total={industries.length} noun="sectors">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((ind) => (
                <IndustryCard key={ind.slug} ind={ind} bySlug={bySlug} />
              ))}
            </div>
          </Expandable>
        )}

        <Card className="mt-6 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_auto] lg:items-center">
          <div>
            <h3 className="t-h3 mb-2">Not on this list?</h3>
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-dim">
              It is a list of sectors we have modelled, not a list of sectors we
              accept. The six systems are the same everywhere — only the nouns
              change. Tell us what yours are called and we will tell you honestly
              whether we are the right people to build it.
              {" "}
              <span className="text-ink-faint">
                Cards marked &ldquo;Shipped&rdquo; are sectors we have delivered production
                systems in.
              </span>
            </p>
          </div>
          {collapse ? (
            <ButtonLink href="/industries" variant="outline" size="lg">
              Sector detail
              <Arrow />
            </ButtonLink>
          ) : (
            <ButtonLink href="/contact" variant="primary" size="lg">
              Ask about yours
              <Arrow />
            </ButtonLink>
          )}
        </Card>
      </div>
    </section>
  );
}
