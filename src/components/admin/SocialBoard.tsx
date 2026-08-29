"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Rule } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";
import type { SocialPost } from "@/lib/content/social";

/* ==========================================================================
   SOCIAL BOARD

   The day-to-day job is not editing these posts — it is finding the next one,
   copying the caption, generating the image, and ticking it off. So this is
   built as a board rather than a form: everything collapsed to one scannable
   line, expanding to the full caption, hashtags and image prompt on click.

   Status is optimistic. Marking a post updates the local state immediately
   and reconciles with the server after; at 176 posts a round-trip per tick
   would make the board feel broken even though it was working.
   ========================================================================== */

type Status = "todo" | "scheduled" | "posted" | "skipped";

type StatusRow = { key: string; status: Status; date?: string; note?: string };

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  todo: { label: "To do", cls: "border-line text-ink-faint" },
  scheduled: { label: "Scheduled", cls: "border-brand/40 bg-tint text-brand-ink" },
  posted: { label: "Posted", cls: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400" },
  skipped: { label: "Skipped", cls: "border-line text-ink-faint line-through" },
};

const SOURCE_LABEL: Record<string, string> = {
  calendar: "30-day calendar",
  library: "Service library",
  google: "Google listing",
  reel: "Reels",
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context; fall back to a scratch textarea.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing more to try — the user can select the text manually */
      }
      document.body.removeChild(ta);
    }
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  }

  return (
    <Button variant="outline" size="sm" onClick={copy} className={done ? "border-brand text-brand-ink" : ""}>
      {done ? "Copied ✓" : label}
    </Button>
  );
}

export function SocialBoard({ posts }: { posts: SocialPost[] }) {
  const [rows, setRows] = useState<Record<string, StatusRow>>({});
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | "remaining" | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/social-status", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (!json.ok) throw new Error(json.error ?? "Could not load status");
        const map: Record<string, StatusRow> = {};
        for (const r of json.data as StatusRow[]) map[r.key] = r;
        setRows(map);
      } catch (err) {
        if (!cancelled) setDbError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function mark(key: string, next: Status) {
    const prev = rows[key];
    const date = next === "posted" ? new Date().toISOString().slice(0, 10) : (prev?.date ?? "");
    // Optimistic — a round-trip per tick would make 176 rows feel sluggish.
    setRows((r) => ({ ...r, [key]: { key, status: next, date } }));
    try {
      const res = await fetch("/api/admin/social-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, status: next, ...(date ? { date } : {}) }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
    } catch (err) {
      // Roll back so the board never shows a state the database rejected.
      setRows((r) => {
        const copy = { ...r };
        if (prev) copy[key] = prev;
        else delete copy[key];
        return copy;
      });
      setDbError((err as Error).message);
    }
  }

  const statusOf = (k: string): Status => rows[k]?.status ?? "todo";

  const groups = useMemo(() => {
    const set = new Map<string, number>();
    for (const p of posts) {
      if (source && p.source !== source) continue;
      set.set(p.group, (set.get(p.group) ?? 0) + 1);
    }
    return [...set.entries()];
  }, [posts, source]);

  const shown = useMemo(
    () =>
      posts.filter((p) => {
        if (source && p.source !== source) return false;
        if (group && p.group !== group) return false;
        const st = statusOf(p.key);
        if (status === "remaining" && (st === "posted" || st === "skipped")) return false;
        if (status && status !== "remaining" && st !== status) return false;
        if (q) {
          const hay = `${p.title} ${p.hook} ${p.caption} ${p.group} ${p.theme}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    // statusOf reads `rows`, which is in the dep list via `rows`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posts, source, group, status, q, rows],
  );

  const counts = useMemo(() => {
    const c = { total: posts.length, posted: 0, scheduled: 0, skipped: 0 };
    for (const p of posts) {
      const s = statusOf(p.key);
      if (s === "posted") c.posted++;
      else if (s === "scheduled") c.scheduled++;
      else if (s === "skipped") c.skipped++;
    }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, rows]);

  const pct = counts.total ? Math.round((counts.posted / counts.total) * 100) : 0;

  const chip =
    "rounded-full border px-3 py-1 text-[0.8125rem] font-medium transition-colors";
  const chipOff = "border-line text-ink-dim hover:border-line-strong hover:text-ink";
  const chipOn = "border-ink bg-ink text-page";

  return (
    <div className="grid gap-5">
      {/* ------------------------------ Progress --------------------------- */}
      <Card raised className="p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Label className="mb-1.5">Publishing</Label>
            <p className="font-display text-2xl font-semibold">
              {counts.posted}{" "}
              <span className="text-ink-faint">of {counts.total} posted</span>
            </p>
          </div>
          <dl className="flex gap-6">
            {[
              ["Scheduled", counts.scheduled],
              ["Skipped", counts.skipped],
              ["Remaining", counts.total - counts.posted - counts.skipped],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="label">{k}</dt>
                <dd className="mt-1 font-display text-lg font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-tint"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Posts published"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${pct}%` }}
          />
        </div>

        {dbError && (
          <p className="mt-4 rounded-sm border border-brand/30 bg-tint px-3.5 py-2.5 text-[0.8125rem] text-ink-dim">
            <strong className="text-ink">Ticks are not being saved.</strong> {dbError}{" "}
            The posts below still work — only the status needs a database.
          </p>
        )}
      </Card>

      {/* ------------------------------ Filters ---------------------------- */}
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={cn(chip, source === null ? chipOn : chipOff)}
            onClick={() => {
              setSource(null);
              setGroup(null);
            }}
          >
            All {posts.length}
          </button>
          {Object.entries(SOURCE_LABEL).map(([k, label]) => {
            const n = posts.filter((p) => p.source === k).length;
            return (
              <button
                key={k}
                className={cn(chip, source === k ? chipOn : chipOff)}
                onClick={() => {
                  setSource(source === k ? null : k);
                  setGroup(null);
                }}
              >
                {label} {n}
              </button>
            );
          })}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          {(["remaining", "scheduled", "posted"] as const).map((s) => (
            <button
              key={s}
              className={cn(chip, status === s ? chipOn : chipOff)}
              onClick={() => setStatus(status === s ? null : s)}
            >
              {s === "remaining" ? "Remaining" : STATUS_META[s].label}
            </button>
          ))}
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search captions…"
            className="ml-auto min-w-[10rem] flex-1 rounded-full border border-line bg-surface px-4 py-1.5 text-[0.8125rem] outline-none focus:border-brand"
          />
        </div>

        {groups.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {groups.map(([g, n]) => (
              <button
                key={g}
                className={cn(
                  "rounded-sm border px-2.5 py-1 text-[0.75rem] transition-colors",
                  group === g ? "border-brand bg-tint text-brand-ink" : chipOff,
                )}
                onClick={() => setGroup(group === g ? null : g)}
              >
                {g} <span className="text-ink-faint">{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------- Board ----------------------------- */}
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <Label tick={false}>
            {loading ? "Loading…" : `${shown.length} shown`}
          </Label>
          {(source || group || status || q) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSource(null);
                setGroup(null);
                setStatus(null);
                setQ("");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {shown.length === 0 && !loading && (
          <p className="px-5 py-10 text-center text-[0.875rem] text-ink-faint">
            Nothing matches those filters.
          </p>
        )}

        <ul className="divide-y divide-line">
          {shown.map((p) => {
            const st = statusOf(p.key);
            const isOpen = open === p.key;
            return (
              <li key={p.key} className={cn(st === "posted" && "opacity-60")}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-4 px-5 py-3.5 text-left transition-colors hover:bg-tint"
                >
                  <span
                    className={cn(
                      "mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium",
                      STATUS_META[st].cls,
                    )}
                  >
                    {STATUS_META[st].label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[0.9375rem] font-semibold">
                      {p.hook || p.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.75rem] text-ink-faint">
                      {p.group}
                      {p.slot && ` · ${p.slot}`} · {p.format}
                    </span>
                  </span>
                  <svg
                    width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden
                    className={cn(
                      "mt-1 shrink-0 text-ink-faint transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  >
                    <path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="grid gap-5 border-t border-line bg-page/50 px-5 py-5">
                    {p.script && (
                      <Field label="Reel script" mono>
                        {p.script}
                      </Field>
                    )}
                    <Field label="Caption">{p.caption}</Field>
                    <Field label="Hashtags" mono>
                      {p.hashtags}
                    </Field>
                    <Field label="Image prompt" mono>
                      {p.imagePrompt}
                    </Field>

                    <div className="flex flex-wrap items-center gap-2">
                      <CopyButton text={p.caption} label="Copy caption" />
                      <CopyButton text={p.hashtags} label="Copy hashtags" />
                      <CopyButton text={p.imagePrompt} label="Copy image prompt" />
                      <span className="mx-1 h-5 w-px bg-line" aria-hidden />
                      {(["todo", "scheduled", "posted", "skipped"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => mark(p.key, s)}
                          aria-pressed={st === s}
                          className={cn(
                            "rounded-sm border px-2.5 py-1 text-[0.75rem] font-medium transition-colors",
                            st === s ? "border-ink bg-ink text-page" : chipOff,
                          )}
                        >
                          {STATUS_META[s].label}
                        </button>
                      ))}
                      {rows[p.key]?.date && (
                        <span className="text-[0.75rem] text-ink-faint">
                          {rows[p.key].date}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="p-5">
        <Label className="mb-2">Where this comes from</Label>
        <p className="text-[0.8125rem] leading-relaxed text-ink-dim">
          Post content is generated from the markdown in <code className="font-mono">/social</code> by{" "}
          <code className="font-mono">scripts/parse-social.py</code>. Edit the markdown for wording,
          re-run the script, redeploy. Only the ticks live in the database — regenerating never
          resets what you have already published.
        </p>
      </Card>
      <Rule />
    </div>
  );
}

function Field({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="label mb-2 flex items-center gap-2.5">
        {label}
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>
      <p
        className={cn(
          "max-h-72 overflow-y-auto rounded-sm border border-line bg-surface px-4 py-3 text-[0.875rem] leading-relaxed whitespace-pre-wrap text-ink-dim",
          mono && "font-mono text-[0.8125rem]",
        )}
      >
        {children}
      </p>
    </div>
  );
}
