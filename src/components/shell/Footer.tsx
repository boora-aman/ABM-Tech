import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Rule } from "@/components/ui/Panel";
import { services } from "@/lib/content/services";
import { site, nav, isPlaceholder } from "@/lib/site.config";
import { inrShort } from "@/lib/utils";

/** Footer. Doubles as the crawlable index — every service linked with its
 *  price, and the contact block matches the Organization JSON-LD exactly. */
export function Footer() {
  const year = new Date().getFullYear();
  const socials = site.socials.filter((s) => s.url && !isPlaceholder(s.url));

  return (
    <footer className="defer-paint mt-8 border-t border-line no-print">
      <div className="page-x py-14">
        <div className="bay grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <Logo size={30} />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[1.0625rem] font-semibold tracking-[0.01em]">
                  ABM Tech
                </span>
                <span className="label mt-1.5 text-[0.625rem]!">{site.tagline}</span>
              </span>
            </Link>
            <p className="mb-5 max-w-xs text-[0.875rem] leading-relaxed text-ink-dim">
              {site.description}
            </p>
            <address className="space-y-1.5 text-[0.875rem] not-italic text-ink-dim">
              <a href={`tel:${site.contact.phoneE164}`} className="block hover:text-brand-ink">
                {site.contact.phoneDisplay}
              </a>
              <a href={`mailto:${site.contact.email}`} className="block hover:text-brand-ink">
                {site.contact.email}
              </a>
              {!isPlaceholder(site.address.locality) && (
                <span className="block">
                  {site.address.locality}, {site.address.region}, {site.address.countryName}
                </span>
              )}
            </address>
            {socials.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="rounded-sm border border-line px-2.5 py-1 text-[0.6875rem] font-medium text-ink-faint transition-colors hover:border-brand hover:text-brand-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Services">
            <h3 className="label mb-4">Services</h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-baseline justify-between gap-3 text-[0.875rem] text-ink-dim transition-colors hover:text-ink"
                  >
                    <span className="truncate">{s.short}</span>
                    <span className="shrink-0 text-[0.75rem] tabular-nums text-ink-faint transition-colors group-hover:text-brand-ink">
                      {s.from > 0 ? `${inrShort(s.from)}+` : "Quote"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="label mb-4">Company</h3>
            <ul className="space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-[0.875rem] text-ink-dim hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="More">
            <h3 className="label mb-4">More</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/sitemap.xml", label: "Sitemap" },
                { href: "/llms.txt", label: "llms.txt" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.875rem] text-ink-dim hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <Rule />
      <div className="page-x py-5">
        <div className="bay flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p className="label normal-case tracking-normal!">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="label normal-case tracking-normal!">
            Fixed price · No lock-in · You own the code
          </p>
        </div>
      </div>
    </footer>
  );
}
