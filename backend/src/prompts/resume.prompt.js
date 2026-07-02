import PROMPT_CONFIG from "../constants/prompts.js";

const smartTruncate = (text, max) => {
  if (text.length <= max) return text;
  return (
    text.slice(0, Math.floor(max * 0.65)) +
    "\n...[truncated]...\n" +
    text.slice(-Math.floor(max * 0.35))
  );
};

export const buildResumePrompt = (rawText) =>
  `
Extract structured data from this resume.
Return ONLY valid JSON. No markdown. No explanation. No extra text.

{
  "name": string,
  "email": string | null,
  "phone": string | null,
  "location": string | null,
  "linkedinUrl": string | null,
  "githubUrl": string | null,
  "skills": string[],
  "topSkills": string[],
  "totalExperienceYears": number,
  "seniorityLevel": "junior" | "mid" | "senior" | "lead" | null,
  "experience": [
    {
      "company": string,
      "title": string,
      "startDate": string | null,
      "endDate": string | null,
      "current": boolean,
      "description": string,
      "skills": string[]
    }
  ],
  "education": [
    {
      "degree": string,
      "field": string,
      "institution": string,
      "startYear": string | null,
      "endYear": string | null,
      "gpa": string | null
    }
  ],
  "certifications": string[],
  "languages": string[],
  "projects": [
    {
      "name": string,
      "description": string,
      "techStack": string[],
      "url": string | null
    }
  ],
  "summary": string
}

Rules:
- Normalise skills: "NodeJS" → "Node.js", "ReactJS" → "React", "mongo" → "MongoDB"
- topSkills: top 5 technical skills only
- totalExperienceYears: numeric estimate e.g. 2.5
- summary: max 2 factual sentences based only on resume content
- Dates: "Jan 2022" format or null

Resume Text:
${smartTruncate(rawText, PROMPT_CONFIG.MAX_RESUME_CHARS)}
`.trim();
