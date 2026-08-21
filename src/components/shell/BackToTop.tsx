"use client";

import { useEffect, useState } from "react";

/**
 * Back to top. One passive scroll listener flipping one boolean — no progress
 * ring, no motion value, no setState per frame. The previous version updated
 * a stroke-dashoffset on every scroll event, which is exactly the sort of
 * per-frame React work that made the page feel heavy.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group/top fixed right-4 bottom-5 z-40 grid size-11 place-items-center rounded-sm border border-line bg-surface text-ink-dim shadow-md transition-[opacity,transform] duration-300 hover:text-brand sm:right-6 no-print ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden
        className="transition-transform duration-250 group-hover/top:-translate-y-0.5"
      >
        <path
          d="M9 14.5V3.5M4 8.5 9 3.5l5 5"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
