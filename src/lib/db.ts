import mongoose from "mongoose";

/* ==========================================================================
   MONGO — optional.
   The site is entirely static content; the database exists only to store
   enquiries. Without MONGODB_URI the contact form still works: the lead is
   emailed and written to the deployment log instead. A missing database must
   never lose a lead.

   The connection is cached across hot reloads and across Fluid Compute
   invocations — a new connection per request exhausts Atlas limits fast.
   ========================================================================== */

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB ?? "abm_tech";

export function isDbConfigured() {
  return Boolean(URI && URI.length > 0);
}

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { _abmMongoose?: Cache };
const cached: Cache = g._abmMongoose ?? { conn: null, promise: null };
g._abmMongoose = cached;

export async function connectDb() {
  if (!URI) return null;
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(URI, {
      dbName: DB_NAME,
      // Fail fast rather than hanging a request on a bad URI.
      serverSelectionTimeoutMS: 6000,
      maxPoolSize: 10,
    });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("[mongo] connection failed:", err);
    return null;
  }
}

const LeadSchema = new mongoose.Schema(
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
  { timestamps: true },
);

export const LeadModel =
  (mongoose.models.Lead as mongoose.Model<Record<string, unknown>>) ??
  mongoose.model("Lead", LeadSchema);
