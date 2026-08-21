"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/* ==========================================================================
   SCROLL SPINE
   The right-hand structural axis of the layout: a fixed vertical rail carrying
   a progress filament, the current section name, and a percentage readout.

   This is the third column of the multi-axis grid made permanent — it tracks
   the reader's focus down the page instead of a scrollbar doing it invisibly.
   Desktop only; on a phone it would steal 40px of a 390px viewport.
   ========================================================================== */

export function ScrollSpine({ sections }: { sections: string[] }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 240, damping: 34 });
  const [pct, setPct] = useState(0);

  useEffect(
    () => progress.on("change", (v) => setPct(Math.round(v * 100))),
    [progress],
  );

  const activeIndex = Math.min(
    sections.length - 1,
    Math.floor((pct / 100) * sections.length),
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-1/2 right-0 z-30 hidden h-[60vh] w-16 -translate-y-1/2 xl:block no-print"
    >
      <div className="relative flex h-full items-stretch justify-center">
        {/* The rail */}
        <div className="relative w-px bg-white/8">
          {/* Progress filament */}
          <motion.div
            className="absolute inset-x-0 top-0 origin-top"
            style={{
              scaleY: reduce ? 1 : progress,
              height: "100%",
              background:
                "linear-gradient(to bottom, var(--color-flare), var(--color-flare-hi))",
            }}
          />
        </div>

        {/* Section ticks */}
        <div className="absolute inset-y-0 right-3 flex flex-col justify-between">
          {sections.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className="font-mono text-[0.5rem] tracking-[0.14em] uppercase transition-colors duration-300"
                style={{
                  color:
                    i === activeIndex
                      ? "var(--color-flare-hi)"
                      : "var(--color-ink-faint)",
                  writingMode: "vertical-rl",
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Percentage readout */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <span className="font-mono text-[0.5625rem] tracking-[0.1em] tabular-nums text-ink-faint">
            {String(pct).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
