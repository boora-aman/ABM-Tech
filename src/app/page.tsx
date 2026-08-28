import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Systems } from "@/components/sections/Systems";
import { Showcase } from "@/components/sections/Showcase";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { IndustriesSection } from "@/components/sections/Industries";
import { Shifts } from "@/components/sections/Shifts";
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

/* --------------------------------------------------------------------------
   Home page order is an argument, read top to bottom:

     Hero      — every business runs six systems; we build all six
     Systems   — here are the six, pick the one that hurts
     Industries— and here is what they are called in your sector
     Services  — here is what each one costs
     Shifts    — here is what changes, without inventing a percentage
     Showcase  — here is one we built
     Approach  — here is how we work
     FAQ / CTA — here is the answer to what you were about to ask

   Each section answers the objection the previous one raises. That sequence
   is why the old ordering (hero → showcase → services) converted poorly: it
   showed products before establishing that any of them applied to the reader.
   -------------------------------------------------------------------------- */

export const metadata: Metadata = pageMeta({
  title: `${site.name} — Business Software, Websites, Apps & Automation`,
  description: site.description,
  keywords: [
    "business software development company india",
    "custom crm development india price",
    "erp software development india",
    "business website with admin panel india",
    "mobile app development company india",
    "ecommerce website development india",
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
      <Systems />
      <IndustriesSection limit={6} />
      <Rule />
      <ServiceGrid services={services} />
      <Rule />
      <Shifts />
      <Showcase slides={slides} />
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
