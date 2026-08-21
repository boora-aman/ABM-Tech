import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { Rule } from "@/components/ui/Panel";
import { Markdown } from "@/lib/markdown";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, graph, breadcrumbLd } from "@/lib/seo";
import { site } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  description:
    "What data ABM Tech collects through this website, why, how long it is kept and how to have it deleted. No analytics, no advertising pixels, no session recording.",
  path: "/privacy",
});

const BODY = `We collect as little as possible and sell none of it. This page says exactly what happens to what you send us.

## What we collect

**When you submit the contact form:** your name and email, plus — only if you choose to provide them — phone number, business name, the service you are interested in and a budget band, along with your message.

**Automatically with that submission:** the page you submitted from, your IP address and browser user-agent. These exist solely to triage spam and abuse. They are never used to profile you and never shown publicly.

**Nothing else.** There is no analytics tracker, no advertising pixel, no session recording, no third-party cookie and no fingerprinting script on this site.

## Why we collect it

To reply to your enquiry. That is the entire purpose. Your details are not added to a mailing list, not synced to a third-party CRM, and not shared with any partner or reseller.

## Where it is stored

In our own MongoDB database. If email notification is enabled, the message content passes through Resend as the transactional email provider. Both act on our instructions as processors, not as independent controllers of your data.

## How long we keep it

Enquiries are retained while commercially relevant, and for a maximum of 24 months after our last contact with you. If you become a client, project correspondence is kept for the length of the engagement plus the statutory period required for tax records.

## Your rights

You can ask us to tell you what we hold, correct anything wrong, delete it entirely, or stop processing it. Email ${site.contact.email} and we will action it within seven working days. There is no form to fill in and we will not ask you to justify the request.

## Cookies

This site sets no tracking cookies. Nothing is stored in your browser except what the browser itself caches.

## Third-party links

Some pages link to WhatsApp and social platforms. Once you follow such a link you are on that company's property and subject to their privacy policy, which we neither control nor have read on your behalf.

## Children

This site is for businesses and is not directed at anyone under 18. We do not knowingly collect data from children.

## Changes

If this policy changes materially we will update the date below. We will not quietly broaden what we collect and rely on you rereading the page.

## Contact

Questions go to ${site.contact.email}, or call ${site.contact.phoneDisplay} during working hours.`;

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ]),
        )}
      />
      <PageHead
        label="Legal"
        title="Privacy policy"
        lead="No analytics, no advertising pixels, no session recording. This page explains the small amount of data we do collect and how to have it removed."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      />
      <Rule />
      <div className="page-x py-14">
        <div className="bay max-w-3xl">
          <p className="label mb-10">Last updated: 6 August 2026</p>
          <Markdown source={BODY} />
        </div>
      </div>
    </>
  );
}
