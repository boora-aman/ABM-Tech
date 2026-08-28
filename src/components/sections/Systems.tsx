import Link from "next/link";
import { Card, Label, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { pillars } from "@/lib/content/pillars";
import { serviceBySlug } from "@/lib/content/services";

/* ==========================================================================
   SYSTEMS — the six pillars, expanded.

   This is the section the old site was missing entirely. A service grid
   answers "what can I buy"; it never answers the question a business owner
   actually arrives with — "which part of my business is broken, and do you
   fix that part?"

   Each pillar states the question in the owner's words, what exists once the
   layer is in place, and which services build it. That last link is what
   turns a browsing visitor into someone reading a scoped price.

   Server component. Hover states are CSS.
   ========================================================================== */

export function Systems() {
  return (
    <section id="systems" className="defer-paint band page-x py-20 sm:py-24">
      <div className="bay">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Label className="mb-4">The whole business</Label>
            <h2 className="t-h1 max-w-xl">
              Six systems. Every business
              <br />
              <span className="brand-text">has all six, working or not.</span>
            </h2>
          </div>
          <p className="t-lead lg:pb-1">
            Whether they are software, a register, or a person who remembers
            things. Find the one that is costing you the most and start there —
            you do not have to fix all six, and you certainly do not have to fix
            them at once.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map((p) => (
            <Card as="article" key={p.key} lift className="flex flex-col p-6 sm:p-7">
              <div className="mb-5 flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="font-display text-[1.75rem] font-semibold leading-none text-brand/25"
                >
                  {p.index}
                </span>
                <h3 className="t-h3">{p.name}</h3>
              </div>

              <p className="mb-4 font-display text-[0.9375rem] font-semibold leading-snug text-brand-ink">
                {p.question}
              </p>

              <p className="mb-5 text-[0.875rem] leading-relaxed text-ink-dim">
                {p.summary}
              </p>

              <ul className="mb-6 space-y-2">
                {p.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex gap-2.5 text-[0.8125rem] leading-snug text-ink-dim"
                  >
                    <Tick className="size-3.5!" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-line pt-5">
                <div className="label mb-2.5 normal-case tracking-normal!">
                  Built by
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                  {p.services.map((slug) => {
                    const s = serviceBySlug(slug);
                    if (!s) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/services/${slug}`}
                        className="ul-draw text-[0.8125rem] text-ink-dim hover:text-brand-ink"
                      >
                        {s.short}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card raised className="mt-6 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_auto] lg:items-center">
          <div>
            <h3 className="t-h3 mb-2">Not sure which one is your problem?</h3>
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-dim">
              That is the normal case, and it is what the first call is for.
              Twenty minutes describing how the business actually runs is usually
              enough for both of us to see which loop is leaking — and sometimes
              the answer is that none of them need software yet.
            </p>
          </div>
          <ButtonLink href="/contact" variant="primary" size="lg">
            Talk it through
            <Arrow />
          </ButtonLink>
        </Card>
      </div>
    </section>
  );
}
