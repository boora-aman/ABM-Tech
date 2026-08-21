import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { services, serviceBySlug } from "@/lib/content/services";
import { projects } from "@/lib/content/work";
import { pageMeta, graph, breadcrumbLd, serviceLd, faqLd } from "@/lib/seo";
import { inr, inrShort } from "@/lib/utils";
import { whatsappLink } from "@/lib/site.config";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

type RouteParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return pageMeta({ title: "Not found", description: "", noIndex: true });
  return pageMeta({
    title: s.title,
    description: s.summary,
    path: `/services/${s.slug}`,
    keywords: s.keywords,
  });
}

export default async function ServicePage({ params }: RouteParams) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const others = services.filter((x) => x.slug !== s.slug);
  const related = projects.filter((p) => p.serviceSlug === s.slug);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.short, path: `/services/${s.slug}` },
          ]),
          serviceLd(s),
          faqLd(s.faqs),
        )}
      />

      <PageHead
        label="Service"
        title={s.title}
        lead={s.summary}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: s.short, path: `/services/${s.slug}` },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">At a glance</span>
            </div>

            <div className="mb-5">
              <div className="font-display text-4xl tracking-[-0.03em] tabular-nums">
                {s.from > 0 ? inr(s.from) : "On request"}
              </div>
              <div className="label mt-2">
                {s.priceMode === "retainer"
                  ? "per month, ex-GST"
                  : s.priceMode === "quote"
                    ? "quoted after audit"
                    : "one-off, ex-GST"}
              </div>
            </div>

            <dl className="mb-6 space-y-3">
              <Row k="Timeline" v={s.timeline} />
              <Row k="Deliverables" v={`${s.deliverables.length} items`} />
              <Row k="First milestone" v={s.phases[0]?.when ?? "Week 1"} />
            </dl>

            <div className="mb-6 border-t border-hair pt-4">
              <span className="label mb-2 block">Best for</span>
              <p className="text-[0.8125rem] leading-relaxed">{s.bestFor}</p>
            </div>

            <div className="flex flex-col gap-2">
              <ButtonLink
                href={`/contact?service=${s.slug}`}
                variant="primary"
                size="md"
                className="w-full"
              >
                Enquire about this
                <Arrow />
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(`Hi ABM Tech — I'm interested in ${s.title}.`)}
                variant="outline"
                size="md"
                external
                className="w-full"
              >
                WhatsApp
              </ButtonLink>
            </div>
          </Card>
        }
      />

      <Rule />

      {/* --------------------------- Intro + stack ----------------------- */}
      <section className="page-x py-16">
        <div className="bay grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <Reveal>
            <p className="font-display text-xl leading-[1.4] tracking-[-0.015em] sm:text-2xl">
              {s.intro}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="p-6">
              <Label className="mb-5">Typical stack</Label>
              <div className="flex flex-wrap gap-1.5">
                {s.stack.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <Rule />

      {/* ---------------------------- Deliverables ----------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label  className="mb-9">
              What you get
            </Label>
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <Stagger className="border-t border-hair" step={0.03}>
              {s.deliverables.map((d, i) => (
                <StaggerItem key={d}>
                  <div className="flex items-start gap-4 border-b border-hair py-3.5">
                    <span className="font-mono text-[0.625rem] tabular-nums text-flare/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] leading-snug text-ink-dim">
                      {d}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {s.excludes && s.excludes.length > 0 && (
              <Reveal delay={0.08}>
                <Card className="p-6">
                  <Label className="mb-5">Not included</Label>
                  <ul className="space-y-3">
                    {s.excludes.map((e) => (
                      <li
                        key={e}
                        className="flex items-start gap-3 text-[0.875rem] text-ink-faint"
                      >
                        <span
                          aria-hidden
                          className="mt-2 h-px w-3 shrink-0 bg-ink-faint"
                        />
                        {e}
                      </li>
                    ))}
                  </ul>
                  <Rule className="my-5" />
                  <p className="text-[0.8125rem] leading-relaxed text-ink-faint">
                    Listed as plainly as the inclusions. Anything here can be
                    scoped on top — quoted before it starts, never assumed.
                  </p>
                </Card>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <Rule />

      {/* ---------------------------- Capabilities ----------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label  className="mb-9">
              How it works
            </Label>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2" step={0.05}>
            {s.capabilities.map((c, i) => (
              <StaggerItem key={c.title} className="h-full">
                <Card leak className="flex h-full flex-col p-6">
                  <span className="mb-4 font-mono text-[0.625rem] tabular-nums text-flare/70">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <h3 className="t-h3 mb-3 font-display">{c.title}</h3>
                  <p className="text-[0.875rem] leading-[1.7] text-ink-dim">
                    {c.body}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Rule />

      {/* ------------------------------- Phases -------------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label  className="mb-9">
              Delivery sequence
            </Label>
          </Reveal>
          <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {s.phases.map((p, i) => (
              <Reveal as="li" key={p.step} delay={0.05 * i}>
                <Card className="flex h-full flex-col p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="flare-fill grid size-8 place-items-center rounded-tight font-mono text-[0.625rem] font-semibold tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="label whitespace-nowrap">{p.when}</span>
                  </div>
                  <h3 className="mb-3 font-display text-[1.0625rem] tracking-[-0.01em]">
                    {p.step}
                  </h3>
                  <p className="text-[0.8125rem] leading-relaxed text-ink-dim">
                    {p.detail}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------- Related work ----------------------- */}
      {related.length > 0 && (
        <>
          <Rule />
          <section className="page-x py-16 sm:py-20">
            <div className="bay">
              <Reveal>
                <Label  className="mb-9">
                  Delivered with this service
                </Label>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-2">
                {related.map((p) => (
                  <Reveal key={p.slug}>
                    <Card leak className="h-full p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <Chip brand>{p.sector}</Chip>
                        <Chip>{p.year}</Chip>
                      </div>
                      <h3 className="t-h3 mb-3 font-display">{p.title}</h3>
                      <p className="mb-6 text-[0.875rem] leading-relaxed text-ink-dim">
                        {p.summary}
                      </p>
                      <dl className="grid grid-cols-2 gap-4">
                        {p.outcomes.slice(0, 2).map((o) => (
                          <div key={o.metric}>
                            <dd className="font-display text-base text-flare-hi">
                              {o.value}
                            </dd>
                            <dt className="label mt-1">{o.metric}</dt>
                          </div>
                        ))}
                      </dl>
                    </Card>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.06}>
                <ButtonLink href="/work" variant="outline" className="mt-6">
                  All engagements
                  <Arrow />
                </ButtonLink>
              </Reveal>
            </div>
          </section>
        </>
      )}

      <Rule />
      <Faq
        items={s.faqs}
        
        label={`${s.short} FAQ`}
        title="Straight answers"
        lead="Including where the honest answer is 'no' or 'buy something else'."
      />

      {/* -------------------------- Other services ----------------------- */}
      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Reveal>
            <Label className="mb-7">Other services</Label>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/services/${o.slug}`}
                className="group/btn inline-flex items-center gap-3 rounded-tight border border-hair px-4 py-2.5 transition-colors hover:border-hair-warm"
              >
                <span className="font-mono text-[0.5625rem] tabular-nums text-flare/70">
                  {o.index}
                </span>
                <span className="text-[0.875rem]">{o.short}</span>
                <span className="label">
                  {o.from > 0 ? `${inrShort(o.from)}+` : "Quote"}
                </span>
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
    <div className="flex items-baseline justify-between gap-3 border-b border-hair pb-2.5 last:border-0 last:pb-0">
      <dt className="label">{k}</dt>
      <dd className="text-right text-[0.8125rem]">{v}</dd>
    </div>
  );
}
