import { Resend } from "resend";
import { site, whatsappLink } from "./site.config";
import type { LeadInput } from "./validators";

/* ==========================================================================
   TRANSACTIONAL EMAIL — optional.
   Without RESEND_API_KEY the lead is still stored and logged; notifyLead
   reports that email was skipped rather than failing the submission.
   ========================================================================== */

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM ?? "ABM Tech <onboarding@resend.dev>";
const TO = process.env.LEAD_NOTIFY_TO ?? site.contact.email;

export const isMailConfigured = () => Boolean(KEY);
const resend = KEY ? new Resend(KEY) : null;

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SHELL = (inner: string) => `<!doctype html>
<html><body style="margin:0;background:#0d0e12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#f4f5f7">
  <div style="max-width:640px;margin:0 auto;padding:32px 20px">
    <div style="background:#161820;border:1px solid rgba(255,69,0,0.2);border-radius:12px;padding:28px">
      <div style="height:3px;width:52px;background:linear-gradient(90deg,#ff4500,#ff8c00);border-radius:2px;margin-bottom:22px"></div>
      ${inner}
    </div>
    <p style="margin:18px 0 0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;text-align:center">
      ${esc(site.name)} · ${esc(site.tagline)}
    </p>
  </div>
</body></html>`;

function notificationHtml(lead: LeadInput) {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Business", lead.company || "—"],
    ["Service", lead.service || "Not specified"],
    ["Budget", lead.budget || "—"],
    ["From", lead.source || "/contact"],
  ];
  return SHELL(`
    <h1 style="margin:0 0 6px;font-size:21px;letter-spacing:-0.02em">New enquiry</h1>
    <p style="margin:0 0 22px;font-size:12px;color:#9ba1ad">
      ${esc(site.url)} · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 0;color:#6b7280;width:34%;vertical-align:top;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">${esc(
              k,
            )}</td><td style="padding:8px 0;font-weight:600">${esc(v)}</td></tr>`,
        )
        .join("")}
    </table>
    <div style="margin-top:20px;padding:16px;background:#0d0e12;border:1px solid rgba(255,255,255,0.06);border-radius:8px">
      <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;margin-bottom:9px">Message</div>
      <div style="font-size:14px;line-height:1.65;white-space:pre-wrap;color:#f4f5f7">${esc(lead.message)}</div>
    </div>
    <div style="margin-top:22px">
      <a href="mailto:${esc(lead.email)}" style="display:inline-block;background:linear-gradient(100deg,#ff4500,#ff8c00);color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:6px">Reply</a>
      ${
        lead.phone
          ? `<a href="https://wa.me/${lead.phone.replace(
              /\D/g,
              "",
            )}" style="display:inline-block;margin-left:8px;border:1px solid rgba(255,255,255,0.12);color:#f4f5f7;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:6px">WhatsApp</a>`
          : ""
      }
    </div>`);
}

function acknowledgementHtml(lead: LeadInput) {
  return SHELL(`
    <h1 style="margin:0 0 14px;font-size:23px;letter-spacing:-0.025em">Thanks, ${esc(
      lead.name.split(" ")[0],
    )} — that's in.</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#9ba1ad">
      Your enquiry has reached us and it will be answered by someone who would
      actually build it, not a sales rep. That is usually within one working day.
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#9ba1ad">
      That reply will include a straight read on whether a custom build is the
      right call — including if we think an off-the-shelf tool would serve you
      better.
    </p>
    <div style="margin:22px 0;padding:16px;background:#0d0e12;border:1px solid rgba(255,255,255,0.06);border-radius:8px">
      <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;margin-bottom:9px">What you sent</div>
      <div style="font-size:14px;line-height:1.65;white-space:pre-wrap;color:#9ba1ad">${esc(
        lead.message,
      )}</div>
    </div>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#9ba1ad">
      Need it faster? WhatsApp is quickest during working hours
      (${site.hours[0].opens}–${site.hours[0].closes} IST, Mon–Sat).
    </p>
    <a href="${whatsappLink()}" style="display:inline-block;background:linear-gradient(100deg,#ff4500,#ff8c00);color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:6px">Continue on WhatsApp</a>
    <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.07);font-size:12px;line-height:1.7;color:#6b7280">
      ${esc(site.contact.email)} · ${esc(site.contact.phoneDisplay)}<br>
      We use your details to reply to you and nothing else. No mailing list.
    </div>`);
}

export type NotifyResult = { notified: boolean; acknowledged: boolean; skipped?: string };

/** Never throws — a mail failure must not fail the lead submission. */
export async function notifyLead(lead: LeadInput): Promise<NotifyResult> {
  if (!resend) {
    return {
      notified: false,
      acknowledged: false,
      skipped: "RESEND_API_KEY not set",
    };
  }

  const [internal, ack] = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: lead.email,
      subject: `New enquiry — ${lead.name}${lead.company ? ` · ${lead.company}` : ""}`,
      html: notificationHtml(lead),
    }),
    resend.emails.send({
      from: FROM,
      to: [lead.email],
      replyTo: site.contact.email,
      subject: `We've got your enquiry — ${site.name}`,
      html: acknowledgementHtml(lead),
    }),
  ]);

  if (internal.status === "rejected") console.error("[mail] notify failed:", internal.reason);
  if (ack.status === "rejected") console.error("[mail] ack failed:", ack.reason);

  return {
    notified: internal.status === "fulfilled",
    acknowledged: ack.status === "fulfilled",
  };
}
