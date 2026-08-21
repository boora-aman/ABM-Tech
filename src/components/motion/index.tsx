import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   ENTRANCE HELPERS — server components, CSS only.

   These replace the previous Framer-Motion versions entirely. Nothing here
   ships client JavaScript, subscribes to scroll, or observes intersection.

   Why: the old versions attached a scroll/intersection observer per element
   and animated via React state. On a page with fifty of them that is fifty
   observers and a lot of main-thread work — a large part of why the site felt
   heavy. A CSS animation with `both` fill gets the same visual result, runs on
   the compositor, works from the server HTML with no hydration, and can never
   strand content at opacity 0 because an observer failed to fire.

   The trade-off is honest: these animate on load rather than on scroll. For a
   business site where the fold is what matters, that is the better trade.
   ========================================================================== */

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /* Accepted and ignored — kept so existing call sites stay valid. */
  y?: number;
  immediate?: boolean;
  blur?: boolean;
  once?: boolean;
}) {
  return (
    <Tag
      className={cn("rise", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Group wrapper. Children fade in together; see the note above on why there
 *  is no per-child scroll stagger any more. */
export function Stagger({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  step?: number;
}) {
  return <Tag className={cn("fade", className)}>{children}</Tag>;
}

export function StaggerItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
}) {
  return <Tag className={className}>{children}</Tag>;
}
