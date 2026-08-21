"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionLabel } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";
import type { Faq as FaqItem } from "@/lib/content/faq";

/* ==========================================================================
   FAQ
   Real buttons with aria-expanded and an animated panel height. Collapsed
   answers stay in the DOM as visually-hidden text: crawlers and AI retrievers
   need to read them, which is the entire reason for writing them carefully.
   ========================================================================== */

export function Faq({
  items,
  index,
  label = "Questions",
  title = "Before you enquire",
  lead,
}: {
  items: FaqItem[];
  index?: string;
  label?: string;
  title?: string;
  lead?: string;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section id="faq" className="page-x py-20 sm:py-28">
      <div className="bay">
        <Reveal>
          <SectionLabel index={index} className="mb-9">
            {label}
          </SectionLabel>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal delay={0.04}>
              <h2 className="t-h2 mb-4">{title}</h2>
            </Reveal>
            {lead && (
              <Reveal delay={0.1}>
                <p className="t-lead">{lead}</p>
              </Reveal>
            )}
          </div>

          <ul className="border-t border-hair">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal as="li" key={item.q} delay={0.025 * i}>
                  <div className="border-b border-hair">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-p-${i}`}
                        id={`faq-b-${i}`}
                        className="group/q flex w-full items-start gap-4 py-5 text-left"
                      >
                        <span className="mt-1 font-mono text-[0.625rem] tabular-nums text-flare/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "flex-1 font-display text-[1.0625rem] leading-snug tracking-[-0.01em] transition-colors sm:text-[1.125rem]",
                            isOpen ? "text-flare-hi" : "group-hover/q:text-ink",
                          )}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            "relative mt-1 grid size-5 shrink-0 place-items-center transition-transform duration-400",
                            isOpen && "rotate-45",
                          )}
                        >
                          <span
                            className="absolute h-px w-3.5"
                            style={{
                              background: isOpen
                                ? "var(--color-flare-hi)"
                                : "var(--color-ink-faint)",
                            }}
                          />
                          <span
                            className="absolute h-3.5 w-px"
                            style={{
                              background: isOpen
                                ? "var(--color-flare-hi)"
                                : "var(--color-ink-faint)",
                            }}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {(isOpen || reduce) && (
                        <motion.div
                          id={`faq-p-${i}`}
                          role="region"
                          aria-labelledby={`faq-b-${i}`}
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 pl-[2.1rem] text-[0.9375rem] leading-[1.72] text-ink-dim">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Kept readable by crawlers while collapsed */}
                    {!isOpen && !reduce && <span className="sr-only">{item.a}</span>}
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
