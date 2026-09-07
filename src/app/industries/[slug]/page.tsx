import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { industries as seedIndustries } from "@/lib/content/industries";
import { getIndustry, getIndustries, getServices } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, faqLd, itemListLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site.config";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

type RouteParams = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

/* Built from the committed seed so the route set is known at build time even
   on a machine with no database — same pattern as /services/[slug]. */
export function generateStaticParams() {
  return seedIndustries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const ind = await getIndustry(slug);
  if (!ind) return pageMeta({ title: "Not found", description: "", noIndex: true });
  return pageMeta({
    title: ind.seoTitle || ind.name,
    description: ind.intro,
    path: `/industries/${ind.slug}`,
    keywords: ind.keywords,
  });
}

export default async function IndustryPage({ params }: RouteParams) {
  const { slug } = await params;
  const [ind, industries, services] = await Promise.all([
    getIndustry(slug),
    getIndustries(),
    getServices(),
  ]);
  if (!ind) notFound();

  const others = industries.filter((x) => x.slug !== ind.slug);
  const related = services.filter((s) => ind.services.includes(s.slug));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: ind.short, path: `/industries/${ind.slug}` },
          ]),
          faqLd(ind.faqs),
          itemListLd(
            `Services for ${ind.name}`,
            related.map((s) => ({ name: s.title, path: `/services/${s.slug}` })),
          ),
        )}
      />

      <PageHead
        label={`Industry ${ind.index}`}
        title={ind.name}
        lead={ind.pain}
        tags={related.map((s) => s.short)}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: ind.short, path: `/industries/${ind.slug}` },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">At a glance</span>
            </div>

            <dl className="mb-6 space-y-3">
              <Row k="Systems typically built" v={String(related.length)} />
              <Row k="Shipped in this sector" v={ind.featured ? "Yes" : "Modelled, not yet shipped"} />
              <Row k="Mapping session" v="Free" />
            </dl>

            <div className="mb-6 border-t border-line pt-4">
              <span className="label mb-2 block">What changes</span>
              <p className="text-[0.8125rem] leading-relaxed">{ind.outcome}</p>
            </div>

            <div className="flex flex-col gap-2">
              <ButtonLink
                href={`/contact?industry=${ind.slug}`}
                variant="primary"
                size="md"
                className="w-full"
              >
                Talk through our sector
                <Arrow />
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(`Hi ABM Tech — we're in ${ind.name} and want to talk through what you'd build for us.`)}
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

      {/* -------------------------------- Intro -------------------------- */}
      <section className="page-x py-16">
        <div className="bay">
          <Reveal>
            <p className="font-display text-xl leading-[1.4] tracking-[-0.015em] sm:text-2xl">
              {ind.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <Rule />

      {/* ------------------------------ Builds ----------------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label className="mb-9">What we build</Label>
          </Reveal>
          <Stagger className="grid gap-5 border-t border-line pt-8 md:grid-cols-2" step={0.04}>
            {ind.builds.map((b, i) => (
              <StaggerItem key={b}>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-[0.625rem] tabular-nums text-brand/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-ink-dim">{b}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* --------------------------- Related services ------------------- */}
      {related.length > 0 && (
        <>
          <Rule />
          <section className="page-x py-16 sm:py-20">
            <div className="bay">
              <Reveal>
                <Label className="mb-9">The services this usually draws on</Label>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-3">
                {related.map((s) => (
                  <Reveal key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="group block h-full">
                      <Card lift className="flex h-full flex-col p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="font-mono text-[0.625rem] tabular-nums text-brand/70">
                            {s.index}
                          </span>
                          <Chip>{s.priceMode === "quote" ? "Quote" : `${s.from > 0 ? `from ₹${s.from.toLocaleString("en-IN")}` : "Quote"}`}</Chip>
                        </div>
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
        items={ind.faqs}
        label={`${ind.short} FAQ`}
        title="Before you ask"
        lead="Including where the honest answer is 'that's a separate service' or 'ask during discovery'."
      />

      {/* -------------------------- Other industries ---------------------- */}
      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Reveal>
            <Label className="mb-7">Other industries</Label>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/industries/${o.slug}`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
                <span className="font-mono text-[0.5625rem] tabular-nums text-brand/70">
                  {o.index}
                </span>
                <span className="text-[0.875rem]">{o.short}</span>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0">
      <dt className="label">{k}</dt>
      <dd className="text-right text-[0.8125rem]">{v}</dd>
    </div>
  );
}
