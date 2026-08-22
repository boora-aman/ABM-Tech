"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Actions. `primary` is the only filled control, so which button matters is
   never ambiguous. Transitions are colour + transform only. */

type Variant = "primary" | "outline" | "ghost" | "whatsapp";
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
    // WhatsApp keeps WhatsApp's own colour in every state. Previously these
    // were `outline` buttons, so hovering turned them brand-orange — which
    // reads as the wrong app.
    v === "whatsapp" &&
      "bg-[#25D366] text-[#052e18] font-semibold shadow-sm hover:bg-[#1eb958]",
    className,
  );
}

/** WhatsApp mark. Pairs with variant="whatsapp". */
export function WhatsAppGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.79 14.14c-.25.7-1.45 1.34-2 1.38-.55.04-1.06.24-3.58-.75-3.04-1.2-4.94-4.35-5.09-4.55-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.05.92 2.2.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.37 2.45 1.52.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.4-.25.68-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.13.08.75-.17 1.45Z" />
    </svg>
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
