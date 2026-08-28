import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { Systems } from "@/components/sections/Systems";
import { IndustriesSection } from "@/components/sections/Industries";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";
import { Card, Rule, Label } from "@/components/ui/Panel";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, graph, breadcrumbLd, faqLd } from "@/lib/seo";
import { getIndustries, getPillars, getServices, getSettings } from "@/lib/content/repo";

export const metadata: Metadata = pageMeta({
  title: "Industries — software built in your sector's own vocabulary",
  description:
    "Custom software for retail, healthcare and pharmacy, manufacturing, logistics, construction, education, hospitality, professional services, field services, e-commerce, finance and non-profits. Same six systems, your sector's nouns.",
  path: "/industries",
  keywords: [
    "industry specific software development india",
    "erp for manufacturing india",
    "software for logistics company india",
    "school management software india",
    "pharmacy software development india",
  ],
});

const INDUSTRY_FAQS = [
  {
    q: "Do you specialise in one industry or work across all of them?",
    a: "Across them, and the reason is structural rather than commercial: the six systems a business runs on are identical everywhere — get found, capture demand, run operations, collect money, work off the desk, know what is happening. Only the nouns change. A batch in a pharmacy and a lot in a factory are the same modelling problem with different regulations attached.",
  },
  {
    q: "How do you learn a sector you haven't built for before?",
    a: "Two mapping sessions where you talk and we write down the vocabulary, the documents you issue, the states a record moves through and the reports you already look at. If after those sessions we do not think we understand your operation well enough to price it honestly, we say so and charge nothing.",
  },
  {
    q: "Which sectors have you actually shipped production systems in?",
    a: "Retail pharmacy, fuel and general retail, distribution, logistics and home/field services. Those are marked on this page. Everything else on the list is a sector we have modelled and can build for — we distinguish between the two rather than implying a portfolio we do not have.",
  },
  {
    q: "Our business doesn't fit any standard category. Is that a problem?",
    a: "It is usually an advantage. Businesses that fit a category can often buy an off-the-shelf product, and we will tell them to. The ones with an unusual process — a pricing rule nobody else has, a document only your regulator wants, a workflow that spans four roles — are precisely the ones where custom software pays for itself.",
  },
  {
    q: "Do you build for businesses outside India?",
    a: "Yes, remotely. The systems are the same; the compliance layer is not, so tax, invoicing formats and data-residency requirements get scoped explicitly rather than assumed. Pricing is quoted in INR.",
  },
];

export const revalidate = 3600;

export default async function IndustriesPage() {
  const [industries, pillars, services, settings] = await Promise.all([
    getIndustries(),
    getPillars(),
    getServices(),
    getSettings(),
  ]);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
          ]),
          faqLd(INDUSTRY_FAQS),
        )}
      />

      <PageHead
        label="Industries"
        title="Same six systems."
        titleAccent="Your sector's vocabulary."
        lead="A bilty, a batch expiry, a job card, a fee instalment, a demand letter. The software underneath is the same engineering; what decides whether it gets used is whether it speaks the language your team already uses out loud."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ]}
        tags={industries.map((i) => i.short)}
        aside={
          <Card className="p-6">
            <Label className="mb-5">At a glance</Label>
            <dl className="space-y-3.5">
              {[
                { k: "Sectors modelled", v: String(industries.length) },
                { k: "Systems per business", v: String(pillars.length) },
                { k: "Shipped in", v: "4 sectors" },
                { k: "Mapping sessions", v: "Free" },
              ].map((r) => (
                <div
                  key={r.k}
                  className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0"
                >
                  <dt className="label">{r.k}</dt>
                  <dd className="text-right text-[0.8125rem] font-medium">{r.v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        }
      />

      <Rule />
      <IndustriesSection
        industries={industries}
        services={services}
        heading={false}
        settings={settings}
      />
      <Systems pillars={pillars} services={services} settings={settings} />
      <Faq
        items={INDUSTRY_FAQS}
        label="Sector questions"
        title="Before you ask"
        lead="Including whether we are the wrong people for your sector."
      />
      <Cta settings={settings} />
    </>
  );
}
