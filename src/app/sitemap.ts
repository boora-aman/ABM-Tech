import type { MetadataRoute } from "next";
import { getServices, getIndustries, getProjects, getPillars, getPosts } from "@/lib/content/repo";
import { comparisons } from "@/lib/content/compare";
import { cities, dehradunServicePages } from "@/lib/content/locations";
import { absoluteUrl } from "@/lib/site.config";

/* ==========================================================================
   SITEMAP

   Priorities reflect commercial intent: pricing and services above editorial.

   `lastModified` is only set where a real date exists (blog posts carry
   `publishedAt`/`updatedAt`). Every other route omits it rather than
   stamping build time — a `lastModified: now` on every static page on every
   deploy tells crawlers everything changes constantly, which trains them to
   discount the signal entirely. Omitting it is honest and, per Google's own
   guidance, harmless: `changeFrequency` still communicates update cadence.
   ========================================================================== */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, industries, projects, pillars, posts] = await Promise.all([
    getServices(),
    getIndustries(),
    getProjects(),
    getPillars(),
    getPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "weekly" },
    { url: absoluteUrl("/services"), priority: 0.95, changeFrequency: "monthly" },
    { url: absoluteUrl("/industries"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("/systems"), priority: 0.85, changeFrequency: "monthly" },
    { url: absoluteUrl("/compare"), priority: 0.85, changeFrequency: "monthly" },
    { url: absoluteUrl("/locations"), priority: 0.8, changeFrequency: "monthly" },
    { url: absoluteUrl("/pricing"), priority: 0.95, changeFrequency: "monthly" },
    { url: absoluteUrl("/work"), priority: 0.8, changeFrequency: "monthly" },
    { url: absoluteUrl("/blog"), priority: 0.8, changeFrequency: "weekly" },
    { url: absoluteUrl("/faq"), priority: 0.75, changeFrequency: "monthly" },
    { url: absoluteUrl("/about"), priority: 0.7, changeFrequency: "yearly" },
    { url: absoluteUrl("/contact"), priority: 0.85, changeFrequency: "yearly" },
    { url: absoluteUrl("/privacy"), priority: 0.2, changeFrequency: "yearly" },
    { url: absoluteUrl("/terms"), priority: 0.2, changeFrequency: "yearly" },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    priority: s.featured ? 0.9 : 0.85,
    changeFrequency: "monthly",
  }));

  /* Highest-value addition: 12 sector pages, each mapped from a service via
     `Industry.services`, so the internal-linking graph and the sitemap agree
     with each other by construction rather than by hand-maintained lists. */
  const industryRoutes: MetadataRoute.Sitemap = industries.map((i) => ({
    url: absoluteUrl(`/industries/${i.slug}`),
    priority: i.featured ? 0.9 : 0.85,
    changeFrequency: "monthly",
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: absoluteUrl(`/work/${p.slug}`),
    priority: 0.75,
    changeFrequency: "monthly",
  }));

  const systemRoutes: MetadataRoute.Sitemap = pillars.map((p) => ({
    url: absoluteUrl(`/systems/${p.key}`),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const compareRoutes: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: absoluteUrl(`/compare/${c.slug}`),
    priority: 0.85,
    changeFrequency: "monthly",
  }));

  /* Nine hand-written location pages, deliberately capped — see the comment
     at the top of content/locations.ts for why this stays small on purpose. */
  const cityRoutes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: absoluteUrl(`/locations/${c.slug}`),
    priority: c.isBase ? 0.85 : 0.75,
    changeFrequency: "monthly",
  }));

  const dehradunRoutes: MetadataRoute.Sitemap = dehradunServicePages.map((d) => ({
    url: absoluteUrl(`/dehradun/${d.slug}`),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    priority: p.featured ? 0.75 : 0.65,
    changeFrequency: "monthly",
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...systemRoutes,
    ...compareRoutes,
    ...cityRoutes,
    ...dehradunRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}
