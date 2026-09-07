import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { Systems } from "@/components/sections/Systems";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPillars, getServices, getSettings } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, itemListLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The Six Systems Every Business Runs On",
  description:
    "Get found, capture demand, run operations, collect the money, work off the desk, know what's happening — the six loops every business depends on, and the services that build each one.",
  path: "/systems",
  keywords: [
    "business systems software india",
    "what software does a business need",
    "custom software architecture india",
  ],
});

export const revalidate = 3600;

export default async function SystemsPage() {
  const [pillars, services, settings] = await Promise.all([
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
            { name: "Systems", path: "/systems" },
          ]),
          itemListLd(
            "The six systems",
            pillars.map((p) => ({ name: p.name, path: `/systems/${p.key}` })),
          ),
        )}
      />

      <PageHead
        label="Systems"
        title="Six loops."
        titleAccent="Every business runs all of them."
        lead="Get found. Capture demand. Run operations. Collect the money. Work off the desk. Know what's happening. Some of yours are software, some are a register, some are a person who remembers things. Pick the one costing you the most."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Systems", path: "/systems" },
        ]}
      />

      <Systems pillars={pillars} services={services} showHeading={false} settings={settings} />
      <Cta settings={settings} />
    </>
  );
}
