import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { cities } from "@/lib/content/locations";
import { getIndustries, getIndustry } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, faqLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site.config";
import { Reveal } from "@/components/motion";

type RouteParams = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const c = cities.find((x) => x.slug === slug);
  if (!c) return pageMeta({ title: "Not found", description: "", noIndex: true });
  return pageMeta({
    title: c.seoTitle,
    description: c.intro,
    path: `/locations/${c.slug}`,
    keywords: c.keywords,
  });
}

export default async function CityPage({ params }: RouteParams) {
  const { slug } = await params;
  const c = cities.find((x) => x.slug === slug);
  if (!c) notFound();

  const allIndustries = await getIndustries();
  const related = allIndustries.filter((i) => c.sectors.includes(i.slug));
  const others = cities.filter((x) => x.slug !== c.slug);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: c.name, path: `/locations/${c.slug}` },
          ]),
          faqLd(c.faqs),
        )}
      />

      <PageHead
        label="Location"
        title={c.name}
        lead={c.isBase ? "Where ABM Tech is based." : "Served remotely from our Dehradun base."}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: c.name, path: `/locations/${c.slug}` },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">At a glance</span>
            </div>
            <div className="mb-6">
              <Chip brand={c.isBase}>{c.isBase ? "Based here" : "Served remotely"}</Chip>
            </div>
            <div className="flex flex-col gap-2">
              <ButtonLink href="/contact" variant="primary" size="md" className="w-full">
                Talk to us
                <Arrow />
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(`Hi ABM Tech — I'm in ${c.name} and want to talk about a project.`)}
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
              {c.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <>
          <Rule />
          <section className="page-x py-16 sm:py-20">
            <div className="bay">
              <Label className="mb-9">Sectors we hear from most in {c.name}</Label>
              <div className="flex flex-wrap gap-2">
                {related.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/industries/${i.slug}`}
                    className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
                  >
                    <span className="text-[0.875rem]">{i.name}</span>
                    <Arrow />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <Rule />
      <Faq items={c.faqs} label={`${c.name} FAQ`} title="Before you ask" />

      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Label className="mb-7">Other locations</Label>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/locations/${o.slug}`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
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
