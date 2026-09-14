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

export const socialStatusWriteSchema = z
  .object({
    key: z.string().trim().min(1).max(80),
    status: z.enum(["todo", "scheduled", "posted", "skipped"]),
    date: isoDate.optional().or(z.literal("")),
    note: z.string().trim().max(500).optional().or(z.literal("")),
    batch: z.string().trim().max(60).optional().or(z.literal("")),
  })
  .strict();

export const adminUserCreateSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(200),
    name: z.string().trim().max(120).optional().or(z.literal("")),
    role: z.enum(["owner", "editor"]),
    /* Twelve, not eight. This account can rewrite every price on the site, so
       the floor is a passphrase rather than a password. */
    password: z.string().min(12, "Use at least 12 characters").max(200),
  })
  .strict();

export const adminUserUpdateSchema = z
  .object({
    role: z.enum(["owner", "editor"]).optional(),
    name: z.string().trim().max(120).optional(),
    password: z.string().min(12, "Use at least 12 characters").max(200).optional(),
  })
  .strict();

/* Every field optional: the site-details document is a set of OVERRIDES over
   site.config.ts, so an empty string means "use the committed value" rather
   than "blank the footer". */
const optStr = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const siteDetailsWriteSchema = z
  .object({
    legalName: optStr(160),
    tagline: optStr(120),
    description: optStr(600),
    founded: optStr(8),

    email: z.string().trim().toLowerCase().email().max(200).optional().or(z.literal("")),
    phoneE164: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +919119756710")
      .optional()
      .or(z.literal("")),
    phoneDisplay: optStr(40),
    whatsapp: z
      .string()
      .trim()
      .regex(/^[1-9]\d{7,14}$/, "Digits only with country code, e.g. 919119756710")
      .optional()
      .or(z.literal("")),
    whatsappPrefill: optStr(300),

    street: optStr(200),
    locality: optStr(80),
    region: optStr(80),
    postalCode: optStr(12),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
    mapsUrl: z.string().trim().url().max(500).optional().or(z.literal("")),

    hours: z
      .array(
        z.object({
          days: z.array(z.enum(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"])).min(1),
          opens: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
          closes: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
        }),
      )
      .max(7)
      .optional(),

    serviceAreas: z.array(z.string().trim().min(1).max(80)).max(20).optional(),

    instagram: z.string().trim().url().max(400).optional().or(z.literal("")),
    facebook: z.string().trim().url().max(400).optional().or(z.literal("")),
    linkedin: z.string().trim().url().max(400).optional().or(z.literal("")),
    github: z.string().trim().url().max(400).optional().or(z.literal("")),
    x: z.string().trim().url().max(400).optional().or(z.literal("")),
    youtube: z.string().trim().url().max(400).optional().or(z.literal("")),

    googleVerification: optStr(120),

    /* Billing identity. GSTIN is accepted and validated now even though the
       business is not registered — the day it is, this becomes a field to fill
       in rather than a schema change, and the PDF already prints it. */
    gstin: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/, "That is not a valid GSTIN")
      .optional()
      .or(z.literal("")),
    udyam: optStr(40),
    pan: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "That is not a valid PAN")
      .optional()
      .or(z.literal("")),
    bankName: optStr(120),
    bankAccount: optStr(40),
    bankIfsc: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "That is not a valid IFSC")
      .optional()
      .or(z.literal("")),
    upi: optStr(80),
    defaultTaxRate: z.number().min(0).max(100).optional(),
    invoiceTerms: optStr(3000),
    quotationTerms: optStr(3000),
  })
  .strict();

/* ------------------------------- Billing --------------------------------- */

const money = z.number().min(0).max(99_99_99_999);
const isoDay = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const clientWriteSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required").max(120),
    company: z.string().trim().max(160).optional().or(z.literal("")),
    email: z.string().trim().toLowerCase().email().max(200).optional().or(z.literal("")),
    phone: z.string().trim().max(24).optional().or(z.literal("")),
    /* Validated whenever present, even though the business is not registered —
       a client's GSTIN is their number, not ours, and a wrong one on an
       invoice is their problem to unpick later. */
    gstin: z
      .string()
      .trim()
      .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/, "That is not a valid GSTIN")
      .optional()
      .or(z.literal("")),
    line1: z.string().trim().max(200).optional().or(z.literal("")),
    line2: z.string().trim().max(200).optional().or(z.literal("")),
    city: z.string().trim().max(80).optional().or(z.literal("")),
    state: z.string().trim().max(80).optional().or(z.literal("")),
    postalCode: z.string().trim().max(12).optional().or(z.literal("")),
    country: z.string().trim().max(80).optional().or(z.literal("")),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
    archived: z.boolean().optional(),
  })
  .strict();

const lineSchema = z.object({
  description: z.string().trim().min(1, "Every line needs a description").max(500),
  hsn: z.string().trim().max(12).optional().or(z.literal("")),
  qty: z.number().min(0).max(1_000_000),
  unit: z.string().trim().max(16).optional().or(z.literal("")),
  rate: money,
  discountPct: z.number().min(0).max(100),
});

export const billingDocWriteSchema = z
  .object({
    kind: z.enum(["quotation", "invoice"]),
    clientId: z.string().trim().min(1, "Choose a client"),
    issueDate: isoDay,
    validUntil: isoDay.optional().or(z.literal("")),
    dueDate: isoDay.optional().or(z.literal("")),
    lines: z.array(lineSchema).min(1, "Add at least one line").max(60),
    discountPct: z.number().min(0).max(100),
    taxRate: z.number().min(0).max(100),
    taxMode: z.enum(["none", "cgst_sgst", "igst"]),
    notes: z.string().trim().max(3000).optional().or(z.literal("")),
    terms: z.string().trim().max(3000).optional().or(z.literal("")),
    status: z
      .enum(["draft", "sent", "accepted", "declined", "expired",
             "partial", "paid", "overdue", "cancelled"])
      .optional(),
  })
  .strict();

export const paymentWriteSchema = z
  .object({
    amount: money.refine((v) => v > 0, "Amount must be more than zero"),
    date: isoDay,
    method: z.enum(["upi", "neft", "imps", "rtgs", "cash", "cheque", "card", "other"]),
    reference: z.string().trim().max(120).optional().or(z.literal("")),
    note: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .strict();

export const sendDocSchema = z
  .object({
    to: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
    subject: z.string().trim().max(200).optional().or(z.literal("")),
    message: z.string().trim().max(4000).optional().or(z.literal("")),
  })
  .strict();
