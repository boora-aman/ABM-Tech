import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/sections/PageHead";
import { Faq } from "@/components/sections/Faq";
import { Card, Rule, Label } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { PhoneFrame } from "@/components/crm/PhoneFrame";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { pageMeta, graph, breadcrumbLd, faqLd } from "@/lib/seo";
import { whatsappLink, absoluteUrl } from "@/lib/site.config";
import {
  apk,
  apkSizeLabel,
  screens,
  hero,
  shifts,
  features,
  extras,
  webCrm,
  steps,
  install,
  permissions,
  recordingNote,
  faqs,
  seo,
} from "@/lib/content/crm-app";

/* ==========================================================================
   /abm-crm — the Android app that comes with the Custom CRM.

   Written to be read by an owner deciding whether their reps will actually
   use a CRM. So the page leads with what happens without anyone typing —
   calls logging themselves, recordings landing on the lead — and states the
   limits next to the features: Android only, a microphone recording rather
   than a call-audio one, and an APK rather than a Play Store listing.
   ========================================================================== */

export const metadata: Metadata = pageMeta({
  title: seo.title,
  description: seo.description,
  path: "/abm-crm",
  keywords: seo.keywords,
});

const PATH = "/abm-crm";

/* SoftwareApplication without offers or a rating. Google shows the rich
   result only with one of those, and there is no public price for the app on
   its own and no review count that would be honest to publish. The node still
   tells search engines and AI answers exactly what the app is. */
function appLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${absoluteUrl(PATH)}#app`,
    name: "ABM CRM",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "CRM",
    operatingSystem: `Android ${apk.minAndroid} or newer`,
    softwareVersion: apk.version,
    fileSize: apkSizeLabel,
    downloadUrl: apk.url.startsWith("http") ? apk.url : absoluteUrl(apk.url),
    url: absoluteUrl(PATH),
    description: seo.description,
    screenshot: Object.values(screens).map((s) => absoluteUrl(s.src)),
    featureList: features.map((f) => f.title),
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export default function AbmCrmPage() {
  const shotOf = (f: (typeof features)[number]) => (f.screen ? screens[f.screen] : null);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Custom CRM", path: "/services/crm" },
            { name: "ABM CRM app", path: PATH },
          ]),
          appLd(),
          faqLd(faqs),
        )}
      />

      <PageHead
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        lead={hero.lead}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Custom CRM", path: "/services/crm" },
          { name: "ABM CRM app", path: PATH },
        ]}
        aside={<DownloadCard />}
      />

      {/* ------------------------------ Screens --------------------------- */}
      <section className="page-x pb-16 sm:pb-20">
        <div className="bay">
          <Stagger
            className="-mx-[clamp(1.125rem,5vw,4rem)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1.125rem,5vw,4rem)] pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            step={0.06}
          >
            {(["callTracking", "createMenu", "newLead", "newTask", "newEvent"] as const).map(
              (k, i) => (
                <StaggerItem key={k} className="w-[62vw] max-w-[260px] shrink-0 snap-center lg:w-auto lg:max-w-none">
                  <figure>
                    <PhoneFrame
                      src={screens[k].src}
                      alt={screens[k].alt}
                      priority={i < 2}
                      className={i % 2 === 1 ? "lg:translate-y-8" : ""}
                    />
                    <figcaption
                      className={`mt-4 text-center text-[0.8125rem] text-ink-dim ${i % 2 === 1 ? "lg:translate-y-8" : ""}`}
                    >
                      {screens[k].caption}
                    </figcaption>
                  </figure>
                </StaggerItem>
              ),
            )}
          </Stagger>
        </div>
      </section>

      <Rule />

      {/* --------------------------- Problem → fix ------------------------ */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label className="mb-9">Why reps actually use it</Label>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3" step={0.05}>
            {shifts.map((s, i) => (
              <StaggerItem key={s.before} className="h-full">
                <Card className="flex h-full flex-col p-6">
                  <span className="mb-4 font-mono text-[0.625rem] tabular-nums text-brand/70">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <p className="text-[0.875rem] leading-relaxed text-ink-faint line-through decoration-brand/50">
                    {s.before}
                  </p>
                  <p className="mt-3 font-display text-[1.0625rem] leading-snug tracking-[-0.01em]">
                    {s.after}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Rule />

      {/* ------------------------------ Features -------------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          <Reveal>
            <Label className="mb-4">What it does</Label>
            <h2 className="t-h2 mb-12 max-w-3xl">
              Everything a rep does on the phone, landing in the CRM without being typed in twice.
            </h2>
          </Reveal>

          <div className="grid gap-14 sm:gap-20">
            {features.map((f, i) => {
              const shot = shotOf(f);
              return (
                <Reveal key={f.key}>
                  <article
                    className={`grid items-center gap-8 ${shot ? "lg:grid-cols-[1fr_minmax(0,17rem)] lg:gap-16" : ""}`}
                  >
                    <div className={shot && i % 2 === 1 ? "lg:order-2" : ""}>
                      <span className="mb-4 block font-mono text-[0.625rem] tabular-nums text-brand/70">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <h3 className="t-h3 mb-4 font-display">{f.title}</h3>
                      <p className="mb-6 max-w-2xl text-[0.9375rem] leading-[1.7] text-ink-dim">
                        {f.body}
                      </p>
                      <ul className="max-w-2xl border-t border-line">
                        {f.points.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-3 border-b border-line py-3 text-[0.875rem] leading-snug"
                          >
                            <span aria-hidden className="mt-[0.45rem] h-px w-3 shrink-0 bg-brand" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      {f.key === "recordings" && (
                        <p className="mt-5 max-w-2xl rounded-sm border border-line bg-tint px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-dim">
                          {recordingNote}
                        </p>
                      )}
                    </div>
                    {shot && (
                      <figure className={`mx-auto w-full max-w-[17rem] ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                        <PhoneFrame src={shot.src} alt={shot.alt} sizes="(min-width: 1024px) 272px, 70vw" />
                      </figure>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <Card className="mt-16 p-6 sm:p-8">
              <Label className="mb-6">Also in the app</Label>
              <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
                {extras.map((e) => (
                  <li key={e} className="flex items-start gap-3 text-[0.875rem] leading-snug text-ink-dim">
                    <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-brand" />
                    {e}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </section>

      <Rule />

      {/* ------------------------------ Web CRM --------------------------- */}
      <section className="page-x py-16 sm:py-20">
        <div className="bay grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <Reveal>
            <Label className="mb-4">Behind the app</Label>
            <h2 className="t-h2 mb-5">The CRM your managers work in.</h2>
            <p className="t-lead mb-7">
              The app is the rep&apos;s side. The web CRM is where the pipeline is run, campaigns
              are routed and the team is managed — built on Frappe CRM, on your own server, with
              your name on it.
            </p>
            <ButtonLink href="/services/crm" variant="outline" size="md">
              See the Custom CRM
              <Arrow />
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="border-t border-line">
              {webCrm.map((w, i) => (
                <li key={w} className="flex items-start gap-4 border-b border-line py-3.5">
                  <span className="font-mono text-[0.625rem] tabular-nums text-brand/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-ink-dim">{w}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Rule />

      {/* ---------------------------- How it works ------------------------ */}
      <section className="page-x py-16 sm:py-20" id="install">
        <div className="bay">
          <Reveal>
            <Label className="mb-9">Up and running in three steps</Label>
          </Reveal>
          <ol className="mb-14 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.05 * i}>
                <Card className="flex h-full flex-col p-6">
                  <span className="brand-fill mb-5 grid size-8 place-items-center rounded-sm font-mono text-[0.625rem] font-semibold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="t-h3 mb-2 font-display">{s.title}</h3>
                  <p className="text-[0.875rem] leading-[1.7] text-ink-dim">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </ol>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <h3 className="t-h3 mb-5 font-display">Installing the APK</h3>
              <ol className="border-t border-line">
                {install.map((step, i) => (
                  <li key={step} className="flex items-start gap-4 border-b border-line py-3.5">
                    <span className="font-mono text-[0.625rem] tabular-nums text-brand/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.875rem] leading-relaxed text-ink-dim">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.08}>
              <h3 className="t-h3 mb-5 font-display">What it asks for, and why</h3>
              <dl className="border-t border-line">
                {permissions.map((p) => (
                  <div key={p.name} className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-5">
                    <dt className="text-[0.875rem] font-medium">{p.name}</dt>
                    <dd className="text-[0.875rem] leading-relaxed text-ink-dim">{p.why}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <Rule />

      <Faq
        items={faqs}
        label="Questions"
        title="Before you install it"
        lead="The limits, stated as plainly as the features."
      />

      <Rule />

      {/* --------------------------------- CTA ---------------------------- */}
      <section className="page-x py-16 sm:py-24">
        <div className="bay">
          <Reveal>
            <Card raised className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h2 className="t-h2 mb-4">See it on your own leads.</h2>
                <p className="t-lead">
                  A demo on the CRM and the app together, with a sample of your pipeline in it.
                  The app comes with every ABM Custom CRM.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <ButtonLink href="/contact?service=crm" variant="primary" size="lg" className="w-full">
                  Book a demo
                  <Arrow />
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink("Hi ABM Tech — I'd like a demo of ABM CRM and the Android app.")}
                  variant="whatsapp"
                  size="lg"
                  external
                  className="w-full"
                >
                  <WhatsAppGlyph />
                  WhatsApp
                </ButtonLink>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** The hero's right column: the download, and what it needs, side by side. */
function DownloadCard() {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
        <span className="label">Android app</span>
      </div>

      <dl className="mb-6 space-y-3 text-[0.8125rem]">
        <Row k="Version" v={apk.version} />
        <Row k="Needs" v={`Android ${apk.minAndroid}+`} />
        <Row k="Size" v={apkSizeLabel} />
        <Row k="Comes with" v="ABM Custom CRM" />
      </dl>

      {/* `download` is ignored cross-origin but harmless same-origin, and it
          gives the file a sensible name on phones that would otherwise save
          it as the last path segment. */}
      <a
        href={apk.url}
        download={`ABM-CRM-${apk.version}.apk`}
        className="mb-2.5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-deep"
      >
        Download for Android
      </a>
      <ButtonLink href="/contact?service=crm" variant="outline" size="md" className="w-full">
        Book a demo
        <Arrow />
      </ButtonLink>

      <p className="mt-5 border-t border-line pt-4 text-[0.75rem] leading-relaxed text-ink-faint">
        The app signs in to your company&apos;s ABM CRM — it needs a CRM account to do anything.{" "}
        <Link href="#install" className="underline underline-offset-2 hover:text-brand-ink">
          How to install an APK
        </Link>
      </p>
      <p className="mt-2 break-all font-mono text-[0.625rem] leading-relaxed text-ink-faint">
        SHA-256 {apk.sha256}
      </p>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5 last:border-0 last:pb-0">
      <dt className="text-ink-faint">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
