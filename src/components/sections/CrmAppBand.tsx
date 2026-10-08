import Link from "next/link";
import { Label } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { PhoneFrame } from "@/components/crm/PhoneFrame";
import { Reveal } from "@/components/motion";
import { apk, screens } from "@/lib/content/crm-app";

/* ==========================================================================
   CRM APP BAND — the product, shown where people browse the services.

   The app had a page and nothing pointing at it. This band puts it on the
   home page and the services page, where someone weighing a CRM will see that
   one comes with an Android app their reps will actually use.
   ========================================================================== */

const POINTS = [
  "Calls log themselves against the lead",
  "Call recordings attached to the call log",
  "Call, WhatsApp and email in one tap",
  "Site visits with GPS and a photo",
];

export function CrmAppBand() {
  return (
    <section className="page-x py-16 sm:py-20">
      <div className="bay">
        <div className="grid items-center gap-12 overflow-hidden rounded-sm border border-line bg-surface p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <Reveal>
            <Label className="mb-4">Our product · ABM CRM</Label>
            <h2 className="t-h2 mb-4">The CRM your sales team carries in their pocket.</h2>
            <p className="t-lead mb-7 max-w-xl">
              Every Custom CRM we build comes with the ABM CRM Android app — so calls, recordings
              and follow-ups land in the CRM without anyone typing them in.
            </p>
            <ul className="mb-8 grid gap-2.5 sm:grid-cols-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-dim">
                  <span aria-hidden className="mt-[0.55rem] h-px w-3 shrink-0 bg-brand" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/abm-crm" variant="primary" size="md">
                See the app
                <Arrow />
              </ButtonLink>
              <Link
                href="/abm-crm#install"
                className="text-[0.875rem] font-medium text-ink-dim underline-offset-4 hover:text-brand-ink hover:underline"
              >
                Download for Android · v{apk.version}
              </Link>
            </div>
          </Reveal>

          {/* Three real screens, fanned. The outer two sit lower so the row
              reads as one group rather than three separate pictures. */}
          <Reveal delay={0.08}>
            <div className="relative mx-auto flex max-w-[30rem] items-start justify-center gap-3 sm:gap-4">
              {(["createMenu", "callTracking", "newTask"] as const).map((k, i) => (
                <div
                  key={k}
                  className={i === 1 ? "w-[34%] shrink-0" : "w-[30%] shrink-0 translate-y-10 opacity-95"}
                >
                  <PhoneFrame
                    src={screens[k].src}
                    alt={screens[k].alt}
                    sizes="(min-width: 1024px) 170px, 30vw"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
