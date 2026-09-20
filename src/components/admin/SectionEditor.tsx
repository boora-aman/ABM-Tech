"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Panel";
import { SECTION_LIBRARY, librarySection, type Section } from "@/lib/billing-sections";
import { cn } from "@/lib/utils";

/* ==========================================================================
   SECTION EDITOR — the prose of a proposal or an agreement.

   Everything arrives prefilled. The job here is to make changing it cheap:
   each section is one collapsible card, the body is a plain textarea, bullets
   and checklists are one item per line, and a table is a grid you type into.

   Nothing is required. Drop a section you do not want, add one back from the
   library, reorder, or rewrite it entirely — what is saved is exactly what
   prints.
   ========================================================================== */

const input =
  "w-full rounded-sm border border-line bg-page px-3 py-2 text-[0.875rem] outline-none transition-colors focus:border-brand";

const linesOf = (items?: string[]) => (items ?? []).join("\n");
const toItems = (v: string) =>
  v.split("\n").map((l) => l.trim()).filter(Boolean);

export function SectionEditor({
  kind,
  sections,
  onChange,
}: {
  kind: "proposal" | "agreement";
  sections: Section[];
  onChange: (next: Section[]) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const patch = (i: number, next: Partial<Section>) =>
    onChange(sections.map((s, k) => (k === i ? { ...s, ...next } : s)));

  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const used = new Set(sections.map((s) => s.id));
  const available = SECTION_LIBRARY[kind].filter((s) => !used.has(s.id));

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[0.8125rem] font-medium">
          Sections
          <span className="ml-2 font-normal text-ink-faint">
            {sections.length} · printed in this order
          </span>
        </span>
        {available.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setAdding((v) => !v)}>
            {adding ? "Close" : `+ Add section (${available.length})`}
          </Button>
        )}
      </div>

      {adding && (
        <Card className="grid gap-1.5 p-3">
          {available.map((s) => (
            <button
              key={s.id}
              type="button"
              className="rounded-sm px-2.5 py-2 text-left text-[0.8125rem] hover:bg-tint"
              onClick={() => {
                const copy = librarySection(kind, s.id);
                if (copy) onChange([...sections, copy]);
                setAdding(false);
                setOpen(s.id);
              }}
            >
              <span className="font-medium">{s.heading}</span>
              {s.note && (
                <span className="ml-2 text-[0.75rem] text-ink-faint">{s.note}</span>
              )}
            </button>
          ))}
        </Card>
      )}

      {sections.map((sec, i) => {
        const isOpen = open === sec.id;
        return (
          <Card key={sec.id || i} className="p-0">
            <div className="flex items-center gap-2 p-3">
              <span className="w-6 shrink-0 text-[0.75rem] text-ink-faint tabular-nums">
                {i + 1}.
              </span>
              <button
                type="button"
                className="min-w-0 flex-1 text-left text-[0.875rem] font-medium"
                onClick={() => setOpen(isOpen ? null : sec.id)}
                aria-expanded={isOpen}
              >
                {sec.heading}
                <span className="ml-2 text-[0.75rem] font-normal text-ink-faint">
                  {sec.kind}
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Move up"
                  className="px-1.5 text-ink-faint hover:text-ink disabled:opacity-30"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  className="px-1.5 text-ink-faint hover:text-ink disabled:opacity-30"
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label="Remove section"
                  className="px-1.5 text-ink-faint hover:text-brand-ink"
                  onClick={() => onChange(sections.filter((_, k) => k !== i))}
                >
                  ×
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="grid gap-3 border-t border-line p-3">
                {sec.note && (
                  <p className="text-[0.75rem] text-ink-faint">{sec.note}</p>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-[0.75rem] text-ink-dim">Heading</span>
                  <input
                    className={input}
                    value={sec.heading}
                    onChange={(e) => patch(i, { heading: e.target.value })}
                  />
                </label>

                {sec.kind === "text" && (
                  <label className="block">
                    <span className="mb-1.5 block text-[0.75rem] text-ink-dim">
                      Body — leave a blank line between paragraphs
                    </span>
                    <textarea
                      className={cn(input, "resize-y leading-relaxed")}
                      rows={8}
                      value={sec.body ?? ""}
                      onChange={(e) => patch(i, { body: e.target.value })}
                    />
                  </label>
                )}

                {(sec.kind === "bullets" || sec.kind === "checklist") && (
                  <label className="block">
                    <span className="mb-1.5 block text-[0.75rem] text-ink-dim">
                      One {sec.kind === "checklist" ? "checklist item" : "bullet"} per line
                    </span>
                    <textarea
                      className={cn(input, "resize-y leading-relaxed")}
                      rows={8}
                      value={linesOf(sec.items)}
                      onChange={(e) => patch(i, { items: toItems(e.target.value) })}
                    />
                  </label>
                )}

                {sec.kind === "table" && (
                  <TableEditor
                    columns={sec.columns ?? []}
                    rows={sec.rows ?? []}
                    onChange={(columns, rows) => patch(i, { columns, rows })}
                  />
                )}
              </div>
            )}
          </Card>
        );
      })}

      {sections.length === 0 && (
        <p className="rounded-sm border border-line px-4 py-3 text-[0.8125rem] text-ink-dim">
          No sections. This document will print as a header, a price table and a
          signature block. Add sections above to put the argument back in.
        </p>
      )}
    </div>
  );
}

function TableEditor({
  columns,
  rows,
  onChange,
}: {
  columns: string[];
  rows: string[][];
  onChange: (columns: string[], rows: string[][]) => void;
}) {
  const width = columns.length || 1;
  /* Rows are normalised to the header width on every edit. A row shorter than
     its header silently drops a cell when it prints. */
  const norm = (r: string[]) =>
    Array.from({ length: width }, (_, i) => r[i] ?? "");

  return (
    <div className="grid gap-2">
      <span className="text-[0.75rem] text-ink-dim">Table</span>

      <div className="grid gap-1.5">
        <div className="flex gap-1.5">
          {columns.map((c, ci) => (
            <input
              key={ci}
              className={cn(input, "font-medium")}
              value={c}
              aria-label={`Column ${ci + 1} heading`}
              onChange={(e) =>
                onChange(
                  columns.map((x, k) => (k === ci ? e.target.value : x)),
                  rows,
                )
              }
            />
          ))}
          <span className="w-7 shrink-0" />
        </div>

        {rows.map((r, ri) => (
          <div key={ri} className="flex gap-1.5">
            {norm(r).map((cell, ci) => (
              <textarea
                key={ci}
                className={cn(input, "resize-y")}
                rows={2}
                aria-label={`Row ${ri + 1} column ${ci + 1}`}
                value={cell}
                onChange={(e) =>
                  onChange(
                    columns,
                    rows.map((row, k) =>
                      k === ri
                        ? norm(row).map((x, j) => (j === ci ? e.target.value : x))
                        : row,
                    ),
                  )
                }
              />
            ))}
            <button
              type="button"
              aria-label="Remove row"
              className="w-7 shrink-0 text-ink-faint hover:text-brand-ink"
              onClick={() => onChange(columns, rows.filter((_, k) => k !== ri))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="justify-self-start"
        onClick={() => onChange(columns, [...rows, Array(width).fill("")])}
      >
        + Add row
      </Button>
    </div>
  );
}
