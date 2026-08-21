import { Label } from "@/components/ui/Panel";
import type { Faq as FaqItem } from "@/lib/content/faq";

/* ==========================================================================
   FAQ
   Native <details>/<summary>. No JS, no state, no AnimatePresence — the
   browser handles disclosure natively with correct keyboard and screen-reader
   behaviour, and the answers are always in the DOM for crawlers and AI
   retrievers, which is the whole reason for writing them carefully.
   ========================================================================== */

export function Faq({
  items,
  label = "Common questions",
  title = "Questions, answered",
  lead,
}: {
  items: FaqItem[];
  label?: string;
  title?: string;
  lead?: string;
}) {
  if (!items.length) return null;

  return (
    <section id="faq" className="defer-paint page-x py-20 sm:py-24">
      <div className="bay grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Label className="mb-4">{label}</Label>
          <h2 className="t-h2 mb-4">{title}</h2>
          {lead && <p className="t-lead">{lead}</p>}
        </div>

        <div className="border-t border-line">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="flex-1 font-display text-[1.0625rem] font-semibold leading-snug transition-colors group-open:text-brand-ink">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="relative mt-1.5 grid size-4 shrink-0 place-items-center text-ink-faint transition-transform duration-300 group-open:rotate-45 group-open:text-brand"
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span className="absolute h-3.5 w-px bg-current" />
                </span>
              </summary>
              <p className="pb-6 pr-10 text-[0.9375rem] leading-[1.72] text-ink-dim">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
