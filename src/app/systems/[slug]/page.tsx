import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { pillars as seedPillars } from "@/lib/content/pillars";
import { getPillar, getPillars, getServices } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, faqLd, itemListLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site.config";
import { Reveal } from "@/components/motion";

type RouteParams = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return seedPillars.map((p) => ({ slug: p.key }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPillar(slug);
  if (!p) return pageMeta({ title: "Not found", description: "", noIndex: true });
  return pageMeta({
    title: p.seoTitle || p.name,
    description: p.summary,
    path: `/systems/${p.key}`,
    keywords: p.keywords,
  });
}

export default async function SystemPage({ params }: RouteParams) {
  const { slug } = await params;
  const [p, pillars, services] = await Promise.all([
    getPillar(slug),
    getPillars(),
    getServices(),
  ]);
  if (!p) notFound();

  const others = pillars.filter((x) => x.key !== p.key);
  const related = services.filter((s) => p.services.includes(s.slug));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Systems", path: "/systems" },
            { name: p.name, path: `/systems/${p.key}` },
          ]),
          faqLd(p.faqs),
          itemListLd(
            `Services that build ${p.name}`,
            related.map((s) => ({ name: s.title, path: `/services/${s.slug}` })),
          ),
        )}
      />

      <PageHead
        label={`System ${p.index}`}
        title={p.name}
        lead={p.question}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Systems", path: "/systems" },
          { name: p.name, path: `/systems/${p.key}` },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">At a glance</span>
            </div>
            <dl className="mb-6 space-y-3">
              <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5">
                <dt className="label">Services in this system</dt>
                <dd className="text-right text-[0.8125rem]">{related.length}</dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2">
              <ButtonLink href="/contact" variant="primary" size="md" className="w-full">
                Talk through this system
                <Arrow />
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(`Hi ABM Tech — I want to talk about ${p.name.toLowerCase()}.`)}
                variant="whatsapp"
                size="md"
                external
                className="w-full"
              >
                <WhatsAppGlyph />
                WhatsApp
              </ButtonLink>
            </div>
          </Card>
        }
      />

      <Rule />

      <section className="page-x py-16">
        <div className="bay">
          <Reveal>
            <p className="font-display text-xl leading-[1.4] tracking-[-0.015em] sm:text-2xl">
              {p.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label className="mb-9">What exists once this is in place</Label>
          </Reveal>
          <ul className="grid gap-4 border-t border-line pt-8 md:grid-cols-2">
            {p.outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-dim">
                <Tick className="mt-0.5 size-4! shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <>
          <Rule />
          <section className="page-x py-16 sm:py-20">
            <div className="bay">
              <Reveal>
                <Label className="mb-9">Built by these services</Label>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-3">
                {related.map((s) => (
                  <Reveal key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="block h-full">
                      <Card lift className="flex h-full flex-col p-6">
                        <span className="mb-4 font-mono text-[0.625rem] tabular-nums text-brand/70">
                          {s.index}
                        </span>
                        <h3 className="t-h3 mb-3 font-display">{s.title}</h3>
                        <p className="mb-6 text-[0.875rem] leading-relaxed text-ink-dim">
                          {s.summary}
                        </p>
                        <span className="ul-draw mt-auto inline-flex items-center gap-2 text-[0.8125rem] font-medium text-brand-ink">
                          See this service
                          <Arrow />
                        </span>
                      </Card>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <Rule />
      <Faq
        items={p.faqs}
        label={`${p.name} FAQ`}
        title="Before you ask"
      />

      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Reveal>
            <Label className="mb-7">The other five systems</Label>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.key}
                href={`/systems/${o.key}`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
                <span className="font-mono text-[0.5625rem] tabular-nums text-brand/70">
                  {o.index}
                </span>
                <span className="text-[0.875rem]">{o.name}</span>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
