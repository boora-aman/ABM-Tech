import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label, Chip, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { services } from "@/lib/content/services";
import { pageMeta, graph, breadcrumbLd, faqLd, serviceLd } from "@/lib/seo";
import { inr, inrShort } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = pageMeta({
  title: "Pricing — every service, every figure, in the open",
  description:
    "Transparent INR pricing for custom CRM from ₹12,000, business websites from ₹6,000, dynamic sites with admin panels from ₹15,000, ERP from ₹15,000, full platforms from ₹20,000, plus AI automation and local SEO.",
  path: "/pricing",
  keywords: [
    "crm development price india",
    "website development cost india",
    "erp software price india",
    "billing software development cost",
    "ai automation pricing india",
  ],
});

const PRICING_FAQS = [
  {
    q: "Why publish prices when most agencies don't?",
    a: "Because hidden pricing wastes both sides' time. A published figure means the people who enquire already know the range, so the first call is about whether the work is right rather than whether you can afford it. It also means we cannot quote the same scope differently to two clients.",
  },
  {
    q: "Are these fixed, or do they move after discovery?",
    a: "The figure is fixed against the scope listed for that service. If discovery reveals work outside it — an extra integration, a migration nobody mentioned — we quote that separately in writing before it starts. What does not happen is a price that drifts upward mid-project.",
  },
  {
    q: "Is GST included?",
    a: "No. All figures are exclusive of GST, added at the applicable rate on invoice. Third-party costs — hosting, domains, SMS and WhatsApp API charges, app store fees, LLM API usage — are billed at actuals with no markup.",
  },
  {
    q: "What are the payment terms?",
    a: "Projects: 40% on signing, 40% at the agreed mid-point milestone, 20% on handover. Retainers: monthly in advance, cancellable with 30 days' notice and no lock-in.",
  },
  {
    q: "What if my budget is below the floor?",
    a: "Tell us the number. We will either scope something honest inside it, or say plainly that what you want cannot be done well for that and what we would do instead — which is sometimes 'use this off-the-shelf tool and spend nothing with us'. That answer costs us a sale and earns a referral.",
  },
  {
    q: "Do you offer a discount for paying annually?",
    a: "Two months free on any retainer paid twelve months up front. We don't push it — a client who can leave monthly is a client we have to keep earning, and that produces better work.",
  },
];

export default function PricingPage() {
  const priced = services.filter((s) => s.from > 0).sort((a, b) => a.from - b.from);
  const floor = priced[0];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          ...services.map((s) => serviceLd(s)),
          faqLd(PRICING_FAQS),
        )}
      />

      <PageHead
        label="Pricing"
        title="Published, itemised,"
        titleAccent="and exclusive of hand-waving."
        lead="Every service with its starting figure, what that figure includes, and what it deliberately excludes. All in INR, exclusive of GST, fixed against a written scope."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">Entry point</span>
            </div>
            <div className="mb-2 font-display text-4xl tracking-[-0.03em]">
              {inr(floor.from)}
            </div>
            <p className="mb-5 text-[0.8125rem] leading-relaxed text-ink-dim">
              The smallest engagement we take on — {floor.short.toLowerCase()},
              delivered in {floor.timeline.toLowerCase()}.
            </p>
            <ButtonLink
              href={`/services/${floor.slug}`}
              variant="primary"
              size="md"
              className="w-full"
            >
              See what it includes
              <Arrow />
            </ButtonLink>
          </Card>
        }
      />

      <Rule />

      {/* ------------------------ The comparison table ------------------- */}
      <section className="page-x py-16">
        <div className="bay">
          <Reveal>
            <Label  className="mb-8">
              All services at a glance
            </Label>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <caption className="sr-only">
                  ABM Tech service pricing: starting figure, billing mode,
                  timeline and audience for each service.
                </caption>
                <thead>
                  <tr className="border-b border-hair">
                    <th scope="col" className="label py-3.5 pr-4">Service</th>
                    <th scope="col" className="label py-3.5 pr-4">From</th>
                    <th scope="col" className="label py-3.5 pr-4">Billing</th>
                    <th scope="col" className="label py-3.5 pr-4">Timeline</th>
                    <th scope="col" className="label py-3.5">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr
                      key={s.slug}
                      className="group border-b border-hair transition-colors hover:bg-white/[0.015]"
                    >
                      <th scope="row" className="py-4 pr-4 align-top">
                        <Link
                          href={`/services/${s.slug}`}
                          className="flex items-baseline gap-2"
                        >
                          <span className="font-mono text-[0.625rem] tabular-nums text-flare/70">
                            {s.index}
                          </span>
                          <span className="font-display text-[0.9375rem] tracking-[-0.01em] transition-colors group-hover:text-flare-hi">
                            {s.title}
                          </span>
                        </Link>
                      </th>
                      <td className="py-4 pr-4 align-top font-display text-[0.9375rem] tabular-nums whitespace-nowrap">
                        {s.from > 0 ? `${inrShort(s.from)}+` : "Quote"}
                      </td>
                      <td className="py-4 pr-4 align-top text-[0.8125rem] text-ink-dim whitespace-nowrap">
                        {s.priceMode === "retainer"
                          ? "Monthly"
                          : s.priceMode === "quote"
                            ? "After audit"
                            : "One-off"}
                      </td>
                      <td className="py-4 pr-4 align-top text-[0.8125rem] text-ink-dim whitespace-nowrap">
                        {s.timeline}
                      </td>
                      <td className="py-4 align-top text-[0.8125rem] text-ink-dim">
                        {s.bestFor}
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

      {/* ---------------------------- Detail cards ------------------------ */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label  className="mb-9">
              What each figure buys
            </Label>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" step={0.05}>
            {services.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <Card leak className="flex h-full flex-col p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="font-mono text-[0.625rem] tabular-nums text-flare/70">
                      [{s.index}]
                    </span>
                    <Chip brand={s.priceMode !== "quote"}>
                      {s.priceMode === "retainer"
                        ? "Monthly"
                        : s.priceMode === "quote"
                          ? "Quote"
                          : "One-off"}
                    </Chip>
                  </div>

                  <h3 className="t-h3 mb-3 font-display">{s.title}</h3>

                  <div className="mb-5 flex items-baseline gap-2">
                    <span className="font-display text-3xl tracking-[-0.03em] tabular-nums">
                      {s.from > 0 ? inrShort(s.from) : "—"}
                    </span>
                    <span className="label">
                      {s.from > 0 ? "starting" : "after audit"}
                    </span>
                  </div>

                  <p className="mb-5 text-[0.875rem] leading-relaxed text-ink-dim">
                    {s.summary}
                  </p>

                  <ul className="mb-5 flex-1 space-y-2">
                    {s.deliverables.slice(0, 5).map((d) => (
                      <li key={d} className="flex gap-2.5 text-[0.8125rem] leading-snug">
                        <Tick />
                        <span className="text-ink-dim">{d}</span>
                      </li>
                    ))}
                    {s.deliverables.length > 5 && (
                      <li className="label pl-4">
                        +{s.deliverables.length - 5} more
                      </li>
                    )}
                  </ul>

                  {s.excludes && s.excludes.length > 0 && (
                    <p className="mb-5 text-[0.75rem] leading-relaxed text-ink-faint">
                      <span className="label">Excludes: </span>
                      {s.excludes.join(" · ")}
                    </p>
                  )}

                  <ButtonLink
                    href={`/services/${s.slug}`}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Full detail
                    <Arrow />
                  </ButtonLink>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.08}>
            <Card className="mt-8 p-6 sm:p-8">
              <Label className="mb-5">Where projects actually land</Label>
              <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-dim">
                The figures above are genuine floors, not bait. A ₹15,000 ERP is a
                single-location system with inventory, billing and reporting; a
                multi-branch build with approval hierarchies and integrations is
                ₹40,000 to ₹1,50,000. A ₹20,000 platform is a focused
                single-role app on a well-defined billing flow; most land between
                ₹45,000 and ₹1,50,000 once roles and app store work are counted.
                We tell you which bracket you are in on the first call — before
                you have spent anything.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <Rule />
      <Faq
        items={PRICING_FAQS}
        
        label="Pricing FAQ"
        title="About the money"
        lead="The commercial questions, answered before you have to ask them."
      />
    </>
  );
}
