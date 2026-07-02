import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(20),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "internship"])
    .optional(),
});

export const updateJobSchema = createJobSchema.partial();
