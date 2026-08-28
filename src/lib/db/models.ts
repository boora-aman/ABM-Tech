import mongoose, { Schema, type Model } from "mongoose";

/* ==========================================================================
   MONGOOSE MODELS

   Mirrors the seed types in src/lib/content/. Keeping the two identical is
   what lets `withDb` swap between database and bundled content
   transparently — add a field here and it must be added to the seed type and
   the write validator, or the three drift apart silently.

   `strict: false` is deliberately NOT set: the admin API validates with zod
   before writing, so an unknown key should be rejected at the boundary rather
   than quietly persisted.

   Nested schemas are named consts rather than inline `new Schema(...)`
   expressions, and `register` is intentionally non-generic. Mongoose's
   generic inference is extremely expensive to typecheck, and threading
   document generics through nested inline schemas is enough to exhaust the
   TypeScript compiler's heap on a project this size. Documents are typed at
   the repo boundary instead, where zod already guarantees the shape.

   Registration is guarded because Next re-evaluates modules on hot reload and
   mongoose throws OverwriteModelError on a second `model()` call.
   ========================================================================== */

const timestamps = { timestamps: true } as const;

export type AnyDoc = Record<string, unknown> & {
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

function register(name: string, schema: Schema): Model<AnyDoc> {
  return (
    (mongoose.models[name] as Model<AnyDoc> | undefined) ??
    mongoose.model<AnyDoc>(name, schema)
  );
}

/* ------------------------------ Fragments ------------------------------- */

const FaqSchema = new Schema(
  { q: { type: String, required: true }, a: { type: String, required: true } },
  { _id: false },
);

const CapabilitySchema = new Schema(
  { title: String, body: String },
  { _id: false },
);

const PhaseSchema = new Schema(
  { step: String, detail: String, when: String },
  { _id: false },
);

const OutcomeSchema = new Schema({ metric: String, value: String }, { _id: false });

const GutsSchema = new Schema(
  { label: String, items: { type: [String], default: [] } },
  { _id: false },
);

/* ------------------------------- Service -------------------------------- */

const ServiceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    index: { type: String, default: "" },
    title: { type: String, required: true },
    short: { type: String, required: true },
    summary: { type: String, default: "" },
    intro: { type: String, default: "" },
    /** Price floor in INR. 0 = quote only. */
    from: { type: Number, default: 0 },
    priceMode: {
      type: String,
      enum: ["project", "retainer", "quote"],
      default: "project",
    },
    timeline: { type: String, default: "" },
    bestFor: { type: String, default: "" },
    deliverables: { type: [String], default: [] },
    excludes: { type: [String], default: [] },
    capabilities: { type: [CapabilitySchema], default: [] },
    phases: { type: [PhaseSchema], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    keywords: { type: [String], default: [] },
    stack: { type: [String], default: [] },
    pillar: { type: String, default: "operate", index: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  timestamps,
);

/* -------------------------------- Post ---------------------------------- */

const PostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    keyTakeaway: { type: String, default: "" },
    body: { type: String, default: "" },
    tags: { type: [String], default: [] },
    author: { type: String, default: "Aman Boora" },
    publishedAt: { type: String, required: true },
    revisedAt: String,
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
    faqs: { type: [FaqSchema], default: [] },
    related: { type: [String], default: [] },
  },
  timestamps,
);

/* ------------------------------ Industry -------------------------------- */

const IndustrySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    index: { type: String, default: "" },
    name: { type: String, required: true },
    short: { type: String, required: true },
    pain: { type: String, default: "" },
    builds: { type: [String], default: [] },
    services: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  timestamps,
);

/* ------------------------------- Pillar --------------------------------- */

const PillarSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    index: { type: String, default: "" },
    name: { type: String, required: true },
    question: { type: String, default: "" },
    summary: { type: String, default: "" },
    outcomes: { type: [String], default: [] },
    services: { type: [String], default: [] },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  timestamps,
);

/* ------------------------------- Project -------------------------------- */

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    index: { type: String, default: "" },
    title: { type: String, required: true },
    sector: { type: String, default: "" },
    year: { type: String, default: "" },
    spine: { type: String, default: "" },
    summary: { type: String, default: "" },
    problem: { type: String, default: "" },
    built: { type: String, default: "" },
    outcomes: { type: [OutcomeSchema], default: [] },
    stack: { type: [String], default: [] },
    guts: { type: [GutsSchema], default: [] },
    serviceSlug: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  timestamps,
);

/* -------------------------------- Slide --------------------------------- */

const SlideSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    kicker: { type: String, default: "" },
    summary: { type: String, default: "" },
    tags: { type: [String], default: [] },
    image: { type: String, default: "" },
    serviceSlug: { type: String, default: "" },
    liveUrl: String,
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  timestamps,
);

/* ------------------------------- Setting -------------------------------- */

/**
 * Free-form page copy — hero headline, section leads, proof strip, CTA text.
 *
 * Deliberately a key/value store rather than a schema per section. Section
 * copy changes shape constantly during design work, and a rigid schema would
 * force a migration every time a heading gains a second line. `value` is
 * Mixed; the read helper is typed at each call site instead.
 */
const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    /** Grouping for the admin UI only. */
    group: { type: String, default: "general", index: true },
    label: { type: String, default: "" },
    hint: { type: String, default: "" },
    value: { type: Schema.Types.Mixed },
  },
  timestamps,
);

/* --------------------------- FAQs + commitments -------------------------- */

const GlobalFaqSchema = new Schema(
  {
    q: { type: String, required: true },
    a: { type: String, required: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  timestamps,
);

const CommitmentSchema = new Schema(
  {
    index: { type: String, default: "" },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  timestamps,
);

/* --------------------------------- Lead --------------------------------- */

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: String,
    company: String,
    service: String,
    budget: String,
    message: { type: String, required: true },
    source: String,
    status: {
      type: String,
      enum: ["new", "contacted", "won", "lost"],
      default: "new",
      index: true,
    },
    /** Retained for abuse triage only; never surfaced publicly. */
    meta: { ip: String, userAgent: String, referer: String },
  },
  timestamps,
);

/* ------------------------------ Admin user ------------------------------ */

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    name: String,
    // select:false so a stray .find() can never leak hashes into a response.
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["owner", "editor"], default: "editor" },
    lastLoginAt: Date,
  },
  timestamps,
);

/* -------------------------------- API key ------------------------------- */

/**
 * Tokens for the machine API at /api/v1 — the surface an MCP server, a cron
 * job or any automation authenticates against.
 *
 * Only the SHA-256 hash of the token is stored, so a leaked database dump
 * yields no working credentials. The plaintext is shown exactly once, at
 * creation, and cannot be recovered afterwards.
 */
const ApiKeySchema = new Schema(
  {
    name: { type: String, required: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    /** First 8 chars of the token, to identify a key without revealing it. */
    prefix: { type: String, required: true },
    /** e.g. ["services:read", "posts:write"] or ["*:read"]. */
    scopes: { type: [String], default: ["*:read"] },
    lastUsedAt: Date,
    expiresAt: Date,
    revoked: { type: Boolean, default: false, index: true },
    createdBy: String,
  },
  timestamps,
);

/* ------------------------------- Exports -------------------------------- */

export const ServiceModel = register("Service", ServiceSchema);
export const PostModel = register("Post", PostSchema);
export const IndustryModel = register("Industry", IndustrySchema);
export const PillarModel = register("Pillar", PillarSchema);
export const ProjectModel = register("Project", ProjectSchema);
export const SlideModel = register("Slide", SlideSchema);
export const SettingModel = register("Setting", SettingSchema);
export const GlobalFaqModel = register("GlobalFaq", GlobalFaqSchema);
export const CommitmentModel = register("Commitment", CommitmentSchema);
export const LeadModel = register("Lead", LeadSchema);
export const AdminUserModel = register("AdminUser", AdminUserSchema);
export const ApiKeyModel = register("ApiKey", ApiKeySchema);
