export const buildExplanationPrompt = (candidate, job, scores) =>
  `
You are an AI hiring assistant. Explain why this candidate was ranked for this job.
Return ONLY valid JSON. No markdown. No extra text.

{
  "overallVerdict": string,
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "recommendationReason": string
}

Rules:
- overallVerdict: one sentence overall assessment
- strengths: max 4 bullet points
- weaknesses: max 3 bullet points
- missingSkills: skills in job requirements not found in candidate
- recommendationReason: 2 sentences explaining the rank

Candidate Summary:
Name: ${candidate.name || "N/A"}
Skills: ${(candidate.topSkills || []).join(", ")}
Experience: ${candidate.totalExperienceYears || 0} years
Seniority: ${candidate.seniorityLevel || "N/A"}
Summary: ${candidate.summary || "N/A"}

Job Requirements:
Title: ${job.title || "N/A"}
Required Skills: ${(job.requiredSkills || []).join(", ")}
Min Experience: ${job.minExperienceYears || 0} years

Scores:
Semantic: ${scores.semanticScore?.toFixed(2)}
Skills: ${scores.skillsScore?.toFixed(2)}
Experience: ${scores.experienceScore?.toFixed(2)}
Overall: ${scores.overallScore?.toFixed(2)}
`.trim();
