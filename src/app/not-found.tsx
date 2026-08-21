import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Card, Label } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { nav } from "@/lib/site.config";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="page-x flex min-h-[75vh] items-center py-32">
      <div className="bay grid w-full gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <Label className="mb-5">404 — page not found</Label>
          <h1 className="t-h1 mb-5">
            We couldn&apos;t find
            <br />
            <span className="brand-text">that page.</span>
          </h1>
          <p className="t-lead mb-8 max-w-lg">
            It may have moved, or the link may be out of date. Everything on the
            site is reachable from the list here.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/" variant="primary" size="lg">
              Back to home
              <Arrow />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Contact us
            </ButtonLink>
          </div>
        </div>

        <Card raised className="p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <Label tick={false}>Pages</Label>
            <Logo size={26} />
          </div>
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <Link
                  href={item.href}
                  className="group/btn flex items-center justify-between gap-3 py-3 text-[0.9375rem] transition-colors hover:text-brand-ink"
                >
                  {item.label}
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
