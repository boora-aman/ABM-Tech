"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Chip, Rule } from "@/components/ui/Panel";
import { computeTotals, inrMoney, type Line } from "@/lib/billing";
import type { Client } from "@/components/admin/ClientManager";
import { clausesFor, presetIdsFor } from "@/lib/billing-terms";
import { presetSections, isLongForm, type Section } from "@/lib/billing-sections";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { services } from "@/lib/content/services";
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

type DocKind = "quotation" | "invoice" | "proposal" | "agreement";

type Doc = {
  id: string;
  kind: DocKind;
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
  sections?: Section[];
  sowRef?: string;
  termsIds?: string[];
  customTerms?: string;
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
  /** Receipt number, ABM/RCT/26-27/001. */
  number?: string;
  receiptSentAt?: string;
  receiptSentTo?: string;
};

type PayForm = {
  docId: string;
  amount: string;
  date: string;
  method: string;
  reference: string;
  note: string;
  sendReceipt: boolean;
  emailTo: string;
};

const METHODS: [string, string][] = [
  ["upi", "UPI"],
  ["neft", "NEFT"],
  ["imps", "IMPS"],
  ["rtgs", "RTGS"],
  ["cash", "Cash"],
  ["cheque", "Cheque"],
  ["card", "Card"],
  ["other", "Other"],
];
const methodLabel = (m: string) => METHODS.find(([k]) => k === m)?.[1] ?? m;

type Draft = {
  id?: string;
  kind: DocKind;
  clientId: string;
  issueDate: string;
  validUntil: string;
  dueDate: string;
  lines: Line[];
  discountPct: number;
  taxRate: number;
  taxMode: "none" | "cgst_sgst" | "igst";
  notes: string;
  sections: Section[];
  sowRef: string;
  termsIds: string[];
  customTerms: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

/* A short list beats a free-text box: "nos"/"Nos"/"no.s" across three
   invoices looks careless on a document somebody files. */
const UNITS = ["nos", "hour", "day", "week", "month", "year", "page", "licence", "lot"];

const blankLine = (): Line => ({ description: "", qty: 1, unit: "nos", rate: 0, discountPct: 0 });

const KIND_LABEL: Record<DocKind, string> = {
  quotation: "quotation",
  invoice: "invoice",
  proposal: "proposal",
  agreement: "service agreement",
};

function blankDraft(kind: DocKind): Draft {
  return {
    kind,
    clientId: "",
    issueDate: today(),
    validUntil: kind === "quotation" || kind === "proposal" ? plusDays(15) : "",
    dueDate: kind === "invoice" ? plusDays(14) : "",
    /* An agreement carries no price. Starting it with an empty line would put
       a stray zero-rupee row on a contract. */
    lines: kind === "agreement" ? [] : [blankLine()],
    discountPct: 0,
    taxRate: 0,
    taxMode: "none",
    notes: "",
    sections: isLongForm(kind) ? presetSections(kind) : [],
    sowRef: "",
    /* An agreement states its own terms in full, as numbered clauses. Bolting
       the short-form terms list onto the end of it would say the same things
       twice, in two voices. */
    termsIds: kind === "agreement" ? [] : presetIdsFor(kind === "proposal" ? "quotation" : kind),
    customTerms: "",
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
  const [tab, setTab] = useState<DocKind | "receivables">("invoice");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  /* Whether a GSTIN is configured. It decides two things in here: the SAC/HSN
     column and the tax controls. Both are meaningless without a registration
     and were the clutter in the line editor. */
  const [gstOn, setGstOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [payForm, setPayForm] = useState<PayForm | null>(null);
  const [payments, setPayments] = useState<Record<string, Payment[]>>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const [d, c, site] = await Promise.all([
      fetch("/api/admin/billing/docs", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/billing/clients", { cache: "no-store" }).then((r) => r.json()),
      /* Tolerated failure: without a database this returns 503, and a missing
         GSTIN is exactly the "not registered" case anyway. */
      fetch("/api/admin/site", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => ({ ok: false })),
    ]);
    if (d.ok) setDocs(d.data as Doc[]);
    else setMsg({ kind: "err", text: d.error });
    if (c.ok) setClients(c.data as Client[]);
    setGstOn(Boolean(site?.ok && (site.data as { gstin?: string })?.gstin));
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

  /* One template for the header and every row, so they cannot drift apart
     when the SAC column appears. */
  const cols = gstOn
    ? "md:grid-cols-[minmax(0,1fr)_5rem_3.5rem_5.5rem_6rem_4rem_7rem_1.5rem]"
    : "md:grid-cols-[minmax(0,1fr)_3.5rem_5.5rem_6rem_4rem_7rem_1.5rem]";

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
      sections: draft.sections,
      sowRef: draft.sowRef,
      termsIds: draft.termsIds,
      customTerms: draft.customTerms,
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
      lines: doc.lines.length || doc.kind === "agreement" ? doc.lines : [blankLine()],
      discountPct: doc.discountPct,
      taxRate: doc.taxRate,
      taxMode: doc.taxMode,
      notes: doc.notes ?? "",
      sections: doc.sections ?? [],
      sowRef: doc.sowRef ?? "",
      termsIds: doc.termsIds ?? [],
      customTerms: doc.customTerms ?? "",
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

  /* A form, not a chain of browser prompts. Three prompts in a row gave no
     way to see the outstanding balance while typing the amount, no way to
     pick a method except by spelling it, and no way back from a typo short
     of cancelling and starting again. */
  function recordPayment(doc: Doc) {
    setOpen(doc.id);
    if (!payments[doc.id]) void loadPayments(doc.id);
    setPayForm({
      docId: doc.id,
      amount: String(doc.balance),
      date: today(),
      method: "upi",
      reference: "",
      note: "",
      sendReceipt: Boolean(doc.client.email),
      emailTo: doc.client.email ?? "",
    });
  }

  async function submitPayment(doc: Doc) {
    if (!payForm) return;
    const amount = Number(payForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMsg({ kind: "err", text: "Enter the amount received." });
      return;
    }
    /* Overpayment is allowed — it happens — but never by accident. */
    if (
      amount > doc.balance + 0.005 &&
      !window.confirm(
        `Rs. ${inrMoney(amount)} is more than the Rs. ${inrMoney(doc.balance)} still due on ${doc.number}. Record it anyway?`,
      )
    )
      return;

    const made = await call(
      `/api/admin/billing/docs/${doc.id}/payments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          date: payForm.date,
          method: payForm.method,
          reference: payForm.reference,
          note: payForm.note,
        }),
      },
    );
    if (!made) return;

    const paymentId = (made as { paymentId?: string }).paymentId;
    let text = `Rs. ${inrMoney(amount)} recorded against ${doc.number}.`;

    /* Sending is a second step on purpose. If email fails the payment is
       still recorded — money that arrived must never be lost because a mail
       server was down — and the receipt can be sent again from the list. */
    if (payForm.sendReceipt && payForm.emailTo.trim() && paymentId) {
      const res = await fetch(`/api/admin/billing/docs/${doc.id}/payments/${paymentId}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: payForm.emailTo.trim() }),
      });
      const json = await res.json().catch(() => ({ ok: false, error: "No response." }));
      text += json.ok
        ? ` Receipt ${json.data.number} emailed to ${payForm.emailTo.trim()}.`
        : ` The receipt was NOT emailed: ${json.error} You can send it from the payment list.`;
      setMsg({ kind: json.ok ? "ok" : "err", text });
    } else {
      setMsg({ kind: "ok", text });
    }

    setPayForm(null);
    await loadPayments(doc.id);
  }

  async function emailReceipt(doc: Doc, p: Payment) {
    const to = window.prompt(
      `Email receipt ${p.number ?? ""} to which address?`,
      p.receiptSentTo || doc.client.email || "",
    );
    if (!to) return;
    const sent = await call(
      `/api/admin/billing/docs/${doc.id}/payments/${p.id}/receipt`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      },
    );
    if (sent) {
      setMsg({ kind: "ok", text: `Receipt ${(sent as { number: string }).number} emailed to ${to}.` });
      await loadPayments(doc.id);
    }
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
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setDraft(blankDraft("agreement"))}>
              + Agreement
            </Button>
            <Button variant="outline" onClick={() => setDraft(blankDraft("proposal"))}>
              + Proposal
            </Button>
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
              {draft.id ? "Edit" : "New"} {KIND_LABEL[draft.kind]}
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
            {draft.kind === "agreement" ? (
              <Field label="Against quotation / project" hint="Optional. Printed in the agreement details.">
                <input
                  className={input}
                  value={draft.sowRef}
                  onChange={(e) => setDraft({ ...draft, sowRef: e.target.value })}
                />
              </Field>
            ) : draft.kind === "quotation" || draft.kind === "proposal" ? (
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
          {draft.kind !== "agreement" && (
          <>
          <div
            className={cn(
              "mb-2 hidden gap-2 px-1 text-[0.6875rem] tracking-[0.08em] text-ink-faint uppercase md:grid",
              cols,
            )}
          >
            <span>Description</span>
            {gstOn && <span>SAC/HSN</span>}
            <span>Qty</span>
            <span>Unit</span>
            <span>Rate</span>
            <span>Disc %</span>
            <span className="text-right">Amount</span>
            <span />
          </div>

          <div className="grid gap-3">
            {draft.lines.map((l, i) => (
              <div
                key={i}
                className={cn(
                  "grid gap-2 rounded-sm border border-line p-3 md:items-center md:border-0 md:p-0 md:[&>*]:min-w-0",
                  cols,
                )}
              >
                <input
                  className={input}
                  placeholder="What you are charging for"
                  value={l.description}
                  onChange={(e) => setLine(i, { description: e.target.value })}
                />
                {gstOn && (
                  <input
                    className={input}
                    placeholder="SAC"
                    value={l.hsn ?? ""}
                    onChange={(e) => setLine(i, { hsn: e.target.value })}
                  />
                )}
                <input
                  className={input}
                  type="number"
                  min={0}
                  step="any"
                  aria-label="Quantity"
                  value={l.qty}
                  onChange={(e) => setLine(i, { qty: Number(e.target.value) })}
                />
                <select
                  className={input}
                  aria-label="Unit"
                  value={l.unit ?? "nos"}
                  onChange={(e) => setLine(i, { unit: e.target.value })}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <input
                  className={input}
                  type="number"
                  min={0}
                  step="any"
                  aria-label="Rate"
                  value={l.rate}
                  onChange={(e) => setLine(i, { rate: Number(e.target.value) })}
                />
                <input
                  className={input}
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  aria-label="Discount percent"
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

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDraft({ ...draft, lines: [...draft.lines, blankLine()] })}
            >
              + Add line
            </Button>

            {/* The catalogue is the site's own services file, not a second
                price list. Two lists of prices drift, and the one on the
                invoice is the one the client holds you to. */}
            <select
              className={cn(input, "w-auto max-w-full")}
              value=""
              aria-label="Add a line from the service catalogue"
              onChange={(e) => {
                const svc = services.find((x) => x.slug === e.target.value);
                if (!svc) return;
                const next: Line = {
                  description: `${svc.title} — ${svc.summary}`,
                  qty: 1,
                  unit: svc.priceMode === "retainer" ? "month" : "nos",
                  rate: svc.from,
                  discountPct: 0,
                };
                const lines = draft.lines.filter((l) => l.description.trim());
                setDraft({ ...draft, lines: [...lines, next] });
              }}
            >
              <option value="">+ From catalogue…</option>
              {services.map((svc) => (
                <option key={svc.slug} value={svc.slug}>
                  {svc.title}
                  {svc.from ? ` — from ${inrMoney(svc.from)}` : " — on request"}
                  {svc.priceMode === "retainer" ? "/mo" : ""}
                </option>
              ))}
            </select>
          </div>
          </>
          )}

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
              {isLongForm(draft.kind) && (
                <SectionEditor
                  kind={draft.kind as "proposal" | "agreement"}
                  sections={draft.sections}
                  onChange={(sections) => setDraft({ ...draft, sections })}
                />
              )}

              {/* Terms are ticked, not typed. Retyping them is how two
                  documents end up promising different things about the same
                  work. The text is composed server-side from what is ticked.
                  An agreement states its terms as full clauses instead. */}
              {draft.kind !== "agreement" && (
              <>
              <fieldset className="grid gap-2.5">
                <legend className="mb-1.5 text-[0.8125rem] font-medium">
                  Terms &amp; conditions
                </legend>
                {clausesFor(draft.kind === "proposal" ? "quotation" : draft.kind as "quotation" | "invoice").map((c) => {
                  const on = draft.termsIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-sm border p-3 transition-colors",
                        on ? "border-brand/40 bg-tint" : "border-line hover:border-line-strong",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]"
                        checked={on}
                        onChange={() =>
                          setDraft({
                            ...draft,
                            termsIds: on
                              ? draft.termsIds.filter((x) => x !== c.id)
                              : [...draft.termsIds, c.id],
                          })
                        }
                      />
                      <span className="min-w-0">
                        <span className="block text-[0.8125rem] font-medium">{c.label}</span>
                        <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-ink-dim">
                          {c.text}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              <Field
                label="Anything else"
                hint="Added as the last numbered term. Leave empty if the ticked clauses cover it."
              >
                <textarea
                  className={cn(input, "resize-y")}
                  rows={2}
                  value={draft.customTerms}
                  onChange={(e) => setDraft({ ...draft, customTerms: e.target.value })}
                />
              </Field>
              </>
              )}

              {draft.kind !== "agreement" && (
              <div className={cn("grid gap-5", gstOn ? "sm:grid-cols-3" : "sm:grid-cols-1")}>
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

                {/* The tax controls appear only once a GSTIN is configured.
                    Charging tax without a registration is not a thing you
                    should be one stray click away from doing, and the two
                    dropdowns were the bulk of the clutter in here. The
                    arithmetic underneath is unchanged and already handles
                    CGST/SGST and IGST. */}
                {gstOn ? (
                  <>
                    <Field label="Tax">
                      <select
                        className={input}
                        value={draft.taxMode}
                        onChange={(e) =>
                          setDraft({ ...draft, taxMode: e.target.value as Draft["taxMode"] })
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
                  </>
                ) : null}
              </div>
              )}
            </div>

            {draft.kind !== "agreement" ? (
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
            ) : (
              <Card className="h-fit p-5">
                <p className="text-[0.8125rem] leading-relaxed text-ink-dim">
                  An agreement carries no price. The money lives in the
                  quotation or proposal it sits on top of, and this document
                  governs how the work is run.
                </p>
              </Card>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={saveDraft}
              disabled={
                busy ||
                !draft.clientId ||
                (draft.kind !== "agreement" &&
                  !draft.lines.some((l) => l.description.trim()))
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
            ["proposal", "Proposals"],
            ["agreement", "Agreements"],
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
            : `No ${KIND_LABEL[tab as DocKind]}s yet.`}
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
                  {doc.kind === "agreement" ? (
                    <p className="text-[0.8125rem] text-ink-faint">no price</p>
                  ) : (
                    <p className="font-semibold tabular-nums">Rs. {inrMoney(doc.totals.total)}</p>
                  )}
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
                  {(doc.sections?.length ?? 0) > 0 && (
                    <p className="mb-3 text-[0.8125rem] text-ink-dim">
                      {doc.sections!.length} sections ·{" "}
                      {doc.sections!.map((x) => x.heading).join(" · ")}
                    </p>
                  )}
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
                        Payments &amp; receipts
                      </Label>
                      <ul className="grid gap-2 text-[0.8125rem]">
                        {payments[doc.id].map((p) => (
                          <li
                            key={p.id}
                            className="grid gap-2 rounded-sm border border-line px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                          >
                            <div className="min-w-0">
                              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                <span className="font-mono text-[0.8125rem]">
                                  {p.number ?? "receipt no. on first view"}
                                </span>
                                <span className="font-semibold tabular-nums">
                                  Rs. {inrMoney(p.amount)}
                                </span>
                              </p>
                              <p className="mt-0.5 text-[0.75rem] text-ink-dim">
                                {p.date} · {methodLabel(p.method)}
                                {p.reference ? ` · ${p.reference}` : ""}
                                {p.receiptSentTo
                                  ? ` · receipt emailed to ${p.receiptSentTo}`
                                  : ""}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              <a
                                className="inline-flex items-center rounded-sm border border-line px-2.5 py-1 text-[0.75rem] hover:border-line-strong"
                                href={`/api/admin/billing/docs/${doc.id}/payments/${p.id}/receipt`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Receipt
                              </a>
                              <a
                                className="inline-flex items-center rounded-sm border border-line px-2.5 py-1 text-[0.75rem] hover:border-line-strong"
                                href={`/api/admin/billing/docs/${doc.id}/payments/${p.id}/receipt?download=1`}
                              >
                                Download
                              </a>
                              <button
                                type="button"
                                className="inline-flex items-center rounded-sm border border-line px-2.5 py-1 text-[0.75rem] hover:border-line-strong disabled:opacity-50"
                                onClick={() => emailReceipt(doc, p)}
                                disabled={busy}
                              >
                                {p.receiptSentAt ? "Email again" : "Email"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {payForm?.docId === doc.id && (
                    <Card raised className="mb-4 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[0.875rem] font-medium">
                          Record payment against {doc.number}
                        </p>
                        <span className="text-[0.75rem] text-ink-dim">
                          Still due Rs. {inrMoney(doc.balance)}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <Field label="Amount received">
                          <input
                            className={input}
                            type="number"
                            min={0}
                            step="any"
                            inputMode="decimal"
                            value={payForm.amount}
                            onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                          />
                        </Field>
                        <Field label="Date received">
                          <input
                            className={input}
                            type="date"
                            value={payForm.date}
                            onChange={(e) => setPayForm({ ...payForm, date: e.target.value })}
                          />
                        </Field>
                        <Field label="Method">
                          <select
                            className={input}
                            value={payForm.method}
                            onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                          >
                            {METHODS.map(([k, label]) => (
                              <option key={k} value={k}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      {/* Quick picks for the two amounts that are almost always
                          the answer: the whole balance, or half of it. */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[
                          ["Full balance", doc.balance],
                          ["Half", Math.round(doc.balance / 2)],
                        ].map(([label, v]) => (
                          <button
                            key={String(label)}
                            type="button"
                            className="rounded-full border border-line px-2.5 py-0.5 text-[0.75rem] text-ink-dim hover:border-line-strong"
                            onClick={() => setPayForm({ ...payForm, amount: String(v) })}
                          >
                            {label} · {inrMoney(Number(v))}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <Field label="Reference / UTR / cheque no.">
                          <input
                            className={input}
                            value={payForm.reference}
                            onChange={(e) => setPayForm({ ...payForm, reference: e.target.value })}
                          />
                        </Field>
                        <Field label="Note on the receipt" hint="Optional. Printed on the receipt.">
                          <input
                            className={input}
                            value={payForm.note}
                            onChange={(e) => setPayForm({ ...payForm, note: e.target.value })}
                          />
                        </Field>
                      </div>

                      <label className="mt-3 flex items-center gap-2.5 text-[0.8125rem]">
                        <input
                          type="checkbox"
                          className="size-4 accent-[var(--color-brand)]"
                          checked={payForm.sendReceipt}
                          onChange={(e) => setPayForm({ ...payForm, sendReceipt: e.target.checked })}
                        />
                        Email the receipt to
                        <input
                          className={cn(input, "w-auto min-w-0 flex-1")}
                          type="email"
                          value={payForm.emailTo}
                          disabled={!payForm.sendReceipt}
                          onChange={(e) => setPayForm({ ...payForm, emailTo: e.target.value })}
                        />
                      </label>

                      {(() => {
                        const a = Number(payForm.amount);
                        if (!Number.isFinite(a) || a <= 0) return null;
                        const left = Math.max(0, doc.balance - a);
                        return (
                          <p className="mt-3 text-[0.75rem] text-ink-dim">
                            {left <= 0.005
                              ? "This settles the invoice. The receipt will say paid in full."
                              : `Part payment. Rs. ${inrMoney(left)} will still be due after this.`}
                          </p>
                        );
                      })()}

                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => submitPayment(doc)}
                          disabled={busy}
                        >
                          {busy ? "Saving…" : "Record payment"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setPayForm(null)}>
                          Cancel
                        </Button>
                      </div>
                    </Card>
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
                    {doc.kind === "invoice" &&
                      doc.balance > 0 &&
                      doc.status !== "cancelled" &&
                      payForm?.docId !== doc.id && (
                      <Button variant="primary" size="sm" onClick={() => recordPayment(doc)} disabled={busy}>
                        Record payment
                      </Button>
                    )}
                    {(doc.kind === "quotation" || doc.kind === "proposal") &&
                      !doc.convertedToId && (
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
