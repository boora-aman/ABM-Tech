import { publishedPosts } from "@/lib/content/posts";
import { site, absoluteUrl } from "@/lib/site.config";

/** RSS 2.0 feed. Static — the journal is a file in the repo, not a database. */
export const dynamic = "force-static";

/** XML has five predefined entities; everything else in our copy is safe as
 *  UTF-8. Escaping is done rather than CDATA so the output stays diffable. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const posts = publishedPosts();
  const updated = posts[0]?.publishedAt ?? new Date().toISOString();

  const items = posts
    .map((p) =>
      [
        "    <item>",
        `      <title>${esc(p.title)}</title>`,
        `      <link>${absoluteUrl(`/blog/${p.slug}`)}</link>`,
        `      <guid isPermaLink="true">${absoluteUrl(`/blog/${p.slug}`)}</guid>`,
        `      <description>${esc(p.excerpt)}</description>`,
        `      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>`,
        `      <author>${esc(site.contact.email)} (${esc(p.author)})</author>`,
        ...p.tags.map((t) => `      <category>${esc(t)}</category>`),
        "    </item>",
      ].join("\n"),
    )
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${esc(site.name)} — Journal</title>`,
    `    <link>${absoluteUrl("/blog")}</link>`,
    `    <description>${esc(site.description)}</description>`,
    "    <language>en-IN</language>",
    `    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
