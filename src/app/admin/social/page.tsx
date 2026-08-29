import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SocialBoard } from "@/components/admin/SocialBoard";
import { socialPosts } from "@/lib/content/social";

export const dynamic = "force-dynamic";

export default async function SocialAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return <SocialBoard posts={socialPosts} />;
}
