"use client";

import Link from "next/link";
import { Panel, SectionLabel, Rule, Tag } from "@/components/ui/Panel";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Arrow } from "@/components/ui/Button";
import { inrShort } from "@/lib/utils";
import type { Service } from "@/lib/content/services";

/* ==========================================================================
   SERVICE MATRIX
   A dense index rather than a grid of equal cards. Each row is a full-width
   structural band carrying index, title, price, timeline and audience — the
   four things a buyer compares — with the hot rule igniting across the row on
   hover.

   Chosen over a bento grid on purpose: eight services in a bento produce
   arbitrary cell sizes that imply a hierarchy that does not exist, and read as
   the same template as every other agency site.
   ========================================================================== */

export function ServiceMatrix({ services }: { services: Service[] }) {
  return (
    <section id="services" className="page-x py-20 sm:py-28">
      <div className="bay">
        <Reveal>
          <SectionLabel index="01" className="mb-9">
            Capabilities
          </SectionLabel>
        </Reveal>

        <div className="mb-14 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Reveal delay={0.04}>
            <h2 className="t-h1">
              Eight services.
              <br />
              <span className="flare-text">Every price published.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lead">
              Starting figures are real floors, and each page states plainly
              where a project typically lands above them. You get the actual
              number before committing, not after.
            </p>
          </Reveal>
        </div>

        <Stagger className="border-t border-hair" step={0.045}>
          {services.map((s) => (
            <StaggerItem key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group/row leak relative block border-b border-hair py-6 transition-colors duration-300 hover:bg-white/[0.015]"
              >
                <div className="grid items-center gap-x-6 gap-y-3 lg:grid-cols-[auto_minmax(0,1.5fr)_minmax(0,1.4fr)_auto_auto]">
                  {/* Index */}
                  <span className="font-mono text-[0.6875rem] tabular-nums text-flare/70">
                    [{s.index}]
                  </span>

                  {/* Title + summary */}
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.25rem] tracking-[-0.02em] transition-colors group-hover/row:text-flare-hi sm:text-[1.4rem]">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-faint lg:hidden">
                      {s.summary}
                    </p>
                  </div>

                  {/* Best for */}
                  <p className="hidden text-[0.8125rem] leading-relaxed text-ink-dim lg:block">
                    {s.bestFor}
                  </p>

                  {/* Timeline */}
                  <span className="meta hidden whitespace-nowrap xl:block">
                    {s.timeline}
                  </span>

                  {/* Price + arrow */}
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <div className="font-display text-lg tracking-[-0.02em] whitespace-nowrap sm:text-xl">
                        {s.from > 0 ? (
                          <>
                            {inrShort(s.from)}
                            <span className="text-ink-faint">+</span>
                          </>
                        ) : (
                          <span className="text-ink-dim">Quote</span>
                        )}
                      </div>
                      <div className="meta mt-1 whitespace-nowrap">
                        {s.priceMode === "retainer"
                          ? "per month"
                          : s.priceMode === "quote"
                            ? "after audit"
                            : "one-off"}
                      </div>
                    </div>
                    <span className="group/btn grid size-9 shrink-0 place-items-center rounded-tight border border-hair transition-colors group-hover/row:border-hair-warm group-hover/row:text-flare-hi">
                      <Arrow />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Honest exclusions */}
        <Reveal delay={0.08}>
          <Panel className="mt-8 p-6 sm:p-8">
            <SectionLabel className="mb-5">What we don&apos;t do</SectionLabel>
            <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-dim">
              We don&apos;t run paid ad campaigns, buy backlinks, do brand or
              print design, or take on WordPress plugin work. We don&apos;t sell
              per-seat licences. And we turn down builds where an off-the-shelf
              tool would genuinely serve you better — you&apos;ll hear that on
              the first call rather than three weeks in.
            </p>
            <Rule className="my-5" />
            <div className="flex flex-wrap gap-2">
              {["No hourly billing", "No per-seat fees", "No lock-in", "No ranking guarantees"].map(
                (t) => (
                  <Tag key={t} hot>
                    {t}
                  </Tag>
                ),
              )}
            </div>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}
