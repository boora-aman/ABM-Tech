import type { Field } from "@/components/admin/CollectionEditor";

/* ==========================================================================
   ADMIN FIELD DESCRIPTORS

   What the editor renders for each collection. Kept beside the resource
   registry rather than inside the page components so the admin gains a
   collection by adding one entry here and one in RESOURCES — never by writing
   another near-identical page.
   ========================================================================== */

const publishing: Field[] = [
  { name: "published", label: "Published", type: "boolean", hint: "Visible on the live site" },
  { name: "order", label: "Sort order", type: "number", hint: "Lower appears first" },
];

export const FIELDS: Record<string, Field[]> = {
  services: [
    { name: "slug", label: "Slug", type: "text", required: true, hint: "URL segment: /services/<slug>. Changing this changes the URL — set up a redirect if the page is already indexed." },
    { name: "index", label: "Index", type: "text", hint: 'Two-digit label shown on cards, e.g. "01"' },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "short", label: "Short label", type: "text", required: true, hint: "Used in nav, chips and the footer" },
    { name: "from", label: "Price floor (INR)", type: "number", hint: "0 means quote-only. Drives the cards, the pricing table, Service schema and llms.txt." },
    { name: "priceMode", label: "Billing", type: "select", options: ["project", "retainer", "quote"] },
    { name: "timeline", label: "Timeline", type: "text", hint: 'e.g. "3–5 weeks"' },
    { name: "bestFor", label: "Best for", type: "text" },
    { name: "pillar", label: "System", type: "select", options: ["found", "capture", "operate", "money", "mobile", "know", "run"], hint: "Which of the six systems this is filed under on /services" },
    { name: "summary", label: "Summary", type: "textarea", hint: "One line. Feeds cards, the meta description and Service schema." },
    { name: "intro", label: "Intro", type: "textarea", rows: 5 },
    { name: "deliverables", label: "Deliverables", type: "list", rows: 8, hint: "One per line" },
    { name: "excludes", label: "Excludes", type: "list", rows: 3, hint: "One per line. Honesty converts — this list is shown publicly." },
    { name: "keywords", label: "Keywords", type: "list", rows: 4, hint: "One per line. Feeds meta keywords and llms.txt." },
    { name: "stack", label: "Stack", type: "list", rows: 3, hint: "One per line" },
    { name: "capabilities", label: "Capabilities (JSON)", type: "json", hint: '[{"title":"…","body":"…"}]' },
    { name: "phases", label: "Phases (JSON)", type: "json", hint: '[{"step":"…","detail":"…","when":"Week 1"}]' },
    { name: "faqs", label: "FAQs (JSON)", type: "json", hint: '[{"q":"…","a":"…"}] — emitted as FAQPage schema' },
    { name: "featured", label: "Featured", type: "boolean", hint: 'Shows the "Popular" chip' },
    ...publishing,
  ],

  posts: [
    { name: "slug", label: "Slug", type: "text", required: true, hint: "URL segment: /blog/<slug>" },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea", hint: "Deck under the headline; also the meta description" },
    { name: "keyTakeaway", label: "Key takeaway", type: "textarea", hint: "One sentence, shown in the answer box. This is the passage AI search is most likely to quote." },
    { name: "body", label: "Body (markdown)", type: "textarea", rows: 22, hint: "Supports ## and ### headings, **bold**, `code`, [links](url) and both list kinds. Headings become the table of contents." },
    { name: "tags", label: "Tags", type: "list", rows: 3, hint: "One per line" },
    { name: "author", label: "Author", type: "text" },
    { name: "publishedAt", label: "Published date", type: "text", required: true, hint: "YYYY-MM-DD" },
    { name: "revisedAt", label: "Revised date", type: "text", hint: "YYYY-MM-DD, optional" },
    { name: "related", label: "Related service slugs", type: "list", rows: 3, hint: "One per line — shown as a CTA at the end of the article" },
    { name: "faqs", label: "FAQs (JSON)", type: "json", hint: '[{"q":"…","a":"…"}]' },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "published", label: "Published", type: "boolean", hint: "Drafts are invisible to the site, the sitemap and the RSS feed" },
  ],

  industries: [
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "index", label: "Index", type: "text" },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "short", label: "Short label", type: "text", required: true },
    { name: "pain", label: "The pain", type: "textarea", hint: "In the sector's own words — this is the line a visitor recognises themselves in" },
    { name: "builds", label: "What we build", type: "list", rows: 6, hint: "One per line" },
    { name: "services", label: "Service slugs", type: "list", rows: 3, hint: "One per line" },
    { name: "featured", label: "Shipped in this sector", type: "boolean", hint: 'Shows the "Shipped" chip — only tick where a production system exists' },
    ...publishing,
  ],

  pillars: [
    { name: "key", label: "Key", type: "text", required: true, hint: "found · capture · operate · money · mobile · know" },
    { name: "index", label: "Index", type: "text" },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "question", label: "The question", type: "text", hint: "Phrased as a business owner would ask it" },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "outcomes", label: "Outcomes", type: "list", rows: 5 },
    { name: "services", label: "Service slugs", type: "list", rows: 3 },
    ...publishing,
  ],

  projects: [
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "index", label: "Index", type: "text" },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "sector", label: "Sector", type: "text" },
    { name: "year", label: "Year", type: "text" },
    { name: "spine", label: "Spine", type: "text", hint: "One line for the rack" },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "problem", label: "The problem", type: "textarea", rows: 6 },
    { name: "built", label: "What we built", type: "textarea", rows: 6 },
    { name: "outcomes", label: "Outcomes (JSON)", type: "json", hint: '[{"metric":"…","value":"…"}]' },
    { name: "stack", label: "Stack", type: "list", rows: 3 },
    { name: "guts", label: "Guts (JSON)", type: "json", hint: '[{"label":"Tables","items":["…"]}]' },
    { name: "serviceSlug", label: "Service slug", type: "text" },
    ...publishing,
  ],

  slides: [
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "kicker", label: "Kicker", type: "text" },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "tags", label: "Tags", type: "list", rows: 3 },
    { name: "image", label: "Image path", type: "text", hint: "Under /public, e.g. /showcase/crm.webp. Leave empty for a placeholder frame." },
    { name: "serviceSlug", label: "Service slug", type: "text" },
    { name: "liveUrl", label: "Live URL", type: "text" },
    ...publishing,
  ],

  settings: [
    { name: "key", label: "Key", type: "text", required: true, hint: "Dot-separated camelCase. Keys the site reads: hero.eyebrow, hero.headline (list), hero.headlineAccent, hero.lead" },
    { name: "group", label: "Group", type: "text", hint: "For grouping in this list only" },
    { name: "label", label: "Label", type: "text" },
    { name: "hint", label: "Hint", type: "text" },
    { name: "value", label: "Value (JSON)", type: "json", rows: 6, hint: 'A string needs quotes: "Some headline". A list is ["a","b"].' },
  ],

  faqs: [
    { name: "q", label: "Question", type: "text", required: true },
    { name: "a", label: "Answer", type: "textarea", rows: 5, required: true, hint: "Emitted as FAQPage schema on the home page — write it to be quotable" },
    ...publishing,
  ],

  commitments: [
    { name: "index", label: "Index", type: "text" },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "body", label: "Body", type: "textarea", rows: 4 },
    ...publishing,
  ],
};
