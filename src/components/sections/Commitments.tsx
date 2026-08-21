"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { SectionLabel } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion";
import { commitments } from "@/lib/content/faq";

/* ==========================================================================
   COMMITMENTS
   A vertical rail whose filament FILLS with scroll progress through the
   section, each station latching as the filament reaches it. Scroll drives one
   continuous value rather than six independent intersection triggers, so the
   section reads as a single mechanism being traversed.
   ========================================================================== */

export function Commitments() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 85, damping: 26 });
  const height = useTransform(fill, (v) => `${v * 100}%`);

  return (
    <section className="page-x py-20 sm:py-28">
      <div className="bay">
        <Reveal>
          <SectionLabel index="03" className="mb-9">
            How we work
          </SectionLabel>
        </Reveal>

        <div className="mb-14 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Reveal delay={0.04}>
            <h2 className="t-h1">
              Six commitments,
              <br />
              <span className="flare-text">every engagement.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lead">
              None of this is remarkable. It is what we would want if we were
              paying — and the reason taking over half-finished projects is a
              large share of the work.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative">
          {/* The rail */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[0.4375rem] w-px bg-white/8 sm:left-[0.5625rem]"
          >
            <motion.div
              className="w-full"
              style={{
                height: reduce ? "100%" : height,
                background:
                  "linear-gradient(to bottom, var(--color-flare), var(--color-flare-hi))",
              }}
            />
          </div>

          <ol className="space-y-0">
            {commitments.map((c, i) => (
              <Station
                key={c.index}
                item={c}
                index={i}
                total={commitments.length}
                progress={fill}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Station({
  item,
  index,
  total,
  progress,
}: {
  item: (typeof commitments)[number];
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const reduce = useReducedMotion();
  const threshold = (index + 0.4) / total;
  const lit = useTransform(progress, (v) => (v >= threshold ? 1 : 0));
  const bg = useTransform(lit, (v) => (v ? "var(--color-flare)" : "#1b1e26"));
  const glow = useTransform(lit, (v) =>
    v ? "0 0 12px rgba(255,69,0,0.65)" : "none",
  );

  return (
    <li className="relative border-b border-hair py-7 pl-9 last:border-0 sm:pl-12">
      <motion.span
        aria-hidden
        className="absolute top-[2.15rem] left-0 size-[0.9375rem] rounded-[3px] sm:size-[1.125rem]"
        style={{
          background: reduce ? "var(--color-flare)" : bg,
          boxShadow: reduce ? "0 0 12px rgba(255,69,0,0.65)" : glow,
        }}
      />
      <Reveal delay={0.03 * index}>
        <div className="grid gap-x-8 gap-y-2 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.5fr)] lg:items-baseline">
          <span className="font-mono text-[0.6875rem] tabular-nums text-flare/70">
            [{item.index}]
          </span>
          <h3 className="font-display text-[1.125rem] tracking-[-0.015em] sm:text-[1.25rem]">
            {item.title}
          </h3>
          <p className="text-[0.9375rem] leading-[1.7] text-ink-dim">
            {item.body}
          </p>
        </div>
      </Reveal>
    </li>
  );
}
