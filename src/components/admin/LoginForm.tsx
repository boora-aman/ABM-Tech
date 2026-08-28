"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, Label, Rule } from "@/components/ui/Panel";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("error") ? "Sign-in failed. Check the email and password." : null,
  );
  const [busy, setBusy] = useState(false);

  const input =
    "w-full rounded-sm border border-line bg-page px-3.5 py-2.5 text-[0.9375rem] outline-none transition-colors focus:border-brand";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      // Deliberately generic: distinguishing "no such user" from "wrong
      // password" tells an attacker which admin emails are real.
      setError("Sign-in failed. Check the email and password.");
      setBusy(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="bay max-w-md">
      <Card raised className="p-7 sm:p-8">
        <Label className="mb-2">ABM Tech</Label>
        <h1 className="t-h2 mb-6">Admin sign in</h1>

        <form onSubmit={submit} className="grid gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[0.8125rem] font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[0.8125rem] font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
          </div>

          {error && (
            <p className="text-[0.8125rem] text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <Rule className="my-6" />
        <p className="text-[0.75rem] leading-relaxed text-ink-faint">
          There is no sign-up. The first owner is created with{" "}
          <code className="font-mono">npm run seed:admin</code>; further users are
          added by an existing owner.
        </p>
      </Card>
    </div>
  );
}
