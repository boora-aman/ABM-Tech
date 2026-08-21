import { cn } from "@/lib/utils";

/**
 * Per-word headline reveal — a SERVER component driven entirely by CSS.
 *
 * Not an aesthetic choice. Headlines are the most important text on any page,
 * and a JS- or scroll-driven reveal that fails to fire leaves a blank gap
 * where the title should be. As markup plus a CSS animation with `both` fill
 * the words are present in the server-rendered HTML, animate without
 * hydration, flatten to their end state under reduced motion, and cost zero
 * bytes of client JavaScript.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  step = 0.05,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.06em] align-bottom"
        >
          <span
            className={cn("word-in", wordClassName)}
            style={{ animationDelay: `${(delay + i * step).toFixed(3)}s` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
