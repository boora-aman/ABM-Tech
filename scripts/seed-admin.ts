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
 * Passwords must be at least 12 characters, except where MONGODB_URI points at
 * this machine — a local throwaway database is not worth the friction.
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
  /* The length floor exists because this account can edit the whole site, and
     a hosted database is reachable from the internet. A database on this
     machine is not, so a throwaway password there is a convenience rather than
     a risk, and the floor only stops people setting up a local copy. Judged on
     where the data lives rather than on a flag, because a flag is something
     somebody eventually passes in production. */
  const uri = process.env.MONGODB_URI ?? "";
  const isLocalDb = /@?(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)[:/]/.test(uri);

  if (password.length < 12 && !isLocalDb) {
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

  if (password.length < 12) {
    console.warn(
      `\n  ! Short password accepted because MONGODB_URI points at this machine.\n` +
        `    Do not reuse it anywhere the database is reachable from outside.\n` +
        `    Note the dev server also answers on your LAN address.\n`,
    );
  }

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
