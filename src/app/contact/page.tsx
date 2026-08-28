import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHead } from "@/components/sections/PageHead";
import { ContactForm } from "@/components/sections/ContactForm";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, organizationLd, faqLd } from "@/lib/seo";
import { site, whatsappLink, isPlaceholder } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: "Contact — describe the problem, get a fixed quote",
  description:
    "Tell us what manual work is costing you the most hours. You get a written scope and a fixed price — or a straight recommendation to buy something off the shelf instead.",
  path: "/contact",
  keywords: ["contact abm tech", "hire crm developer india", "erp development enquiry"],
});

const CONTACT_FAQS = [
  {
    q: "What happens after I submit?",
    a: "It reaches us immediately and is answered by someone who would actually build it, usually within one working day. That reply includes a straight read on whether custom software is the right call — sometimes the answer is that an off-the-shelf tool would serve you better.",
  },
  {
    q: "What should I include?",
    a: "The manual work costing you the most hours, what you're using today (Excel and WhatsApp is a completely normal starting point), roughly how many people would use the system, and any hard deadline. That's enough for a scope conversation.",
  },
  {
    q: "Is the first conversation free?",
    a: "Yes, and it is not a sales call. You get an honest read on scope, a rough bracket, and whether we are the right people. Only paid discovery — for genuinely complex ERP or platform work — is charged, and we tell you before it starts.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, before any detail is shared if you prefer. Most of our work is anonymised on this site for exactly that reason.",
  },
];

export const revalidate = 3600;

export default async function ContactPage() {
  const services = await getServices();
  const addressReady = !isPlaceholder(site.address.locality);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          organizationLd(),
          faqLd(CONTACT_FAQS),
          {
            "@type": "ContactPage",
            name: `Contact ${site.name}`,
            description: "Enquiry form, direct phone, email and WhatsApp.",
          },
        )}
      />

      <PageHead
        label="Contact"
        title="Describe the problem."
        titleAccent="We'll quote the system."
        lead="No brief required. Tell us what the manual work is and who does it, and you'll get a written scope with a fixed price — or a recommendation to buy something instead."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">Fastest route</span>
            </div>
            <p className="mb-5 text-[0.8125rem] leading-relaxed text-ink-dim">
              WhatsApp gets the quickest reply during working hours. The form is
              better if you want to describe something properly.
            </p>
            <div className="flex flex-col gap-2">
              <ButtonLink href={whatsappLink()} variant="whatsapp" size="md" external className="w-full">
                <WhatsAppGlyph />
                WhatsApp us
                <Arrow />
              </ButtonLink>
              <ButtonLink
                href={`tel:${site.contact.phoneE164}`}
                variant="outline"
                size="md"
                external
                className="w-full"
              >
                {site.contact.phoneDisplay}
              </ButtonLink>
            </div>
          </Card>
        }
      />

      <Rule />

      <section className="page-x py-16">
        <div className="bay grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <Suspense
            fallback={
              <Card className="p-8">
                <span className="label">Loading form…</span>
              </Card>
            }
          >
            <ContactForm services={services} />
          </Suspense>

          <div className="flex flex-col gap-5">
            <Card className="p-6">
              <Label className="mb-6">Direct lines</Label>
              <ul className="space-y-4">
                <Line label="Phone" value={site.contact.phoneDisplay} href={`tel:${site.contact.phoneE164}`} />
                <Line label="Email" value={site.contact.email} href={`mailto:${site.contact.email}`} />
                <Line
                  label="Hours"
                  value={`${site.hours[0].opens}–${site.hours[0].closes} IST · Mon–Sat`}
                />
                {addressReady && (
                  <Line
                    label="Based in"
                    value={`${site.address.locality}, ${site.address.region}`}
                  />
                )}
                <Line label="Serving" value={site.serviceAreas.join(" · ")} />
              </ul>
            </Card>

            <Card className="p-6">
              <Label className="mb-5">What we&apos;ll ask</Label>
              <ol className="space-y-3.5">
                {[
                  "What the manual work is, and roughly how many hours a week it takes.",
                  "What you use today — Excel, a register, a tool you've outgrown.",
                  "How many people would use the system, and in what roles.",
                  "Whether there's a hard deadline driving it.",
                ].map((q, i) => (
                  <li key={q} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-[0.625rem] tabular-nums text-brand/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.8125rem] leading-relaxed text-ink-dim">
                      {q}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </section>

      <Rule />
      <Faq
        items={CONTACT_FAQS}
        label="Before you send"
        title="What to expect"
        lead="Including where the honest answer costs us the project."
      />
    </>
  );
}

function Line({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <span className="label shrink-0">{label}</span>
      <span className="text-right text-[0.8125rem] break-words">{value}</span>
    </>
  );
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
      {href ? (
        <a href={href} className="flex w-full items-baseline justify-between gap-4 transition-colors hover:text-brand-ink">
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}
