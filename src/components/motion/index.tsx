"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   MOTION PRIMITIVES
   Every one degrades to a complete, legible static state. Rules learned the
   hard way and encoded here:

   • Above-the-fold content animates on MOUNT (`immediate`), never on
     scroll-into-view — a viewport trigger there earns nothing and can strand
     content at opacity 0 if the observer misses.
   • Pointer-following effects are gated on `useFinePointer()`. On touch they
     fire on tap and make controls shift under the finger.
   • Counters initialise to their TARGET so the server HTML carries the real
     figure; the client resets and counts up on the same frame.
   • Tickers are pure CSS. A rAF loop writing transforms janks scrolling.
   ========================================================================== */

/* Subscribed via useSyncExternalStore rather than setState-in-an-effect: the
   pointer type is external browser state, and this is the API for reading it
   without a cascading render on mount. The server snapshot is `false`, so SSR
   assumes coarse pointer and no pointer-following effects are ever emitted
   into the initial HTML. */
function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getFinePointer = () => window.matchMedia("(pointer: fine)").matches;

/** Precise pointer AND no reduced-motion preference. */
export function useFinePointer() {
  const reduce = useReducedMotion();
  const fine = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointer,
    () => false,
  );
  return fine && !reduce;
}

export { SplitText } from "./SplitText";

/* ------------------------------- Reveal --------------------------------- */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  immediate = false,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  immediate?: boolean;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <div className={className}>{children}</div>;

  const from = { opacity: 0, y };
  const to = { opacity: 1, y: 0 };
  const transition = { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const };

  if (immediate) {
    return (
      <Comp className={className} initial={from} animate={to} transition={transition}>
        {children}
      </Comp>
    );
  }
  return (
    <Comp
      className={className}
      initial={from}
      whileInView={to}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={transition}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------ Stagger --------------------------------- */
export function Stagger({
  children,
  className,
  step = 0.06,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-8%" }}
      variants={{ shown: { transition: { staggerChildren: step } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Magnetic -------------------------------- */
export function Magnetic({
  children,
  strength = 0.2,
  radius = 90,
  className,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const active = useFinePointer();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 250, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    function move(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) > radius + Math.max(r.width, r.height) / 2) {
        x.set(0);
        y.set(0);
        return;
      }
      x.set(dx * strength);
      y.set(dy * strength);
    }
    function leave() {
      x.set(0);
      y.set(0);
    }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [active, radius, strength, x, y]);

  if (!active) return <span className={className}>{children}</span>;
  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.span>
  );
}

/* -------------------------------- Counter ------------------------------- */
export function Counter({
  to,
  from = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Initialised to the TARGET: the server HTML then carries the real figure,
  // so crawlers and no-JS users read "20+" rather than "0+".
  const [n, setN] = useState(to);

  useEffect(() => {
    // Already initialised to `to`, so reduced motion needs no state write —
    // it simply never starts the animation.
    if (reduce) return;
    const t0 = performance.now();
    let raf = 0;
    const run = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(run);
      else setN(to);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [reduce, from, to, duration]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {n.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* -------------------------------- Ticker -------------------------------- */
/** Pure-CSS marquee. `seconds` is one full loop — higher is slower. Pauses on
 *  hover and focus-within (handled in CSS). */
export function Ticker({
  children,
  seconds = 200,
  className,
  reverse = false,
}: {
  children: ReactNode;
  seconds?: number;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn("ticker relative flex overflow-hidden", className)}
      role="marquee"
      aria-label="Scrolling list"
    >
      <div
        className="ticker-track items-center"
        style={
          {
            "--ticker-duration": `${seconds}s`,
            animationDirection: reverse ? "reverse" : undefined,
          } as CSSProperties
        }
      >
        {children}
        {/* Duplicated for the seamless -50% loop; hidden from AT so the list
            is not announced twice. */}
        <span aria-hidden className="flex shrink-0 items-center">
          {children}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------- Parallax ------------------------------- */
export function Parallax({
  children,
  distance = 50,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const sy = useSpring(y, { stiffness: 110, damping: 26 });
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y: sy }}>{children}</motion.div>
    </div>
  );
}
