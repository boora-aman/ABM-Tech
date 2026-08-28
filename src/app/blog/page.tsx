import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/sections/PageHead";
import { Cta } from "@/components/sections/Cta";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPosts } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site.config";
import { formatDate, readingTime } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Journal — straight answers about buying and owning software",
  description:
    "Articles on choosing between custom and off-the-shelf software, what a fixed price actually means, and the handover that proves you own what you paid for. Written for the person signing the invoice.",
  path: "/blog",
  keywords: [
    "custom software vs off the shelf",
    "fixed price software development",
    "software handover checklist",
    "buying business software india",
  ],
});

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
          ]),
          {
            "@type": "Blog",
            "@id": absoluteUrl("/blog#blog"),
            name: "ABM Tech Journal",
            url: absoluteUrl("/blog"),
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.excerpt,
              datePublished: p.publishedAt,
              url: absoluteUrl(`/blog/${p.slug}`),
            })),
          },
        )}
      />

      <PageHead
        label="Journal"
        title="Straight answers about"
        titleAccent="buying and owning software."
        lead="Written for the person signing the invoice rather than the person writing the code. Including the answers that cost us work."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Journal", path: "/blog" },
        ]}
        tags={allTags}
      />

      <Rule />

      <section className="page-x py-16 sm:py-20">
        <div className="bay">
          {lead && (
            <Card as="article" raised lift className="mb-6 p-7 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <Chip brand>Latest</Chip>
                    {lead.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                  <h2 className="t-h2 mb-4">
                    <Link href={`/blog/${lead.slug}`} className="ul-draw">
                      {lead.title}
                    </Link>
                  </h2>
                  <p className="t-lead mb-6">{lead.excerpt}</p>
                  <Link
                    href={`/blog/${lead.slug}`}
                    className="group/btn inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand-ink"
                  >
                    Read the article
                    <Arrow />
                  </Link>
                </div>

                <div className="lg:border-l lg:border-line lg:pl-8">
                  <Label className="mb-4">The short answer</Label>
                  <p className="font-display text-[1.0625rem] leading-snug font-medium">
                    {lead.keyTakeaway}
                  </p>
                  <Rule className="my-5" />
                  <p className="text-[0.75rem] text-ink-faint">
                    <time dateTime={lead.publishedAt}>
                      {formatDate(lead.publishedAt)}
                    </time>
                    {" · "}
                    {readingTime(lead.body)} min read
                  </p>
                </div>
              </div>
            </Card>
          )}

          {rest.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((p) => (
                <Card as="article" key={p.slug} lift className="flex flex-col p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                  <h2 className="t-h3 mb-3">
                    <Link href={`/blog/${p.slug}`} className="ul-draw">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mb-6 flex-1 text-[0.9375rem] leading-relaxed text-ink-dim">
                    {p.excerpt}
                  </p>
                  <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
                    <span className="text-[0.75rem] text-ink-faint">
                      <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
                      {" · "}
                      {readingTime(p.body)} min
                    </span>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group/btn inline-flex items-center gap-2 text-[0.8125rem] font-medium text-brand-ink"
                    >
                      Read
                      <Arrow />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Cta />
    </>
  );
}
