import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validators";
import { connectDb, isDbConfigured, LeadModel } from "@/lib/db";
import { notifyLead, isMailConfigured } from "@/lib/mail";

/* ==========================================================================
   POST /api/lead
     1. validate  — the server is the authority; the client's zod pass is UX
     2. spam      — honeypot + time-to-submit floor + per-IP rate limit
     3. persist   — the lead must survive even if email is down
     4. notify    — best effort, never fails the request
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** In-memory, per-instance: a speed bump, not a guarantee. Move to Upstash or
 *  the Vercel Firewall if this is ever actually targeted. */
const HITS = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  HITS.set(ip, recent);
  if (HITS.size > 5000) {
    for (const [k, v] of HITS) if (!v.some((t) => now - t < WINDOW)) HITS.delete(k);
  }
  return recent.length > MAX;
}

function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : (req.headers.get("x-real-ip") ?? "unknown");
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!fields[k]) fields[k] = i.message;
    }
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", fields },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // Honeypot and speed trap. Both answer 200 so the bot believes it succeeded
  // and does not retry with a different shape.
  if (lead.website) return NextResponse.json({ ok: true, note: "Received." });
  if (lead.renderedAt && Date.now() - lead.renderedAt < 2000) {
    return NextResponse.json({ ok: true, note: "Received." });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "That's several enquiries in a short window. WhatsApp us instead — it's faster anyway.",
      },
      { status: 429 },
    );
  }

  let stored = false;
  if (isDbConfigured()) {
    try {
      const conn = await connectDb();
      if (conn) {
        await LeadModel.create({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || undefined,
          company: lead.company || undefined,
          service: lead.service || undefined,
          budget: lead.budget || undefined,
          message: lead.message,
          source: lead.source || "/contact",
          status: "new",
          meta: {
            ip,
            userAgent: req.headers.get("user-agent") ?? undefined,
            referer: req.headers.get("referer") ?? undefined,
          },
        });
        stored = true;
      }
    } catch (err) {
      console.error("[lead] persist failed:", err);
    }
  }

  const mail = await notifyLead(lead);

  // Last-resort channel. With neither Mongo nor Resend configured the enquiry
  // would otherwise vanish; deployment logs are the fallback of record.
  if (!stored && !mail.notified) {
    console.warn(
      "[lead] NOT PERSISTED AND NOT EMAILED — set MONGODB_URI or RESEND_API_KEY.",
      JSON.stringify({ ...lead, website: undefined, at: new Date().toISOString() }),
    );
  }

  const note = !isDbConfigured()
    ? "Saved to server logs — set MONGODB_URI to store enquiries."
    : !isMailConfigured()
      ? "Stored. Add RESEND_API_KEY for email notifications."
      : undefined;

  return NextResponse.json({ ok: true, stored, note });
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST to submit an enquiry." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
