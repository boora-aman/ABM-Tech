"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { ThemeToggle } from "./Theme";
import { nav, site } from "@/lib/site.config";
import type { MenuPanel } from "@/lib/content/megamenu";
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

export function Header({ panels = [] }: { panels?: MenuPanel[] }) {
  const pathname = usePathname();
  const [lifted, setLifted] = useState(false);
  /* Both menus store the route they were opened on. Comparing that against
     the live pathname closes them on navigation as DERIVED state — an effect
     watching `pathname` would setState during render and cascade. */
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [menuAt, setMenuAt] = useState<{ href: string; path: string } | null>(null);

  const open = openAt === pathname;
  const menu = menuAt?.path === pathname ? menuAt.href : null;

  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null);
  const setMenu = (href: string | null) =>
    setMenuAt(href ? { href, path: pathname } : null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const panelFor = (href: string) => panels.find((p) => p.key === href);

  /* Open immediately, close on a short delay. Without the delay the panel
     vanishes while the pointer crosses the gap between the trigger and the
     panel below it, which makes the menu feel broken rather than fast. */
  const openMenu = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(panelFor(href) ? href : null);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenAt(null);
      setMenuAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
          <nav
            aria-label="Primary"
            className="ml-auto hidden lg:block"
            onMouseLeave={scheduleClose}
          >
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const panel = panelFor(item.href);
                const isOpen = menu === item.href;
                return (
                  <li key={item.href} onMouseEnter={() => openMenu(item.href)}>
                    <Link
                      href={item.href}
                      aria-current={active(item.href) ? "page" : undefined}
                      aria-expanded={panel ? isOpen : undefined}
                      onFocus={() => openMenu(item.href)}
                      className={cn(
                        "relative flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-[0.875rem] font-medium",
                        "transition-colors duration-200",
                        active(item.href) || isOpen
                          ? "text-brand-ink"
                          : "text-ink-dim hover:text-ink",
                      )}
                    >
                      {item.label}
                      {panel && (
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 10 10"
                          fill="none"
                          aria-hidden
                          className={cn(
                            "mt-px transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isOpen && "rotate-180",
                          )}
                        >
                          <path
                            d="M2 3.5 5 6.5 8 3.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </Link>
                  </li>
                );
              })}
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
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-sm border border-line text-ink-dim transition-colors hover:border-line-strong hover:text-ink lg:hidden"
            >
              <MenuGlyph open={open} />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------- Mega panel -------------------------------
          One container that holds every panel and cross-fades between them,
          rather than a panel per nav item. Moving from Services to Industries
          therefore slides the shared surface instead of dismissing one box and
          building another — that continuity is what makes it feel considered
          rather than twitchy.

          Every panel stays mounted and is hidden with opacity, so switching
          costs a composite and never a re-layout. `inert` keeps the hidden
          ones out of the tab order. */}
      <div
        className={cn(
          "absolute inset-x-0 top-full hidden origin-top lg:block",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          menu
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div className="border-b border-line bg-page/95 shadow-md backdrop-blur-md">
          <div className="page-x">
            <div className="bay relative">
              {panels.map((panel) => {
                const isOpen = menu === panel.key;
                return (
                  <div
                    key={panel.key}
                    {...(!isOpen ? { inert: true } : {})}
                    aria-hidden={!isOpen}
                    className={cn(
                      "transition-opacity duration-200",
                      isOpen
                        ? "opacity-100"
                        : "pointer-events-none absolute inset-0 opacity-0",
                    )}
                  >
                    <div className="grid gap-x-8 gap-y-7 py-8 md:grid-cols-3 xl:grid-cols-4">
                      {panel.columns.map((col, i) => (
                        <div key={col.title || i}>
                          {col.title && (
                            <p className="label mb-3.5">{col.title}</p>
                          )}
                          <ul className="space-y-1">
                            {col.links.map((l) => (
                              <li key={l.href + l.label}>
                                <Link
                                  href={l.href}
                                  onClick={() => setMenu(null)}
                                  className="group/ml -mx-2 flex items-baseline gap-2 rounded-sm px-2 py-1.5 text-[0.875rem] text-ink-dim transition-colors duration-150 hover:bg-tint hover:text-brand-ink"
                                >
                                  <span
                                    aria-hidden
                                    className="mt-[0.45em] h-px w-0 shrink-0 bg-brand transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ml:w-3"
                                  />
                                  <span>{l.label}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {panel.footer && (
                      <div className="border-t border-line py-4">
                        <Link
                          href={panel.footer.href}
                          onClick={() => setMenu(null)}
                          className="group/btn inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand-ink"
                        >
                          {panel.footer.label}
                          <Arrow />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
