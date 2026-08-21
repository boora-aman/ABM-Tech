import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { Approach } from "@/components/sections/Approach";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";
import { Rule } from "@/components/ui/Panel";
import { JsonLd } from "@/components/seo/JsonLd";
import { services } from "@/lib/content/services";
import { slides } from "@/lib/content/showcase";
import { globalFaqs } from "@/lib/content/faq";
import { pageMeta, graph, breadcrumbLd, faqLd, serviceLd } from "@/lib/seo";
import { site } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: `${site.name} — CRM, ERP & Business Software Development`,
  description: site.description,
  path: "/",
  keywords: [
    "custom crm development india price",
    "erp software development india",
    "business website with admin panel india",
    "billing software with mobile app",
    "ai automation for business india",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([{ name: "Home", path: "/" }]),
          faqLd(globalFaqs),
          ...services.map((s) => serviceLd(s)),
        )}
      />

      <Hero />
      <Showcase slides={slides} />
      <Rule />
      <ServiceGrid services={services} />
      <Rule />
      <Approach />
      <Rule />
      <Faq
        items={globalFaqs}
        label="Common questions"
        title="Questions, answered"
        lead="Including the ones where the honest answer costs us the project."
      />
      <Cta />
    </>
  );
}
