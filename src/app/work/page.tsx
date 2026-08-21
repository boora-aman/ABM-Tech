import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { XRayShowcase } from "@/components/sections/XRayShowcase";
import { Panel, Rule, Datum, SectionLabel } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { projects } from "@/lib/content/work";
import { pageMeta, graph, breadcrumbLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: "Work — four systems, in production",
  description:
    "A pharmacy ERP on batch-level inventory, a field-service CRM with an offline technician app, multi-site billing with shift reconciliation, and an invoice extraction pipeline with human review.",
  path: "/work",
  keywords: [
    "software development case studies india",
    "erp implementation case study",
    "crm case study india",
    "ai automation case study",
  ],
});

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
          ]),
          {
            "@type": "ItemList",
            name: "Engagements",
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.title,
              url: absoluteUrl("/work"),
            })),
          },
        )}
      />

      <PageHead
        index="03"
        label="Work"
        title="Four systems,"
        titleAccent="all of them running."
        lead="Described by capability and outcome rather than by client name. Hover any showcase to dissolve the interface and read the structure underneath."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]}
        aside={
          <Panel marks className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <Datum className="pulse-dot" />
              <span className="meta-bright">On client detail</span>
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-ink-dim">
              Commercial engagements are under NDA, so clients are anonymised
              and the interfaces shown are abstract rather than fabricated
              screenshots. The architecture is real — that is what the X-ray
              view exposes, and a table list gives nothing away.
            </p>
          </Panel>
        }
      />

      <Rule />
      <XRayShowcase projects={projects} />
      <Rule />

      <section className="page-x py-16">
        <div className="bay">
          <Reveal>
            <Panel className="blueprint grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.4fr_auto] lg:items-center">
              <div>
                <SectionLabel className="mb-5">Your turn</SectionLabel>
                <h2 className="t-h2 mb-4">
                  Every one of these started as
                  <br />
                  <span className="flare-text">a spreadsheet and a complaint.</span>
                </h2>
                <p className="t-lead max-w-xl">
                  Describe the manual work that costs you the most hours. We
                  quote the system that removes it, or tell you plainly that a
                  tool you can buy would do the job better.
                </p>
              </div>
              <ButtonLink href="/contact" variant="flare" size="lg">
                Start a project
                <Arrow />
              </ButtonLink>
            </Panel>
          </Reveal>
        </div>
      </section>
    </>
  );
}
