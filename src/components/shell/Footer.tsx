import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Rule, Datum, Tag } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Ticker } from "@/components/motion";
import { services } from "@/lib/content/services";
import { site, nav, whatsappLink, isPlaceholder } from "@/lib/site.config";
import { inrShort } from "@/lib/utils";

/* ==========================================================================
   FOOTER
   Doubles as the crawlable index: every service page is linked with its price,
   and the contact block matches the Organization JSON-LD exactly.
   ========================================================================== */

const CAPABILITIES = [
  "CRM", "ERP", "Billing platforms", "Admin panels", "Mobile apps",
  "AI automation", "Document extraction", "WhatsApp API", "Business websites",
  "Google Business Profile", "Technical SEO", "Digitisation",
];

export function Footer() {
  const year = new Date().getFullYear();
  const socials = site.socials.filter((s) => s.url && !isPlaceholder(s.url));

  return (
    <footer className="relative mt-28 no-print">
      <Rule />

      {/* Capability ticker — slow CSS drift, pauses on hover */}
      <Ticker seconds={260} className="border-b border-hair py-6">
        {CAPABILITIES.map((c, i) => (
          <span key={`${c}-${i}`} className="flex shrink-0 items-center gap-6 pr-6">
            <span className="font-display text-lg tracking-[-0.01em] whitespace-nowrap text-ink-dim sm:text-2xl">
              {c}
            </span>
            <Datum />
          </span>
        ))}
      </Ticker>

      {/* ------------------------------ CTA ------------------------------- */}
      <div className="page-x blueprint border-b border-hair py-16">
        <div className="bay grid gap-8 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div>
            <h2 className="t-h1 mb-4 max-w-2xl">
              Tell us what the manual work is.
              <br />
              <span className="flare-text">We&apos;ll quote the system.</span>
            </h2>
            <p className="t-lead max-w-xl">
              One call, a written scope, a fixed price. If an off-the-shelf tool
              fits better than a build, we&apos;ll say so.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact" variant="flare" size="lg">
              Start a project
              <Arrow />
            </ButtonLink>
            <ButtonLink href={whatsappLink()} variant="glass" size="lg" external>
              WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* --------------------------- Link matrix -------------------------- */}
      <div className="page-x py-14">
        <div className="bay grid gap-12 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <Logo size={34} />
              <span className="flex flex-col leading-none">
                <span className="font-display text-base font-semibold tracking-[0.02em]">
                  ABM Tech
                </span>
                <span className="meta mt-1.5">{site.tagline}</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-[0.875rem] leading-relaxed text-ink-dim">
              {site.description}
            </p>
            <address className="space-y-2 text-[0.8125rem] not-italic text-ink-dim">
              <a
                href={`tel:${site.contact.phoneE164}`}
                className="block transition-colors hover:text-flare-hi"
              >
                {site.contact.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="block transition-colors hover:text-flare-hi"
              >
                {site.contact.email}
              </a>
              {!isPlaceholder(site.address.locality) && (
                <div>
                  {site.address.locality}, {site.address.region},{" "}
                  {site.address.countryName}
                </div>
              )}
            </address>

            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="rounded-tight border border-hair px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.08em] uppercase text-ink-faint transition-colors hover:border-hair-warm hover:text-flare-hi"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services with prices — the most useful thing a footer can carry */}
          <nav aria-label="Services">
            <h3 className="meta mb-5">Services</h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-baseline justify-between gap-3 text-[0.875rem] text-ink-dim transition-colors hover:text-ink"
                  >
                    <span className="truncate">{s.short}</span>
                    <span className="shrink-0 font-mono text-[0.6875rem] text-ink-faint transition-colors group-hover:text-flare-hi">
                      {s.from > 0 ? `${inrShort(s.from)}+` : "Quote"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio">
            <h3 className="meta mb-5">Studio</h3>
            <ul className="space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-[0.875rem] text-ink-dim transition-colors hover:text-ink"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="meta mb-5">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/llms.txt", label: "llms.txt" },
                { href: "/sitemap.xml", label: "Sitemap" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.875rem] text-ink-dim transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {site.serviceAreas.map((a) => (
                <Tag key={a}>{a}</Tag>
            ))}
            </div>
          </nav>
        </div>
      </div>

      <Rule />
      <div className="page-x py-6">
        <div className="bay flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="meta">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="meta flex items-center gap-2">
            <Datum />
            Fixed scope · fixed price · you own the code
          </p>
        </div>
      </div>
    </footer>
  );
}
