import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/sections/PageHead";
import { Cta } from "@/components/sections/Cta";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { comparisons } from "@/lib/content/compare";
import { getSettings } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, itemListLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Custom Software vs Off-the-Shelf — Honest Comparisons",
  description:
    "Custom CRM vs Zoho, custom ERP vs Tally and ERPNext, custom website vs WordPress, custom store vs Shopify — including when the off-the-shelf product is genuinely the right answer.",
  path: "/compare",
  keywords: [
    "custom software vs off the shelf india",
    "zoho crm alternative",
    "tally alternative",
    "shopify alternative india",
  ],
});

export const revalidate = 3600;

export default async function ComparePage() {
  const settings = await getSettings();

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/compare" },
          ]),
          itemListLd(
            "Comparisons",
            comparisons.map((c) => ({ name: c.title, path: `/compare/${c.slug}` })),
          ),
        )}
      />

      <PageHead
        label="Compare"
        title="Custom, or the tool"
        titleAccent="you already pay for?"
        lead="Five honest comparisons — including exactly when the off-the-shelf product wins and we'd tell you to keep it. A shorter honest answer earns more referrals than a padded proposal."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ]}
      />

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <div className="grid gap-5 md:grid-cols-2">
            {comparisons.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`} className="block h-full">
                <Card lift className="flex h-full flex-col p-6 sm:p-7">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="font-mono text-[0.625rem] tabular-nums text-brand/70">
                      {c.index}
                    </span>
                    <Chip brand>{c.short}</Chip>
                  </div>
                  <h3 className="t-h3 mb-3 font-display">{c.title}</h3>
                  <p className="mb-6 text-[0.875rem] leading-relaxed text-ink-dim">
                    {c.summary}
                  </p>
                  <span className="ul-draw mt-auto inline-flex items-center gap-2 text-[0.8125rem] font-medium text-brand-ink">
                    Read the comparison
                    <Arrow />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Cta settings={settings} />
    </>
  );
}
