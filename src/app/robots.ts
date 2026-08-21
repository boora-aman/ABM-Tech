import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site.config";

/**
 * AI crawlers are explicitly ALLOWED. For a services business a citation
 * inside an AI answer is a qualified referral, so blocking GPTBot and friends
 * would trade away exactly the visibility we want. A deliberate decision, not
 * an inherited default — see /llms.txt for the map published for them.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/_next/"];
  const agents = [
    "*", "Googlebot", "Bingbot", "DuckDuckBot",
    "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-Web", "anthropic-ai",
    "PerplexityBot", "Perplexity-User",
    "Google-Extended", "Applebot", "Applebot-Extended",
    "CCBot", "meta-externalagent", "Amazonbot",
  ];

  return {
    rules: agents.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
