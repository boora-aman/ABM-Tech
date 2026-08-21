"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Datum } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/* ==========================================================================
   PIPELINE VIEWPORT
   The glass module that overlaps the hero headline. It is a real, working
   miniature of a CRM pipeline — cards move between stages on a timer, the
   stage counts update, and the bar chart reflects the same data.

   Why build it rather than drop in a screenshot: the claim on this page is
   "we build systems like this". A static mockup asks to be believed; a working
   one does not. It is also the only honest way to show a product when every
   real client deployment is under NDA.
   ========================================================================== */

type Card = { id: string; label: string; value: string; stage: number };

const STAGES = ["New", "Qualified", "Quoted", "Won"];

const SEED: Card[] = [
  { id: "a", label: "Retail chain", value: "₹1.2L", stage: 0 },
  { id: "b", label: "Clinic group", value: "₹48k", stage: 1 },
  { id: "c", label: "Distributor", value: "₹85k", stage: 1 },
  { id: "d", label: "Logistics co.", value: "₹2.1L", stage: 2 },
  { id: "e", label: "Pharmacy", value: "₹15k", stage: 3 },
];

export function Viewport({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [cards, setCards] = useState<Card[]>(SEED);

  // Advance one card per interval, wrapping at the end. Deterministic order,
  // so it reads as a process rather than as noise.
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      setCards((prev) => {
        const next = [...prev];
        const target = i % next.length;
        next[target] = {
          ...next[target],
          stage: (next[target].stage + 1) % STAGES.length,
        };
        i++;
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, [reduce]);

  const counts = STAGES.map(
    (_, si) => cards.filter((c) => c.stage === si).length,
  );
  const won = cards.filter((c) => c.stage === STAGES.length - 1).length;

  return (
    <div
      className={cn("panel regmarks overflow-hidden", className)}
      role="img"
      aria-label={`Illustrative CRM pipeline: ${STAGES.map(
        (s, i) => `${s} ${counts[i]}`,
      ).join(", ")}.`}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2.5 border-b border-hair px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-flare/70" />
          <span className="size-2 rounded-full bg-white/12" />
          <span className="size-2 rounded-full bg-white/12" />
        </span>
        <span className="meta ml-1">pipeline · live</span>
        <span className="ml-auto flex items-center gap-2">
          <Datum className="pulse-dot" />
          <span className="meta tabular-nums">{won} won</span>
        </span>
      </div>

      {/* Board */}
      <div className="grid grid-cols-4 gap-px bg-white/5">
        {STAGES.map((stage, si) => (
          <div key={stage} className="min-h-[9.5rem] bg-obsidian/50 p-2.5">
            <div className="mb-2.5 flex items-baseline justify-between gap-1">
              <span className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-ink-faint">
                {stage}
              </span>
              <span className="font-mono text-[0.5625rem] tabular-nums text-flare">
                {counts[si]}
              </span>
            </div>
            <div className="space-y-1.5">
              {cards
                .filter((c) => c.stage === si)
                .map((c) => (
                  <motion.div
                    key={c.id}
                    layout={!reduce}
                    layoutId={reduce ? undefined : `card-${c.id}`}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    className="rounded-tight border border-white/6 bg-slate/80 p-2"
                  >
                    <div className="truncate text-[0.6875rem] text-ink">
                      {c.label}
                    </div>
                    <div className="mt-1 font-mono text-[0.5625rem] tabular-nums text-flare-hi">
                      {c.value}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer chart — same data, second representation */}
      <div className="flex items-end gap-1.5 border-t border-hair px-4 py-3">
        {counts.map((n, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-[2px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                height: `${8 + n * 12}px`,
                background:
                  i === counts.length - 1
                    ? "linear-gradient(to top, var(--color-flare), var(--color-flare-hi))"
                    : "rgba(255,255,255,0.12)",
              }}
            />
            <span className="font-mono text-[0.5rem] text-ink-faint">
              {STAGES[i].slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
