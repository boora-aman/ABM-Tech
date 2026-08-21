"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SectionLabel, Datum, Tag, Rule } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/content/work";

/* ==========================================================================
   X-RAY SHOWCASE — split-pane architecture view

   LEFT pane stays locked as a high-fidelity interface. RIGHT pane scrolls the
   engagement's problem, build and outcomes. Hovering (or tapping) the left
   pane dissolves the interface and exposes the structures underneath — the
   real collections, endpoints and scheduled jobs.

   The reason this interaction exists: the claim being made is "we built what
   you're looking at". A gallery of screenshots asks to be believed. Exposing
   the schema beneath the surface is the only version of that claim a technical
   buyer can actually evaluate — and it works when every client deployment is
   under NDA, because a table list gives nothing away.
   ========================================================================== */

export function XRayShowcase({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const p = projects[active];
  if (!p) return null;

  return (
    <section id="work" className="page-x py-20 sm:py-28">
      <div className="bay">
        <Reveal>
          <SectionLabel index="02" className="mb-9">
            Delivered systems
          </SectionLabel>
        </Reveal>

        <div className="mb-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Reveal delay={0.04}>
            <h2 className="t-h1">
              Look under the interface.
              <br />
              <span className="flare-text">That&apos;s where the work is.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lead">
              Hover any panel to dissolve the surface and expose the collections,
              endpoints and scheduled jobs beneath it. Clients are anonymised;
              the architecture is not.
            </p>
          </Reveal>
        </div>

        {/* Selector rail */}
        <div
          role="tablist"
          aria-label="Engagements"
          className="mb-6 flex gap-2 overflow-x-auto border-y border-hair py-3"
        >
          {projects.map((proj, i) => (
            <button
              key={proj.slug}
              role="tab"
              aria-selected={i === active}
              aria-controls="xray-panel"
              onClick={() => {
                setActive(i);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setActive((v) => (v + 1) % projects.length);
                if (e.key === "ArrowLeft")
                  setActive((v) => (v - 1 + projects.length) % projects.length);
              }}
              className={cn(
                "flex shrink-0 items-baseline gap-2 rounded-tight border px-3.5 py-2 transition-colors",
                i === active
                  ? "border-hair-warm bg-flare/8 text-ink"
                  : "border-hair text-ink-dim hover:border-white/15 hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[0.5625rem] tabular-nums",
                  i === active ? "text-flare" : "text-ink-faint",
                )}
              >
                {proj.index}
              </span>
              <span className="text-[0.8125rem] whitespace-nowrap">
                {proj.title}
              </span>
            </button>
          ))}
        </div>

        <div
          id="xray-panel"
          role="tabpanel"
          className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start"
        >
          {/* ------------------- LEFT: the X-ray pane ------------------- */}
          <div className="lg:sticky lg:top-24">
            <div
              className={cn("xray panel relative overflow-hidden")}
              data-open={open ? "true" : "false"}
              onClick={() => setOpen((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen((v) => !v);
                }
              }}
              aria-label={`${p.title}: toggle architecture view`}
            >
              {/* Window chrome */}
              <div className="relative z-2 flex items-center gap-2.5 border-b border-hair px-4 py-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2 rounded-full bg-flare/70" />
                  <span className="size-2 rounded-full bg-white/12" />
                  <span className="size-2 rounded-full bg-white/12" />
                </span>
                <span className="meta ml-1 truncate">{p.slug}</span>
                <span className="ml-auto flex items-center gap-2">
                  <Datum className="pulse-dot" />
                  <span className="meta hidden sm:inline">
                    {open ? "schema" : "hover to x-ray"}
                  </span>
                </span>
              </div>

              <div className="relative min-h-[22rem] sm:min-h-[26rem]">
                {/* SKIN — the finished interface */}
                <div className="xray-skin absolute inset-0 p-4 sm:p-5">
                  <SkinMock project={p} />
                </div>

                {/* GUTS — the structure underneath */}
                <div className="xray-guts absolute inset-0 overflow-auto p-4 sm:p-5">
                  <div className="space-y-4">
                    {p.guts.map((g) => (
                      <div key={g.label}>
                        <div className="mb-2 flex items-center gap-2">
                          <Datum />
                          <span className="meta-bright">{g.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {g.items.map((it) => (
                            <code
                              key={it}
                              className="inset-panel px-2 py-1 font-mono text-[0.625rem] text-signal/85"
                            >
                              {it}
                            </code>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="meta mt-3 normal-case tracking-normal leading-relaxed">
              Tap the panel on a touch device to toggle the architecture view.
            </p>
          </div>

          {/* ------------------- RIGHT: the narrative ------------------- */}
          <motion.article
            key={p.slug}
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0"
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Tag hot>{p.sector}</Tag>
              <Tag>{p.year}</Tag>
            </div>

            <h3 className="t-h2 mb-4 font-display">{p.title}</h3>
            <p className="t-lead mb-8">{p.summary}</p>

            <div className="mb-8 space-y-6">
              <Block label="The problem" body={p.problem} />
              <Block label="What we built" body={p.built} />
            </div>

            <Rule className="mb-6" />

            <dl className="mb-8 grid grid-cols-2 gap-x-6 gap-y-5">
              {p.outcomes.map((o) => (
                <div key={o.metric}>
                  <dd className="font-display text-lg tracking-[-0.02em] text-flare-hi sm:text-xl">
                    {o.value}
                  </dd>
                  <dt className="meta mt-1.5 leading-snug">{o.metric}</dt>
                </div>
              ))}
            </dl>

            <div className="mb-8 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>

            <Link
              href={`/services/${p.serviceSlug}`}
              className="group/btn inline-flex items-center gap-2.5 text-[0.875rem] text-flare transition-colors hover:text-flare-hi"
            >
              Service that delivered this
              <Arrow />
            </Link>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="h-px w-6 bg-flare" aria-hidden />
        <span className="meta-bright">{label}</span>
      </div>
      <p className="text-[0.9375rem] leading-[1.7] text-ink-dim">{body}</p>
    </div>
  );
}

/**
 * A generic dashboard skin. Deliberately abstract — bars, rows and a table
 * shell rather than a fabricated screenshot of a named client system, which
 * would be inventing evidence rather than showing structure.
 */
function SkinMock({ project }: { project: Project }) {
  const rows = 6;
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Stat row */}
      <div className="grid grid-cols-3 gap-2">
        {project.outcomes.slice(0, 3).map((o) => (
          <div key={o.metric} className="inset-panel px-2.5 py-2">
            <div className="truncate font-display text-sm text-ink">{o.value}</div>
            <div className="meta mt-1 truncate text-[0.5rem]!">{o.metric}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="inset-panel flex items-end gap-1 px-3 py-3">
        {[38, 52, 44, 66, 58, 78, 71, 88, 82, 94].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-[1px]"
            style={{
              height: `${h * 0.5}px`,
              background:
                i > 7
                  ? "linear-gradient(to top, var(--color-flare), var(--color-flare-hi))"
                  : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      {/* Table shell */}
      <div className="inset-panel flex-1 overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_auto] gap-2 border-b border-white/6 px-3 py-2">
          {["Record", "Status", "Value"].map((h) => (
            <span key={h} className="meta text-[0.5rem]!">
              {h}
            </span>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1.6fr_1fr_auto] items-center gap-2 border-b border-white/4 px-3 py-2 last:border-0"
          >
            <span
              className="h-1.5 rounded-full bg-white/12"
              style={{ width: `${70 - i * 6}%` }}
            />
            <span
              className="h-1.5 w-10 rounded-full"
              style={{
                background: i % 3 === 0 ? "var(--color-flare)" : "rgba(255,255,255,0.1)",
                opacity: i % 3 === 0 ? 0.8 : 1,
              }}
            />
            <span className="h-1.5 w-8 rounded-full bg-white/12" />
          </div>
        ))}
      </div>
    </div>
  );
}
