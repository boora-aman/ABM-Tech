"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Chip } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/* ==========================================================================
   CLIENTS

   The address book behind quotations and invoices. Editing a client here
   changes who the NEXT document is addressed to — documents already issued
   keep the snapshot they were created with, which is why an old invoice still
   shows the old office.

   Archiving rather than deleting: a client with billing history is a record.
   ========================================================================== */

export type Client = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  gstin?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  archived?: boolean;
};

const BLANK: Client = { id: "", name: "", country: "India" };

const input =
  "w-full rounded-sm border border-line bg-page px-3 py-2 text-[0.875rem] outline-none transition-colors focus:border-brand";

function Text({
  label,
  value,
  onChange,
  hint,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.8125rem] font-medium">{label}</span>
      <input
        className={input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {hint && <span className="mt-1 block text-[0.75rem] text-ink-faint">{hint}</span>}
    </label>
  );
}

export function ClientManager() {
  const [rows, setRows] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Client | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/billing/clients", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setRows(json.data as Client[]);
    else setMsg({ kind: "err", text: json.error });
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

  async function save() {
    if (!draft) return;
    setBusy(true);
    setMsg(null);
    try {
      const editing = Boolean(draft.id);
      const { id, ...body } = draft;
      const res = await fetch(
        editing ? `/api/admin/billing/clients?id=${encodeURIComponent(id)}` : "/api/admin/billing/clients",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const json = await res.json();
      if (!json.ok) {
        const detail = Array.isArray(json.detail)
          ? json.detail.map((i: { message?: string }) => i.message).join(" · ")
          : "";
        throw new Error([json.error, detail].filter(Boolean).join(" — "));
      }
      setMsg({ kind: "ok", text: `${draft.company || draft.name} saved.` });
      setDraft(null);
      await load();
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function archive(c: Client) {
    if (!window.confirm(`Archive ${c.company || c.name}? Their documents stay exactly as they are.`))
      return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/billing/clients?id=${encodeURIComponent(c.id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setMsg({ kind: "ok", text: `${c.company || c.name} archived.` });
      await load();
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof Client) => (v: string) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label className="mb-1.5">Billing</Label>
          <h2 className="t-h3">Clients</h2>
        </div>
        {!draft && (
          <Button variant="primary" onClick={() => setDraft({ ...BLANK })}>
            + Add client
          </Button>
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

      {draft && (
        <Card raised className="p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="t-h3">{draft.id ? "Edit client" : "New client"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>
              Close
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Text label="Contact name *" value={draft.name} onChange={set("name")} />
            <Text label="Company" value={draft.company ?? ""} onChange={set("company")} />
            <Text label="Email" type="email" value={draft.email ?? ""} onChange={set("email")}
              hint="Where quotations and invoices are sent." />
            <Text label="Phone" value={draft.phone ?? ""} onChange={set("phone")} />
            <Text label="Address line 1" value={draft.line1 ?? ""} onChange={set("line1")} />
            <Text label="Address line 2" value={draft.line2 ?? ""} onChange={set("line2")} />
            <Text label="City" value={draft.city ?? ""} onChange={set("city")} />
            <Text label="State" value={draft.state ?? ""} onChange={set("state")} />
            <Text label="PIN code" value={draft.postalCode ?? ""} onChange={set("postalCode")} />
            <Text label="Country" value={draft.country ?? ""} onChange={set("country")} />
            <Text label="Client GSTIN" value={draft.gstin ?? ""} onChange={set("gstin")}
              hint="Only if they have one. Yours is separate, under Business details." />
            <Text label="Internal notes" value={draft.notes ?? ""} onChange={set("notes")}
              hint="Never printed on a document." />
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="primary" onClick={save} disabled={busy || !draft.name.trim()}>
              {busy ? "Saving…" : draft.id ? "Save changes" : "Add client"}
            </Button>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-[0.875rem] text-ink-faint">Loading…</p>
      ) : rows.length === 0 ? (
        <Card className="p-6 text-[0.875rem] text-ink-dim">
          No clients yet. Add one before raising a quotation.
        </Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((c) => (
            <Card key={c.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="font-medium">
                  {c.company || c.name}
                  {c.company && (
                    <span className="ml-2 text-[0.8125rem] font-normal text-ink-dim">{c.name}</span>
                  )}
                </p>
                <p className="mt-1 text-[0.8125rem] text-ink-dim">
                  {[c.email, c.phone, [c.city, c.state].filter(Boolean).join(", ")]
                    .filter(Boolean)
                    .join(" · ") || "No contact details"}
                </p>
                {c.gstin && <Chip className="mt-2">GSTIN {c.gstin}</Chip>}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => setDraft(c)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => archive(c)} disabled={busy}>
                  Archive
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
