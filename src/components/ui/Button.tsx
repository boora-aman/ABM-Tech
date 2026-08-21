"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Actions. `primary` is the only filled control, so which button matters is
   never ambiguous. Transitions are colour + transform only. */

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem] gap-2",
  md: "h-11 px-5 text-[0.875rem] gap-2",
  lg: "h-[3.125rem] px-6 text-[0.9375rem] gap-2.5",
};

function classes(v: Variant, s: Size, className?: string) {
  return cn(
    "group/btn inline-flex select-none items-center justify-center rounded-sm font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
    SIZES[s],
    v === "primary" &&
      "bg-brand text-white shadow-sm hover:bg-brand-deep",
    v === "outline" &&
      "border border-line-strong text-ink hover:border-brand hover:text-brand-ink",
    v === "ghost" && "text-ink-dim hover:text-ink",
    className,
  );
}

export function Button({
  children, variant = "outline", size = "md", className, type = "button", ...rest
}: {
  children: ReactNode; variant?: Variant; size?: Size; className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children, href, variant = "outline", size = "md", className, external, ...rest
}: {
  children: ReactNode; href: string; variant?: Variant; size?: Size;
  className?: string; external?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const cls = classes(variant, size, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden
      className={cn(
        "transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5",
        className,
      )}
    >
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
