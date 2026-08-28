"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   FORM FIELDS
   Inputs are recessed panels with a hairline that ignites warm on focus —
   consistent with how every other surface in the system behaves. Each field is
   a real label/input pair wired with aria-describedby and aria-invalid.
   ========================================================================== */

type Base = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

const INPUT =
  "peer w-full rounded-sm border bg-page px-3.5 py-3 text-[0.9375rem] outline-none transition-colors duration-300 placeholder:text-ink-faint/70 focus:border-brand focus:bg-surface";

function Shell({
  label,
  hint,
  error,
  required,
  id,
  children,
  className,
}: Base & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink">
        {label}
        {required && (
          <span aria-hidden className="text-brand">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[0.75rem] text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="flex items-center gap-1.5 text-[0.75rem] font-medium text-brand-ink"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 4v3.6M7 9.7h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export function Field({
  label,
  name,
  hint,
  error,
  required,
  className,
  type = "text",
  ...rest
}: Base & React.InputHTMLAttributes<HTMLInputElement>) {
  const uid = useId();
  const id = `f-${name}-${uid}`;
  return (
    <Shell {...{ label, name, hint, error, required, id, className }}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn(INPUT, error ? "border-brand" : "border-line")}
        {...rest}
      />
    </Shell>
  );
}

export function TextArea({
  label,
  name,
  hint,
  error,
  required,
  className,
  rows = 6,
  ...rest
}: Base & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const uid = useId();
  const id = `t-${name}-${uid}`;
  return (
    <Shell {...{ label, name, hint, error, required, id, className }}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn(INPUT, "resize-y leading-relaxed", error ? "border-brand" : "border-line")}
        {...rest}
      />
    </Shell>
  );
}

export function Select({
  label,
  name,
  hint,
  error,
  required,
  className,
  options,
  ...rest
}: Base & { options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const uid = useId();
  const id = `s-${name}-${uid}`;
  return (
    <Shell {...{ label, name, hint, error, required, id, className }}>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={cn(
            INPUT,
            "cursor-pointer appearance-none pr-10",
            error ? "border-brand" : "border-line",
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-faint"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 5.5 7 9l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Shell>
  );
}

/** Segmented control for budget bands — a select feels heavy for five values. */
export function Segments({
  label,
  name,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="mb-1 text-[0.8125rem] font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "cursor-pointer rounded-sm border px-3 py-2 text-[0.8125rem] transition-colors duration-250 has-focus-visible:outline has-focus-visible:outline-brand-ink",
                on
                  ? "border-brand bg-tint text-brand-ink font-medium"
                  : "border-line text-ink-dim hover:border-line-strong hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={on}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
