"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

const C = 2 * Math.PI * 14;

/** Back-to-top with a live scroll-progress ring. Appears after 1.5 viewports. */
export function BackToTop() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 240, damping: 34 });
  const [dash, setDash] = useState(C);

  useEffect(() => {
    const on = () => setShown(window.scrollY > window.innerHeight * 1.5);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(
    () =>
      progress.on("change", (v) =>
        setDash(C * (1 - Math.min(1, Math.max(0, v)))),
      ),
    [progress],
  );

  return (
    <AnimatePresence>
      {shown && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.75 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          whileHover={reduce ? undefined : { y: -2 }}
          className="group/top fixed right-4 bottom-5 z-50 grid size-11 place-items-center rounded-tight border border-hair bg-slate/70 backdrop-blur-md transition-colors hover:border-hair-warm sm:right-6 no-print"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            aria-hidden
            className="absolute -rotate-90"
          >
            <circle cx="17" cy="17" r="14" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
            <circle
              cx="17"
              cy="17"
              r="14"
              fill="none"
              stroke="var(--color-flare)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={dash}
            />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
            className="relative transition-transform duration-300 group-hover/top:-translate-y-0.5"
          >
            <path
              d="M9 14.5V3.5M4 8.5 9 3.5l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
