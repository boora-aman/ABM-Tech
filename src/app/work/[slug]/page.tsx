import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/sections/PageHead";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { projects as seedProjects } from "@/lib/content/work";
import { getProject, getProjects, getService, getIndustry } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site.config";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

type RouteParams = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return seedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return pageMeta({ title: "Not found", description: "", noIndex: true });
  return pageMeta({
    title: `${p.title} — ${p.sector} case study`,
    description: p.summary,
    path: `/work/${p.slug}`,
    keywords: [
      `${p.sector.toLowerCase()} software case study`,
      `${p.title.toLowerCase()} india`,
    ],
    type: "article",
  });
}

export default async function ProjectPage({ params }: RouteParams) {
  const { slug } = await params;
  const [p, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!p) notFound();

  const [service, industry] = await Promise.all([
    getService(p.serviceSlug),
    p.industrySlug ? getIndustry(p.industrySlug) : Promise.resolve(null),
  ]);

  const others = projects.filter((x) => x.slug !== p.slug);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: p.title, path: `/work/${p.slug}` },
          ]),
          {
            "@type": "CreativeWork",
            "@id": absoluteUrl(`/work/${p.slug}#work`),
            name: p.title,
            about: p.sector,
            description: p.summary,
            url: absoluteUrl(`/work/${p.slug}`),
            dateCreated: p.year,
            creator: { "@id": absoluteUrl("/#organization") },
          },
        )}
      />

      <PageHead
        label={`Case study ${p.index}`}
        title={p.title}
        lead={p.summary}
        tags={p.stack}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: p.title, path: `/work/${p.slug}` },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">At a glance</span>
            </div>

            <dl className="mb-6 space-y-3">
              <Row k="Sector" v={p.sector} />
              <Row k="Year" v={p.year} />
              {service && <Row k="Service" v={service.short} />}
            </dl>

            <div className="mb-6 border-t border-line pt-4">
              <span className="label mb-2 block">Spine</span>
              <p className="text-[0.8125rem] leading-relaxed">{p.spine}</p>
            </div>

            {service && (
              <ButtonLink
                href={`/services/${service.slug}`}
                variant="primary"
                size="md"
                className="w-full"
              >
                See this service
                <Arrow />
              </ButtonLink>
            )}
          </Card>
        }
      />

      <Rule />

      {/* -------------------------------- Outcomes ------------------------- */}
      <section className="page-x py-16">
        <div className="bay">
          <Stagger className="grid gap-5 grid-cols-2 md:grid-cols-4" step={0.04}>
            {p.outcomes.map((o) => (
              <StaggerItem key={o.metric}>
                <Card className="p-6">
                  <div className="font-display text-2xl tracking-[-0.02em] text-brand-ink">
                    {o.value}
                  </div>
                  <div className="label mt-2">{o.metric}</div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Rule />

      {/* --------------------------------- Problem -------------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <Label className="mb-5">The problem</Label>
            <p className="text-[0.9375rem] leading-[1.75] text-ink-dim">{p.problem}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <Label className="mb-5">What we built</Label>
            <p className="text-[0.9375rem] leading-[1.75] text-ink-dim">{p.built}</p>
          </Reveal>
        </div>
      </section>

      <Rule />

      {/* --------------------------------- Guts ------------------------------ */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label className="mb-9">Under the hood</Label>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {p.guts.map((g) => (
              <Reveal key={g.label}>
                <Card className="h-full p-6">
                  <span className="label mb-4 block">{g.label}</span>
                  <ul className="space-y-2">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="font-mono text-[0.75rem] leading-snug text-ink-dim"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- Service & industry links ---------------- */}
      {(service || industry) && (
        <>
          <Rule />
          <section className="page-x py-14">
            <div className="bay flex flex-wrap items-center gap-3">
              <Label className="mr-2">Built as</Label>
              {service && (
                <Link
                  href={`/services/${service.slug}`}
                  className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
                >
                  <span className="text-[0.875rem]">{service.title}</span>
                  <Arrow />
                </Link>
              )}
              {industry && (
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
                >
                  <Chip brand>{industry.short}</Chip>
                  <span className="text-[0.875rem]">{industry.name}</span>
                  <Arrow />
                </Link>
              )}
            </div>
          </section>
        </>
      )}

      {/* ------------------------------ Other projects ------------------------ */}
      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Reveal>
            <Label className="mb-7">Other engagements</Label>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/work/${o.slug}`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
                <span className="font-mono text-[0.5625rem] tabular-nums text-brand/70">
                  {o.index}
                </span>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0">
      <dt className="label">{k}</dt>
      <dd className="text-right text-[0.8125rem]">{v}</dd>
    </div>
  );
}
