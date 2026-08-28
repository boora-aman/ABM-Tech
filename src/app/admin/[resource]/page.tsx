import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { resolveResource, resourceNames } from "@/lib/resources";
import { FIELDS } from "@/lib/admin-fields";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return resourceNames.map((resource) => ({ resource }));
}

export default async function ResourceAdminPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { resource } = await params;
  const def = resolveResource(resource);
  const fields = FIELDS[resource];
  if (!def || !fields) notFound();

  return (
    <CollectionEditor
      resource={resource}
      title={def.label}
      fields={fields}
      uniqueKey={def.uniqueKey}
      note={
        resource === "settings"
          ? "Page copy overrides. Every section falls back to the wording committed in the repository if a key is missing, so deleting a setting restores the original copy rather than blanking the page."
          : undefined
      }
    />
  );
}
