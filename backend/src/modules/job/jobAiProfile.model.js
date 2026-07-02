import mongoose from "mongoose";

const jobAiProfileSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true, index: true },

    requiredSkills: { type: [String], default: [] },
    preferredSkills: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    minExperienceYears: { type: Number, default: null },
    maxExperienceYears: { type: Number, default: null },
    educationLevel: { type: String, default: null },
    keywords: { type: [String], default: [] },
    seniorityLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "lead", null],
      default: null,
    },
    summary: { type: String, default: null },

    embeddingPointId: { type: String, default: null },
    parsingModel: { type: String, enum: ["gemini", "groq"], default: null },
  },
  { timestamps: true },
);

export default mongoose.model("JobAiProfile", jobAiProfileSchema);
