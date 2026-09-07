import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { comparisons } from "@/lib/content/compare";
import { getService, getSettings } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, faqLd } from "@/lib/seo";
import { Reveal } from "@/components/motion";
import { Cta } from "@/components/sections/Cta";

type RouteParams = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const c = comparisons.find((x) => x.slug === slug);
  if (!c) return pageMeta({ title: "Not found", description: "", noIndex: true });
  return pageMeta({
    title: c.seoTitle,
    description: c.summary,
    path: `/compare/${c.slug}`,
    keywords: c.keywords,
    type: "article",
  });
}

export default async function ComparisonPage({ params }: RouteParams) {
  const { slug } = await params;
  const c = comparisons.find((x) => x.slug === slug);
  if (!c) notFound();

  const [service, settings] = await Promise.all([
    getService(c.serviceSlug),
    getSettings(),
  ]);

  const others = comparisons.filter((x) => x.slug !== c.slug);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/compare" },
            { name: c.short, path: `/compare/${c.slug}` },
          ]),
          faqLd(c.faqs),
          {
            "@type": "Article",
            headline: c.title,
            description: c.summary,
          },
        )}
      />

      <PageHead
        label={`Compare ${c.index}`}
        title={c.title}
        lead={c.summary}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: c.short, path: `/compare/${c.slug}` },
        ]}
        aside={
          service && (
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                <span className="label">The custom option</span>
              </div>
              <div className="mb-2 font-display text-3xl tracking-[-0.03em]">
                {service.from > 0 ? `₹${service.from.toLocaleString("en-IN")}` : "Quote"}
              </div>
              <p className="mb-5 text-[0.8125rem] leading-relaxed text-ink-dim">
                {service.timeline}
              </p>
              <ButtonLink href={`/services/${service.slug}`} variant="primary" size="md" className="w-full">
                See what it includes
                <Arrow />
              </ButtonLink>
            </Card>
          )
        }
      />

      <Rule />

      <section className="page-x py-16">
        <div className="bay">
          <Reveal>
            <p className="font-display text-xl leading-[1.4] tracking-[-0.015em] sm:text-2xl">
              {c.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label className="mb-8">Side by side</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <caption className="sr-only">{c.title} comparison table</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="label py-3.5 pr-4">Dimension</th>
                    <th scope="col" className="label py-3.5 pr-4">{c.incumbent}</th>
                    <th scope="col" className="label py-3.5">Custom build</th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r) => (
                    <tr key={r.dimension} className="border-b border-line">
                      <th scope="row" className="py-4 pr-4 align-top font-display text-[0.875rem] font-medium">
                        {r.dimension}
                      </th>
                      <td className="py-4 pr-4 align-top text-[0.8125rem] text-ink-dim">
                        {r.incumbent}
                      </td>
                      <td className="py-4 align-top text-[0.8125rem] text-ink-dim">
                        {r.custom}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <Card className="h-full p-6 sm:p-7">
              <Label className="mb-4">When {c.incumbent} is the right answer</Label>
              <p className="text-[0.9375rem] leading-[1.75] text-ink-dim">
                {c.whenIncumbentWins}
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="h-full p-6 sm:p-7">
              <Label className="mb-4">When custom is the right answer</Label>
              <p className="text-[0.9375rem] leading-[1.75] text-ink-dim">
                {c.whenCustomWins}
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <Rule />
      <Faq items={c.faqs} label={`${c.short} FAQ`} title="Before you switch" />

      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Label className="mb-7">Other comparisons</Label>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/compare/${o.slug}`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
                <span className="font-mono text-[0.5625rem] tabular-nums text-brand/70">{o.index}</span>
                <span className="text-[0.875rem]">{o.title}</span>
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
