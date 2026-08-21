"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   ACTIONS
   `flare` is the only filled control on the page, so which button is primary
   is never ambiguous. Everything else is a bordered glass sheet.
   ========================================================================== */

type Variant = "flare" | "glass" | "ghost";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem] gap-2",
  md: "h-11 px-5 text-[0.875rem] gap-2.5",
  lg: "h-[3.25rem] px-7 text-[0.9375rem] gap-3",
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn(
    "group/btn relative inline-flex select-none items-center justify-center overflow-hidden",
    "rounded-tight font-medium tracking-[-0.005em] whitespace-nowrap",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-300",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
    SIZES[size],
    variant === "flare" &&
      "flare-fill font-semibold shadow-[0_10px_30px_-10px_rgba(255,69,0,0.65)] hover:shadow-[0_14px_38px_-10px_rgba(255,69,0,0.85)]",
    variant === "glass" &&
      "border border-hair bg-slate/50 text-ink backdrop-blur-md hover:border-hair-warm hover:bg-slate/80",
    variant === "ghost" &&
      "border border-transparent text-ink-dim hover:border-hair hover:text-ink",
    className,
  );
}

/** Warm light sweeping across the control on hover — the brand's motion tell. */
function Sweep() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full group-hover/btn:opacity-100"
      style={{
        background:
          "linear-gradient(100deg, transparent, rgba(255,255,255,0.22), transparent)",
      }}
    />
  );
}

export function Button({
  children,
  variant = "glass",
  size = "md",
  className,
  type = "button",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      <Sweep />
      <span className="relative z-1 inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "glass",
  size = "md",
  className,
  external,
  ...rest
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const cls = classes(variant, size, className);
  const inner = (
    <>
      <Sweep />
      <span className="relative z-1 inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

/** Arrow that travels on parent hover. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1",
        className,
      )}
    >
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
