/**
 * npm run seed:admin — create or update the first admin user.
 *
 * Usage:
 *   ADMIN_EMAIL=you@abmtech.in ADMIN_PASSWORD='a long passphrase' npm run seed:admin
 *
 * There is no sign-up route on the site, so this is the only way the first
 * account comes into existence. Re-running it resets that user's password,
 * which is also the password-reset path.
 */
import bcrypt from "bcryptjs";
import { connectDb, isDbConfigured } from "../src/lib/db/mongoose.ts";
import { AdminUserModel } from "../src/lib/db/models.ts";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim();

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD.");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("Use at least 12 characters. This account can edit the whole site.");
    process.exit(1);
  }
  if (!isDbConfigured()) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const conn = await connectDb();
  if (!conn) {
    console.error("Could not connect to MongoDB.");
    process.exit(1);
  }

  // Cost 12: roughly a quarter-second per hash on typical VPS hardware, which
  // is slow enough to make offline cracking expensive and fast enough that a
  // login does not feel sluggish.
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await AdminUserModel.findOne({ email }).lean();
  await AdminUserModel.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, name: name ?? email, role: "owner" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(
    existing
      ? `Password reset for existing owner ${email}.`
      : `Owner created: ${email}. Sign in at /admin/login.`,
  );
  await conn.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
