import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, Label } from "@/components/ui/Panel";
import { RESOURCES, resourceNames } from "@/lib/resources";
import { isDbConfigured } from "@/lib/db/mongoose";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="grid gap-6">
      <Card raised className="p-6 sm:p-8">
        <Label className="mb-4">Getting started</Label>
        <p className="mb-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-dim">
          Everything on the public site is editable here. Saving revalidates the
          affected pages immediately, so a change is live without a redeploy —
          and the pages stay statically generated, so search engines still get
          fully rendered HTML.
        </p>
        <p className="max-w-2xl text-[0.875rem] leading-relaxed text-ink-faint">
          If the database is empty the site falls back to the seed content
          committed in the repository, so it can never be edited into a blank
          page. Run <code className="rounded-sm border border-line bg-tint px-1.5 py-0.5 font-mono text-[0.8125rem]">npm run seed</code> once to import that content
          into MongoDB and start editing it.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {resourceNames.map((name) => (
          <Card key={name} lift as={Link} href={`/admin/${name}`} className="block p-5">
            <h2 className="mb-1.5 font-display text-[1rem] font-semibold">
              {RESOURCES[name].label}
            </h2>
            <p className="text-[0.8125rem] text-ink-faint">
              /api/admin/{name} · /api/v1/{name}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Label className="mb-3">Machine API</Label>
        <p className="mb-3 max-w-2xl text-[0.875rem] leading-relaxed text-ink-dim">
          The same content is readable and writable over a token-authenticated
          REST API at <code className="font-mono text-[0.8125rem]">/api/v1</code>,
          for automations and MCP tooling.
        </p>
        <ul className="space-y-1.5 text-[0.8125rem] text-ink-dim">
          <li>
            <code className="font-mono">GET /api/v1</code> — capability discovery
          </li>
          <li>
            <code className="font-mono">GET /api/v1/openapi.json</code> — full OpenAPI 3.1 document
          </li>
        </ul>
        {isDbConfigured() && (
          <p className="mt-4 text-[0.8125rem] text-ink-faint">
            Create tokens under API keys. A token is shown once and only its hash
            is stored.
          </p>
        )}
      </Card>
    </div>
  );
}
