"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Card, Label, Chip, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Slide } from "@/lib/content/showcase";

/* ==========================================================================
   SHOWCASE

   ONE large frame plus a tab strip, rather than a peeking scroll-snap row.

   The scroll-snap version had real problems: `scroll-snap-type: x mandatory`
   combined with large asymmetric edge padding made the first and last cards
   awkward to rest on, partial cards at the viewport edge read as clipped
   rather than as a hint, and dimming the inactive cards looked like a
   rendering fault instead of a deliberate focus effect.

   A single frame is also simply better for screenshots: the product gets the
   full width instead of two-thirds of it.

   Cost: no swipe gesture. Acceptable, because the controls are explicit and
   the tab strip is itself horizontally scrollable on a phone. Switching slides
   is a state change with a CSS crossfade — no JS animation loop, nothing
   per-frame.
   ========================================================================== */

export function Showcase({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const active = slides[i];

  const step = useCallback(
    (dir: 1 | -1) => setI((v) => (v + dir + slides.length) % slides.length),
    [slides.length],
  );

  if (!active) return null;

  return (
    <section id="showcase" className="defer-paint page-x py-20 sm:py-24">
      <div className="bay">
        {/* ------------------------------ Heading ---------------------------- */}
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label className="mb-4">What we&apos;ve built</Label>
            <h2 className="t-h1 max-w-xl">
              Products already running
              <br />
              <span className="brand-text">for real businesses.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous product"
              className="grid size-10 place-items-center rounded-sm border border-line text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
            >
              <Chevron dir="left" />
            </button>
            <span className="label tabular-nums" aria-live="polite" aria-atomic="true">
              {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next product"
              className="grid size-10 place-items-center rounded-sm border border-line text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        {/* ------------------------------- Tabs ------------------------------ */}
        <div
          role="tablist"
          aria-label="Products"
          className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s, idx) => (
            <button
              key={s.id}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={idx === i}
              aria-controls="showcase-panel"
              onClick={() => setI(idx)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
                if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
              }}
              className={cn(
                "shrink-0 rounded-sm border px-4 py-2.5 text-[0.875rem] font-medium transition-colors",
                idx === i
                  ? "border-brand bg-tint text-brand-ink"
                  : "border-line text-ink-dim hover:border-line-strong hover:text-ink",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* ------------------------------ The panel -------------------------- */}
        <Card
          raised
          id="showcase-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="overflow-hidden"
        >
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            {/* Frame — keyed so React remounts it and the CSS fade replays */}
            <div
              key={active.id}
              className="fade relative aspect-[16/10] border-b border-line bg-page lg:border-r lg:border-b-0"
            >
              {active.image ? (
                <Image
                  src={active.image}
                  alt={`${active.title} — ${active.kicker}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                  priority={i === 0}
                />
              ) : (
                <Placeholder slide={active} />
              )}
            </div>

            {/* Copy */}
            <div key={`${active.id}-copy`} className="fade flex flex-col p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {active.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <h3 className="t-h3 mb-2">{active.title}</h3>
              <p className="mb-5 text-[0.875rem] font-medium brand-text">
                {active.kicker}
              </p>
              <p className="mb-7 text-[0.9375rem] leading-relaxed text-ink-dim">
                {active.summary}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-line pt-6">
                <ButtonLink
                  href={`/services/${active.serviceSlug}`}
                  variant="outline"
                  size="sm"
                >
                  How we build this
                  <Arrow />
                </ButtonLink>
                {active.liveUrl && (
                  <ButtonLink href={active.liveUrl} variant="ghost" size="sm" external>
                    Visit live
                    <Arrow />
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Progress dots */}
        <div className="mt-5 flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show ${s.title}`}
              aria-current={idx === i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === i ? "w-8 bg-brand" : "w-1.5 bg-line-strong hover:bg-ink-faint",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Placeholder art for slides awaiting a screenshot.
 *
 * Deliberately designed rather than an empty grey box: a browser-chrome frame
 * with the product name set large, a soft brand wash, and the feature list
 * rendered as skeleton rows. Six empty boxes read as a broken build; six of
 * these read as a section that is simply pending its assets.
 */
function Placeholder({ slide }: { slide: Slide }) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-brand/45" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="label ml-1 truncate normal-case tracking-normal!">
          {slide.title}
        </span>
      </div>

      {/* Body */}
      <div
        className="relative flex flex-1 flex-col justify-between p-5 sm:p-7"
        style={{
          background:
            "linear-gradient(140deg, var(--t-tint), transparent 55%), var(--t-page)",
        }}
      >
        <div>
          <p className="font-display text-2xl leading-tight font-semibold sm:text-3xl">
            {slide.title}
          </p>
          <p className="mt-2 max-w-sm text-[0.875rem] text-ink-dim">
            {slide.kicker}
          </p>
        </div>

        {/* Skeleton rows — suggest an interface without inventing a fake one */}
        <div className="my-5 space-y-2.5" aria-hidden>
          {[92, 74, 84, 60].map((w, n) => (
            <div key={n} className="flex items-center gap-2.5">
              <span className="size-4 shrink-0 rounded-[3px] border border-line bg-surface" />
              <span
                className="h-2 rounded-full bg-line-strong/60"
                style={{ width: `${w}%`, maxWidth: "22rem" }}
              />
            </div>
          ))}
        </div>

        <p className="label flex items-center gap-2">
          <Tick className="size-3.5!" />
          Screenshot coming soon
        </p>
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
