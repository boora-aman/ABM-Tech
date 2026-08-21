import type { Metadata } from "next";
import { PageHead } from "@/components/sections/PageHead";
import { Rule } from "@/components/ui/Panel";
import { Markdown } from "@/lib/markdown";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, graph, breadcrumbLd } from "@/lib/seo";
import { site } from "@/lib/site.config";

export const metadata: Metadata = pageMeta({
  title: "Terms of service",
  description:
    "Engagement terms for ABM Tech: scope and pricing, payment schedule, code ownership, what we do not guarantee, support and cancellation.",
  path: "/terms",
});

const BODY = `These terms cover engagements with ${site.legalName}. A signed proposal or written scope takes precedence wherever the two differ.

## Scope and pricing

Work is quoted at a fixed price against a written scope. There is no hourly meter. If discovery reveals work outside the agreed scope, we quote it separately in writing and you decide before it starts.

Prices are in INR and exclusive of GST, which is added at the applicable rate. Third-party costs — hosting, domains, SMS and WhatsApp Business API charges, payment gateway fees, app store fees, LLM API usage — are billed at actuals with no markup and are your cost rather than ours.

## Payment

**Projects:** 40% on signing, 40% at the agreed mid-point milestone, 20% on handover.

**Retainers:** monthly in advance.

Invoices are due within 14 days. We reserve the right to pause work on accounts more than 30 days overdue, having told you first.

## Intellectual property

You own the deliverables outright, from the first commit. Code lives in your Git organisation and deploys to your accounts. On final payment all rights in the bespoke work transfer to you.

We retain ownership of our pre-existing tooling, internal libraries and general know-how, and the right to reuse generic techniques. We do not reuse your business logic, data or designs for another client.

## What we do not guarantee

We do not guarantee search rankings, traffic volumes or lead counts — those depend on competitor activity, algorithm changes and your own pricing and reviews. Specifically on Google Maps: there is no single "position one", because results are personalised by the searcher's distance from your premises. Any figures we cite from past work are historical results, not forecasts.

For AI automation we do not guarantee a zero error rate. Accuracy is measured and reported, low-confidence output is routed to human review, and anyone claiming perfect accuracy is either not measuring or not telling you.

## Your responsibilities

You agree to provide accurate information, to hold the rights to any content or data you give us, and to give timely feedback and access. Where a timeline depends on your input — approvals, content, data exports, staff availability for training — delays there move the schedule.

## Confidentiality

Both sides keep the other's confidential information confidential. We will not name you as a client or publish work about your project without your written agreement. Where an engagement is under NDA, that NDA governs.

## Support and warranty

Every build includes 30 days of bug fixing after launch at no charge. A bug is behaviour that departs from the agreed scope; a change of mind about the scope is a change request.

Support beyond that is a separate, optional retainer. Your software works whether or not you buy it.

## Cancellation

Retainers cancel with 30 days' written notice from either side, with no penalty. Project work cancelled mid-delivery is invoiced for work completed to that point, and you receive everything produced so far — code, documentation, credentials — regardless of the reason.

## Liability

Our total liability under any engagement is limited to the fees you paid us for that engagement. We are not liable for indirect or consequential loss, including lost profit, revenue or data, except where the law does not permit that limitation.

## Governing law

These terms are governed by the laws of India, and the courts at our registered office have exclusive jurisdiction.

## Contact

Questions about these terms go to ${site.contact.email}.`;

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Terms", path: "/terms" },
          ]),
        )}
      />
      <PageHead
        label="Legal"
        title="Terms of service"
        lead="The commercial terms in plain language — including a clear statement of what we do not guarantee, because that is the part that matters most."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
      />
      <Rule />
      <div className="page-x py-14">
        <div className="bay max-w-3xl">
          <p className="meta mb-10">Last updated: 6 August 2026</p>
          <Markdown source={BODY} />
        </div>
      </div>
    </>
  );
}
