import Link from "next/link";
import type { ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion";
import { Rule, Tag } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/* ==========================================================================
   PAGE MASTHEAD
   Shared across interior routes. Keeps the hero's structural language — a
   bracketed index, a crawlable breadcrumb rail, a kinetic headline and an
   optional right-hand data column — without repeating the live viewport.
   ========================================================================== */

export function PageHead({
  index,
  label,
  title,
  titleAccent,
  lead,
  tags,
  breadcrumb,
  aside,
  className,
}: {
  index?: string;
  label: string;
  title: string;
  titleAccent?: string;
  lead?: string;
  tags?: readonly string[];
  breadcrumb?: { name: string; path: string }[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("page-x pt-28 pb-14 sm:pt-36 sm:pb-16", className)}>
      <div className="bay">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumb.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="meta opacity-45">
                      /
                    </span>
                  )}
                  {i === breadcrumb.length - 1 ? (
                    <span className="meta" aria-current="page">
                      {c.name}
                    </span>
                  ) : (
                    <Link
                      href={c.path}
                      className="meta transition-colors hover:text-flare-hi"
                    >
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className={cn(
            "grid gap-10",
            Boolean(aside) && "lg:grid-cols-[1.5fr_minmax(0,22rem)] lg:items-end",
          )}
        >
          <div className="min-w-0">
            <Reveal immediate>
              <div className="mb-6 flex items-center gap-3">
                {index && (
                  <span className="meta-bright flex items-center gap-1.5">
                    <span className="text-flare">[</span>
                    <span className="tabular-nums">{index}</span>
                    <span className="text-flare">]</span>
                  </span>
                )}
                <span className="meta-bright">{label}</span>
                <Rule className="w-16" />
              </div>
            </Reveal>

            <h1 className="t-h1 mb-6 font-display">
              <SplitText text={title} />
              {titleAccent && (
                <>
                  <br />
                  {/* Per-word gradient — see the note in Hero.tsx: a wrapper
                      with background-clip:text renders invisible through
                      SplitText's animated spans. */}
                  <SplitText
                    text={titleAccent}
                    delay={0.16}
                    wordClassName="flare-text"
                  />
                </>
              )}
            </h1>

            {lead && (
              <Reveal immediate delay={0.24}>
                <p className="t-lead max-w-2xl">{lead}</p>
              </Reveal>
            )}

            {tags && tags.length > 0 && (
              <Reveal immediate delay={0.32}>
                <div className="mt-7 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {aside && (
            <Reveal immediate delay={0.18}>
              {aside}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}
