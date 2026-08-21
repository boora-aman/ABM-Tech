"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Label, Chip } from "@/components/ui/Panel";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Slide } from "@/lib/content/showcase";

/* ==========================================================================
   SHOWCASE CAROUSEL

   Built on native CSS scroll-snap rather than a JS transform loop. That is a
   performance decision: the browser scrolls the track itself, on the
   compositor, with real momentum and real trackpad/touch feel. A JS carousel
   animating `translateX` every frame is exactly the kind of thing that made
   the previous build feel heavy.

   JS here does only three things, none of them per-frame:
     • scrollIntoView on arrow/dot click
     • read which card is centred (throttled to one rAF per scroll burst)
     • keyboard arrows

   Accessibility: it is a labelled region with a live index readout, the track
   is keyboard-scrollable, and every control has a real accessible name.
   ========================================================================== */

export function Showcase({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const frame = useRef(0);

  /** Which card is nearest the centre of the viewport. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const c = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex(best);
  }, []);

  // One passive listener, coalesced to a single rAF — never a setState per
  // scroll event.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        measure();
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const el = track.children[i] as HTMLElement | undefined;
    if (!el) return;
    track.scrollTo({
      left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  const step = (dir: 1 | -1) =>
    goTo(Math.min(slides.length - 1, Math.max(0, index + dir)));

  return (
    <section id="showcase" className="defer-paint py-20 sm:py-24">
      <div className="page-x">
        <div className="bay mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label className="mb-4">What we&apos;ve built</Label>
            <h2 className="t-h1 max-w-xl">
              Products already running for
              <br />
              <span className="brand-text">real businesses.</span>
            </h2>
          </div>

          {/* Transport controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={index === 0}
              aria-label="Previous product"
              className="grid size-10 place-items-center rounded-sm border border-line text-ink-dim transition-colors hover:border-line-strong hover:text-ink disabled:opacity-35 disabled:hover:border-line"
            >
              <Chevron dir="left" />
            </button>
            <span
              className="label tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={index === slides.length - 1}
              aria-label="Next product"
              className="grid size-10 place-items-center rounded-sm border border-line text-ink-dim transition-colors hover:border-line-strong hover:text-ink disabled:opacity-35 disabled:hover:border-line"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>

      {/* The track. Bleeds to the viewport edge so partial cards signal
          scrollability without a hint needing to say so. */}
      <div
        ref={trackRef}
        role="region"
        aria-label="Product showcase — scroll or use arrow keys"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        }}
        className="snap-row px-[max(1.125rem,calc((100vw-78rem)/2+1.125rem))] pb-4 sm:px-[max(4rem,calc((100vw-78rem)/2))]"
      >
        {slides.map((s, i) => (
          <article
            key={s.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
            className={cn(
              "snap-item card-lift lift w-[min(88vw,42rem)] overflow-hidden",
              i !== index && "opacity-70 transition-opacity duration-500",
              i === index && "opacity-100 transition-opacity duration-500",
            )}
          >
            {/* Frame */}
            <div className="relative aspect-[16/10] border-b border-line bg-page">
              {s.image ? (
                <Image
                  src={s.image}
                  alt={`${s.title} — ${s.kicker}`}
                  fill
                  sizes="(max-width: 640px) 88vw, 42rem"
                  className="object-cover"
                  priority={i === 0}
                />
              ) : (
                <Placeholder title={s.title} />
              )}
            </div>

            {/* Body */}
            <div className="p-6 sm:p-7">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {s.tags.slice(0, 4).map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
              <h3 className="t-h3 mb-1.5">{s.title}</h3>
              <p className="label mb-4 normal-case tracking-normal! text-ink-faint!">
                {s.kicker}
              </p>
              <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-dim">
                {s.summary}
              </p>
              <Link
                href={`/services/${s.serviceSlug}`}
                className="group/btn inline-flex items-center gap-2 text-[0.875rem] font-medium brand-text"
              >
                How we build this
                <Arrow />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Dots */}
      <div className="page-x mt-4">
        <div className="bay flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${s.title}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-7 bg-brand" : "w-1.5 bg-line-strong hover:bg-ink-faint",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Placeholder frame for slides without a screenshot yet. Deliberately looks
 * like an intentional empty state — a labelled window chrome — rather than a
 * broken image, so the section is presentable before the assets arrive.
 */
function Placeholder({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="label ml-1 truncate">{title}</span>
      </div>
      <div className="grid flex-1 place-items-center p-6">
        <div className="text-center">
          <svg
            width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden
            className="mx-auto mb-3 text-ink-faint"
          >
            <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 14.5l4.5-4 3.5 3 3.5-4L21 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="8.5" r="1.2" fill="currentColor" />
          </svg>
          <p className="label">Screenshot coming</p>
        </div>
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
