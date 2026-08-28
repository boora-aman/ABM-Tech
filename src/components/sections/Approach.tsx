import { Card, Label } from "@/components/ui/Panel";
import type { commitments as Commitments } from "@/lib/content/faq";

/* ==========================================================================
   APPROACH
   Six commitments as a plain numbered grid. The previous version tied each
   station to a scroll-driven motion value, which meant six `useTransform`
   subscriptions recalculating on every scroll frame. This is the same content
   with none of that cost.
   ========================================================================== */

export function Approach({ commitments }: { commitments: typeof Commitments }) {
  return (
    <section id="approach" className="defer-paint page-x py-20 sm:py-24">
      <div className="bay">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Label className="mb-4">How we work</Label>
            <h2 className="t-h1 max-w-lg">
              Six things we commit to
              <br />
              <span className="brand-text">on every project.</span>
            </h2>
          </div>
          <p className="t-lead lg:pb-1">
            None of it is remarkable — it is simply what we would want if we were
            the ones paying.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {commitments.map((c) => (
            <Card key={c.index} lift className="p-6">
              <span
                aria-hidden
                className="mb-5 block font-display text-[1.75rem] font-semibold leading-none text-brand/25"
              >
                {c.index}
              </span>
              <h3 className="mb-2.5 font-display text-[1.0625rem] font-semibold">
                {c.title}
              </h3>
              <p className="text-[0.875rem] leading-relaxed text-ink-dim">
                {c.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
