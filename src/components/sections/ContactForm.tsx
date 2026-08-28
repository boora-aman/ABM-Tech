"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Field, TextArea, Select, Segments } from "@/components/ui/Field";
import { Button, ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { Card, Rule, Label } from "@/components/ui/Panel";
import { leadSchema } from "@/lib/validators";
import { whatsappLink } from "@/lib/site.config";
import type { Service } from "@/lib/content/services";

/* ==========================================================================
   CONTACT FORM
   A real <form> validated by the same zod schema on both sides. Anti-spam is
   invisible to humans — a honeypot and a time-to-submit floor. No CAPTCHA:
   those cost real users more than they cost bots.
   ========================================================================== */

const BUDGETS = [
  { value: "under-15k", label: "Under ₹15k" },
  { value: "15k-50k", label: "₹15k–50k" },
  { value: "50k-1l", label: "₹50k–1L" },
  { value: "1l-plus", label: "₹1L+" },
  { value: "not-sure", label: "Not sure yet" },
];

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export function ContactForm({ services }: { services: Service[] }) {
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const renderedAt = useRef(0);

  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [budget, setBudget] = useState("not-sure");
  // Deep links from the service pages arrive as ?service=slug. Read in the
  // initialiser rather than from an effect — useSearchParams is available on
  // the first client render, so there is nothing to wait for.
  const [service, setService] = useState(() => params.get("service") ?? "");

  useEffect(() => {
    // Stamped once, for the submit-speed spam check.
    renderedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      service,
      budget,
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
      source: typeof window !== "undefined" ? window.location.pathname : "/contact",
      renderedAt: renderedAt.current,
    };

    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const k = String(i.path[0] ?? "form");
        if (!next[k]) next[k] = i.message;
      }
      setErrors(next);
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }

    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!res.ok || !json.ok) {
        if (json.fields) setErrors(json.fields);
        setState({
          kind: "error",
          message: json.error ?? "Something went wrong. Try WhatsApp instead.",
        });
        return;
      }
      setState({ kind: "sent" });
      formRef.current?.reset();
    } catch {
      setState({
        kind: "error",
        message:
          "Couldn't reach the server — nothing was sent. WhatsApp is the fastest fallback.",
      });
    }
  }

  if (state.kind === "sent") {
    return (
      <Card raised className="p-7 sm:p-10">
        <div className="rise" role="status" aria-live="polite">
          <div className="mb-6 flex items-center gap-2.5">
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            <Label tick={false}>Message sent</Label>
          </div>
          <h2 className="t-h2 mb-4 font-display">Thanks — we&apos;ve got it.</h2>
          <p className="t-lead">
            We usually reply within one working day.
          </p>
          <Rule className="my-7" />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={whatsappLink()} variant="whatsapp" size="lg" external>
              <WhatsAppGlyph />
              Continue on WhatsApp
              <Arrow />
            </ButtonLink>
            <Button variant="outline" size="lg" onClick={() => setState({ kind: "idle" })}>
              Send another
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card raised className="p-6 sm:p-8">
      <form ref={formRef} onSubmit={onSubmit} noValidate>
        <div className="mb-7 flex items-center gap-2.5">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          <Label tick={false}>Project enquiry</Label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" name="name" required autoComplete="name" placeholder="Name" error={errors.name} />
          <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@company.in" error={errors.email} />
          <Field label="Phone / WhatsApp" name="phone" type="tel" autoComplete="tel" placeholder="+91 00000 00000" hint="Optional — makes the first reply faster" error={errors.phone} />
          <Field label="Business name" name="company" autoComplete="organization" placeholder="Your business" error={errors.company} />
        </div>

        <div className="mt-5 grid gap-5">
          <Select
            label="What do you need?"
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            error={errors.service}
            options={[
              { value: "", label: "Not sure — help me work it out" },
              ...services.map((s) => ({ value: s.slug, label: s.title })),
              { value: "other", label: "Something else" },
            ]}
          />
          <Segments label="Rough budget" name="budget" value={budget} onChange={setBudget} options={BUDGETS} />
          <TextArea
            label="What's the problem?"
            name="message"
            required
            rows={7}
            placeholder="What manual work is costing you the most hours? What are you using today — even if that's Excel and WhatsApp? Who would use the system?"
            hint="The more specific, the more specific the reply."
            error={errors.message}
          />
        </div>

        {/* Honeypot — hidden from humans, irresistible to bots */}
        <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
          <label htmlFor="website-hp">Website</label>
          <input id="website-hp" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {state.kind === "error" && (
          <p role="alert" className="rise mt-6">
            <span className="block rounded-sm border border-brand/35 bg-tint px-4 py-3 text-[0.875rem] leading-relaxed brand-text">
              {state.message}
            </span>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" size="lg" disabled={state.kind === "sending"}>
            {state.kind === "sending" ? (
              <>
                <Spinner />
                Sending
              </>
            ) : (
              <>
                Send enquiry
                <Arrow />
              </>
            )}
          </Button>
          <ButtonLink href={whatsappLink()} variant="whatsapp" size="lg" external>
            <WhatsAppGlyph />
            Or WhatsApp instead
          </ButtonLink>
        </div>

        <p className="mt-6 text-[0.75rem] leading-relaxed text-ink-faint">
          We use what you send to reply to you and nothing else. No mailing list,
          no resale, no third-party CRM sync. Deleted on request.
        </p>
      </form>
    </Card>
  );
}

function Spinner() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden
      className="animate-spin"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
