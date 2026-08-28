import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { publishedPosts } from "@/lib/content/posts";
import { absoluteUrl } from "@/lib/site.config";

/** Priorities reflect commercial intent: pricing and services above editorial. */
export default function sitemap(): MetadataRoute.Sitemap {
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

  const postRoutes: MetadataRoute.Sitemap = publishedPosts().map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    priority: p.featured ? 0.75 : 0.65,
    changeFrequency: "monthly",
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
