"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Rule } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/* ==========================================================================
   SITE DETAILS

   Grouped into the four things a person actually comes here to change —
   identity, contact, address, social — rather than one long alphabetical
   list. The address block carries a NAP warning because getting it subtly
   wrong is worse than leaving it blank: mismatched details across site,
   schema and Google Business Profile suppress local ranking.

   Every field shows the committed default as its placeholder, so an empty box
   reads as "using the built-in value" rather than "missing".
   ========================================================================== */

type Row = Record<string, unknown>;
type Field = {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url" | "number" | "textarea";
};

const GROUPS: { title: string; note?: string; fields: Field[] }[] = [
  {
    title: "Business identity",
    fields: [
      { name: "legalName", label: "Legal name", placeholder: "ABM Tech" },
      { name: "tagline", label: "Tagline", placeholder: "Systems · Software · Scale" },
      { name: "founded", label: "Founded", placeholder: "2024" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        hint: "Used as the default meta description and in the footer.",
      },
    ],
  },
  {
    title: "Contact",
    note: "These appear in the header, the footer, the contact page, your lead notification emails and the Organization schema.",
    fields: [
      { name: "email", label: "Email", type: "email", placeholder: "contact@abmtech.in" },
      {
        name: "phoneE164",
        label: "Phone (international)",
        type: "tel",
        placeholder: "+919119756710",
        hint: "Used for the tel: link and schema. Must start with + and the country code.",
      },
      {
        name: "phoneDisplay",
        label: "Phone (as displayed)",
        placeholder: "+91 91197 56710",
      },
      {
        name: "whatsapp",
        label: "WhatsApp number",
        placeholder: "919119756710",
        hint: "Digits only, with country code, no + and no spaces.",
      },
      {
        name: "whatsappPrefill",
        label: "WhatsApp prefilled message",
        type: "textarea",
        placeholder: "Hi ABM Tech — I'd like to discuss a system for my business.",
      },
    ],
  },
  {
    title: "Address",
    note: "Keep this byte-identical to your Google Business Profile. Mismatched name, address or phone across your site, schema and listings actively suppresses local ranking rather than merely failing to help. Leave the street empty and the LocalBusiness schema is omitted entirely, which is correct for a service-area business.",
    fields: [
      { name: "street", label: "Street + area", placeholder: "(empty — no LocalBusiness schema)" },
      { name: "locality", label: "City", placeholder: "Dehradun" },
      { name: "region", label: "State", placeholder: "Uttarakhand" },
      { name: "postalCode", label: "PIN code", placeholder: "248001" },
      { name: "lat", label: "Latitude", type: "number", placeholder: "30.3165" },
      { name: "lng", label: "Longitude", type: "number", placeholder: "78.0322" },
      {
        name: "mapsUrl",
        label: "Google Maps link",
        type: "url",
        hint: "The share link from your Business Profile.",
      },
    ],
  },
  {
    title: "Billing identity",
    note: "Printed on every quotation and invoice. You are not GST registered, so leave GSTIN empty — documents then read \u201cInvoice\u201d rather than \u201cTax Invoice\u201d, charge no tax, and carry a line saying so. Fill your Udyam number in instead; it is the registration you have and it belongs on the document. The day you do register, filling GSTIN in here switches every future document over.",
    fields: [
      { name: "udyam", label: "Udyam / MSME number", placeholder: "UDYAM-UK-05-0000000" },
      {
        name: "gstin",
        label: "GSTIN",
        placeholder: "(not registered \u2014 leave empty)",
        hint: "Only fill this in once you actually hold a GST registration.",
      },
      { name: "pan", label: "PAN" },
      { name: "bankName", label: "Bank name", placeholder: "HDFC Bank" },
      { name: "bankAccount", label: "Account number" },
      { name: "bankIfsc", label: "IFSC" },
      { name: "upi", label: "UPI ID", hint: "Shown in the PAY TO panel on invoices." },
      {
        name: "invoiceTerms",
        label: "Default invoice terms",
        type: "textarea",
        hint: "Prefilled on new invoices. Editable per document.",
      },
      {
        name: "quotationTerms",
        label: "Default quotation terms",
        type: "textarea",
      },
    ],
  },
  {
    title: "Social profiles",
    note: "These feed sameAs in Organization schema — an entity-identity claim. Only one website should list a given profile; two sites claiming the same accounts tells search engines the brands are one entity. An empty field renders no icon rather than a dead link.",
    fields: [
      { name: "instagram", label: "Instagram", type: "url" },
      { name: "facebook", label: "Facebook", type: "url" },
      { name: "linkedin", label: "LinkedIn", type: "url" },
      { name: "github", label: "GitHub", type: "url" },
      { name: "x", label: "X", type: "url" },
      { name: "youtube", label: "YouTube", type: "url" },
      {
        name: "googleVerification",
        label: "Google site verification",
        hint: "The content value of the google-site-verification meta tag.",
      },
    ],
  },
];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
type Hour = { days: string[]; opens: string; closes: string };

export function SiteDetailsForm() {
  const [data, setData] = useState<Row>({});
  const [hours, setHours] = useState<Hour[]>([]);
  const [areas, setAreas] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/site", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (!json.ok) throw new Error(json.error);
        const d = json.data as Row;
        setData(d);
        setHours(
          Array.isArray(d.hours) && d.hours.length
            ? (d.hours as Hour[])
            : [{ days: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], opens: "10:00", closes: "19:00" }],
        );
        setAreas(Array.isArray(d.serviceAreas) ? (d.serviceAreas as string[]).join("\n") : "");
      } catch (err) {
        if (!cancelled) setMsg({ kind: "err", text: (err as Error).message });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const payload: Row = {};
      for (const g of GROUPS) {
        for (const f of g.fields) {
          const v = data[f.name];
          if (f.type === "number") {
            if (v !== undefined && v !== "" && v !== null) payload[f.name] = Number(v);
          } else {
            payload[f.name] = typeof v === "string" ? v.trim() : (v ?? "");
          }
        }
      }
      payload.hours = hours.filter((h) => h.days.length && h.opens && h.closes);
      payload.serviceAreas = areas
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) {
        const detail = Array.isArray(json.detail)
          ? json.detail
              .map((i: { path?: unknown[]; message?: string }) =>
                `${(i.path ?? []).join(".") || "form"}: ${i.message ?? ""}`,
              )
              .join(" · ")
          : "";
        throw new Error([json.error, detail].filter(Boolean).join(" — "));
      }
      setMsg({ kind: "ok", text: "Saved. Every page has been refreshed." });
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-sm border border-line bg-page px-3 py-2 text-[0.875rem] outline-none transition-colors focus:border-brand";

  if (loading) return <p className="text-[0.875rem] text-ink-dim">Loading…</p>;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="mb-1.5">Site</Label>
          <h2 className="t-h3">Business details</h2>
        </div>
        <Button variant="primary" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <p className="rounded-sm border border-line bg-tint px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-dim">
        Leave a field empty to use the value committed in the repository — the
        greyed text in each box. Clearing a field restores that default rather
        than blanking it, so the site can never be edited into a broken footer.
      </p>

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

      {GROUPS.map((g) => (
        <Card key={g.title} className="p-6 sm:p-7">
          <Label className="mb-3">{g.title}</Label>
          {g.note && (
            <p className="mb-6 max-w-3xl text-[0.8125rem] leading-relaxed text-ink-faint">
              {g.note}
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            {g.fields.map((f) => (
              <div key={f.name} className={cn(f.type === "textarea" && "md:col-span-2")}>
                <label htmlFor={`s-${f.name}`} className="mb-1.5 block text-[0.8125rem] font-medium">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={`s-${f.name}`}
                    rows={3}
                    className={cn(input, "resize-y leading-relaxed")}
                    placeholder={f.placeholder}
                    value={String(data[f.name] ?? "")}
                    onChange={(e) => setData({ ...data, [f.name]: e.target.value })}
                  />
                ) : (
                  <input
                    id={`s-${f.name}`}
                    type={f.type === "number" ? "number" : "text"}
                    step={f.type === "number" ? "any" : undefined}
                    className={input}
                    placeholder={f.placeholder}
                    value={String(data[f.name] ?? "")}
                    onChange={(e) => setData({ ...data, [f.name]: e.target.value })}
                  />
                )}
                {f.hint && (
                  <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-faint">{f.hint}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* ------------------------------- Hours ---------------------------- */}
      <Card className="p-6 sm:p-7">
        <Label className="mb-3">Opening hours</Label>
        <p className="mb-6 max-w-3xl text-[0.8125rem] leading-relaxed text-ink-faint">
          Shown on the contact page and emitted as openingHoursSpecification in
          LocalBusiness schema. Hours that say you are closed when you are open
          produce a bad user signal, so keep holiday changes current.
        </p>

        <div className="grid gap-4">
          {hours.map((h, i) => (
            <div key={i} className="grid gap-3 rounded-sm border border-line p-4">
              <div className="flex flex-wrap gap-1.5">
                {DAYS.map((d) => {
                  const on = h.days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setHours(
                          hours.map((x, xi) =>
                            xi === i
                              ? {
                                  ...x,
                                  days: on
                                    ? x.days.filter((y) => y !== d)
                                    : [...x.days, d],
                                }
                              : x,
                          ),
                        )
                      }
                      className={cn(
                        "rounded-sm border px-2.5 py-1 text-[0.75rem] font-medium transition-colors",
                        on
                          ? "border-brand bg-tint text-brand-ink"
                          : "border-line text-ink-faint hover:border-line-strong hover:text-ink",
                      )}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-[0.8125rem] text-ink-dim">
                  Opens
                  <input
                    type="time"
                    value={h.opens}
                    onChange={(e) =>
                      setHours(hours.map((x, xi) => (xi === i ? { ...x, opens: e.target.value } : x)))
                    }
                    className="rounded-sm border border-line bg-page px-2.5 py-1.5 text-[0.8125rem] outline-none focus:border-brand"
                  />
                </label>
                <label className="flex items-center gap-2 text-[0.8125rem] text-ink-dim">
                  Closes
                  <input
                    type="time"
                    value={h.closes}
                    onChange={(e) =>
                      setHours(hours.map((x, xi) => (xi === i ? { ...x, closes: e.target.value } : x)))
                    }
                    className="rounded-sm border border-line bg-page px-2.5 py-1.5 text-[0.8125rem] outline-none focus:border-brand"
                  />
                </label>
                {hours.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHours(hours.filter((_, xi) => xi !== i))}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setHours([...hours, { days: [], opens: "10:00", closes: "19:00" }])}
        >
          + Add a different set of hours
        </Button>
      </Card>

      {/* --------------------------- Service areas ------------------------ */}
      <Card className="p-6 sm:p-7">
        <Label className="mb-3">Service areas</Label>
        <p className="mb-4 max-w-3xl text-[0.8125rem] leading-relaxed text-ink-faint">
          One per line. Shown on the contact page and in llms.txt.
        </p>
        <textarea
          rows={4}
          className={cn(input, "resize-y leading-relaxed")}
          placeholder={"India\nRemote / Worldwide"}
          value={areas}
          onChange={(e) => setAreas(e.target.value)}
        />
      </Card>

      <Rule />
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </Button>
        <span className="text-[0.8125rem] text-ink-faint">
          Saving refreshes every page, so changes are live immediately.
        </span>
      </div>
    </div>
  );
}
