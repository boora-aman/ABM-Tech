"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Rule, Chip } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/* ==========================================================================
   COLLECTION EDITOR

   One component drives every collection. Fields are described declaratively
   by the page that renders it, and the shape of the field decides the control:

     text / textarea / number / boolean / select  → a real input
     list                                         → one item per line
     json                                         → a validated JSON textarea

   Deeply nested structures (a service's capabilities, phases and faqs) are
   edited as JSON on purpose. A nested form builder for arrays-of-objects
   three levels deep is substantially more code and more fragile than the JSON
   is awkward, and every save is validated server-side against the same zod
   schema — so a malformed edit comes back naming the exact failing path
   rather than being silently accepted.
   ========================================================================== */

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "select" | "list" | "json";
  hint?: string;
  options?: string[];
  /** Rows for textarea/json/list controls. */
  rows?: number;
  required?: boolean;
};

type Row = Record<string, unknown>;

const emptyFor = (fields: Field[]): Row =>
  Object.fromEntries(
    fields.map((f) => [
      f.name,
      f.type === "boolean"
        ? false
        : f.type === "number"
          ? 0
          : f.type === "list" || f.type === "json"
            ? []
            : "",
    ]),
  );

function toEditable(value: unknown, type: Field["type"]): string {
  if (value === undefined || value === null) return "";
  if (type === "list")
    return Array.isArray(value) ? value.join("\n") : String(value);
  if (type === "json") return JSON.stringify(value ?? [], null, 2);
  return String(value);
}

export function CollectionEditor({
  resource,
  title,
  fields,
  uniqueKey,
  note,
}: {
  resource: string;
  title: string;
  fields: Field[];
  uniqueKey?: string;
  note?: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Row>(() => emptyFor(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  /* The form is closed by default. It used to sit permanently above the list,
     which pushed the existing records off the first screen — on a collection
     with twenty fields you could not see what you already had without
     scrolling past a blank form you had not asked for. */
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const labelKey = useMemo(
    () => uniqueKey ?? fields.find((f) => f.type === "text")?.name ?? "id",
    [uniqueKey, fields],
  );

  /* Fetching is done inside the effect rather than in a function the effect
     calls, so no state is set synchronously during the effect body — that
     pattern causes a cascading render and is what react-hooks flags. The
     cancelled flag stops a late response from a previous resource writing
     into the new one's state. */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/admin/${resource}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (cancelled) return;
        if (!json.ok) throw new Error(json.error ?? "Could not load");
        setRows(json.data as Row[]);
        setStatus(null);
      } catch (err) {
        if (!cancelled)
          setStatus({ kind: "err", text: (err as Error).message });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resource]);

  /** Re-read after a write. Safe to call from an event handler. */
  async function load() {
    try {
      const res = await fetch(`/api/admin/${resource}`, { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Could not load");
      setRows(json.data as Row[]);
    } catch (err) {
      setStatus({ kind: "err", text: (err as Error).message });
    }
  }

  function edit(row: Row) {
    const next: Row = {};
    for (const f of fields) next[f.name] = row[f.name];
    setDraft(next);
    setEditingId(String(row.id ?? ""));
    setFormOpen(true);
    setStatus(null);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setDraft(emptyFor(fields));
    setEditingId(null);
    setFormOpen(false);
    setStatus(null);
  }

  function startNew() {
    setDraft(emptyFor(fields));
    setEditingId(null);
    setFormOpen(true);
    setStatus(null);
  }

  /** Turn the string-backed form state into the JSON the API expects. */
  function buildPayload(): Row | null {
    const out: Row = {};
    for (const f of fields) {
      const raw = draft[f.name];
      if (f.type === "number") {
        out[f.name] = Number(raw ?? 0);
      } else if (f.type === "boolean") {
        out[f.name] = Boolean(raw);
      } else if (f.type === "list") {
        const text =
          typeof raw === "string"
            ? raw
            : Array.isArray(raw)
              ? raw.join("\n")
              : "";
        out[f.name] = text
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.type === "json") {
        const text = typeof raw === "string" ? raw : JSON.stringify(raw ?? []);
        if (!text.trim()) {
          out[f.name] = [];
        } else {
          try {
            out[f.name] = JSON.parse(text);
          } catch {
            setStatus({ kind: "err", text: `"${f.label}" is not valid JSON.` });
            return null;
          }
        }
      } else {
        const v = typeof raw === "string" ? raw.trim() : raw;
        if (v === "" && !f.required) continue;
        out[f.name] = v;
      }
    }
    return out;
  }

  async function save() {
    const payload = buildPayload();
    if (!payload) return;

    setBusy(true);
    setStatus(null);
    try {
      const url = editingId
        ? `/api/admin/${resource}?id=${encodeURIComponent(editingId)}`
        : `/api/admin/${resource}`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) {
        const paths = Array.isArray(json.detail)
          ? json.detail
              .map(
                (i: { path?: unknown[]; message?: string }) =>
                  `${(i.path ?? []).join(".") || "(root)"}: ${i.message ?? ""}`,
              )
              .join(" · ")
          : "";
        throw new Error([json.error, paths].filter(Boolean).join(" — "));
      }
      setStatus({
        kind: "ok",
        text: editingId
          ? "Saved. Live pages refreshed."
          : "Created. Live pages refreshed.",
      });
      reset();
      await load();
    } catch (err) {
      setStatus({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Row) {
    const name = String(row[labelKey] ?? row.id ?? "this record");
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/${resource}?id=${encodeURIComponent(String(row.id))}`,
        { method: "DELETE" },
      );
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Could not delete");
      setStatus({ kind: "ok", text: "Deleted." });
      await load();
    } catch (err) {
      setStatus({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const shown = filter
    ? rows.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(filter.toLowerCase()),
      )
    : rows;

  const input =
    "w-full rounded-sm border border-line bg-page px-3 py-2 text-[0.875rem] outline-none transition-colors focus:border-brand";

  return (
    <div className="grid gap-6">
      {/* ------------------------------ Toolbar ---------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label className="mb-1.5">Collection</Label>
          <h2 className="t-h3">{title}</h2>
        </div>
        {!formOpen && (
          <Button variant="primary" onClick={startNew}>
            + New record
          </Button>
        )}
      </div>

      {/* -------------------------------- Form ----------------------------- */}
      {formOpen && (
        <Card raised className="p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Label className="mb-1.5">
                {editingId ? "Editing" : "New record"}
              </Label>
              <h2 className="t-h3">
                {editingId ? String(draft[labelKey] ?? title) : title}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              {editingId ? "Cancel edit" : "Close"}
            </Button>
          </div>

          {note && (
            <p className="mb-6 rounded-sm border border-line bg-tint px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-dim">
              {note}
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((f) => {
              const wide =
                f.type === "textarea" || f.type === "json" || f.type === "list";
              return (
                <div key={f.name} className={cn(wide && "md:col-span-2")}>
                  <label
                    htmlFor={`f-${f.name}`}
                    className="mb-1.5 block text-[0.8125rem] font-medium"
                  >
                    {f.label}
                    {f.required && <span className="ml-1 text-brand">*</span>}
                  </label>

                  {f.type === "boolean" ? (
                    <label className="flex cursor-pointer items-center gap-2.5 text-[0.875rem] text-ink-dim">
                      <input
                        id={`f-${f.name}`}
                        type="checkbox"
                        checked={Boolean(draft[f.name])}
                        onChange={(e) =>
                          setDraft({ ...draft, [f.name]: e.target.checked })
                        }
                        className="size-4 accent-[var(--color-brand)]"
                      />
                      {f.hint ?? "Enabled"}
                    </label>
                  ) : f.type === "select" ? (
                    <select
                      id={`f-${f.name}`}
                      className={input}
                      value={String(draft[f.name] ?? "")}
                      onChange={(e) =>
                        setDraft({ ...draft, [f.name]: e.target.value })
                      }
                    >
                      <option value="">—</option>
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ||
                    f.type === "json" ||
                    f.type === "list" ? (
                    <textarea
                      id={`f-${f.name}`}
                      className={cn(
                        input,
                        "resize-y leading-relaxed",
                        f.type === "json" && "font-mono text-[0.8125rem]",
                      )}
                      rows={f.rows ?? (f.type === "json" ? 8 : 4)}
                      value={toEditable(draft[f.name], f.type)}
                      onChange={(e) =>
                        setDraft({ ...draft, [f.name]: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      id={`f-${f.name}`}
                      type={f.type === "number" ? "number" : "text"}
                      className={input}
                      value={String(draft[f.name] ?? "")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          [f.name]:
                            f.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  )}

                  {f.hint && f.type !== "boolean" && (
                    <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-faint">
                      {f.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Rule className="my-6" />

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={save} disabled={busy}>
              {busy ? "Saving…" : editingId ? "Save changes" : "Create"}
            </Button>
            {status && (
              <span
                className={cn(
                  "text-[0.8125rem]",
                  status.kind === "ok"
                    ? "text-brand-ink"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {status.text}
              </span>
            )}
          </div>
        </Card>
      )}

      {/* A save or delete made with the form closed still needs to report. */}
      {!formOpen && status && (
        <p
          className={cn(
            "rounded-sm border px-4 py-3 text-[0.875rem]",
            status.kind === "ok"
              ? "border-brand/30 bg-tint text-ink-dim"
              : "border-red-500/40 text-red-600 dark:text-red-400",
          )}
        >
          {status.text}
        </p>
      )}

      {/* ------------------------------ Records ---------------------------- */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Label>
            {loading ? "Loading…" : `${shown.length} of ${rows.length} records`}
          </Label>
          <input
            type="search"
            placeholder="Filter…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-sm border border-line bg-page px-3 py-1.5 text-[0.8125rem] outline-none focus:border-brand"
          />
        </div>

        {!loading && rows.length === 0 && (
          <p className="text-[0.875rem] leading-relaxed text-ink-dim">
            Nothing in the database yet — the site is serving the bundled seed
            content. Run{" "}
            <code className="rounded-sm border border-line bg-tint px-1.5 py-0.5 font-mono text-[0.8125rem]">
              npm run seed
            </code>{" "}
            to import it, or create one with <strong>New record</strong>.
          </p>
        )}

        <ul className="divide-y divide-line">
          {shown.map((r) => (
            <li
              key={String(r.id)}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9375rem] font-medium">
                  {String(r[labelKey] ?? r.id)}
                </p>
                <p className="truncate text-[0.75rem] text-ink-faint">
                  {String(r.title ?? r.name ?? r.q ?? r.key ?? "")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {"published" in r && (
                  <Chip brand={Boolean(r.published)}>
                    {r.published === false ? "Draft" : "Live"}
                  </Chip>
                )}
                <Button variant="outline" size="sm" onClick={() => edit(r)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(r)}
                  disabled={busy}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
