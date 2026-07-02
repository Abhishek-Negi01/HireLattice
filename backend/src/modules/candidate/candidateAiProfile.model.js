import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: null },
    title: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: null },
    skills: { type: [String], default: [] },
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: null },
    field: { type: String, default: null },
    institution: { type: String, default: null },
    startYear: { type: String, default: null },
    endYear: { type: String, default: null },
    gpa: { type: String, default: null },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    description: { type: String, default: null },
    techStack: { type: [String], default: [] },
    url: { type: String, default: null },
  },
  { _id: false },
);

const candidateAiProfileSchema = new mongoose.Schema(
  {
    candidateId: { type: String, required: true, index: true },
    resumeId: { type: String, required: true, index: true },

    name: String,
    email: String,
    phone: String,
    location: String,
    linkedinUrl: String,
    githubUrl: String,

    skills: { type: [String], default: [] },
    topSkills: { type: [String], default: [] },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    certifications: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },

    summary: { type: String, default: null },
    totalExperienceYears: { type: Number, default: 0 },
    seniorityLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "lead", null],
      default: null,
    },

    embeddingPointId: { type: String, default: null },
    parsingModel: { type: String, enum: ["gemini", "groq"], default: null },
    rawTextHash: { type: String, default: null },
  },
  { timestamps: true },
);

candidateAiProfileSchema.index(
  { candidateId: 1, resumeId: 1 },
  { unique: true },
);

export default mongoose.model("CandidateAiProfile", candidateAiProfileSchema);
