import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   STRUCTURAL PRIMITIVES
   Glass sheets, rules, rails and labels. Everything the layout is assembled
   from — no rounded-pill cards, no drop shadows used as decoration.
   ========================================================================== */

/** The core glass sheet. `leak` adds the travelling warm edge light on hover. */
export function Panel({
  as: Tag = "div",
  leak = false,
  solid = false,
  marks = false,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  leak?: boolean;
  solid?: boolean;
  /** Corner registration marks — reserve for genuinely important panels. */
  marks?: boolean;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag
      className={cn(
        solid ? "panel-solid" : "panel",
        leak && "leak overflow-hidden",
        marks && "regmarks",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Flat recessed area: code blocks, inputs, data readouts. */
export function Well({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <div className={cn("inset-panel", className)}>{children}</div>;
}

/** Measurement rule — a hairline with a warm ignition point at its start. */
export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rule", className)} />;
}

/** Single teal data point. The only sanctioned use of the cold accent. */
export function Datum({ className }: { className?: string }) {
  return <span aria-hidden className={cn("datum", className)} />;
}

/**
 * Section label. An index numeral in a bracket, the label, and a rule that
 * runs to the edge — the structural signature of the layout.
 */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {index && (
        <span className="meta-bright flex items-center gap-1.5">
          <span className="text-flare">[</span>
          <span className="tabular-nums">{index}</span>
          <span className="text-flare">]</span>
        </span>
      )}
      <span className="meta-bright">{children}</span>
      <Rule className="flex-1" />
    </div>
  );
}

/** Small technical tag. */
export function Tag({
  children,
  className,
  hot = false,
}: {
  children: ReactNode;
  className?: string;
  hot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-tight border px-2 py-1 font-mono text-[0.625rem] tracking-[0.08em] uppercase",
        hot
          ? "border-hair-warm text-flare-hi"
          : "border-hair text-ink-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Status pill with a live dot. */
export function Status({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-tight border border-hair bg-obsidian-lift/60 px-2.5 py-1.5",
        className,
      )}
    >
      <span className="datum pulse-dot" aria-hidden />
      <span className="meta-bright">{children}</span>
    </span>
  );
}
