import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserManager } from "@/components/admin/UserManager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  if ((session.user as { role?: string }).role !== "owner") {
    return (
      <p className="text-[0.9375rem] text-ink-dim">
        User management is owner-only. Ask an owner to add or change an account.
      </p>
    );
  }

  return <UserManager currentEmail={session.user.email ?? ""} />;
}
