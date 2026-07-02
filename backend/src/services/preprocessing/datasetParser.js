import { extractCsv } from "./csvExtractor.js";
import { hashText } from "../../utils/hashResume.js";
import logger from "../../utils/logger.js";

// Converts a CSV row into a parsed AI profile shape (same as resumeParser output)
const rowToProfile = (row) => ({
  name: row.name,
  email: row.email,
  phone: row.phone,
  location: null,
  linkedinUrl: null,
  githubUrl: null,
  skills: row.skills,
  topSkills: row.skills.slice(0, 5),
  totalExperienceYears: row.yearsExperience,
  seniorityLevel:
    row.yearsExperience >= 5
      ? "senior"
      : row.yearsExperience >= 2
        ? "mid"
        : "junior",
  experience: row.jobRole
    ? [
        {
          company: null,
          title: row.jobRole,
          startDate: null,
          endDate: null,
          current: false,
          description: row.resumeText.slice(0, 300),
          skills: row.skills,
        },
      ]
    : [],
  education: row.university
    ? [
        {
          degree: null,
          field: null,
          institution: row.university,
          startYear: null,
          endYear: row.graduationYear,
          gpa: null,
        },
      ]
    : [],
  certifications: [],
  languages: [],
  projects: [],
  summary: row.resumeText.slice(0, 200),
});

export const parseDatasetBuffer = (buffer) => {
  const rows = extractCsv(buffer);
  logger.info(`CSV dataset: ${rows.length} rows parsed`);

  return rows.map((row) => ({
    profile: rowToProfile(row),
    rawText: row.resumeText,
    rawTextHash: hashText(row.resumeText),
    email: row.email,
    name: row.name,
  }));
};
