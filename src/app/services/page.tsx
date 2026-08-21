import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { services } from "@/lib/content/services";
import { globalFaqs } from "@/lib/content/faq";
import { pageMeta, graph, breadcrumbLd, serviceLd, faqLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: "Services — CRM, ERP, billing platforms, websites & AI automation",
  description:
    "Eight services with published pricing: custom CRM, static and dynamic business websites, ERP systems, billing platforms with mobile apps, AI automation, business digitisation, and Google Business Profile with technical SEO.",
  path: "/services",
  keywords: [
    "software development services india",
    "custom crm erp development",
    "business software company india",
    "ai automation services india",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          ...services.map((s) => serviceLd(s)),
          {
            "@type": "ItemList",
            name: "Services",
            numberOfItems: services.length,
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              url: absoluteUrl(`/services/${s.slug}`),
            })),
          },
          faqLd(globalFaqs),
        )}
      />

      <PageHead
        label="Services"
        title="What we build,"
        titleAccent="and what it costs."
        lead="Eight services. Each page carries the full deliverable list, the delivery sequence, the honest exclusions and the price floor — so you can qualify us out without a call."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">Not sure which?</span>
            </div>
            <p className="mb-5 text-[0.8125rem] leading-relaxed text-ink-dim">
              Describe the manual work costing you the most hours. We&apos;ll
              tell you which of these removes it — including when the answer is
              &ldquo;none of them yet&rdquo;.
            </p>
            <ButtonLink href="/contact" variant="primary" size="md" className="w-full">
              Describe the problem
              <Arrow />
            </ButtonLink>
          </Card>
        }
      />

      <Rule />
      <ServiceGrid services={services} />
      <Rule />
      <Faq
        items={globalFaqs}
        label="Questions"
        title="Before you enquire"
        lead="The questions that come up on almost every first call."
      />
    </>
  );
}
