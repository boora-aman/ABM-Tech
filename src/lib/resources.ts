import type { Model } from "mongoose";
import type { ZodType } from "zod";
import {
  ServiceModel,
  PostModel,
  IndustryModel,
  PillarModel,
  ProjectModel,
  SlideModel,
  SettingModel,
  GlobalFaqModel,
  CommitmentModel,
  SocialStatusModel,
  type AnyDoc,
} from "@/lib/db/models";
import {
  serviceWriteSchema,
  postWriteSchema,
  industryWriteSchema,
  pillarWriteSchema,
  projectWriteSchema,
  slideWriteSchema,
  settingWriteSchema,
  globalFaqWriteSchema,
  commitmentWriteSchema,
  socialStatusWriteSchema,
} from "@/lib/validators";

/* ==========================================================================
   RESOURCE REGISTRY

   ONE definition of every editable collection, shared by:
     • /api/admin/[resource]  — session-authenticated, used by the admin UI
     • /api/v1/[resource]     — token-authenticated, used by automations/MCP

   Having both routes resolve through the same registry is the point. A script
   cannot write a shape the admin would reject, cannot touch a collection the
   admin does not expose, and cannot skip the cache revalidation that keeps
   the statically generated pages current.

   `revalidate` lists the paths whose static HTML must be regenerated after a
   write. Getting this list right is what keeps the CMS SEO-safe: the page a
   crawler receives is still pre-rendered, it is simply pre-rendered again.
   ========================================================================== */

export type ResourceDef = {
  model: Model<AnyDoc>;
  schema: ZodType;
  /** Unique key used for upserts. Absent for id-only collections. */
  uniqueKey?: string;
  /** Paths to revalidate after any write. */
  revalidate: string[];
  /** Human label for the admin UI and the API index. */
  label: string;
  /** Default sort applied on list reads. */
  sort: Record<string, 1 | -1>;
};

const ALWAYS = ["/", "/sitemap.xml", "/llms.txt"];

export const RESOURCES: Record<string, ResourceDef> = {
  services: {
    model: ServiceModel,
    schema: serviceWriteSchema,
    uniqueKey: "slug",
    label: "Services",
    sort: { order: 1, index: 1 },
    revalidate: [
      ...ALWAYS,
      "/services",
      "/services/[slug]",
      "/pricing",
      "/industries",
      "/blog/[slug]",
    ],
  },
  posts: {
    model: PostModel,
    schema: postWriteSchema,
    uniqueKey: "slug",
    label: "Journal posts",
    sort: { publishedAt: -1 },
    revalidate: [...ALWAYS, "/blog", "/blog/[slug]", "/feed.xml"],
  },
  industries: {
    model: IndustryModel,
    schema: industryWriteSchema,
    uniqueKey: "slug",
    label: "Industries",
    sort: { order: 1, index: 1 },
    revalidate: [...ALWAYS, "/industries", "/services/[slug]"],
  },
  pillars: {
    model: PillarModel,
    schema: pillarWriteSchema,
    uniqueKey: "key",
    label: "Systems (pillars)",
    sort: { order: 1, index: 1 },
    revalidate: [...ALWAYS, "/industries", "/services", "/services/[slug]"],
  },
  projects: {
    model: ProjectModel,
    schema: projectWriteSchema,
    uniqueKey: "slug",
    label: "Work",
    sort: { order: 1, index: 1 },
    revalidate: [...ALWAYS, "/work", "/services/[slug]"],
  },
  slides: {
    model: SlideModel,
    schema: slideWriteSchema,
    uniqueKey: "slug",
    label: "Showcase slides",
    sort: { order: 1 },
    revalidate: [...ALWAYS, "/work"],
  },
  settings: {
    model: SettingModel,
    schema: settingWriteSchema,
    uniqueKey: "key",
    label: "Page copy & settings",
    sort: { group: 1, key: 1 },
    // Copy can appear on any page, so a settings write refreshes the lot.
    revalidate: [
      ...ALWAYS,
      "/services",
      "/pricing",
      "/industries",
      "/work",
      "/about",
      "/contact",
      "/blog",
      "/services/[slug]",
      "/blog/[slug]",
    ],
  },
  faqs: {
    model: GlobalFaqModel,
    schema: globalFaqWriteSchema,
    label: "Site-wide FAQs",
    sort: { order: 1 },
    revalidate: [...ALWAYS, "/services", "/services/[slug]"],
  },
  /* Publishing state only — the post content itself is a generated module,
     not a database record, so this writes nothing the site renders and needs
     no page revalidation. */
  "social-status": {
    model: SocialStatusModel,
    schema: socialStatusWriteSchema,
    uniqueKey: "key",
    label: "Social publishing status",
    sort: { key: 1 },
    revalidate: [],
  },
  commitments: {
    model: CommitmentModel,
    schema: commitmentWriteSchema,
    label: "Commitments",
    sort: { order: 1, index: 1 },
    revalidate: [...ALWAYS, "/about"],
  },
};

export function resolveResource(name: string): ResourceDef | null {
  return Object.hasOwn(RESOURCES, name) ? RESOURCES[name] : null;
}

export const resourceNames = Object.keys(RESOURCES);

/* The client bundle needs this list without the Mongoose imports, so it is
   duplicated in resources.client.ts. This assertion fails the build if the two
   ever drift apart. */
import { resourceNames as clientNames } from "./resources.client";
if (
  process.env.NODE_ENV !== "production" &&
  (clientNames.length !== resourceNames.length ||
    !resourceNames.every((n) => (clientNames as readonly string[]).includes(n)))
) {
  throw new Error(
    "resources.client.ts is out of sync with RESOURCES — update the list there too.",
  );
}
