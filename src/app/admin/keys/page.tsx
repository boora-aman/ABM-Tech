import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ApiKeyManager } from "@/components/admin/ApiKeyManager";

export const dynamic = "force-dynamic";

export default async function KeysPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if ((session.user as { role?: string }).role !== "owner") {
    return (
      <p className="text-[0.9375rem] text-ink-dim">
        API keys are owner-only. Ask an owner to create one for you.
      </p>
    );
  }
  return <ApiKeyManager />;
}
