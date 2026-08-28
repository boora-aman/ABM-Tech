import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db/mongoose";
import { resourceNames, RESOURCES } from "@/lib/resources";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Panel";

/* Admin is never indexed and never cached. */
export const metadata: Metadata = {
  title: "Admin · ABM Tech",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // The login page renders inside this layout, so it cannot require a session.
  // Everything else redirects, and middleware.ts blocks the route before this
  // component ever runs — this is the second of the two gates.
  if (!session?.user) {
    return <main className="page-x pt-32 pb-20">{children}</main>;
  }

  const role = (session.user as { role?: string }).role ?? "editor";

  return (
    <div className="page-x pt-28 pb-20">
      <div className="bay">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <Label className="mb-2">Admin</Label>
            <h1 className="t-h2">Content</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.8125rem] text-ink-faint">
              {session.user.email} · {role}
            </span>
            <Link
              href="/"
              className="text-[0.8125rem] text-ink-dim hover:text-brand-ink"
            >
              View site
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </header>

        {!isDbConfigured() && (
          <p className="mb-6 rounded-sm border border-brand/30 bg-tint px-4 py-3 text-[0.875rem] leading-relaxed text-ink-dim">
            <strong className="text-ink">No database configured.</strong> The site
            is serving bundled seed content and editing is disabled. Set{" "}
            <code className="font-mono text-[0.8125rem]">MONGODB_URI</code> and
            restart to enable the CMS.
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
          <nav aria-label="Admin sections">
            <ul className="space-y-1">
              {resourceNames.map((name) => (
                <li key={name}>
                  <Link
                    href={`/admin/${name}`}
                    className="block rounded-sm px-3 py-2 text-[0.875rem] text-ink-dim transition-colors hover:bg-tint hover:text-ink"
                  >
                    {RESOURCES[name].label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/admin/leads"
                  className="block rounded-sm px-3 py-2 text-[0.875rem] text-ink-dim transition-colors hover:bg-tint hover:text-ink"
                >
                  Leads
                </Link>
              </li>
              {role === "owner" && (
                <li>
                  <Link
                    href="/admin/keys"
                    className="block rounded-sm px-3 py-2 text-[0.875rem] text-ink-dim transition-colors hover:bg-tint hover:text-ink"
                  >
                    API keys
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
