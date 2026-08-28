import { Card, Label, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { site, whatsappLink } from "@/lib/site.config";
import { pick } from "@/lib/content/repo";

/** Closing call to action. Server component, no motion. */
export function Cta({ settings = {} }: { settings?: Record<string, unknown> }) {
  const eyebrow = pick(settings, "cta.eyebrow", "Next step");
  const title = pick(settings, "cta.heading", ["Tell us what's slowing"]);
  const titleAccent = pick(settings, "cta.headingAccent", "the business down.");
  const lead = pick(
    settings,
    "cta.lead",
    "One call, a written scope, a fixed price. If a tool you can simply buy would do the job better, we'll say so.",
  );
  const points = pick(settings, "cta.points", [
    "Free first consultation",
    "Fixed price, written scope",
    "Reply within one working day",
    "No obligation to proceed",
  ]);
  return (
    <section className="defer-paint page-x py-20 sm:py-24">
      <div className="bay">
        <Card raised className="grid gap-10 p-7 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <Label className="mb-4">{eyebrow}</Label>
            <h2 className="t-h1 mb-4 max-w-xl">
              {title.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
              <span className="brand-text">{titleAccent}</span>
            </h2>
            <p className="t-lead mb-7 max-w-lg">{lead}</p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {points.map((t) => (
                <li key={t} className="flex gap-2.5 text-[0.875rem] text-ink-dim">
                  <Tick />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <ButtonLink href="/contact" variant="primary" size="lg" className="w-full">
              Get a free quote
              <Arrow />
            </ButtonLink>
            <ButtonLink href={whatsappLink()} variant="whatsapp" size="lg" external className="w-full">
              <WhatsAppGlyph />
              WhatsApp us
            </ButtonLink>
            <ButtonLink
              href={`tel:${site.contact.phoneE164}`}
              variant="ghost"
              size="lg"
              external
              className="w-full"
            >
              {site.contact.phoneDisplay}
            </ButtonLink>
          </div>
        </Card>
      </div>
    </section>
  );
}
