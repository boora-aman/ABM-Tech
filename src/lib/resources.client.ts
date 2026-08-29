/**
 * Resource names for client components.
 *
 * `resources.ts` imports the Mongoose models, which cannot be bundled into a
 * client component. This is the same list with none of the server imports —
 * kept in sync by the assertion in resources.ts.
 */
export const resourceNames = [
  "services",
  "posts",
  "industries",
  "pillars",
  "projects",
  "slides",
  "settings",
  "faqs",
  "commitments",
  "social-status",
] as const;
