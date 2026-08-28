import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { withDb, plain } from "@/lib/db/mongoose";
import { LeadModel } from "@/lib/db/models";
import { Card, Label, Chip } from "@/components/ui/Panel";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  source?: string;
  status?: string;
  createdAt?: string;
};

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const leads = await withDb(
    async () => {
      const docs = await LeadModel.find().sort({ createdAt: -1 }).limit(200).lean();
      return plain<Lead>(docs);
    },
    () => [] as Lead[],
  );

  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <Label className="mb-2">Enquiries</Label>
        <p className="text-[0.875rem] text-ink-dim">
          {leads.length === 0
            ? "No enquiries yet. The contact form writes here, and emails a copy regardless — a database outage never loses a lead."
            : `${leads.length} most recent.`}
        </p>
      </Card>

      {leads.map((l) => (
        <Card key={l.id} className="p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[1.0625rem] font-semibold">{l.name}</h2>
              <p className="text-[0.8125rem] text-ink-dim">
                <a href={`mailto:${l.email}`} className="hover:text-brand-ink">
                  {l.email}
                </a>
                {l.phone && (
                  <>
                    {" · "}
                    <a href={`tel:${l.phone}`} className="hover:text-brand-ink">
                      {l.phone}
                    </a>
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {l.service && <Chip>{l.service}</Chip>}
              {l.budget && <Chip>{l.budget}</Chip>}
              <Chip brand={l.status === "new"}>{l.status ?? "new"}</Chip>
            </div>
          </div>

          <p className="mb-4 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink-dim">
            {l.message}
          </p>

          <p className="text-[0.75rem] text-ink-faint">
            {l.company && `${l.company} · `}
            {l.source && `${l.source} · `}
            {l.createdAt && formatDate(l.createdAt)}
          </p>
        </Card>
      ))}
    </div>
  );
}
