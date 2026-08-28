import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDb, isDbConfigured } from "./db/mongoose";
import { AdminUserModel } from "./db/models";

/* ==========================================================================
   AUTH — email + bcrypt, backed by MongoDB.

   There is no public sign-up path. The first owner is created by
   `npm run seed:admin`; further users are created by an existing owner. That
   is deliberate — an admin panel on a public marketing site should have no
   route by which a stranger can obtain an account.

   Sessions are JWT-backed httpOnly cookies with an 8-hour lifetime.
   ========================================================================== */

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * A real bcrypt hash of a value nobody knows, compared against when the user
 * does not exist. Without it, a missing account returns far faster than a
 * wrong password and response timing enumerates valid admin emails.
 */
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEe.7RQwqU9ozlwqZDRBH/dRUu.HYs4WNVy";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login", error: "/admin/login" },

  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        if (!isDbConfigured()) return null;

        const conn = await connectDb();
        if (!conn) return null;

        const user = await AdminUserModel.findOne({
          email: parsed.data.email.toLowerCase(),
        })
          .select("+passwordHash")
          .lean();

        const hash = (user?.passwordHash as string | undefined) ?? DUMMY_HASH;
        const ok = await bcrypt.compare(parsed.data.password, hash);
        if (!user || !ok) return null;

        await AdminUserModel.updateOne(
          { _id: user._id },
          { $set: { lastLoginAt: new Date() } },
        );

        return {
          id: String(user._id),
          email: String(user.email),
          name: (user.name as string | undefined) ?? String(user.email),
          role: (user.role as string | undefined) ?? "editor",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = (user as { role?: string }).role ?? "editor";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          (token.role as string | undefined) ?? "editor";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/** True when the caller holds a valid admin session. */
export async function requireSession() {
  const session = await auth();
  return session?.user ? session : null;
}

/** True when the caller is an owner rather than an editor. */
export async function requireOwner() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "owner" ? session : null;
}
