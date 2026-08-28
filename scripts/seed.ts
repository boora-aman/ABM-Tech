/**
 * npm run seed — import the committed seed content into MongoDB.
 *
 * Idempotent: every collection is upserted on its unique key, so running it
 * twice changes nothing and running it after edits will OVERWRITE those edits
 * for the records present in the seed files. That is the intended behaviour —
 * the seed files are the baseline, the database is the live copy.
 *
 * Safe to run against a populated database only if you actually want the seed
 * to win. Pass --only=<resource> to limit it.
 */
import { connectDb, isDbConfigured } from "../src/lib/db/mongoose.ts";
import {
  ServiceModel,
  PostModel,
  IndustryModel,
  PillarModel,
  ProjectModel,
  SlideModel,
  GlobalFaqModel,
  CommitmentModel,
} from "../src/lib/db/models.ts";
import { services } from "../src/lib/content/services.ts";
import { posts } from "../src/lib/content/posts.ts";
import { industries } from "../src/lib/content/industries.ts";
import { pillars } from "../src/lib/content/pillars.ts";
import { projects } from "../src/lib/content/work.ts";
import { slides } from "../src/lib/content/showcase.ts";
import { globalFaqs, commitments } from "../src/lib/content/faq.ts";

type Doc = Record<string, unknown>;

async function upsertAll(
  label: string,
  model: { findOneAndUpdate: (...a: unknown[]) => { exec: () => Promise<unknown> } },
  rows: Doc[],
  /** Field to upsert on. Every collection needs one or re-running the seed
   *  would duplicate rather than update. */
  key: string,
) {
  let n = 0;
  for (const [i, row] of rows.entries()) {
    const doc: Doc = { ...row, order: (row.order as number | undefined) ?? i };
    await model
      .findOneAndUpdate(
        { [key]: doc[key] },
        { $set: doc },
        { upsert: true, returnDocument: "after" },
      )
      .exec();
    n++;
  }
  console.log(`  ${label.padEnd(14)} ${n}`);
}

async function main() {
  if (!isDbConfigured()) {
    console.error("MONGODB_URI is not set. Nothing to seed.");
    process.exit(1);
  }
  const conn = await connectDb();
  if (!conn) {
    console.error("Could not connect to MongoDB.");
    process.exit(1);
  }

  const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
  const want = (name: string) => !only || only === name;

  console.log("Seeding:");

  if (want("services"))
    await upsertAll("services", ServiceModel as never, services as unknown as Doc[], "slug");
  if (want("posts"))
    await upsertAll("posts", PostModel as never, posts as unknown as Doc[], "slug");
  if (want("industries"))
    await upsertAll("industries", IndustryModel as never, industries as unknown as Doc[], "slug");
  if (want("pillars"))
    await upsertAll("pillars", PillarModel as never, pillars as unknown as Doc[], "key");
  if (want("projects"))
    await upsertAll("projects", ProjectModel as never, projects as unknown as Doc[], "slug");
  if (want("slides"))
    await upsertAll(
      "slides",
      SlideModel as never,
      (slides as unknown as Doc[]).map((s) => ({ ...s, slug: s.id })),
      "slug",
    );
  if (want("faqs"))
    await upsertAll("faqs", GlobalFaqModel as never, globalFaqs as unknown as Doc[], "q");
  if (want("commitments"))
    await upsertAll("commitments", CommitmentModel as never, commitments as unknown as Doc[], "index");

  console.log("\nDone. The admin now edits these records; the seed files remain the fallback.");
  console.log(
    "\nNOTE: this wrote to MongoDB directly, so the running app's cached pages\n" +
      "were not refreshed. On a live server, either restart it or call:\n" +
      "  curl -X POST -H 'Authorization: Bearer <token>' https://abmtech.in/api/v1/revalidate",
  );
  await conn.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
