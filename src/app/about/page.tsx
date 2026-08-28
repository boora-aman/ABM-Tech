import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { Approach } from "@/components/sections/Approach";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label, Chip, Tick } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, graph, breadcrumbLd, organizationLd, faqLd } from "@/lib/seo";
import { site } from "@/lib/site.config";
import { getServices, getCommitments, getSettings } from "@/lib/content/repo";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = pageMeta({
  title: "About — an engineering studio, not an agency",
  description:
    "ABM Tech is a software engineering studio building the six systems a business runs on — website, CRM, ERP, billing, mobile apps and automation — across 12 sectors. Fixed scope, fixed price, code you own, and a straight answer when off-the-shelf fits better.",
  path: "/about",
  keywords: ["about abm tech", "software studio india", "custom software company india"],
});

const ABOUT_FAQS = [
  {
    q: "You list 13 services across 12 sectors. Isn't that too broad to be good at?",
    a: "It would be, if they were 13 unrelated products. They are not — they are the same six systems assembled differently, on one stack, by the same people. A billing app and a CRM share a data model, an auth layer and a deployment pipeline; the difference is which nouns they hold. What we do not do is claim depth we lack: sectors we have shipped in are marked as such, and if your problem needs specialist domain knowledge we do not have, we say so.",
  },
  {
    q: "How big is the team?",
    a: "Small, deliberately. Everyone on an engagement writes production code, with specialist contractors brought in for defined pieces — design, mobile, content — rather than a bench of generalists billed against your budget. It means we take fewer projects at once and say no more often than an agency would.",
  },
  {
    q: "Why is your pricing so much lower than an agency's?",
    a: "Because there is no bench, no account manager layer and no sales commission built into the quote. The trade is honest: you get direct access to the people building it, and we cannot absorb scope creep the way a larger shop can — which is why scope is written down before anything starts.",
  },
  {
    q: "What sectors do you know well?",
    a: "Production systems have shipped in retail pharmacy, fuel and general retail, distribution, logistics and home/field services. We have modelled a further set — manufacturing, construction, education, hospitality, professional services, e-commerce, finance and non-profits — and we mark the difference rather than implying a portfolio we do not have. Sector knowledge matters more than people expect: knowing a pharmacy needs batch-level MRP, or that a fuel station reconciles per shift, is the difference between software that gets used and software abandoned in month two.",
  },
  {
    q: "Do you work with businesses outside India?",
    a: "Yes, remotely. Pricing is quoted in INR and time zones from Europe to Southeast Asia are straightforward. On-site phases for ERP rollouts would be scoped separately.",
  },
];

export const revalidate = 3600;

export default async function AboutPage() {
  const [services, commitments, settings] = await Promise.all([
    getServices(),
    getCommitments(),
    getSettings(),
  ]);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          organizationLd(),
          faqLd(ABOUT_FAQS),
        )}
      />

      <PageHead
        label="About"
        title="An engineering studio,"
        titleAccent="not an agency."
        lead={site.positioning}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        aside={
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              <span className="label">Studio</span>
            </div>
            <dl className="space-y-3.5">
              {[
                { k: "Founded", v: site.founded },
                { k: "Services", v: String(services.length) },
                { k: "Billing", v: "Fixed price" },
                { k: "Code ownership", v: "Client, day one" },
                { k: "Lock-in", v: "None" },
              ].map((r) => (
                <div
                  key={r.k}
                  className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0"
                >
                  <dt className="label">{r.k}</dt>
                  <dd className="text-right text-[0.8125rem]">{r.v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        }
      />

      <Rule />

      {/* ------------------------------ Metrics -------------------------- */}
      <section className="page-x py-14">
        <div className="bay">
          <Reveal>
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...site.scale, ...site.proof].map((t) => (
                <div key={t.k} className="border-t border-line pt-5">
                  <dd className="font-display text-3xl tracking-[-0.03em] text-brand-ink sm:text-4xl">
                    {t.v}
                  </dd>
                  <dt className="label mt-2.5">{t.k}</dt>
                  <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-faint">
                    {t.note}
                  </p>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <Rule />

      {/* ------------------------------- Story --------------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <Label  className="mb-8">
                Why this exists
              </Label>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="t-h2 mb-7">The gap between a tool and a system.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 text-[1rem] leading-[1.75] text-ink-dim">
                <p>
                  Almost every business we meet has already bought software. A
                  CRM nobody fills in. An accounting package that does not know
                  about their stock. Three tools that each hold a third of the
                  truth and disagree with the other two.
                </p>
                <p>
                  The reason is always the same: the tool enforces a process that
                  is not theirs, so a private spreadsheet appears alongside it,
                  and within a quarter the spreadsheet is the real system while
                  the software is a licence fee.
                </p>
                <p>
                  So we build narrow instead of broad. Not a hundred features
                  used adequately — the twelve things a team actually does,
                  shaped the way they already do them. That is a smaller,
                  cheaper, less impressive-sounding project, and it is the one
                  that survives contact with a Monday morning.
                </p>
                <p>
                  The corollary is that we sometimes talk clients out of a build
                  entirely. If your process is standard enough that an
                  off-the-shelf tool genuinely fits, we say so. That answer costs
                  a project and earns a referral, and we are content with the
                  trade.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <Card className="p-6 sm:p-8">
              <Label className="mb-6">What we are not</Label>
              <ul className="space-y-4">
                {[
                  "Not a reseller. We do not take vendor commissions, so a recommendation is never bought.",
                  "Not a body shop. Nobody is billed to your project to keep a bench busy.",
                  "Not a marketing agency. We do not run ads, buy links or sell rankings.",
                  "Not a template shop. If a page builder would do the job, we will tell you to use one.",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-[0.875rem] leading-relaxed">
                    <Tick />
                    <span className="text-ink-dim">{t}</span>
                  </li>
                ))}
              </ul>
              <Rule className="my-6" />
              <div className="flex flex-wrap gap-2">
                {["Fixed price", "Written scope", "Your Git org", "30-day fixes", "No lock-in"].map(
                  (t) => (
                    <Chip key={t} brand>
                      {t}
                    </Chip>
                  ),
                )}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <Rule />
      <Approach commitments={commitments} settings={settings} />
      <Rule />
      <Faq
        items={ABOUT_FAQS}
        label="About us"
        title="The questions about us, not the work"
        lead="Including why the pricing looks the way it does."
      />

      <section className="page-x pb-20">
        <div className="bay">
          <Reveal>
            <Card raised className="mesh-frame flex flex-wrap items-center justify-between gap-6 p-7 sm:p-10">
              <div>
                <h2 className="t-h3 mb-2 font-display">
                  Start with the problem, not the product.
                </h2>
                <p className="t-lead max-w-xl">
                  One call, a written scope, a fixed price.
                </p>
              </div>
              <ButtonLink href="/contact" variant="primary" size="lg">
                Get in touch
                <Arrow />
              </ButtonLink>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
