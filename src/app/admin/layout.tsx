import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db/mongoose";
import { resourceNames, RESOURCES } from "@/lib/resources";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Panel";
import { AdminNav } from "@/components/admin/AdminNav";

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
  // `name` is set by seed:admin (ADMIN_NAME) and falls back to the email there,
  // so this shows a person rather than a login string wherever one exists.
  const displayName = session.user.name?.trim() || session.user.email || "Admin";

  return (
    <div className="page-x pt-28 pb-20">
      <div className="bay">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5 sm:mb-8 sm:pb-6">
          <div>
            <Label className="mb-2">Admin</Label>
            <h1 className="t-h2">Content</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full bg-tint font-display text-[0.6875rem] font-semibold text-brand-ink"
              >
                {displayName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase() ?? "")
                  .join("")}
              </span>
              <span className="leading-tight">
                <span className="block text-[0.8125rem] font-medium">
                  {displayName}
                </span>
                <span className="block text-[0.75rem] text-ink-faint capitalize">
                  {role}
                </span>
              </span>
            </span>
            <Link
              href="/"
              className="hidden text-[0.8125rem] text-ink-dim hover:text-brand-ink sm:block"
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:items-start">
          <AdminNav
            items={[
              ...resourceNames
                .filter((name) => name !== "social-status")
                .map((name) => ({
                  href: `/admin/${name}`,
                  label: RESOURCES[name].label,
                })),
              { href: "/admin/social", label: "Social posts" },
              { href: "/admin/leads", label: "Leads" },
              ...(role === "owner"
                ? [{ href: "/admin/keys", label: "API keys" }]
                : []),
            ]}
          />

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
