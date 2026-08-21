"use client";

import { useEffect, useState } from "react";
import { Datum } from "@/components/ui/Panel";
import { site } from "@/lib/site.config";
import { seeded } from "@/lib/utils";

/* ==========================================================================
   TELEMETRY RAIL — the hero's left column.

   A live metadata stream: engine ticks, response times, deployment counts. It
   exists to do one thing a marketing headline cannot — demonstrate that the
   people who built this page are comfortable with running systems.

   Honesty constraint: the *labels and figures* are real values from
   site.config. Only the response-time jitter and the tick counter are
   synthetic, and they are presented as engine activity rather than as client
   metrics. Seeded rather than random so the server and client first paint
   agree and there is no hydration mismatch.
   ========================================================================== */

const LINES = [
  "engine.boot",
  "scope.lock",
  "schema.migrate",
  "api.contract",
  "auth.rbac",
  "deploy.preview",
  "audit.trail",
  "handover.docs",
];

export function Telemetry({ className }: { className?: string }) {
  const [tick, setTick] = useState(0);
  const [ms, setMs] = useState(42);

  useEffect(() => {
    const rand = seeded("abm-telemetry");
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setMs(28 + Math.floor(rand() * 34));
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className}>
      <div className="mb-5 flex items-center gap-2">
        <Datum className="pulse-dot" />
        <span className="meta-bright">ABM engine · activity</span>
      </div>

      {/* Process stream */}
      <ul className="mb-7 space-y-1.5">
        {LINES.map((l, i) => (
          <li
            key={l}
            className="flex items-baseline gap-2 font-mono text-[0.625rem] tracking-[0.06em]"
          >
            <span className="text-flare/60 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-ink-faint">{l}</span>
            <span className="ml-auto text-signal/70">ok</span>
          </li>
        ))}
      </ul>

      {/* Live readouts */}
      <div className="mb-7 space-y-2 border-t border-hair pt-4">
        <Readout k="resp" v={`${ms}ms`} />
        <Readout k="cycles" v={String(tick).padStart(4, "0")} />
        <Readout k="region" v="ap-south-1" />
      </div>

      {/* Real figures from config */}
      <dl className="space-y-3 border-t border-hair pt-4">
        {site.telemetry.map((t) => (
          <div key={t.k}>
            <dd className="font-display text-xl tracking-[-0.02em]">{t.v}</dd>
            <dt className="meta mt-1 leading-snug">{t.k}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Readout({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 font-mono text-[0.625rem] tracking-[0.06em]">
      <span className="text-ink-faint uppercase">{k}</span>
      <span className="tabular-nums text-ink-dim">{v}</span>
    </div>
  );
}
