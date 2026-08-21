import Link from "next/link";
import type { ReactNode } from "react";
import { Label, Chip } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/* ==========================================================================
   PAGE MASTHEAD
   Shared across interior routes. Server component; entrance is CSS with
   staggered delays, so nothing depends on hydration or an observer.
   ========================================================================== */

export function PageHead({
  label,
  title,
  titleAccent,
  lead,
  tags,
  breadcrumb,
  aside,
  className,
}: {
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
    <header className={cn("page-x pt-32 pb-12 sm:pt-40 sm:pb-16", className)}>
      <div className="bay">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem]">
              {breadcrumb.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-ink-faint">
                      /
                    </span>
                  )}
                  {i === breadcrumb.length - 1 ? (
                    <span className="text-ink-faint" aria-current="page">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.path} className="text-ink-dim hover:text-brand-ink">
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
            Boolean(aside) && "lg:grid-cols-[1.5fr_minmax(0,21rem)] lg:items-end",
          )}
        >
          <div className="min-w-0">
            <div className="rise mb-5" style={{ animationDelay: "0.04s" }}>
              <Label>{label}</Label>
            </div>

            <h1 className="t-h1 rise mb-5" style={{ animationDelay: "0.1s" }}>
              {title}
              {titleAccent && (
                <>
                  <br />
                  <span className="brand-text">{titleAccent}</span>
                </>
              )}
            </h1>

            {lead && (
              <p className="t-lead rise max-w-2xl" style={{ animationDelay: "0.16s" }}>
                {lead}
              </p>
            )}

            {tags && tags.length > 0 && (
              <div className="rise mt-6 flex flex-wrap gap-2" style={{ animationDelay: "0.22s" }}>
                {tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            )}
          </div>

          {aside && (
            <div className="rise" style={{ animationDelay: "0.14s" }}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
