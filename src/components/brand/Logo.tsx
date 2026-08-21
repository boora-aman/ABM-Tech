/**
 * ABM TECH — brand mark.
 *
 * Concept: "The Stack Ascending".
 * Three sheared vertical bars rising left to right, reading simultaneously as
 * a layered system stack, a growth curve, and the diagonal of an "A". A single
 * electric-teal datum sits at the apex — the one cold pixel in the identity.
 *
 * NO <defs>, NO gradient ids. SVG ids are document-global and this mark renders
 * several times per page (header at two breakpoints, footer, OG). A shared
 * gradient id collides, and every reference resolves to whichever instance
 * appears first — which may be inside a `display:none` responsive wrapper,
 * leaving an unfilled mark. The volcanic gradient is reproduced instead by
 * stepping three flat fills across the bars, which is crisper at favicon size.
 */

const HOT = "#ff4500";
const MID = "#ff6a00";
const WARM = "#ff8c00";
const TEAL = "#00f5d4";

type Props = {
  size?: number;
  className?: string;
  /** Adds the apex datum pulse. */
  animate?: boolean;
  title?: string;
};

export function Logo({
  size = 32,
  className,
  animate = false,
  title = "ABM Tech",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
    >
      <title>{title}</title>

      {/* Three sheared bars, ascending. The shear angle is constant so they
          read as one structure rather than three objects. */}
      <path d="M4 31.5 L9.2 31.5 L13.4 20.5 L8.2 20.5 Z" fill={HOT} />
      <path d="M13 31.5 L18.2 31.5 L24.4 14.5 L19.2 14.5 Z" fill={MID} />
      <path d="M22 31.5 L27.2 31.5 L35.4 8.5 L30.2 8.5 Z" fill={WARM} />

      {/* Base rule — the ground the stack stands on */}
      <rect x="4" y="33.6" width="31.4" height="1.6" rx="0.4" fill={HOT} opacity="0.45" />

      {/* The apex datum. The only teal in the identity. */}
      <rect x="34.4" y="4.6" width="3" height="3" rx="0.8" fill={TEAL}>
        {animate && (
          <animate
            attributeName="opacity"
            values="1;0.25;1"
            dur="2.4s"
            repeatCount="indefinite"
          />
        )}
      </rect>
    </svg>
  );
}

/** Mark + wordmark. `compact` drops the descriptor line for narrow viewports. */
export function Wordmark({
  size = 30,
  className,
  compact = false,
  animate = false,
}: {
  size?: number;
  className?: string;
  compact?: boolean;
  animate?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Logo size={size} animate={animate} className="shrink-0" />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-[0.02em] whitespace-nowrap ${
            compact ? "text-[0.9375rem]" : "text-[1.0625rem]"
          }`}
        >
          ABM<span className="text-ink-faint"> </span>Tech
        </span>
        {!compact && (
          <span className="meta mt-1.5 text-[0.5625rem]! tracking-[0.26em]! whitespace-nowrap">
            Systems · Software · Scale
          </span>
        )}
      </span>
    </span>
  );
}
