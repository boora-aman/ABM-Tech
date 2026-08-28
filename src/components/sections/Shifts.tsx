import { Card, Label, Rule } from "@/components/ui/Panel";
import { shifts, stackMarks } from "@/lib/content/pillars";
import { site } from "@/lib/site.config";

/* ==========================================================================
   SHIFTS — what changes, as a before/after.

   Deliberately not percentages. "Cut costs 47%" is unverifiable and every
   agency claims it; a concrete before/after a reader recognises from their own
   Monday is more persuasive and stays true.

   Followed by the "where you are starting from" block, which answers the
   unasked question — am I too small, too messy or too far gone for this — and
   the stack ticker, which tells a technical buyer this is not assembled from
   page-builder plugins.
   ========================================================================== */

export function Shifts() {
  return (
    <section className="defer-paint page-x py-20 sm:py-24">
      <div className="bay">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Label className="mb-4">What actually changes</Label>
            <h2 className="t-h1 max-w-lg">
              No percentages.
              <br />
              <span className="brand-text">Just a different Monday.</span>
            </h2>
          </div>
          <p className="t-lead lg:pb-1">
            Every agency claims a number nobody can verify. These are the shifts
            our clients describe in their own words — and the sectors we have
            actually seen each one in.
          </p>
        </div>

        {/* Before / after ladder */}
        <div className="grid gap-4 sm:grid-cols-2">
          {shifts.map((s) => (
            <Card key={s.after} lift className="p-6">
              <p className="mb-4 flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-faint line-through decoration-ink-faint/40">
                <span
                  aria-hidden
                  className="mt-1.5 h-px w-4 shrink-0 bg-ink-faint/40"
                />
                {s.before}
              </p>
              <p className="mb-5 flex items-start gap-3 font-display text-[1.0625rem] font-semibold leading-snug">
                <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-brand" />
                {s.after}
              </p>
              <Rule className="mb-3" />
              <p className="text-[0.75rem] text-ink-faint">{s.where}</p>
            </Card>
          ))}
        </div>

        {/* Where you are starting from */}
        <div className="mt-16">
          <Label className="mb-8">Wherever you are starting from</Label>
          <div className="grid gap-5 lg:grid-cols-3">
            {site.fit.map((f, i) => (
              <Card key={f.title} lift className="p-6">
                <span
                  aria-hidden
                  className="mb-5 block font-display text-[1.75rem] font-semibold leading-none text-brand/25"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2.5 font-display text-[1.0625rem] font-semibold">
                  {f.title}
                </h3>
                <p className="text-[0.875rem] leading-relaxed text-ink-dim">
                  {f.body}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Engineering stack */}
        <div className="mt-16">
          <Rule className="mb-6" />
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <Label>What it is built with</Label>
            <p className="text-[0.8125rem] text-ink-faint">
              Standard, boring, hireable technology — so anyone can pick it up
              after us.
            </p>
          </div>
          <div
            className="ticker overflow-hidden"
            style={{ ["--ticker-duration" as string]: "70s" }}
          >
            <div className="ticker-track items-center gap-8 pr-8">
              {[...stackMarks, ...stackMarks].map((m, i) => (
                <span
                  key={`${m}-${i}`}
                  aria-hidden={i >= stackMarks.length}
                  className="whitespace-nowrap font-display text-[0.9375rem] font-medium text-ink-faint"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
