import { withDb, plain, isDbConfigured } from "@/lib/db/mongoose";
import { site } from "@/lib/site.config";
import {
  ServiceModel,
  PostModel,
  IndustryModel,
  PillarModel,
  ProjectModel,
  SlideModel,
  SettingModel,
  GlobalFaqModel,
  CommitmentModel,
  SiteDetailsModel,
} from "@/lib/db/models";

import { services as seedServices, type Service } from "./services";
import { posts as seedPosts, type Post } from "./posts";
import { industries as seedIndustries, type Industry } from "./industries";
import { pillars as seedPillars, type Pillar } from "./pillars";
import { projects as seedProjects, type Project } from "./work";
import { slides as seedSlides, type Slide } from "./showcase";
import { globalFaqs as seedFaqs, commitments as seedCommitments, type Faq } from "./faq";

/* ==========================================================================
   CONTENT REPOSITORY

   The ONLY module pages import content from. It hides whether the data came
   from MongoDB or from the bundled seed files, which is what gives us:

     • `npm run dev` and `npm run build` with zero configuration
     • a database outage degrading to static content instead of a 500
     • an admin that can edit everything without the site ever depending on
       the database being up at request time

   SEO NOTE. Every one of these is called from a server component inside a
   statically generated or ISR page — never from the browser. Editing content
   in the admin calls `revalidatePath`, which regenerates the static HTML.
   A crawler is therefore always served fully rendered markup with its
   structured data intact; nothing here ever becomes a client-side fetch.
   ========================================================================== */

export { isDbConfigured };

/* ------------------------------- Services ------------------------------- */

export async function getServices(): Promise<Service[]> {
  return withDb(
    async () => {
      const docs = await ServiceModel.find({ published: { $ne: false } })
        .sort({ order: 1, index: 1 })
        .lean();
      const rows = plain<Service & { order?: number }>(docs);
      if (!rows.length) return seedServices;
      const bySlug = new Map(seedServices.map((s) => [s.slug, s]));
      return rows.map((r) => withSeedFallback(r, bySlug.get(r.slug)));
    },
    () => seedServices,
  );
}

export async function getService(slug: string): Promise<Service | null> {
  return withDb(
    async () => {
      const doc = await ServiceModel.findOne({
        slug,
        published: { $ne: false },
      }).lean();
      const seedMatch = seedServices.find((s) => s.slug === slug);
      if (doc) return withSeedFallback(plain<Service>([doc])[0], seedMatch);
      return seedMatch ?? null;
    },
    () => seedServices.find((s) => s.slug === slug) ?? null,
  );
}

/* -------------------------------- Posts --------------------------------- */

export async function getPosts(): Promise<Post[]> {
  return withDb(
    async () => {
      const docs = await PostModel.find({ published: true })
        .sort({ publishedAt: -1 })
        .lean();
      const rows = plain<Post>(docs);
      return rows.length ? rows : seedPosts.filter((p) => p.published);
    },
    () =>
      seedPosts
        .filter((p) => p.published)
        .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)),
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  return withDb(
    async () => {
      const doc = await PostModel.findOne({ slug, published: true }).lean();
      if (doc) return plain<Post>([doc])[0];
      return seedPosts.find((p) => p.slug === slug && p.published) ?? null;
    },
    () => seedPosts.find((p) => p.slug === slug && p.published) ?? null,
  );
}

/* ------------------------------ Industries ------------------------------ */

/** `.lean()` returns exactly the stored document — a row saved before a
 *  schema field existed comes back missing that key entirely (`undefined`,
 *  not `[]` or `""`). Spreading the seed first means a DB row only overrides
 *  fields it actually has, so older admin-edited rows fall back to the
 *  matching seed's value for any field added after they were last saved,
 *  instead of the page crashing on `undefined.length`. */
function withSeedFallback<T extends object>(dbRow: T, seedRow: T | undefined): T {
  return seedRow ? { ...seedRow, ...dbRow } : dbRow;
}

export async function getIndustries(): Promise<Industry[]> {
  return withDb(
    async () => {
      const docs = await IndustryModel.find({ published: { $ne: false } })
        .sort({ order: 1, index: 1 })
        .lean();
      const rows = plain<Industry>(docs);
      if (!rows.length) return seedIndustries;
      const bySlug = new Map(seedIndustries.map((i) => [i.slug, i]));
      return rows.map((r) => withSeedFallback(r, bySlug.get(r.slug)));
    },
    () => seedIndustries,
  );
}

export async function getIndustry(slug: string): Promise<Industry | null> {
  return withDb(
    async () => {
      const doc = await IndustryModel.findOne({
        slug,
        published: { $ne: false },
      }).lean();
      const seedMatch = seedIndustries.find((i) => i.slug === slug);
      if (doc) return withSeedFallback(plain<Industry>([doc])[0], seedMatch);
      return seedMatch ?? null;
    },
    () => seedIndustries.find((i) => i.slug === slug) ?? null,
  );
}

/* ------------------------------- Pillars -------------------------------- */

export async function getPillars(): Promise<Pillar[]> {
  return withDb(
    async () => {
      const docs = await PillarModel.find({ published: { $ne: false } })
        .sort({ order: 1, index: 1 })
        .lean();
      const rows = plain<Pillar>(docs);
      if (!rows.length) return seedPillars;
      const byKey = new Map(seedPillars.map((p) => [p.key, p]));
      return rows.map((r) => withSeedFallback(r, byKey.get(r.key)));
    },
    () => seedPillars,
  );
}

export async function getPillar(key: string): Promise<Pillar | null> {
  return withDb(
    async () => {
      const doc = await PillarModel.findOne({
        key,
        published: { $ne: false },
      }).lean();
      const seedMatch = seedPillars.find((p) => p.key === key);
      if (doc) return withSeedFallback(plain<Pillar>([doc])[0], seedMatch);
      return seedMatch ?? null;
    },
    () => seedPillars.find((p) => p.key === key) ?? null,
  );
}

/* ------------------------------- Projects ------------------------------- */

export async function getProjects(): Promise<Project[]> {
  return withDb(
    async () => {
      const docs = await ProjectModel.find({ published: { $ne: false } })
        .sort({ order: 1, index: 1 })
        .lean();
      const rows = plain<Project>(docs);
      if (!rows.length) return seedProjects;
      const bySlug = new Map(seedProjects.map((p) => [p.slug, p]));
      return rows.map((r) => withSeedFallback(r, bySlug.get(r.slug)));
    },
    () => seedProjects,
  );
}

export async function getProject(slug: string): Promise<Project | null> {
  return withDb(
    async () => {
      const doc = await ProjectModel.findOne({
        slug,
        published: { $ne: false },
      }).lean();
      const seedMatch = seedProjects.find((p) => p.slug === slug);
      if (doc) return withSeedFallback(plain<Project>([doc])[0], seedMatch);
      return seedMatch ?? null;
    },
    () => seedProjects.find((p) => p.slug === slug) ?? null,
  );
}

/* -------------------------------- Slides -------------------------------- */

export async function getSlides(): Promise<Slide[]> {
  return withDb(
    async () => {
      const docs = await SlideModel.find({ published: { $ne: false } })
        .sort({ order: 1 })
        .lean();
      const rows = plain<Slide & { slug?: string }>(docs);
      // The seed type keys slides by `id`; the model uses `slug` so it can
      // share the generic upsert path with every other collection.
      return rows.length
        ? rows.map((r) => ({ ...r, id: r.id ?? r.slug ?? "" }))
        : seedSlides;
    },
    () => seedSlides,
  );
}

/* --------------------------- FAQs + commitments -------------------------- */

export async function getGlobalFaqs(): Promise<Faq[]> {
  return withDb(
    async () => {
      const docs = await GlobalFaqModel.find({ published: { $ne: false } })
        .sort({ order: 1 })
        .lean();
      const rows = plain<Faq>(docs);
      return rows.length ? rows : seedFaqs;
    },
    () => seedFaqs,
  );
}

export async function getCommitments(): Promise<typeof seedCommitments> {
  return withDb(
    async () => {
      const docs = await CommitmentModel.find({ published: { $ne: false } })
        .sort({ order: 1, index: 1 })
        .lean();
      const rows = plain<(typeof seedCommitments)[number]>(docs);
      return rows.length ? rows : seedCommitments;
    },
    () => seedCommitments,
  );
}

/* ------------------------------- Settings -------------------------------- */

export type SettingRow = {
  key: string;
  group?: string;
  label?: string;
  hint?: string;
  value?: unknown;
};

/**
 * All settings as a keyed map. Page sections call `pick()` against this with
 * a hardcoded fallback, so a missing or deleted key renders the original copy
 * rather than an empty heading — the site can never be edited into a blank
 * page from the admin.
 */
export async function getSettings(): Promise<Record<string, unknown>> {
  return withDb(
    async () => {
      const docs = await SettingModel.find().lean();
      const rows = plain<SettingRow>(docs);
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    },
    () => ({}),
  );
}

/**
 * Read one setting with a typed fallback.
 *
 * The fallback is mandatory by design. Every call site therefore carries the
 * copy it would show if the database were empty, which is what makes the
 * whole CMS additive rather than load-bearing.
 */
export function pick<T>(settings: Record<string, unknown>, key: string, fallback: T): T {
  const v = settings[key];
  if (v === undefined || v === null || v === "") return fallback;
  if (Array.isArray(fallback) && !Array.isArray(v)) return fallback;
  return v as T;
}

/* ------------------------------ Site details ----------------------------- */

/**
 * The business details — contact, address, hours, socials — merged over the
 * committed defaults in site.config.ts.
 *
 * Returns the SAME SHAPE as `site`, so a consumer swaps `site` for the result
 * and nothing else changes. That is what kept this from becoming a rewrite of
 * all 31 files that import the config.
 *
 * Every field falls back individually: an empty document, a cleared field or
 * an unreachable database all render the committed value rather than a blank
 * footer or a broken LocalBusiness node.
 */
/* `site` is declared `as const`, so `typeof site` narrows every string to its
   literal value — "2024" rather than string — and nothing from the database
   can be assigned to it. The shape is therefore widened explicitly here, which
   also documents what a consumer can rely on. */
export type SiteConfig = Omit<
  typeof site,
  | "legalName" | "tagline" | "description" | "founded"
  | "contact" | "address" | "hours" | "serviceAreas" | "socials" | "verification"
> & {
  legalName: string;
  tagline: string;
  description: string;
  founded: string;
  contact: {
    email: string;
    phoneE164: string;
    phoneDisplay: string;
    whatsapp: string;
    whatsappPrefill: string;
  };
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    countryName: string;
    lat: number;
    lng: number;
    mapsUrl: string;
  };
  hours: { days: string[]; opens: string; closes: string }[];
  serviceAreas: string[];
  socials: { key: string; label: string; url: string }[];
  verification: { google: string };
};

/** The committed config widened to the mutable SiteConfig shape. Used both as
 *  the fallback and as the base every database value is merged over. */
function baseConfig(): SiteConfig {
  return {
    ...site,
    legalName: site.legalName,
    tagline: site.tagline,
    description: site.description,
    founded: site.founded,
    contact: { ...site.contact },
    address: { ...site.address },
    hours: site.hours.map((h) => ({ ...h, days: [...h.days] })),
    serviceAreas: [...site.serviceAreas],
    socials: site.socials.map((x) => ({ key: x.key, label: x.label, url: x.url })),
    verification: { ...site.verification },
  };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const base = baseConfig();
  const row = await withDb(
    async () => {
      const doc = await SiteDetailsModel.findOne({ key: "site" }).lean();
      return doc ? plain<Record<string, unknown>>([doc])[0] : null;
    },
    () => null,
  );
  if (!row) return base;

  const str = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim() ? v.trim() : fallback;
  const num = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback;
  const social = (key: string, fallback: string) =>
    str(row[key], fallback);

  return {
    ...base,
    legalName: str(row.legalName, base.legalName),
    tagline: str(row.tagline, base.tagline),
    description: str(row.description, base.description),
    founded: str(row.founded, base.founded),

    contact: {
      email: str(row.email, base.contact.email),
      phoneE164: str(row.phoneE164, base.contact.phoneE164),
      phoneDisplay: str(row.phoneDisplay, base.contact.phoneDisplay),
      whatsapp: str(row.whatsapp, base.contact.whatsapp),
      whatsappPrefill: str(row.whatsappPrefill, base.contact.whatsappPrefill),
    },

    address: {
      ...base.address,
      street: str(row.street, base.address.street),
      locality: str(row.locality, base.address.locality),
      region: str(row.region, base.address.region),
      postalCode: str(row.postalCode, base.address.postalCode),
      lat: num(row.lat, base.address.lat),
      lng: num(row.lng, base.address.lng),
      mapsUrl: str(row.mapsUrl, base.address.mapsUrl),
    },

    hours: Array.isArray(row.hours) && row.hours.length
      ? (row.hours as SiteConfig["hours"])
      : base.hours,

    serviceAreas:
      Array.isArray(row.serviceAreas) && row.serviceAreas.length
        ? (row.serviceAreas as string[])
        : base.serviceAreas,

    socials: base.socials.map((x) => ({ ...x, url: social(x.key, x.url) })),

    verification: {
      google: str(row.googleVerification, base.verification.google),
    },
  };
}

/** WhatsApp link built from the live config rather than the committed one. */
export function whatsappLinkFor(cfg: SiteConfig, message?: string) {
  return `https://wa.me/${cfg.contact.whatsapp}?text=${encodeURIComponent(
    message ?? cfg.contact.whatsappPrefill,
  )}`;
}
