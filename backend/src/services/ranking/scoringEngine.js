// 0–1 score: how many required skills the candidate has
export const scoreSkills = (
  candidateSkills = [],
  requiredSkills = [],
  preferredSkills = [],
) => {
  if (!requiredSkills.length && !preferredSkills.length) return 0.5;

  const candidateSet = new Set(candidateSkills.map((s) => s.toLowerCase()));
  const reqHits = requiredSkills.filter((s) =>
    candidateSet.has(s.toLowerCase()),
  ).length;
  const prefHits = preferredSkills.filter((s) =>
    candidateSet.has(s.toLowerCase()),
  ).length;

  const reqScore = requiredSkills.length ? reqHits / requiredSkills.length : 0;
  const prefScore = preferredSkills.length
    ? prefHits / preferredSkills.length
    : 0;

  return requiredSkills.length ? reqScore * 0.7 + prefScore * 0.3 : prefScore;
};

// 0–1 score: experience years vs job requirement
export const scoreExperience = (
  candidateYears = 0,
  minRequired = 0,
  maxRequired = null,
) => {
  if (minRequired === 0 && !maxRequired) return 0.8; // no requirement = neutral

  if (candidateYears >= minRequired) {
    if (!maxRequired || candidateYears <= maxRequired * 1.5) return 1.0;
    return 0.7; // overqualified
  }
  const gap = minRequired - candidateYears;
  return Math.max(0, 1 - gap / (minRequired || 1));
};

// 0–1 score: education level
export const scoreEducation = (candidateEdu = [], requiredLevel = null) => {
  if (!requiredLevel) return 0.7;
  const levels = ["high school", "diploma", "bachelor", "master", "phd"];
  const reqIdx = levels.findIndex((l) =>
    requiredLevel.toLowerCase().includes(l),
  );
  const candIdx = candidateEdu.reduce((best, edu) => {
    const i = levels.findIndex((l) => edu.degree?.toLowerCase().includes(l));
    return Math.max(best, i);
  }, -1);
  if (reqIdx === -1 || candIdx === -1) return 0.6;
  return candIdx >= reqIdx ? 1.0 : Math.max(0.2, candIdx / reqIdx);
};

// 0–1 score: profile completeness + activity signals
export const scoreBehavioral = (profile = {}) => {
  let score = 0;
  if (profile.linkedinUrl) score += 0.2;
  if (profile.githubUrl) score += 0.2;
  if (profile.phone) score += 0.1;
  if ((profile.projects?.length || 0) >= 2) score += 0.2;
  if ((profile.certifications?.length || 0) >= 1) score += 0.15;
  if ((profile.skills?.length || 0) >= 5) score += 0.15;
  return Math.min(score, 1.0);
};

// 0–1 score: resume content quality
export const scoreResumeQuality = (profile = {}) => {
  let score = 0;
  if (profile.summary?.length > 50) score += 0.2;
  if ((profile.projects?.length || 0) >= 2) score += 0.3;
  if ((profile.certifications?.length || 0) >= 1) score += 0.2;
  if ((profile.skills?.length || 0) >= 8) score += 0.15;
  if ((profile.experience?.length || 0) >= 1) score += 0.15;
  return Math.min(score, 1.0);
};

// 0–1 score: projects relevance
export const scoreProjects = (candidateProjects = [], requiredSkills = []) => {
  if (!candidateProjects.length) return 0;
  const reqSet = new Set(requiredSkills.map((s) => s.toLowerCase()));
  const relevant = candidateProjects.filter((p) =>
    (p.techStack || []).some((t) => reqSet.has(t.toLowerCase())),
  ).length;
  return Math.min(relevant / Math.max(candidateProjects.length, 1), 1.0);
};
