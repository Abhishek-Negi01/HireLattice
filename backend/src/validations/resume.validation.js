import { z } from "zod";

export const uploadSourceSchema = z.object({
  candidateId: z.string().uuid().optional(), // required for recruiter uploads
});
