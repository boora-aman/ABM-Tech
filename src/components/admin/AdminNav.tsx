"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/* ==========================================================================
   ADMIN NAV

   Two presentations of one list, because the two viewports want different
   things:

   • Desktop — a sticky sidebar. There is room beside the content, and a
     persistent column is the fastest thing to hit repeatedly.

   • Mobile — a horizontally scrolling strip pinned under the header. The
     previous layout stacked all eleven links vertically ABOVE the content, so
     every visit to any page began by scrolling past the whole menu. A strip
     costs one row, stays reachable, and never pushes the content down.

   Active state is derived from the pathname rather than passed in, so the
   server layout stays a server component.
   ========================================================================== */

export type AdminNavItem = { href: string; label: string };

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  // `/admin` must not match every child route, so it is compared exactly.
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ------------------------------ Mobile --------------------------- */}
      <nav
        aria-label="Admin sections"
        className="sticky top-16 z-30 -mx-[clamp(1.125rem,5vw,4rem)] border-b border-line bg-page/95 backdrop-blur-md lg:hidden"
      >
        {/* The fades tell you the row scrolls; without them a cut-off pill
            reads as a broken layout rather than as more content. */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-page to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-page to-transparent"
          />
          <ul className="flex gap-1.5 overflow-x-auto px-[clamp(1.125rem,5vw,4rem)] py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((it) => {
              const active = isActive(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors",
                      active
                        ? "border-ink bg-ink text-page"
                        : "border-line text-ink-dim",
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ------------------------------ Desktop -------------------------- */}
      <nav
        aria-label="Admin sections"
        className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
      >
        <ul className="space-y-0.5">
          {items.map((it) => {
            const active = isActive(it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-sm px-3 py-2 text-[0.875rem] transition-colors",
                    active
                      ? "bg-tint font-medium text-brand-ink"
                      : "text-ink-dim hover:bg-tint hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-4 w-0.5 shrink-0 rounded-full transition-colors",
                      active ? "bg-brand" : "bg-transparent",
                    )}
                  />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
