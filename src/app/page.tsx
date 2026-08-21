import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ServiceMatrix } from "@/components/sections/ServiceMatrix";
import { XRayShowcase } from "@/components/sections/XRayShowcase";
import { Commitments } from "@/components/sections/Commitments";
import { Faq } from "@/components/sections/Faq";
import { ScrollSpine } from "@/components/shell/ScrollSpine";
import { Rule } from "@/components/ui/Panel";
import { JsonLd } from "@/components/seo/JsonLd";
import { services } from "@/lib/content/services";
import { projects } from "@/lib/content/work";
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

      <ScrollSpine
        sections={["Intro", "Services", "Work", "Method", "FAQ"]}
      />

      <Hero />
      <Rule />
      <ServiceMatrix services={services} />
      <Rule />
      <XRayShowcase projects={projects} />
      <Rule />
      <Commitments />
      <Rule />
      <Faq
        items={globalFaqs}
        index="04"
        label="Questions"
        title="Before you enquire"
        lead="Including the ones where the honest answer costs us the project."
      />
    </>
  );
}
