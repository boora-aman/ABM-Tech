"use client";

import { useId, useState, type ReactNode } from "react";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ==========================================================================
   EXPANDABLE

   A "show the rest" disclosure for long card grids.

   The hidden cards are rendered on the server and stay in the DOM — they are
   clipped to zero height, not removed. That matters: a crawler parses the
   HTML it is served, so collapsing must never cost us the content or the
   internal links inside it. Lazily mounting the remainder on click would have
   hidden seven service pages from every crawl.

   The animation uses the `grid-template-rows: 0fr → 1fr` technique rather
   than a max-height guess. Card heights vary by breakpoint and by content, so
   any fixed max-height is either too small (clipping the last row) or too
   large (making the transition visibly lag at the end). This animates to the
   content's natural height with no magic number.

   `inert` is applied while collapsed so the clipped links are not focusable —
   without it, tabbing appears to send focus nowhere.
   ========================================================================== */

export function Expandable({
  children,
  hidden,
  total,
  noun,
  className,
}: {
  children: ReactNode;
  /** How many items are inside the collapsed region. */
  hidden: number;
  /** Total in the section, named on the button so the click is informed. */
  total: number;
  /** Plural noun for the label, e.g. "services". */
  noun: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  if (hidden <= 0) return null;

  return (
    <div className={className}>
      <div id={id} data-open={open} className="reveal" aria-hidden={!open}>
        <div className="reveal-inner" {...(!open ? { inert: true } : {})}>
          {/* Top padding lives here so it collapses with the region rather
              than leaving a gap above the button when closed. */}
          <div className="pt-5">{children}</div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className={cn(
            "group/btn inline-flex items-center gap-2.5 rounded-sm border border-line-strong",
            "px-5 py-2.5 text-[0.875rem] font-medium",
            "transition-[background-color,border-color,color] duration-200",
            "hover:border-brand hover:text-brand-ink",
          )}
        >
          {open ? "Show fewer" : `Show all ${total} ${noun}`}
          <Arrow
            className={cn(
              "transition-transform duration-300 group-hover/btn:translate-x-0! ",
              open ? "-rotate-90" : "rotate-90",
            )}
          />
        </button>
      </div>
    </div>
  );
}
