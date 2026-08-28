import type { MetadataRoute } from "next";
import { getServices, getPosts } from "@/lib/content/repo";
import { absoluteUrl } from "@/lib/site.config";

/** Priorities reflect commercial intent: pricing and services above editorial. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getServices(), getPosts()]);
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: absoluteUrl("/services"), priority: 0.95, changeFrequency: "monthly", lastModified: now },
    { url: absoluteUrl("/industries"), priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: absoluteUrl("/pricing"), priority: 0.95, changeFrequency: "monthly", lastModified: now },
    { url: absoluteUrl("/work"), priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: absoluteUrl("/blog"), priority: 0.8, changeFrequency: "weekly", lastModified: now },
    { url: absoluteUrl("/about"), priority: 0.7, changeFrequency: "yearly", lastModified: now },
    { url: absoluteUrl("/contact"), priority: 0.85, changeFrequency: "yearly", lastModified: now },
    { url: absoluteUrl("/privacy"), priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: absoluteUrl("/terms"), priority: 0.2, changeFrequency: "yearly", lastModified: now },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    priority: s.featured ? 0.9 : 0.85,
    changeFrequency: "monthly",
    lastModified: now,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    priority: p.featured ? 0.75 : 0.65,
    changeFrequency: "monthly",
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
