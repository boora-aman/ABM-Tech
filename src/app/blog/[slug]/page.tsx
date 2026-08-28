import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Rule, Label, Chip } from "@/components/ui/Panel";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/ui/Button";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Markdown } from "@/lib/markdown";
import { posts as seedPosts } from "@/lib/content/posts";
import { getPost, getPosts, getServices, getSettings } from "@/lib/content/repo";
import { pageMeta, graph, breadcrumbLd, articleLd, faqLd } from "@/lib/seo";
import { site, whatsappLink } from "@/lib/site.config";
import { formatDate, readingTime, outline } from "@/lib/utils";

type RouteParams = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

/* Built from the committed seed so the route set exists at build time without
   a database. Posts published later from the admin are served on demand. */
export function generateStaticParams() {
  return seedPosts.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post)
    return pageMeta({ title: "Article not found", description: "", noIndex: true });

  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: post.tags.map((t) => t.toLowerCase()),
  });
}

export default async function PostPage({ params }: RouteParams) {
  const { slug } = await params;
  const [post, all, allServices, settings] = await Promise.all([
    getPost(slug),
    getPosts(),
    getServices(),
    getSettings(),
  ]);
  if (!post) notFound();

  const toc = outline(post.body);
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const bySlug = new Map(allServices.map((s) => [s.slug, s]));
  const services = (post.related ?? [])
    .map((s) => bySlug.get(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleLd(post),
          faqLd(post.faqs ?? []),
        )}
      />

      {/* ------------------------------ Masthead -------------------------- */}
      <header className="page-x pt-32 pb-12 sm:pt-40">
        <div className="bay max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem]">
              <li>
                <Link href="/" className="text-ink-dim hover:text-brand-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-ink-faint">
                /
              </li>
              <li>
                <Link href="/blog" className="text-ink-dim hover:text-brand-ink">
                  Journal
                </Link>
              </li>
              <li aria-hidden className="text-ink-faint">
                /
              </li>
              <li className="text-ink-faint" aria-current="page">
                {post.tags[0]}
              </li>
            </ol>
          </nav>

          <div className="rise mb-6 flex flex-wrap gap-2" style={{ animationDelay: "0.04s" }}>
            {post.tags.map((t) => (
              <Chip key={t} brand={t === post.tags[0]}>
                {t}
              </Chip>
            ))}
          </div>

          <h1 className="t-h1 rise mb-6" style={{ animationDelay: "0.1s" }}>
            {post.title}
          </h1>

          <p className="t-lead rise mb-8" style={{ animationDelay: "0.16s" }}>
            {post.excerpt}
          </p>

          <Card className="rise flex flex-wrap items-center gap-x-5 gap-y-3 p-5" style={{ animationDelay: "0.22s" }}>
            <span className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-full bg-tint font-display text-[0.6875rem] font-semibold text-brand-ink"
              >
                AB
              </span>
              <span>
                <span className="block text-[0.8125rem] font-semibold">
                  {post.author}
                </span>
                <span className="text-[0.75rem] text-ink-faint">
                  Founder, {site.name}
                </span>
              </span>
            </span>
            <span aria-hidden className="hidden h-8 w-px bg-line sm:block" />
            <span className="text-[0.8125rem] text-ink-dim">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <span className="text-[0.8125rem] text-ink-dim">
              {readingTime(post.body)} min read
            </span>
          </Card>
        </div>
      </header>

      {/* ---------------------------- Key takeaway ------------------------ */}
      <div className="page-x pb-12">
        <div className="bay max-w-4xl">
          <Card raised className="p-6 sm:p-8">
            <Label className="mb-4">The short answer</Label>
            <p className="font-display text-xl leading-snug font-medium sm:text-2xl">
              {post.keyTakeaway}
            </p>
          </Card>
        </div>
      </div>

      <Rule />

      {/* ------------------------------ Article --------------------------- */}
      <div className="page-x py-14 sm:py-16">
        <div className="bay grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-16">
          <article className="min-w-0 max-w-3xl">
            <Markdown source={post.body} />

            {services.length > 0 && (
              <Card raised className="mt-14 p-6 sm:p-8">
                <Label className="mb-5">If you want this done</Label>
                <ul className="mb-6 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group/s flex items-baseline justify-between gap-3 border-b border-line pb-2.5 text-[0.9375rem] text-ink-dim transition-colors hover:text-ink"
                      >
                        <span>{s.title}</span>
                        <Arrow className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/contact" variant="primary" size="md">
                    Get a free quote
                    <Arrow />
                  </ButtonLink>
                  <ButtonLink
                    href={whatsappLink(
                      `Hi ${site.name} — I read "${post.title}" and had a question.`,
                    )}
                    variant="whatsapp"
                    size="md"
                    external
                  >
                    <WhatsAppGlyph />
                    Ask a question
                  </ButtonLink>
                </div>
              </Card>
            )}
          </article>

          {/* ----------------------------- Sidebar -------------------------- */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {toc.length > 0 && (
              <nav aria-label="On this page" className="mb-5">
                <Card className="p-5">
                  <Label className="mb-4">On this page</Label>
                  <ol className="space-y-2.5">
                    {toc.map((h) => (
                      <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                        <a
                          href={`#${h.id}`}
                          className="group/toc flex gap-2.5 text-[0.8125rem] leading-snug text-ink-dim transition-colors hover:text-brand-ink"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.5em] h-px w-2 shrink-0 bg-brand transition-all duration-300 group-hover/toc:w-4"
                          />
                          <span>{h.text}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </Card>
              </nav>
            )}

            <Card raised className="p-5">
              <Label className="mb-3">Need this done?</Label>
              <p className="mb-4 text-[0.8125rem] leading-relaxed text-ink-dim">
                One call, a written scope, a fixed price. If an off-the-shelf tool
                fits you better, we&apos;ll say so.
              </p>
              <ButtonLink href="/contact" variant="primary" size="sm" className="w-full">
                Start the conversation
                <Arrow />
              </ButtonLink>
            </Card>
          </aside>
        </div>
      </div>

      {post.faqs && post.faqs.length > 0 && (
        <>
          <Rule />
          <Faq
            items={post.faqs}
            label="Related questions"
            title="Quick answers"
            lead="The follow-ups this article usually prompts."
          />
        </>
      )}

      {/* ---------------------------- Keep reading ------------------------ */}
      {related.length > 0 && (
        <>
          <Rule />
          <section className="page-x py-16 sm:py-20">
            <div className="bay">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                <h2 className="t-h2">Keep reading</h2>
                <ButtonLink href="/blog" variant="outline">
                  All articles
                  <Arrow />
                </ButtonLink>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {related.map((p) => (
                  <Card as="article" key={p.slug} lift className="flex flex-col p-6">
                    <Label className="mb-4">{p.tags[0]}</Label>
                    <h3 className="t-h3 mb-3">
                      <Link href={`/blog/${p.slug}`} className="ul-draw">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mb-5 flex-1 text-[0.8125rem] leading-relaxed text-ink-dim">
                      {p.excerpt}
                    </p>
                    <span className="text-[0.75rem] text-ink-faint">
                      {readingTime(p.body)} min read
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <Cta settings={settings} />
    </>
  );
}
