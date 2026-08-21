import { z } from "zod";

/**
 * Shared by the client form (inline errors) and the API route (the authority).
 * The server always re-parses; the client pass is UX only.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(24)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[+\d][\d\s()-]{6,23}$/.test(v), "Enter a valid phone number"),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(12, "A sentence or two about the problem helps")
    .max(4000, "Longer than we can accept — please summarise"),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  /** Honeypot: must stay empty. Bots fill every field they find. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Client render timestamp; sub-2s submissions are almost always bots. */
  renderedAt: z.coerce.number().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
