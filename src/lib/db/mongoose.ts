import mongoose from "mongoose";

/* ==========================================================================
   MONGO CONNECTION

   MONGODB_URI is OPTIONAL and that is a deliberate architectural choice, not
   an oversight. Every read path goes through `withDb`, which falls back to
   the bundled seed content in `src/lib/content/*`. Three consequences:

     • `npm run dev` works with zero configuration
     • a database outage degrades the site to static content, never a 500
     • the site is fully renderable at build time on a machine with no DB

   That last one is what protects SEO. Pages stay statically generated and
   are revalidated on write (see revalidatePath in the admin API), so a
   crawler is always served pre-rendered HTML — never a client-side fetch.

   The connection is cached across hot reloads and across serverless
   invocations; a new connection per request exhausts the pool very fast.
   ========================================================================== */

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB ?? "abm_tech";

export function isDbConfigured() {
  return Boolean(URI && URI.trim().length > 0);
}

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as { _abmMongoose?: Cache };
const cached: Cache = globalForMongoose._abmMongoose ?? { conn: null, promise: null };
globalForMongoose._abmMongoose = cached;

export async function connectDb() {
  if (!URI) return null;
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(URI, {
      dbName: DB_NAME,
      // Fail fast rather than hanging a page render on a bad URI.
      serverSelectionTimeoutMS: 6000,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("[mongo] connection failed — falling back to seed content:", err);
    return null;
  }
}

/**
 * The single guard every read path goes through. Runs the query when a
 * database is configured and reachable; otherwise resolves the bundled seed.
 */
export async function withDb<T>(
  query: () => Promise<T>,
  fallback: T | (() => T),
): Promise<T> {
  const resolve = () =>
    typeof fallback === "function" ? (fallback as () => T)() : fallback;

  if (!isDbConfigured()) return resolve();
  try {
    const conn = await connectDb();
    if (!conn) return resolve();
    return await query();
  } catch (err) {
    console.error("[mongo] query failed — serving seed content:", err);
    return resolve();
  }
}

/** Strip Mongo internals so documents match the plain content types. */
export function plain<T>(docs: unknown[]): T[] {
  return docs.map((d) => {
    const o = JSON.parse(JSON.stringify(d)) as Record<string, unknown>;
    if (o._id) {
      o.id = String(o._id);
      delete o._id;
    }
    delete o.__v;
    return o as T;
  });
}
