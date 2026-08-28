import { z } from "zod";

/**
 * Shared by the client form (inline errors) and the API route (the authority).
 * The server always re-parses; the client pass is UX only.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(24)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[+\d][\d\s()-]{6,23}$/.test(v), "Enter a valid phone number"),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(12, "A sentence or two about the problem helps")
    .max(4000, "Longer than we can accept — please summarise"),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  /** Honeypot: must stay empty. Bots fill every field they find. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Client render timestamp; sub-2s submissions are almost always bots. */
  renderedAt: z.coerce.number().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/* ==========================================================================
   ADMIN WRITE SCHEMAS

   The authority for every write, whether it arrives from the admin UI or from
   the machine API at /api/v1. Both routes parse through these, so an
   automation cannot write a shape the admin would have rejected.

   `.strict()` everywhere is the point: an unknown key is an error, not
   something silently persisted. That is what stops a typo'd field name from
   becoming an invisible column of dead data.
   ========================================================================== */

const faqItem = z.object({
  q: z.string().trim().min(3).max(300),
  a: z.string().trim().min(3).max(4000),
});

const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");

/** ISO date (YYYY-MM-DD) or a full ISO timestamp. */
const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}([T ].*)?$/, "Use YYYY-MM-DD");

const strList = (max = 60) => z.array(z.string().trim().min(1).max(600)).max(max);

export const serviceWriteSchema = z
  .object({
    slug,
    index: z.string().trim().max(8).optional(),
    title: z.string().trim().min(2).max(160),
    short: z.string().trim().min(1).max(60),
    summary: z.string().trim().max(600).optional(),
    intro: z.string().trim().max(4000).optional(),
    from: z.number().int().min(0).max(100_000_000),
    priceMode: z.enum(["project", "retainer", "quote"]),
    timeline: z.string().trim().max(120).optional(),
    bestFor: z.string().trim().max(300).optional(),
    deliverables: strList().optional(),
    excludes: strList(30).optional(),
    capabilities: z
      .array(
        z.object({
          title: z.string().trim().min(2).max(200),
          body: z.string().trim().max(2000),
        }),
      )
      .max(20)
      .optional(),
    phases: z
      .array(
        z.object({
          step: z.string().trim().min(2).max(200),
          detail: z.string().trim().max(2000),
          when: z.string().trim().max(80),
        }),
      )
      .max(20)
      .optional(),
    faqs: z.array(faqItem).max(30).optional(),
    keywords: strList(40).optional(),
    stack: strList(40).optional(),
    pillar: z.enum(["found", "capture", "operate", "money", "mobile", "know", "run"]),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const postWriteSchema = z
  .object({
    slug,
    title: z.string().trim().min(4).max(200),
    excerpt: z.string().trim().max(600).optional(),
    keyTakeaway: z.string().trim().max(800).optional(),
    body: z.string().trim().max(120_000),
    tags: strList(12).optional(),
    author: z.string().trim().max(120).optional(),
    publishedAt: isoDate,
    revisedAt: isoDate.optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
    faqs: z.array(faqItem).max(30).optional(),
    related: z.array(slug).max(12).optional(),
  })
  .strict();

export const industryWriteSchema = z
  .object({
    slug,
    index: z.string().trim().max(8).optional(),
    name: z.string().trim().min(2).max(160),
    short: z.string().trim().min(1).max(40),
    pain: z.string().trim().max(1000).optional(),
    builds: strList(20).optional(),
    services: z.array(slug).max(12).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const pillarWriteSchema = z
  .object({
    key: z
      .string()
      .trim()
      .regex(/^[a-z][a-z0-9-]*$/, "Lowercase key")
      .max(40),
    index: z.string().trim().max(8).optional(),
    name: z.string().trim().min(2).max(120),
    question: z.string().trim().max(400).optional(),
    summary: z.string().trim().max(2000).optional(),
    outcomes: strList(20).optional(),
    services: z.array(slug).max(12).optional(),
    published: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const projectWriteSchema = z
  .object({
    slug,
    index: z.string().trim().max(8).optional(),
    title: z.string().trim().min(2).max(200),
    sector: z.string().trim().max(120).optional(),
    year: z.string().trim().max(12).optional(),
    spine: z.string().trim().max(300).optional(),
    summary: z.string().trim().max(1200).optional(),
    problem: z.string().trim().max(4000).optional(),
    built: z.string().trim().max(4000).optional(),
    outcomes: z
      .array(
        z.object({
          metric: z.string().trim().max(120),
          value: z.string().trim().max(120),
        }),
      )
      .max(12)
      .optional(),
    stack: strList(30).optional(),
    guts: z
      .array(
        z.object({
          label: z.string().trim().max(120),
          items: strList(40),
        }),
      )
      .max(12)
      .optional(),
    serviceSlug: z.string().trim().max(120).optional().or(z.literal("")),
    published: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const slideWriteSchema = z
  .object({
    slug,
    title: z.string().trim().min(2).max(200),
    kicker: z.string().trim().max(300).optional(),
    summary: z.string().trim().max(1200).optional(),
    tags: strList(12).optional(),
    image: z.string().trim().max(400).optional().or(z.literal("")),
    serviceSlug: z.string().trim().max(120).optional().or(z.literal("")),
    liveUrl: z.string().trim().url().max(400).optional().or(z.literal("")),
    published: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const settingWriteSchema = z
  .object({
    /* Dot-separated, camelCase segments — `hero.headlineAccent`, not
       `hero.headline_accent`. The previous pattern banned uppercase entirely,
       which rejected every key the page components actually read, so no copy
       override could be saved at all. */
    key: z
      .string()
      .trim()
      .regex(
        /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$/,
        "Dot-separated camelCase, e.g. hero.headlineAccent",
      )
      .max(80),
    group: z.string().trim().max(40).optional(),
    label: z.string().trim().max(160).optional(),
    hint: z.string().trim().max(400).optional(),
    /** Free-form on purpose — a setting may be a string, a list or an object. */
    value: z.unknown(),
  })
  .strict();

export const globalFaqWriteSchema = z
  .object({
    q: z.string().trim().min(3).max(300),
    a: z.string().trim().min(3).max(4000),
    published: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const commitmentWriteSchema = z
  .object({
    index: z.string().trim().max(8).optional(),
    title: z.string().trim().min(2).max(200),
    body: z.string().trim().max(2000).optional(),
    published: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const leadStatusSchema = z
  .object({ status: z.enum(["new", "contacted", "won", "lost"]) })
  .strict();

export const apiKeyWriteSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    scopes: z
      .array(
        z
          .string()
          .trim()
          .regex(/^(\*|[a-z-]+):(read|write)$/, "Use resource:read or resource:write"),
      )
      .min(1)
      .max(40),
    expiresAt: isoDate.optional(),
  })
  .strict();
