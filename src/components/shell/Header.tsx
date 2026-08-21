"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { ThemeToggle } from "./Theme";
import { nav, site } from "@/lib/site.config";
import { cn } from "@/lib/utils";

/* ==========================================================================
   HEADER
   The ONE element allowed a backdrop blur — a single fixed layer is cheap,
   whereas the previous build put one on every card.

   Scroll handling is a single passive listener flipping one boolean, not a
   motion value recalculating per frame.

   Responsive visibility is switched on WRAPPER elements, never by adding
   `hidden` to a component that sets its own display: two competing display
   utilities on one element resolve by stylesheet order, which silently renders
   both variants at once.
   ========================================================================== */

export function Header() {
  const pathname = usePathname();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 no-print transition-shadow duration-300",
        lifted
          ? "border-b border-line bg-page/85 shadow-sm backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="page-x">
        <div className="bay flex h-16 items-center gap-4 sm:h-[4.25rem]">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="flex min-w-0 shrink items-center transition-opacity hover:opacity-75"
          >
            <span className="hidden sm:block">
              <Wordmark size={28} />
            </span>
            <span className="sm:hidden">
              <Wordmark size={26} compact />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-sm px-3.5 py-2 text-[0.875rem] font-medium transition-colors",
                      active(item.href)
                        ? "text-brand-ink"
                        : "text-ink-dim hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-4">
            <a
              href={`tel:${site.contact.phoneE164}`}
              className="hidden text-[0.8125rem] font-medium text-ink-dim transition-colors hover:text-brand-ink xl:block"
            >
              {site.contact.phoneDisplay}
            </a>
            <ThemeToggle />
            <span className="hidden sm:block">
              <ButtonLink href="/contact" variant="primary" size="sm">
                Get a quote
                <Arrow />
              </ButtonLink>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-sm border border-line text-ink-dim transition-colors hover:border-line-strong hover:text-ink lg:hidden"
            >
              <MenuGlyph open={open} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet. Opacity + transform only, and it stays mounted so there
          is no AnimatePresence and no layout thrash on open/close. */}
      <div
        className={cn(
          "absolute inset-x-0 top-full origin-top border-b border-line bg-page shadow-md transition-[opacity,transform] duration-250 lg:hidden",
          open
            ? "pointer-events-auto scale-y-100 opacity-100"
            : "pointer-events-none scale-y-95 opacity-0",
        )}
      >
        <nav aria-label="Site" className="page-x py-3">
          <ul className="bay">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active(item.href) ? "page" : undefined}
                  className={cn(
                    "block py-3.5 text-[0.9375rem] font-medium transition-colors",
                    active(item.href) ? "text-brand-ink" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="bay mt-4 grid grid-cols-2 gap-2 pb-2">
            <ButtonLink
              href={`tel:${site.contact.phoneE164}`}
              variant="outline"
              external
              className="w-full"
            >
              Call us
            </ButtonLink>
            <ButtonLink href="/contact" variant="primary" className="w-full">
              Get a quote
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2.5 6h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        className={cn("origin-center transition-transform duration-250", open && "translate-y-[3px] rotate-45")}
      />
      <path
        d="M2.5 12h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        className={cn("origin-center transition-transform duration-250", open && "-translate-y-[3px] -rotate-45")}
      />
    </svg>
  );
}
