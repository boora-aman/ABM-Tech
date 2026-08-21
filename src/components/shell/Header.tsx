"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Wordmark } from "@/components/brand/Logo";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Rule } from "@/components/ui/Panel";
import { nav, site, whatsappLink } from "@/lib/site.config";
import { cn } from "@/lib/utils";

/* ==========================================================================
   HEADER
   A structural bar, not a floating pill. It sits flush to the top edge, and
   the active route is marked by a warm underline that MORPHS between items via
   a shared layout animation — the whole bar reads as one rail with a lit
   segment rather than five separate links.

   Responsive rule: visibility is switched on WRAPPER elements, never by adding
   `hidden` to a component that already sets its own `display`. Two competing
   display utilities on one element resolve by stylesheet order, not by which
   you wrote last — which silently renders both variants at once.
   ========================================================================== */

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 12);
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
    <header className="fixed inset-x-0 top-0 z-50 no-print">
      <div
        className={cn(
          "transition-all duration-500",
          lifted
            ? "border-b border-hair bg-obsidian/85 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="page-x">
          <div className="bay flex h-16 items-center gap-4 sm:h-[4.5rem]">
            {/* Brand */}
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="flex min-w-0 shrink items-center transition-opacity hover:opacity-80"
            >
              <span className="hidden sm:block">
                <Wordmark size={30} animate />
              </span>
              <span className="sm:hidden">
                <Wordmark size={26} animate compact />
              </span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="ml-auto hidden lg:block">
              <ul className="flex items-center">
                {nav.map((item) => {
                  const on = active(item.href);
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        aria-current={on ? "page" : undefined}
                        className="group/nav flex items-baseline gap-2 px-4 py-3"
                      >
                        <span
                          className={cn(
                            "font-mono text-[0.5625rem] tracking-[0.12em] transition-colors",
                            on ? "text-flare" : "text-ink-faint",
                          )}
                        >
                          {item.index}
                        </span>
                        <span
                          className={cn(
                            "text-[0.875rem] transition-colors",
                            on ? "text-ink" : "text-ink-dim group-hover/nav:text-ink",
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                      {on && (
                        <motion.span
                          layoutId="nav-lit"
                          aria-hidden
                          className="absolute inset-x-2 -bottom-px h-px"
                          style={{
                            background:
                              "linear-gradient(90deg, var(--color-flare), var(--color-flare-hi))",
                          }}
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 34 }
                          }
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Actions */}
            <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-6">
              <a
                href={`tel:${site.contact.phoneE164}`}
                className="hidden meta-bright px-2 transition-colors hover:text-flare-hi xl:block"
              >
                {site.contact.phoneDisplay}
              </a>
              <span className="hidden sm:block">
                <ButtonLink href="/contact" variant="flare" size="sm">
                  Start a project
                  <Arrow />
                </ButtonLink>
              </span>
              <span className="sm:hidden">
                <ButtonLink
                  href="/contact"
                  variant="flare"
                  size="sm"
                  className="size-9 px-0"
                  aria-label="Start a project"
                >
                  <Arrow />
                </ButtonLink>
              </span>

              {/* Menu toggle */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-9 place-items-center rounded-tight border border-hair bg-slate/50 transition-colors hover:border-hair-warm lg:hidden"
              >
                <MenuGlyph open={open} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 top-16 z-40 bg-obsidian/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.nav
              aria-label="Site navigation"
              className="absolute inset-x-0 top-16 z-45 border-b border-hair bg-obsidian/95 backdrop-blur-xl sm:top-[4.5rem] lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="page-x py-4">
                <ul className="bay">
                  {nav.map((item, i) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active(item.href) ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-3 py-3.5"
                      >
                        <span
                          className={cn(
                            "font-mono text-[0.625rem] tracking-[0.12em]",
                            active(item.href) ? "text-flare" : "text-ink-faint",
                          )}
                        >
                          {item.index}
                        </span>
                        <span className="t-h3 font-display">{item.label}</span>
                      </Link>
                      {i < nav.length - 1 && <Rule />}
                    </li>
                  ))}
                </ul>
                <div className="bay mt-5 grid grid-cols-2 gap-2">
                  <ButtonLink
                    href={whatsappLink()}
                    variant="glass"
                    external
                    className="w-full"
                  >
                    WhatsApp
                  </ButtonLink>
                  <ButtonLink
                    href={`tel:${site.contact.phoneE164}`}
                    variant="glass"
                    external
                    className="w-full"
                  >
                    Call
                  </ButtonLink>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
      <motion.path
        d="M2.5 6h13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        animate={open ? { d: "M4 4l10 10" } : { d: "M2.5 6h13" }}
        transition={{ duration: 0.26 }}
      />
      <motion.path
        d="M2.5 12h13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        animate={open ? { d: "M14 4L4 14" } : { d: "M2.5 12h13" }}
        transition={{ duration: 0.26 }}
      />
    </svg>
  );
}
