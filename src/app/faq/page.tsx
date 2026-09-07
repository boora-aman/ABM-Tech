import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";
import { Card, Rule, Label } from "@/components/ui/Panel";
import { Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGlobalFaqs, getCommitments, getServices, getSettings } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, faqLd } from "@/lib/seo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = pageMeta({
  title: "FAQ — pricing, ownership, timelines and how we work",
  description:
    "Answers on fixed pricing, code ownership, delivery timelines, support after launch, and when we'll tell you an off-the-shelf product is the better answer.",
  path: "/faq",
  keywords: [
    "custom software development faq",
    "software development cost india questions",
    "fixed price software development",
  ],
});

export const revalidate = 3600;

export default async function FaqPage() {
  const [faqs, commitments, services, settings] = await Promise.all([
    getGlobalFaqs(),
    getCommitments(),
    getServices(),
    getSettings(),
  ]);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqLd(faqs),
        )}
      />

      <PageHead
        label="FAQ"
        title="Questions,"
        titleAccent="answered plainly."
        lead="The questions people actually ask before hiring us — pricing, ownership, timelines, and where the honest answer is 'you don't need us'."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label className="mb-9">What we commit to on every engagement</Label>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" step={0.04}>
            {commitments.map((c) => (
              <StaggerItem key={c.index}>
                <Card lift className="flex h-full flex-col p-6">
                  <span className="mb-4 font-mono text-[0.625rem] tabular-nums text-brand/70">
                    [{c.index}]
                  </span>
                  <h3 className="t-h3 mb-3 font-display">{c.title}</h3>
                  <p className="text-[0.875rem] leading-[1.7] text-ink-dim">{c.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Rule />
      <Faq
        items={faqs}
        label="Common questions"
        title="Before you get in touch"
        lead="If your question isn't here, it's usually answered on the specific service page — every one of the 14 carries its own FAQ."
      />

      <Rule />
      <section className="page-x py-14">
        <div className="bay">
          <Reveal>
            <Label className="mb-7">Or jump straight to a service's own FAQ</Label>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}#faq`}
                className="group/btn inline-flex items-center gap-3 rounded-sm border border-line px-4 py-2.5 transition-colors hover:border-line-strong"
              >
                <span className="font-mono text-[0.5625rem] tabular-nums text-brand/70">
                  {s.index}
                </span>
                <span className="text-[0.875rem]">{s.short}</span>
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
