import bcrypt from "bcryptjs";
import { auth, requireOwner } from "@/lib/auth";
import { connectDb, isDbConfigured, plain } from "@/lib/db/mongoose";
import { AdminUserModel } from "@/lib/db/models";
import { adminUserCreateSchema, adminUserUpdateSchema } from "@/lib/validators";
import { ok, fail } from "@/lib/api";

/* ==========================================================================
   ADMIN USERS — /api/admin/users

   Owner-only, and deliberately outside the generic RESOURCES registry: this
   collection holds password hashes and decides who can do anything at all, so
   it gets its own route with its own rules rather than a shared CRUD path.

   Three guards that matter more than they look:

     • `passwordHash` is never returned. The schema marks it select:false and
       every response is built from an explicit field list.
     • The last owner cannot be demoted or deleted. Without that, one wrong
       click locks everybody out of the admin permanently — there is no
       sign-up route to recover through.
     • Nobody can delete or demote themselves, which is the usual way people
       discover the previous rule the hard way.
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** bcrypt cost 12 — ~0.25s per hash on VPS hardware. Slow enough to make
 *  offline cracking expensive, fast enough that login does not drag. */
const COST = 12;

const FIELDS = "email name role lastLoginAt createdAt";

async function guard() {
  const session = await requireOwner();
  if (!session) return { error: fail("Owner access required.", 403) };
  if (!isDbConfigured()) return { error: fail("No database configured.", 503) };
  const conn = await connectDb();
  if (!conn) return { error: fail("Database unreachable.", 503) };
  return { session };
}

export async function GET() {
  const g = await guard();
  if (g.error) return g.error;

  const docs = await AdminUserModel.find().select(FIELDS).sort({ createdAt: 1 }).lean();
  return ok(plain(docs));
}

export async function POST(req: Request) {
  const g = await guard();
  if (g.error) return g.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }

  const parsed = adminUserCreateSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  const { email, name, role, password } = parsed.data;

  if (await AdminUserModel.exists({ email })) {
    return fail(`${email} already has an account. Reset their password instead.`, 409);
  }

  const created = await AdminUserModel.create({
    email,
    name: name || email,
    role,
    passwordHash: await bcrypt.hash(password, COST),
  });

  return ok(
    { id: String(created._id), email, name: name || email, role },
    { status: 201 },
  );
}

export async function PATCH(req: Request) {
  const g = await guard();
  if (g.error) return g.error;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("Missing ?id.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON.");
  }

  const parsed = adminUserUpdateSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);

  const target = await AdminUserModel.findById(id).select(FIELDS).lean();
  if (!target) return fail("Not found.", 404);

  const me = (await auth())?.user?.email?.toLowerCase();
  const isSelf = String(target.email).toLowerCase() === me;

  if (parsed.data.role && parsed.data.role !== target.role) {
    if (isSelf) {
      return fail("You cannot change your own role. Ask another owner.", 400);
    }
    if (target.role === "owner" && parsed.data.role === "editor") {
      const owners = await AdminUserModel.countDocuments({ role: "owner" });
      if (owners <= 1) {
        return fail("That is the last owner. Promote someone else first.", 400);
      }
    }
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.role) update.role = parsed.data.role;
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.password) {
    update.passwordHash = await bcrypt.hash(parsed.data.password, COST);
  }
  if (!Object.keys(update).length) return fail("Nothing to change.");

  const saved = await AdminUserModel.findByIdAndUpdate(id, { $set: update }, { new: true })
    .select(FIELDS)
    .lean();
  return ok(plain([saved])[0]);
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (g.error) return g.error;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("Missing ?id.");

  const target = await AdminUserModel.findById(id).select(FIELDS).lean();
  if (!target) return fail("Not found.", 404);

  const me = (await auth())?.user?.email?.toLowerCase();
  if (String(target.email).toLowerCase() === me) {
    return fail("You cannot remove your own account.", 400);
  }
  if (target.role === "owner") {
    const owners = await AdminUserModel.countDocuments({ role: "owner" });
    if (owners <= 1) {
      return fail("That is the last owner. Promote someone else first.", 400);
    }
  }

  await AdminUserModel.findByIdAndDelete(id);
  return ok({ id, email: target.email });
}
