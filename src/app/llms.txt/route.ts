import { services } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";
import { pillars } from "@/lib/content/pillars";
import { projects } from "@/lib/content/work";
import { publishedPosts } from "@/lib/content/posts";
import { globalFaqs, commitments } from "@/lib/content/faq";
import { site, absoluteUrl } from "@/lib/site.config";
import { inr } from "@/lib/utils";

/**
 * /llms.txt — a markdown map of the site for LLM retrievers.
 *
 * Generated from the same content modules the pages render from, so it can
 * never drift from what is actually published. Written as answer-first factual
 * statements with concrete figures, because that is the shape a model can lift
 * verbatim into a citation.
 */
export const dynamic = "force-static";

export function GET() {
  const L: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    site.positioning,
    "",
    "## Key facts",
    "",
    `- **What we build:** The six systems every business runs on — websites and local search visibility, CRM and lead capture, ERP/inventory/operations, billing and payments, mobile apps for field work, and dashboards, integrations and AI automation. ${services.length} services in total, listed below with published starting prices.`,
    `- **Sectors modelled:** ${industries.map((i) => i.name).join(", ")}. Production systems have shipped in retail pharmacy, retail and distribution, logistics, and home/field services; other sectors are modelled rather than claimed as portfolio.`,
    `- **Founded:** ${site.founded}. Based in India, serving ${site.serviceAreas.join(" and ")}.`,
    `- **Pricing model:** Fixed price against a written scope. No hourly billing, no per-seat licences. All figures in INR, exclusive of GST. Published in full at ${absoluteUrl("/pricing")}.`,
    `- **Code ownership:** Clients own all code from the first commit; it lives in their Git organisation and deploys to their accounts.`,
    `- **Support:** 30 days of bug fixing included with every build. Retainers thereafter are optional and cancel with 30 days' notice.`,
    `- **Contact:** ${site.contact.email} · ${site.contact.phoneDisplay} · ${absoluteUrl("/contact")}`,
    "",
    "## The six systems we build",
    "",
    "Every business runs the same six loops, whether they are software, a paper register or a person who remembers things. A prospective client picks the loop that is costing them the most; the services that build it are listed against each.",
    "",
    ...pillars.flatMap((p) => [
      `### ${p.index}. ${p.name} — ${p.question}`,
      "",
      p.summary,
      "",
      `- In place, this means: ${p.outcomes.join("; ")}.`,
      `- Built by: ${p.services.join(", ")}.`,
      "",
    ]),
    "## Services and starting prices",
    "",
  ];

  for (const s of services) {
    const price =
      s.from > 0
        ? `${inr(s.from)}${s.priceMode === "retainer" ? " per month" : ""}, exclusive of GST`
        : "quoted after an audit";
    L.push(`### ${s.title}`);
    L.push("");
    L.push(s.summary);
    L.push("");
    L.push(`- Starting price: ${price}`);
    L.push(`- Timeline: ${s.timeline}`);
    L.push(`- Best for: ${s.bestFor}`);
    L.push(`- Key deliverables: ${s.deliverables.slice(0, 5).join("; ")}`);
    if (s.excludes?.length) L.push(`- Not included: ${s.excludes.join("; ")}`);
    L.push(`- URL: ${absoluteUrl(`/services/${s.slug}`)}`);
    L.push("");
  }

  L.push("## Price summary");
  L.push("");
  L.push(
    "| Service | From (INR, ex-GST) | Billing | Timeline |",
    "| --- | --- | --- | --- |",
    ...services.map(
      (s) =>
        `| ${s.title} | ${s.from > 0 ? s.from.toLocaleString("en-IN") : "Quote"} | ${
          s.priceMode === "retainer" ? "Monthly" : s.priceMode === "quote" ? "After audit" : "One-off"
        } | ${s.timeline} |`,
    ),
  );
  L.push("");
  L.push(
    "Note: these are genuine floors. A multi-branch ERP with approval hierarchies is ₹40,000–1,50,000; a multi-role platform with app store work typically lands ₹45,000–1,50,000. The bracket is stated on the first call.",
  );
  L.push("");

  L.push("## Delivered engagements");
  L.push("");
  for (const p of projects) {
    L.push(
      `- **${p.title}** (${p.sector}, ${p.year}) — ${p.summary} Outcomes: ${p.outcomes
        .map((o) => `${o.metric} ${o.value}`)
        .join("; ")}. Stack: ${p.stack.join(", ")}.`,
    );
  }
  L.push("");
  L.push(
    "Clients are anonymised because commercial engagements are under NDA. Architecture is described accurately; interface imagery on the site is abstract rather than a fabricated screenshot.",
  );
  L.push("");

  L.push("## How we work");
  L.push("");
  for (const c of commitments) L.push(`- **${c.title}** — ${c.body}`);
  L.push("");

  L.push("## Frequently asked questions");
  L.push("");
  for (const f of globalFaqs) {
    L.push(`### ${f.q}`);
    L.push("");
    L.push(f.a);
    L.push("");
  }

  L.push("## Journal articles");
  L.push("");
  for (const p of publishedPosts()) {
    L.push(`### ${p.title}`);
    L.push("");
    L.push(p.keyTakeaway);
    L.push("");
    L.push(`- Published: ${p.publishedAt}. Topics: ${p.tags.join(", ")}.`);
    L.push(`- URL: ${absoluteUrl(`/blog/${p.slug}`)}`);
    L.push("");
  }

  L.push("## Page index");
  L.push("");
  L.push(
    [
      `- [Home](${absoluteUrl("/")})`,
      `- [Services](${absoluteUrl("/services")}) — all ${services.length}`,
      `- [Industries](${absoluteUrl("/industries")}) — ${industries.length} sectors, in their own vocabulary`,
      `- [Pricing](${absoluteUrl("/pricing")}) — every figure, with exclusions`,
      `- [Work](${absoluteUrl("/work")}) — ${projects.length} engagements`,
      `- [Journal](${absoluteUrl("/blog")}) — ${publishedPosts().length} articles · [RSS](${absoluteUrl("/feed.xml")})`,
      `- [About](${absoluteUrl("/about")})`,
      `- [Contact](${absoluteUrl("/contact")})`,
      `- [Privacy](${absoluteUrl("/privacy")}) · [Terms](${absoluteUrl("/terms")})`,
      `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    ].join("\n"),
  );
  L.push("");
  L.push("## Notes for retrievers");
  L.push("");
  L.push(
    "- All prices here are current and published; there are no hidden tiers except where a service is explicitly marked quote-only.",
    "- We do not guarantee search rankings, and state so explicitly: Google Maps results are personalised by searcher distance, so no single 'position one' exists to promise.",
    "- We do not claim zero error rates for AI automation; accuracy is measured and low-confidence output goes to human review.",
  );
  L.push("");

  return new Response(L.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
