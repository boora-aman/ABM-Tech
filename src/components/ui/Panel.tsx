import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   PRIMITIVES
   Opaque cards with real borders. No backdrop-filter anywhere — it was the
   single biggest source of scroll jank in the previous build.
   ========================================================================== */

export function Card({
  as: Tag = "div",
  lift = false,
  raised = false,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  lift?: boolean;
  raised?: boolean;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag
      className={cn(raised ? "card-lift" : "card", lift && "lift", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Hairline divider. */
export function Rule({ className }: { className?: string }) {
  return <hr aria-hidden className={cn("h-px border-0 bg-line", className)} />;
}

/** Small uppercase section label with an optional leading brand tick. */
export function Label({
  children,
  className,
  tick = true,
}: {
  children: ReactNode;
  className?: string;
  tick?: boolean;
}) {
  return (
    <p className={cn("label flex items-center gap-2.5", className)}>
      {tick && (
        <span aria-hidden className="h-px w-6 shrink-0 bg-brand" />
      )}
      {children}
    </p>
  );
}

/** Neutral tag/chip. */
export function Chip({
  children,
  className,
  brand = false,
}: {
  children: ReactNode;
  className?: string;
  brand?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.6875rem] font-medium",
        brand
          ? "border-brand/30 bg-tint text-brand-ink"
          : "border-line text-ink-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small check mark used in deliverable lists. */
export function Tick({ className }: { className?: string }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden
      className={cn("mt-0.5 shrink-0 text-brand", className)}
    >
      <path
        d="M3 8.4l3 3 7-7"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
