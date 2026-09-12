import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteDetailsForm } from "@/components/admin/SiteDetailsForm";

export const dynamic = "force-dynamic";

export default async function SiteDetailsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return <SiteDetailsForm />;
}
