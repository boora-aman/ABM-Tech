"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Chip, Rule } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/* ==========================================================================
   USER MANAGER

   Owner-only. The form is closed by default and the list is what you land on,
   same as every other collection — the common job is checking who has access,
   not adding someone.

   Passwords are write-only in both directions: typed here, hashed server-side,
   never returned. There is no "show password" because there is nothing stored
   that could be shown.
   ========================================================================== */

type AdminUser = {
  id: string;
  email: string;
  name?: string;
  role: "owner" | "editor";
  lastLoginAt?: string;
  createdAt?: string;
};

export function UserManager({ currentEmail }: { currentEmail: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"owner" | "editor">("editor");
  const [password, setPassword] = useState("");

  async function load() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setUsers(json.data as AdminUser[]);
    else setMsg({ kind: "err", text: json.error });
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (!json.ok) throw new Error(json.error);
        setUsers(json.data as AdminUser[]);
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

  function reset() {
    setEmail("");
    setName("");
    setRole("editor");
    setPassword("");
    setOpen(false);
  }

  async function create() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, password }),
      });
      const json = await res.json();
      if (!json.ok) {
        const detail = Array.isArray(json.detail)
          ? json.detail.map((i: { message?: string }) => i.message).join(" · ")
          : "";
        throw new Error([json.error, detail].filter(Boolean).join(" — "));
      }
      setMsg({ kind: "ok", text: `${json.data.email} can now sign in as ${json.data.role}.` });
      reset();
      await load();
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function patch(u: AdminUser, body: Record<string, unknown>, done: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(u.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setMsg({ kind: "ok", text: done });
      await load();
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(u: AdminUser) {
    if (!window.confirm(`Remove ${u.email}? They lose access immediately.`)) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(u.id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setMsg({ kind: "ok", text: `${u.email} removed.` });
      await load();
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(u: AdminUser) {
    const pw = window.prompt(
      `New password for ${u.email}.\n\nAt least 12 characters. Send it to them over a channel you trust, and ask them to change it.`,
    );
    if (!pw) return;
    if (pw.length < 12) {
      setMsg({ kind: "err", text: "Use at least 12 characters." });
      return;
    }
    await patch(u, { password: pw }, `Password reset for ${u.email}.`);
  }

  const input =
    "w-full rounded-sm border border-line bg-page px-3 py-2 text-[0.875rem] outline-none transition-colors focus:border-brand";

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label className="mb-1.5">Access</Label>
          <h2 className="t-h3">Admin users</h2>
        </div>
        {!open && (
          <Button variant="primary" onClick={() => setOpen(true)}>
            + Add user
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

      {open && (
        <Card raised className="p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="t-h3">New user</h3>
            <Button variant="ghost" size="sm" onClick={reset}>
              Close
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="u-email" className="mb-1.5 block text-[0.8125rem] font-medium">
                Email <span className="text-brand">*</span>
              </label>
              <input
                id="u-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="u-name" className="mb-1.5 block text-[0.8125rem] font-medium">
                Name
              </label>
              <input
                id="u-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={input}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="u-role" className="mb-1.5 block text-[0.8125rem] font-medium">
                Role
              </label>
              <select
                id="u-role"
                value={role}
                onChange={(e) => setRole(e.target.value as "owner" | "editor")}
                className={input}
              >
                <option value="editor">Editor — edit all content</option>
                <option value="owner">Owner — also manages users and API keys</option>
              </select>
              <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-faint">
                Give editor unless they need to issue API keys or add people.
              </p>
            </div>
            <div>
              <label htmlFor="u-pw" className="mb-1.5 block text-[0.8125rem] font-medium">
                Password <span className="text-brand">*</span>
              </label>
              <input
                id="u-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={input}
                autoComplete="new-password"
                minLength={12}
              />
              <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-faint">
                At least 12 characters. Send it over a channel you trust and ask
                them to change it after the first sign-in.
              </p>
            </div>
          </div>

          <Rule className="my-6" />

          <Button
            variant="primary"
            onClick={create}
            disabled={busy || !email.trim() || password.length < 12}
          >
            {busy ? "Creating…" : "Create user"}
          </Button>
        </Card>
      )}

      <Card className="p-6 sm:p-7">
        <Label className="mb-5">{loading ? "Loading…" : `${users.length} users`}</Label>
        <ul className="divide-y divide-line">
          {users.map((u) => {
            const isSelf = u.email.toLowerCase() === currentEmail.toLowerCase();
            return (
              <li
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3.5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-tint font-display text-[0.6875rem] font-semibold text-brand-ink"
                  >
                    {(u.name || u.email)
                      .split(/[\s@.]+/)
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase() ?? "")
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-medium">
                      {u.name || u.email}
                      {isSelf && <span className="ml-2 text-[0.75rem] text-ink-faint">you</span>}
                    </p>
                    <p className="truncate text-[0.75rem] text-ink-faint">
                      {u.email}
                      {u.lastLoginAt
                        ? ` · last in ${new Date(u.lastLoginAt).toLocaleDateString("en-IN")}`
                        : " · never signed in"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Chip brand={u.role === "owner"}>{u.role}</Chip>
                  <Button variant="outline" size="sm" onClick={() => resetPassword(u)} disabled={busy}>
                    Reset password
                  </Button>
                  {!isSelf && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          patch(
                            u,
                            { role: u.role === "owner" ? "editor" : "owner" },
                            `${u.email} is now ${u.role === "owner" ? "an editor" : "an owner"}.`,
                          )
                        }
                      >
                        Make {u.role === "owner" ? "editor" : "owner"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(u)} disabled={busy}>
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <Rule className="my-6" />
        <p className="text-[0.8125rem] leading-relaxed text-ink-faint">
          <strong className="text-ink-dim">Editor</strong> can change every piece
          of content on the site. <strong className="text-ink-dim">Owner</strong>{" "}
          can also add or remove users and issue API keys. The last owner cannot
          be removed or demoted — there is no sign-up route to recover through.
        </p>
      </Card>
    </div>
  );
}
