"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   THEME
   The whole system re-materialises from CSS custom properties, so the toggle
   only flips one attribute on <html>. No component re-renders needed.

   Light is the default for everyone; dark is opt-in and remembered.
   ========================================================================== */

/** Runs in <head> before paint so there is no flash of the wrong theme.
 *  Kept as a string because it must execute before React hydrates. */
export const themeScript =
  `(function(){try{var t=localStorage.getItem("abm-theme");if(t==="dark"){document.documentElement.dataset.theme="dark"}else{document.documentElement.dataset.theme="light"}}catch(e){document.documentElement.dataset.theme="light"}})();`;

/* The <html data-theme> attribute is owned by the inline head script, so it is
   external state. Reading it through useSyncExternalStore avoids a
   setState-in-effect and the cascading render that comes with it. */
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getSnapshot = () => document.documentElement.dataset.theme === "dark";
/** Server render always assumes light — the default. */
const getServerSnapshot = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function commit(next: boolean) {
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("abm-theme", next ? "dark" : "light");
    } catch {
      /* private mode — the attribute still applies for this session */
    }
    listeners.forEach((l) => l());
  }

  /**
   * Flip the theme as a circle expanding from the button.
   *
   * View Transitions give us the old paint as a snapshot underneath the new
   * one for free, so the effect is a single clip-path animation on the
   * incoming layer — no cloned DOM, no canvas, no per-element transition. On
   * a browser without the API, or for a visitor who has asked for reduced
   * motion, it falls through to the plain instant swap, which is the correct
   * behaviour rather than a degraded one.
   */
  function apply(next: boolean, origin?: { x: number; y: number }) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startViewTransition = (
      document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      }
    ).startViewTransition;

    if (!origin || reduce || typeof startViewTransition !== "function") {
      commit(next);
      return;
    }

    const { x, y } = origin;
    // Radius to the farthest corner, so the circle always covers the viewport.
    const end = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = startViewTransition.call(document, () => commit(next));
    void transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`],
        },
        {
          duration: 520,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        apply(!dark, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={cn(
        "grid size-9 place-items-center rounded-sm border border-line text-ink-dim",
        "transition-colors duration-200 hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {/* Both glyphs are rendered; only one is shown. Swapping opacity avoids
          a layout change and keeps the control from jumping. */}
      <span className="relative grid size-4 place-items-center">
        <svg
          width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden
          className={cn("absolute transition-opacity duration-200", dark ? "opacity-0" : "opacity-100")}
        >
          <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a} x1="9" y1="1.4" x2="9" y2="3"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
              transform={`rotate(${a} 9 9)`}
            />
          ))}
        </svg>
        <svg
          width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden
          className={cn("absolute transition-opacity duration-200", dark ? "opacity-100" : "opacity-0")}
        >
          <path
            d="M14.2 11.4A5.8 5.8 0 0 1 6.6 3.8a6.2 6.2 0 1 0 7.6 7.6Z"
            stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
