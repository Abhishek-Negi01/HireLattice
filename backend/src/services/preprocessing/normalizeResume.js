import { normalizeSkills } from "../../utils/skillNormalizer.js";
import { normalizeCompany } from "../../utils/companyNormalizer.js";

// Normalise AI-parsed resume fields before storing
export const normalizeResumeProfile = (parsed) => {
  return {
    ...parsed,
    skills: normalizeSkills(parsed.skills || []),
    topSkills: normalizeSkills(parsed.topSkills || []),
    experience: (parsed.experience || []).map((exp) => ({
      ...exp,
      company: normalizeCompany(exp.company || ""),
      skills: normalizeSkills(exp.skills || []),
    })),
  };
};
