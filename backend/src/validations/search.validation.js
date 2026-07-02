import { z } from "zod";

export const semanticSearchSchema = z.object({
  jobId: z.string().uuid(),
  topK: z.number().int().min(1).max(100).default(20),
  filters: z
    .object({
      minExperience: z.number().optional(),
      maxExperience: z.number().optional(),
      skills: z.array(z.string()).optional(),
      location: z.string().optional(),
    })
    .optional(),
});
