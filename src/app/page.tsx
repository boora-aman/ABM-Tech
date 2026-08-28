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
import {
  getServices,
  getSlides,
  getGlobalFaqs,
  getIndustries,
  getPillars,
  getCommitments,
  getSettings,
} from "@/lib/content/repo";
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

   Content comes from the repo, which reads MongoDB when it is configured and
   the committed seed files otherwise. `revalidate` keeps the page statically
   generated and refreshed hourly; admin writes call revalidatePath so an edit
   is live immediately. A crawler is therefore always served pre-rendered HTML
   with its structured data intact.
   -------------------------------------------------------------------------- */

export const revalidate = 3600;

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

export default async function HomePage() {
  const [services, slides, faqs, industries, pillars, commitments, settings] =
    await Promise.all([
      getServices(),
      getSlides(),
      getGlobalFaqs(),
      getIndustries(),
      getPillars(),
      getCommitments(),
      getSettings(),
    ]);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([{ name: "Home", path: "/" }]),
          faqLd(faqs),
          ...services.map((s) => serviceLd(s)),
        )}
      />

      <Hero
        pillars={pillars}
        industries={industries}
        serviceCount={services.length}
        settings={settings}
      />
      <Systems pillars={pillars} services={services} settings={settings} />
      <IndustriesSection
        industries={industries}
        services={services}
        initial={6}
        settings={settings}
      />
      <Rule />
      <ServiceGrid services={services} initial={6} settings={settings} />
      <Rule />
      <Shifts />
      <Showcase slides={slides} />
      <Rule />
      <Approach commitments={commitments} settings={settings} />
      <Rule />
      <Faq
        items={faqs}
        label="Common questions"
        title="Questions, answered"
        lead="Including the ones where the honest answer costs us the project."
      />
      <Cta settings={settings} />
    </>
  );
}
