import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { Showcase } from "@/components/sections/Showcase";
import { Cta } from "@/components/sections/Cta";
import { Card, Rule, Label } from "@/components/ui/Panel";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProjects, getSlides } from "@/lib/content/repo";

import { pageMeta, graph, breadcrumbLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: "Our work — systems running for real businesses",
  description:
    "A pharmacy ERP on batch-level inventory, a field-service CRM with an offline technician app, multi-site billing with shift reconciliation, and an invoice extraction pipeline with human review.",
  path: "/work",
  keywords: [
    "software development case studies india",
    "erp implementation case study",
    "crm case study india",
  ],
});

export const revalidate = 3600;

export default async function WorkPage() {
  const [projects, slides] = await Promise.all([getProjects(), getSlides()]);
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
            name: "Projects",
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
        label="Our work"
        title="Systems already running"
        titleAccent="for real businesses."
        lead="Client names are withheld where the engagement is under NDA, but the systems, the numbers and the technology are real."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]}
      />

      <Showcase slides={slides} />
      <Rule />

      {/* Case detail — plain, readable, no interaction required */}
      <section className="defer-paint page-x py-20 sm:py-24">
        <div className="bay">
          <Label className="mb-10">Case detail</Label>
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((p) => (
              <Card as="article" key={p.slug} lift className="flex flex-col p-6 sm:p-7">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-[0.75rem] text-ink-faint">
                  <span>{p.sector}</span>
                  <span aria-hidden>·</span>
                  <span>{p.year}</span>
                </div>

                <h3 className="t-h3 mb-3">{p.title}</h3>
                <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-dim">
                  {p.summary}
                </p>

                <div className="mb-6 space-y-4">
                  <div>
                    <p className="label mb-1.5">The problem</p>
                    <p className="text-[0.875rem] leading-relaxed text-ink-dim">
                      {p.problem}
                    </p>
                  </div>
                  <div>
                    <p className="label mb-1.5">What we built</p>
                    <p className="text-[0.875rem] leading-relaxed text-ink-dim">
                      {p.built}
                    </p>
                  </div>
                </div>

                <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-5">
                  {p.outcomes.slice(0, 4).map((o) => (
                    <div key={o.metric}>
                      <dd className="font-display text-[1.0625rem] font-semibold brand-text">
                        {o.value}
                      </dd>
                      <dt className="label mt-1 normal-case tracking-normal!">
                        {o.metric}
                      </dt>
                    </div>
                  ))}
                </dl>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
