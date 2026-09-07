import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/sections/PageHead";
import { Cta } from "@/components/sections/Cta";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { cities, dehradunServicePages } from "@/lib/content/locations";
import { getSettings } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, itemListLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Where We Work — Dehradun and the Wider Doon Valley",
  description:
    "ABM Tech is based in Dehradun and works with businesses across Haridwar, Rishikesh and Haldwani remotely from that base — the honest version, not an inflated service-area list.",
  path: "/locations",
  keywords: ["software company dehradun", "software company uttarakhand"],
});

export const revalidate = 3600;

export default async function LocationsPage() {
  const settings = await getSettings();

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
          ]),
          itemListLd(
            "Locations",
            cities.map((c) => ({ name: c.name, path: `/locations/${c.slug}` })),
          ),
        )}
      />

      <PageHead
        label="Locations"
        title="One office."
        titleAccent="Four cities, honestly described."
        lead="ABM Tech is based in Dehradun. Haridwar, Rishikesh and Haldwani are served remotely from that base — we say so plainly rather than list a service area we can't back up with a local presence."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ]}
      />

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Label className="mb-9">Cities</Label>
          <div className="grid gap-5 md:grid-cols-2">
            {cities.map((c) => (
              <Link key={c.slug} href={`/locations/${c.slug}`} className="block h-full">
                <Card lift className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <h3 className="t-h3 font-display">{c.name}</h3>
                    {c.isBase && <Chip brand>Based here</Chip>}
                  </div>
                  <p className="mb-6 text-[0.875rem] leading-relaxed text-ink-dim">
                    {c.intro.slice(0, 140)}…
                  </p>
                  <span className="ul-draw mt-auto inline-flex items-center gap-2 text-[0.8125rem] font-medium text-brand-ink">
                    Read more
                    <Arrow />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Label className="mb-9">Dehradun, by service</Label>
          <div className="flex flex-wrap gap-2">
            {dehradunServicePages.map((d) => (
              <Link
                key={d.slug}
                href={`/dehradun/${d.slug}`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
                <span className="text-[0.875rem]">{d.title}</span>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Cta settings={settings} />
    </>
  );
}
