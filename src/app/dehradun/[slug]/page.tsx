import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { dehradunServicePages } from "@/lib/content/locations";
import { getService } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, faqLd, serviceLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site.config";
import { Reveal } from "@/components/motion";

type RouteParams = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return dehradunServicePages.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const d = dehradunServicePages.find((x) => x.slug === slug);
  if (!d) return pageMeta({ title: "Not found", description: "", noIndex: true });
  return pageMeta({
    title: d.seoTitle,
    description: d.intro,
    path: `/dehradun/${d.slug}`,
    keywords: d.keywords,
  });
}

export default async function DehradunServicePage({ params }: RouteParams) {
  const { slug } = await params;
  const d = dehradunServicePages.find((x) => x.slug === slug);
  if (!d) notFound();

  const service = await getService(d.serviceSlug);
  const others = dehradunServicePages.filter((x) => x.slug !== d.slug);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: "Dehradun", path: "/locations/dehradun" },
            { name: d.title, path: `/dehradun/${d.slug}` },
          ]),
          faqLd(d.faqs),
          service ? serviceLd(service) : null,
        )}
      />

      <PageHead
        label="Dehradun"
        title={d.title}
        lead={d.intro}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: "Dehradun", path: "/locations/dehradun" },
          { name: d.title, path: `/dehradun/${d.slug}` },
        ]}
        aside={
          service && (
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                <span className="label">Featured service</span>
              </div>
              <div className="mb-2 font-display text-3xl tracking-[-0.03em]">
                {service.from > 0 ? `₹${service.from.toLocaleString("en-IN")}` : "Quote"}
              </div>
              <p className="mb-5 text-[0.8125rem] leading-relaxed text-ink-dim">
                {service.timeline}
              </p>
              <div className="flex flex-col gap-2">
                <ButtonLink href={`/services/${service.slug}`} variant="primary" size="md" className="w-full">
                  See what it includes
                  <Arrow />
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink(`Hi ABM Tech — I'm in Dehradun and want to talk about ${service.title}.`)}
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
          )
        }
      />

      <Rule />
      <Faq items={d.faqs} label="Before you ask" title="Local questions" />

      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Label className="mb-7">Other Dehradun pages</Label>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/dehradun/${o.slug}`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
                <span className="text-[0.875rem]">{o.title}</span>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
