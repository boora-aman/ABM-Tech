/**
 * npm run seed:admin — create or update an admin user.
 *
 * Usage:
 *   ADMIN_EMAIL=you@abmtech.in ADMIN_PASSWORD='a long passphrase' npm run seed:admin
 *
 * Optional:
 *   ADMIN_NAME='Their Name'
 *   ADMIN_ROLE=owner        # defaults to `editor`
 *
 * There is no sign-up route on the site, so this is how the FIRST account
 * comes into existence; after that, an owner adds people at /admin/users.
 * Re-running it against an existing email resets that password, which is also
 * the password-reset path.
 *
 * The role now defaults to `editor`. It previously created an owner every
 * time, which meant adding a second person silently handed them the API keys
 * and the ability to remove everyone else.
 */
import bcrypt from "bcryptjs";
import { connectDb, isDbConfigured } from "../src/lib/db/mongoose.ts";
import { AdminUserModel } from "../src/lib/db/models.ts";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim();
  const role = process.env.ADMIN_ROLE?.trim() === "owner" ? "owner" : "editor";

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
  const owners = await AdminUserModel.countDocuments({ role: "owner" });

  // The very first account must be an owner or nobody can administer the site.
  const effectiveRole = owners === 0 && !existing ? "owner" : role;

  await AdminUserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        passwordHash,
        name: name ?? email,
        role: effectiveRole,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  if (existing) {
    console.log(`Password reset for ${email} (role: ${effectiveRole}).`);
  } else {
    console.log(`${effectiveRole === "owner" ? "Owner" : "Editor"} created: ${email}`);
    if (owners === 0) {
      console.log("First account on this database, so it was made an owner.");
    }
    console.log("Sign in at /admin/login.");
  }
  await conn.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
