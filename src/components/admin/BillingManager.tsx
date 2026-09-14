"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Chip, Rule } from "@/components/ui/Panel";
import { computeTotals, inrMoney, type Line } from "@/lib/billing";
import type { Client } from "@/components/admin/ClientManager";
import { cn } from "@/lib/utils";

/* ==========================================================================
   QUOTATIONS AND INVOICES

   One editor for both, because they are the same document with a different
   heading and a different sequence. Totals are computed here with the SAME
   function the PDF and the API use, so what the editor shows and what the
   client receives cannot drift apart.

   Status is not editable. It is derived from the payments recorded against a
   document; a status you can type is a status that stops matching the money.
   ========================================================================== */

type Totals = ReturnType<typeof computeTotals>;

type Doc = {
  id: string;
  kind: "quotation" | "invoice";
  number: string;
  client: Record<string, string | undefined>;
  clientId?: string;
  issueDate: string;
  validUntil?: string;
  dueDate?: string;
  lines: Line[];
  discountPct: number;
  taxRate: number;
  taxMode: "none" | "cgst_sgst" | "igst";
  status: string;
  notes?: string;
  terms?: string;
  convertedToId?: string;
  convertedFromId?: string;
  sentAt?: string;
  lastSentTo?: string;
  totals: Totals;
  paid: number;
  balance: number;
};

type Payment = {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference?: string;
  note?: string;
};

type Draft = {
  id?: string;
  kind: "quotation" | "invoice";
  clientId: string;
  issueDate: string;
  validUntil: string;
  dueDate: string;
  lines: Line[];
  discountPct: number;
  taxRate: number;
  taxMode: "none" | "cgst_sgst" | "igst";
  notes: string;
  terms: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const blankLine = (): Line => ({ description: "", qty: 1, unit: "nos", rate: 0, discountPct: 0 });

function blankDraft(kind: "quotation" | "invoice"): Draft {
  return {
    kind,
    clientId: "",
    issueDate: today(),
    validUntil: kind === "quotation" ? plusDays(15) : "",
    dueDate: kind === "invoice" ? plusDays(14) : "",
    lines: [blankLine()],
    discountPct: 0,
    taxRate: 0,
    taxMode: "none",
    notes: "",
    terms: "",
  };
}

const STATUS_TONE: Record<string, string> = {
  draft: "border-line text-ink-faint",
  sent: "border-line text-ink-dim",
  accepted: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
  paid: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
  partial: "border-amber-500/40 text-amber-700 dark:text-amber-400",
  overdue: "border-red-500/40 text-red-600 dark:text-red-400",
  declined: "border-red-500/40 text-red-600 dark:text-red-400",
  expired: "border-line text-ink-faint",
  cancelled: "border-line text-ink-faint line-through",
};

const input =
  "w-full rounded-sm border border-line bg-page px-3 py-2 text-[0.875rem] outline-none transition-colors focus:border-brand";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.8125rem] font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[0.75rem] text-ink-faint">{hint}</span>}
    </label>
  );
}

export function BillingManager() {
  const [tab, setTab] = useState<"quotation" | "invoice" | "receivables">("invoice");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [payments, setPayments] = useState<Record<string, Payment[]>>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const [d, c] = await Promise.all([
      fetch("/api/admin/billing/docs", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/billing/clients", { cache: "no-store" }).then((r) => r.json()),
    ]);
    if (d.ok) setDocs(d.data as Doc[]);
    else setMsg({ kind: "err", text: d.error });
    if (c.ok) setClients(c.data as Client[]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function call(url: string, init?: RequestInit, done?: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(url, init);
      const json = await res.json();
      if (!json.ok) {
        const detail = Array.isArray(json.detail)
          ? json.detail.map((i: { message?: string }) => i.message).join(" · ")
          : "";
        throw new Error([json.error, detail].filter(Boolean).join(" — "));
      }
      if (done) setMsg({ kind: "ok", text: done });
      await load();
      return json.data;
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
      return null;
    } finally {
      setBusy(false);
    }
  }

  /* -------------------------------- Editor ------------------------------- */

  const dTotals = useMemo(
    () =>
      draft
        ? computeTotals(draft.lines, draft.discountPct, draft.taxRate, draft.taxMode)
        : null,
    [draft],
  );

  const setLine = (i: number, patch: Partial<Line>) =>
    setDraft((d) =>
      d ? { ...d, lines: d.lines.map((l, k) => (k === i ? { ...l, ...patch } : l)) } : d,
    );

  async function saveDraft() {
    if (!draft) return;
    const body = {
      kind: draft.kind,
      clientId: draft.clientId,
      issueDate: draft.issueDate,
      validUntil: draft.validUntil || "",
      dueDate: draft.dueDate || "",
      lines: draft.lines
        .filter((l) => l.description.trim())
        .map((l) => ({
          description: l.description.trim(),
          hsn: l.hsn ?? "",
          qty: Number(l.qty) || 0,
          unit: l.unit ?? "nos",
          rate: Number(l.rate) || 0,
          discountPct: Number(l.discountPct) || 0,
        })),
      discountPct: Number(draft.discountPct) || 0,
      taxRate: Number(draft.taxRate) || 0,
      taxMode: draft.taxMode,
      notes: draft.notes,
      terms: draft.terms,
    };
    const saved = await call(
      draft.id ? `/api/admin/billing/docs/${draft.id}` : "/api/admin/billing/docs",
      {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft.id ? { ...body, kind: undefined, clientId: undefined } : body),
      },
      draft.id ? "Saved." : undefined,
    );
    if (saved) {
      setMsg({ kind: "ok", text: `${saved.number} saved.` });
      setDraft(null);
    }
  }

  function editDoc(doc: Doc) {
    setDraft({
      id: doc.id,
      kind: doc.kind,
      clientId: doc.clientId ?? "",
      issueDate: doc.issueDate,
      validUntil: doc.validUntil ?? "",
      dueDate: doc.dueDate ?? "",
      lines: doc.lines.length ? doc.lines : [blankLine()],
      discountPct: doc.discountPct,
      taxRate: doc.taxRate,
      taxMode: doc.taxMode,
      notes: doc.notes ?? "",
      terms: doc.terms ?? "",
    });
    setOpen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* -------------------------------- Actions ------------------------------ */

  async function emailDoc(doc: Doc) {
    const to = window.prompt(
      `Email ${doc.number} to which address?`,
      doc.lastSentTo || doc.client.email || "",
    );
    if (!to) return;
    const note = window.prompt("Covering note (optional):", "") ?? "";
    await call(
      `/api/admin/billing/docs/${doc.id}/send`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message: note }),
      },
      `${doc.number} sent to ${to}.`,
    );
  }

  async function recordPayment(doc: Doc) {
    const raw = window.prompt(
      `Amount received against ${doc.number}.\nOutstanding: Rs. ${inrMoney(doc.balance)}`,
      String(doc.balance),
    );
    if (!raw) return;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMsg({ kind: "err", text: "That is not an amount." });
      return;
    }
    const method =
      window.prompt("Method — upi, neft, imps, rtgs, cash, cheque, card, other", "upi") ?? "upi";
    const reference = window.prompt("Reference / UTR (optional)", "") ?? "";
    await call(
      `/api/admin/billing/docs/${doc.id}/payments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, date: today(), method, reference }),
      },
      `Rs. ${inrMoney(amount)} recorded against ${doc.number}.`,
    );
    if (open === doc.id) await loadPayments(doc.id);
  }

  async function convert(doc: Doc) {
    if (!window.confirm(`Raise an invoice from ${doc.number}? The quotation stays as it is.`))
      return;
    const made = await call(`/api/admin/billing/docs/${doc.id}/convert`, { method: "POST" });
    if (made) {
      setMsg({ kind: "ok", text: `${made.number} created from ${doc.number}.` });
      setTab("invoice");
    }
  }

  async function removeDoc(doc: Doc) {
    if (!window.confirm(`Delete draft ${doc.number}? Its number is not reused.`)) return;
    await call(`/api/admin/billing/docs/${doc.id}`, { method: "DELETE" }, `${doc.number} deleted.`);
  }

  const loadPayments = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/billing/docs/${id}/payments`, { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setPayments((p) => ({ ...p, [id]: json.data as Payment[] }));
  }, []);

  function toggle(doc: Doc) {
    const next = open === doc.id ? null : doc.id;
    setOpen(next);
    if (next && doc.kind === "invoice" && !payments[doc.id]) void loadPayments(doc.id);
  }

  /* --------------------------------- Views ------------------------------- */

  const shown = useMemo(() => {
    if (tab === "receivables")
      return docs.filter(
        (d) => d.kind === "invoice" && d.balance > 0 && !["draft", "cancelled"].includes(d.status),
      );
    return docs.filter((d) => d.kind === tab);
  }, [docs, tab]);

  const outstanding = useMemo(
    () =>
      docs
        .filter((d) => d.kind === "invoice" && !["draft", "cancelled"].includes(d.status))
        .reduce((sum, d) => sum + d.balance, 0),
    [docs],
  );
  const overdue = useMemo(
    () => docs.filter((d) => d.status === "overdue").reduce((s, d) => s + d.balance, 0),
    [docs],
  );

  const clientLabel = (c: Client) => `${c.company || c.name}${c.company ? ` — ${c.name}` : ""}`;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label className="mb-1.5">Billing</Label>
          <h2 className="t-h3">Quotations &amp; invoices</h2>
        </div>
        {!draft && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDraft(blankDraft("quotation"))}>
              + Quotation
            </Button>
            <Button variant="primary" onClick={() => setDraft(blankDraft("invoice"))}>
              + Invoice
            </Button>
          </div>
        )}
      </div>

      {msg && (
        <p
          className={cn(
            "rounded-sm border px-4 py-3 text-[0.875rem]",
            msg.kind === "ok"
              ? "border-brand/30 bg-tint text-ink-dim"
              : "border-red-500/40 text-red-600 dark:text-red-400",
          )}
        >
          {msg.text}
        </p>
      )}

      {/* ------------------------------ Editor ------------------------------ */}
      {draft && dTotals && (
        <Card raised className="p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="t-h3">
              {draft.id ? "Edit" : "New"} {draft.kind === "quotation" ? "quotation" : "invoice"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>
              Close
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field
              label="Client *"
              hint={draft.id ? "Locked — a document records who it was addressed to." : undefined}
            >
              <select
                className={input}
                value={draft.clientId}
                disabled={Boolean(draft.id)}
                onChange={(e) => setDraft({ ...draft, clientId: e.target.value })}
              >
                <option value="">Choose…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {clientLabel(c)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Issue date">
              <input
                type="date"
                className={input}
                value={draft.issueDate}
                onChange={(e) => setDraft({ ...draft, issueDate: e.target.value })}
              />
            </Field>
            {draft.kind === "quotation" ? (
              <Field label="Valid until">
                <input
                  type="date"
                  className={input}
                  value={draft.validUntil}
                  onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })}
                />
              </Field>
            ) : (
              <Field label="Due date">
                <input
                  type="date"
                  className={input}
                  value={draft.dueDate}
                  onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
                />
              </Field>
            )}
          </div>

          <Rule className="my-6" />

          {/* Lines */}
          <div className="mb-2 hidden gap-2 px-1 text-[0.6875rem] tracking-[0.08em] text-ink-faint uppercase md:grid md:grid-cols-[minmax(0,1fr)_5rem_4rem_7rem_4rem_7rem_1.5rem]">
            <span>Description</span>
            <span>SAC/HSN</span>
            <span>Qty</span>
            <span>Unit / Rate</span>
            <span>Disc %</span>
            <span className="text-right">Amount</span>
            <span />
          </div>

          <div className="grid gap-3">
            {draft.lines.map((l, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-sm border border-line p-3 md:grid-cols-[minmax(0,1fr)_5rem_4rem_7rem_4rem_7rem_1.5rem] md:items-center md:border-0 md:p-0 md:[&>*]:min-w-0"
              >
                <input
                  className={input}
                  placeholder="What you are charging for"
                  value={l.description}
                  onChange={(e) => setLine(i, { description: e.target.value })}
                />
                <input
                  className={input}
                  placeholder="SAC"
                  value={l.hsn ?? ""}
                  onChange={(e) => setLine(i, { hsn: e.target.value })}
                />
                <input
                  className={input}
                  type="number"
                  min={0}
                  step="any"
                  value={l.qty}
                  onChange={(e) => setLine(i, { qty: Number(e.target.value) })}
                />
                <div className="grid min-w-0 gap-1">
                  <input
                    className={input}
                    placeholder="unit"
                    value={l.unit ?? ""}
                    onChange={(e) => setLine(i, { unit: e.target.value })}
                  />
                  <input
                    className={input}
                    type="number"
                    min={0}
                    step="any"
                    value={l.rate}
                    onChange={(e) => setLine(i, { rate: Number(e.target.value) })}
                  />
                </div>
                <input
                  className={input}
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={l.discountPct}
                  onChange={(e) => setLine(i, { discountPct: Number(e.target.value) })}
                />
                <span className="text-right text-[0.875rem] tabular-nums">
                  {inrMoney(dTotals.lineTotals[i] ?? 0)}
                </span>
                <button
                  type="button"
                  aria-label="Remove line"
                  className="justify-self-end px-2 text-ink-faint hover:text-brand-ink"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      lines: draft.lines.length > 1
                        ? draft.lines.filter((_, k) => k !== i)
                        : [blankLine()],
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => setDraft({ ...draft, lines: [...draft.lines, blankLine()] })}
          >
            + Add line
          </Button>

          <Rule className="my-6" />

          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
            <div className="grid gap-5">
              <Field label="Notes" hint="Printed on the document, under the total.">
                <textarea
                  className={cn(input, "resize-y")}
                  rows={3}
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                />
              </Field>
              <Field label="Terms">
                <textarea
                  className={cn(input, "resize-y")}
                  rows={3}
                  value={draft.terms}
                  onChange={(e) => setDraft({ ...draft, terms: e.target.value })}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Overall discount %">
                  <input
                    className={input}
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    value={draft.discountPct}
                    onChange={(e) => setDraft({ ...draft, discountPct: Number(e.target.value) })}
                  />
                </Field>
                {/* Dormant until the business registers. Left in place so that
                    switching on GST later is a setting, not a rebuild. */}
                <Field label="Tax" hint="Leave at none while not GST registered.">
                  <select
                    className={input}
                    value={draft.taxMode}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        taxMode: e.target.value as Draft["taxMode"],
                      })
                    }
                  >
                    <option value="none">None</option>
                    <option value="cgst_sgst">CGST + SGST</option>
                    <option value="igst">IGST</option>
                  </select>
                </Field>
                <Field label="Tax rate %">
                  <input
                    className={input}
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    disabled={draft.taxMode === "none"}
                    value={draft.taxRate}
                    onChange={(e) => setDraft({ ...draft, taxRate: Number(e.target.value) })}
                  />
                </Field>
              </div>
            </div>

            <Card className="h-fit p-5">
              <dl className="grid gap-2 text-[0.875rem]">
                <div className="flex justify-between">
                  <dt className="text-ink-dim">Subtotal</dt>
                  <dd className="tabular-nums">{inrMoney(dTotals.subtotal)}</dd>
                </div>
                {dTotals.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink-dim">Discount</dt>
                    <dd className="tabular-nums">−{inrMoney(dTotals.discount)}</dd>
                  </div>
                )}
                {dTotals.tax > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink-dim">Tax</dt>
                    <dd className="tabular-nums">{inrMoney(dTotals.tax)}</dd>
                  </div>
                )}
                {dTotals.roundOff !== 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink-dim">Round off</dt>
                    <dd className="tabular-nums">{inrMoney(dTotals.roundOff)}</dd>
                  </div>
                )}
                <Rule className="my-1" />
                <div className="flex justify-between font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums text-brand-ink">Rs. {inrMoney(dTotals.total)}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={saveDraft}
              disabled={
                busy ||
                !draft.clientId ||
                !draft.lines.some((l) => l.description.trim())
              }
            >
              {busy ? "Saving…" : draft.id ? "Save changes" : "Create"}
            </Button>
            {draft.id && (
              <a
                className="inline-flex items-center text-[0.8125rem] text-ink-dim underline underline-offset-4 hover:text-brand-ink"
                href={`/api/admin/billing/docs/${draft.id}/pdf`}
                target="_blank"
                rel="noreferrer"
              >
                Preview PDF
              </a>
            )}
          </div>
        </Card>
      )}

      {/* ------------------------------- Tabs ------------------------------- */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["invoice", "Invoices"],
            ["quotation", "Quotations"],
            ["receivables", "Receivables"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors",
              tab === k ? "border-ink bg-ink text-page" : "border-line text-ink-dim",
            )}
          >
            {label}
          </button>
        ))}
        {tab === "receivables" && (
          <span className="ml-auto text-[0.8125rem] text-ink-dim">
            Outstanding <strong className="text-ink">Rs. {inrMoney(outstanding)}</strong>
            {overdue > 0 && (
              <>
                {" · "}
                <span className="text-red-600 dark:text-red-400">
                  overdue Rs. {inrMoney(overdue)}
                </span>
              </>
            )}
          </span>
        )}
      </div>

      {/* ------------------------------- List ------------------------------- */}
      {loading ? (
        <p className="text-[0.875rem] text-ink-faint">Loading…</p>
      ) : shown.length === 0 ? (
        <Card className="p-6 text-[0.875rem] text-ink-dim">
          {tab === "receivables"
            ? "Nothing outstanding. Every issued invoice is settled."
            : `No ${tab === "invoice" ? "invoices" : "quotations"} yet.`}
        </Card>
      ) : (
        <div className="grid gap-3">
          {shown.map((doc) => (
            <Card key={doc.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <button
                  type="button"
                  className="min-w-0 text-left"
                  onClick={() => toggle(doc)}
                  aria-expanded={open === doc.id}
                >
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    <span className="font-mono text-[0.875rem]">{doc.number}</span>
                    <Chip className={STATUS_TONE[doc.status] ?? ""}>{doc.status}</Chip>
                    {doc.convertedToId && <Chip>invoiced</Chip>}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-ink-dim">
                    {doc.client.company || doc.client.name} · {doc.issueDate}
                    {doc.kind === "invoice" && doc.dueDate ? ` · due ${doc.dueDate}` : ""}
                  </p>
                </button>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">Rs. {inrMoney(doc.totals.total)}</p>
                  {doc.kind === "invoice" && doc.paid > 0 && (
                    <p className="mt-0.5 text-[0.8125rem] text-ink-dim tabular-nums">
                      paid {inrMoney(doc.paid)} · due {inrMoney(doc.balance)}
                    </p>
                  )}
                </div>
              </div>

              {open === doc.id && (
                <>
                  <Rule className="my-4" />
                  <ul className="mb-4 grid gap-1.5 text-[0.8125rem]">
                    {doc.lines.map((l, i) => (
                      <li key={i} className="flex justify-between gap-4">
                        <span className="min-w-0 text-ink-dim">
                          {l.description}{" "}
                          <span className="text-ink-faint">
                            ({l.qty} {l.unit} × {inrMoney(l.rate)})
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                          {inrMoney(doc.totals.lineTotals[i] ?? 0)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {doc.kind === "invoice" && (payments[doc.id]?.length ?? 0) > 0 && (
                    <div className="mb-4">
                      <Label className="mb-2" tick={false}>
                        Payments
                      </Label>
                      <ul className="grid gap-1.5 text-[0.8125rem]">
                        {payments[doc.id].map((p) => (
                          <li key={p.id} className="flex justify-between gap-4">
                            <span className="text-ink-dim">
                              {p.date} · {p.method}
                              {p.reference ? ` · ${p.reference}` : ""}
                            </span>
                            <span className="tabular-nums">{inrMoney(p.amount)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {doc.sentAt && (
                    <p className="mb-4 text-[0.75rem] text-ink-faint">
                      Last emailed to {doc.lastSentTo} on{" "}
                      {new Date(doc.sentAt).toLocaleString("en-IN")}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <a
                      className="inline-flex items-center rounded-sm border border-line px-3 py-1.5 text-[0.8125rem] hover:border-line-strong"
                      href={`/api/admin/billing/docs/${doc.id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Preview
                    </a>
                    <a
                      className="inline-flex items-center rounded-sm border border-line px-3 py-1.5 text-[0.8125rem] hover:border-line-strong"
                      href={`/api/admin/billing/docs/${doc.id}/pdf?download=1`}
                    >
                      Download PDF
                    </a>
                    <Button variant="outline" size="sm" onClick={() => emailDoc(doc)} disabled={busy}>
                      Email
                    </Button>
                    {doc.kind === "invoice" && doc.balance > 0 && doc.status !== "cancelled" && (
                      <Button variant="primary" size="sm" onClick={() => recordPayment(doc)} disabled={busy}>
                        Record payment
                      </Button>
                    )}
                    {doc.kind === "quotation" && !doc.convertedToId && (
                      <Button variant="outline" size="sm" onClick={() => convert(doc)} disabled={busy}>
                        Raise invoice
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => editDoc(doc)}>
                      Edit
                    </Button>
                    {doc.status === "draft" && (
                      <Button variant="ghost" size="sm" onClick={() => removeDoc(doc)} disabled={busy}>
                        Delete
                      </Button>
                    )}
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
