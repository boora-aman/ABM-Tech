import type { ReactNode } from "react";
import { slugify } from "./utils";

/* ==========================================================================
   MARKDOWN — a small in-repo renderer.
   Covers exactly the subset the legal pages use: h2, paragraphs, bold, inline
   code, links and both list kinds. Written in-house rather than pulling a full
   pipeline because the input is our own content (so the usual sanitisation
   surface does not exist), it renders to React elements with no
   dangerouslySetInnerHTML anywhere, and it ships zero client JS.
   ========================================================================== */

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${key}-${i++}`;
    if (tok.startsWith("**")) {
      out.push(
        <strong key={k} className="font-semibold text-ink">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`")) {
      out.push(
        <code
            key={k}
            className="rounded-sm border border-line bg-tint px-1.5 py-0.5 font-mono text-[0.875em] text-brand-ink"
          >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (link) {
        const external = /^https?:\/\//.test(link[2]);
        out.push(
          <a
            key={k}
            href={link[2]}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-brand underline decoration-brand/40 underline-offset-[3px] transition-colors hover:text-brand-ink"
          >
            {link[1]}
          </a>,
        );
      } else out.push(tok);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let kind: "ul" | "ol" | null = null;
  let key = 0;

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(" ").trim();
    para = [];
    if (!text) return;
    blocks.push(
      <p key={`p${key++}`} className="mb-6 text-[1rem] leading-[1.75] text-ink-dim">
        {inline(text, `p${key}`)}
      </p>,
    );
  };

  const flushList = () => {
    if (!list.length || !kind) return;
    const items = list;
    const Tag = kind;
    list = [];
    kind = null;
    blocks.push(
      <Tag key={`l${key++}`} className="mb-7 space-y-2.5">
        {items.map((it, idx) => (
          <li key={idx} className="flex gap-3.5">
            {Tag === "ol" ? (
              <span className="mt-0.5 font-mono text-[0.6875rem] tabular-nums text-brand/70">
                {String(idx + 1).padStart(2, "0")}
              </span>
            ) : (
              <span
                aria-hidden
                className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-brand"
              />
            )}
            <span className="flex-1 text-[1rem] leading-[1.72] text-ink-dim">
              {inline(it, `li${key}-${idx}`)}
            </span>
          </li>
        ))}
      </Tag>,
    );
  };

  const flush = () => {
    flushPara();
    flushList();
  };

  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    if (/^###\s/.test(line)) {
      flush();
      const text = line.replace(/^###\s+/, "");
      blocks.push(
        <h3
          key={`h3${key++}`}
          id={slugify(text)}
          className="mt-9 mb-4 scroll-mt-28 font-display text-[1.0625rem] font-semibold"
        >
          {inline(text, `h3${key}`)}
        </h3>,
      );
      continue;
    }
    if (/^##\s/.test(line)) {
      flush();
      const text = line.replace(/^##\s+/, "");
      blocks.push(
        <div key={`h${key++}`} className="mt-12 mb-5 first:mt-0">
          <span aria-hidden className="mb-4 block h-px w-12" style={{ background: "var(--color-brand)" }} />
          <h2 id={slugify(text)} className="t-h3 scroll-mt-28 font-display">
            {inline(text, `h${key}`)}
          </h2>
        </div>,
      );
      continue;
    }
    const ol = /^(\d+)\.\s+(.*)$/.exec(line);
    if (ol) {
      flushPara();
      if (kind === "ul") flushList();
      kind = "ol";
      list.push(ol[2]);
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(line);
    if (ul) {
      flushPara();
      if (kind === "ol") flushList();
      kind = "ul";
      list.push(ul[1]);
      continue;
    }
    if (kind) flushList();
    para.push(line.trim());
  }
  flush();
  return <>{blocks}</>;
}
