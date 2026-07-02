import PROMPT_CONFIG from "../constants/prompts.js";

const smartTruncate = (text, max) => {
  if (text.length <= max) return text;
  return (
    text.slice(0, Math.floor(max * 0.65)) +
    "\n...[truncated]...\n" +
    text.slice(-Math.floor(max * 0.35))
  );
};

export const buildJdPrompt = (jdText) =>
  `
Extract structured requirements from this job description.
Return ONLY valid JSON. No markdown. No explanation. No extra text.

{
  "requiredSkills": string[],
  "preferredSkills": string[],
  "responsibilities": string[],
  "minExperienceYears": number | null,
  "maxExperienceYears": number | null,
  "educationLevel": string | null,
  "keywords": string[],
  "seniorityLevel": "junior" | "mid" | "senior" | "lead" | null,
  "summary": string
}

Rules:
- responsibilities: max 8 items
- keywords: important domain terms not already listed in skills
- summary: 1-2 sentences describing the role

Job Description:
${smartTruncate(jdText, PROMPT_CONFIG.MAX_JD_CHARS)}
`.trim();
