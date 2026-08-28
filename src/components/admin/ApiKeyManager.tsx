"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Rule, Chip } from "@/components/ui/Panel";
import { resourceNames } from "@/lib/resources.client";

type Key = {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  revoked?: boolean;
  lastUsedAt?: string;
  createdAt?: string;
};

export function ApiKeyManager() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<string[]>(["*:read"]);
  const [fresh, setFresh] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/keys", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setKeys(json.data as Key[]);
    else setError(json.error);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/keys", { cache: "no-store" });
      const json = await res.json();
      if (cancelled) return;
      if (json.ok) setKeys(json.data as Key[]);
      else setError(json.error);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function create() {
    setBusy(true);
    setError(null);
    setFresh(null);
    try {
      const res = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, scopes }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Could not create key");
      setFresh(json.data.token as string);
      setName("");
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string, keyName: string) {
    if (!window.confirm(`Revoke "${keyName}"? Anything using it stops working immediately.`))
      return;
    await fetch(`/api/admin/keys?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  function toggle(scope: string) {
    setScopes((s) => (s.includes(scope) ? s.filter((x) => x !== scope) : [...s, scope]));
  }

  const allScopes = ["*:read", "*:write", ...resourceNames.flatMap((r) => [`${r}:read`, `${r}:write`])];

  return (
    <div className="grid gap-6">
      <Card raised className="p-6 sm:p-7">
        <Label className="mb-4">New API key</Label>
        <p className="mb-5 max-w-2xl text-[0.875rem] leading-relaxed text-ink-dim">
          For automations, cron jobs and MCP tooling. The token is shown once
          and only its hash is stored — if it is lost, revoke it and issue
          another.
        </p>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="key-name" className="mb-1.5 block text-[0.8125rem] font-medium">
              Name
            </label>
            <input
              id="key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MCP server"
              className="w-full rounded-sm border border-line bg-page px-3 py-2 text-[0.875rem] outline-none focus:border-brand"
            />
          </div>
        </div>

        <Label className="mb-3">Scopes</Label>
        <div className="mb-5 flex flex-wrap gap-2">
          {allScopes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              aria-pressed={scopes.includes(s)}
              className={
                scopes.includes(s)
                  ? "rounded-sm border border-brand bg-tint px-2.5 py-1 font-mono text-[0.75rem] text-brand-ink"
                  : "rounded-sm border border-line px-2.5 py-1 font-mono text-[0.75rem] text-ink-faint hover:border-line-strong hover:text-ink"
              }
            >
              {s}
            </button>
          ))}
        </div>

        <Button variant="primary" onClick={create} disabled={busy || !name.trim() || !scopes.length}>
          {busy ? "Creating…" : "Create key"}
        </Button>

        {error && (
          <p className="mt-4 text-[0.8125rem] text-red-600 dark:text-red-400">{error}</p>
        )}

        {fresh && (
          <div className="mt-5 rounded-sm border border-brand/40 bg-tint p-4">
            <p className="mb-2 text-[0.8125rem] font-semibold text-ink">
              Copy this now — it will not be shown again.
            </p>
            <code className="block break-all font-mono text-[0.8125rem] text-brand-ink">
              {fresh}
            </code>
          </div>
        )}
      </Card>

      <Card className="p-6 sm:p-7">
        <Label className="mb-5">{keys.length} keys</Label>
        <ul className="divide-y divide-line">
          {keys.map((k) => (
            <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-medium">
                  {k.name}{" "}
                  <span className="font-mono text-[0.75rem] text-ink-faint">
                    {k.prefix}…
                  </span>
                </p>
                <p className="font-mono text-[0.75rem] text-ink-faint">
                  {k.scopes.join(" ")}
                  {k.lastUsedAt
                    ? ` · last used ${new Date(k.lastUsedAt).toLocaleDateString("en-IN")}`
                    : " · never used"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {k.revoked ? (
                  <Chip>Revoked</Chip>
                ) : (
                  <>
                    <Chip brand>Active</Chip>
                    <Button variant="ghost" size="sm" onClick={() => revoke(k.id, k.name)}>
                      Revoke
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <Rule className="my-6" />
        <p className="text-[0.8125rem] leading-relaxed text-ink-faint">
          Use with{" "}
          <code className="font-mono">Authorization: Bearer &lt;token&gt;</code>{" "}
          against <code className="font-mono">/api/v1</code>. Call{" "}
          <code className="font-mono">GET /api/v1</code> for capability discovery
          or <code className="font-mono">/api/v1/openapi.json</code> for the full
          contract.
        </p>
      </Card>
    </div>
  );
}
