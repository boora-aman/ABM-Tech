import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { ServiceCatalogue } from "@/components/sections/ServiceCatalogue";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices, getGlobalFaqs, getPillars } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, serviceLd, faqLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: "Services — websites, CRM, ERP, billing, apps, automation & support",
  description:
    "Thirteen services with published pricing, grouped by the part of the business they fix: websites and local search, CRM, ERP and digitisation, billing and e-commerce, mobile apps, dashboards, integrations and AI automation, plus hosting and support.",
  path: "/services",
  keywords: [
    "software development services india",
    "custom crm erp development",
    "business software company india",
    "mobile app development services india",
    "ecommerce development services india",
    "api integration services india",
    "ai automation services india",
  ],
});

export const revalidate = 3600;

export default async function ServicesPage() {
  const [services, globalFaqs, pillars] = await Promise.all([
    getServices(),
    getGlobalFaqs(),
    getPillars(),
  ]);

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
        lead={`${services.length} services, grouped by the part of the business each one fixes. Every page carries the full deliverable list, the delivery sequence, the honest exclusions and the price floor — so you can qualify us out without ever making a call.`}
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
      <ServiceCatalogue services={services} pillars={pillars} />
      <Rule />
      <Faq
        items={globalFaqs}
        label="Questions"
        title="Before you enquire"
        lead="The questions that come up on almost every first call."
      />
      <Cta />
    </>
  );
}
