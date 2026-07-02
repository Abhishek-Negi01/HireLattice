import RANKING_WEIGHTS from "../../constants/rankingWeights.js";
import {
  scoreSkills,
  scoreExperience,
  scoreEducation,
  scoreBehavioral,
  scoreResumeQuality,
  scoreProjects,
} from "./scoringEngine.js";

/**
 * Compute full hybrid score for one candidate against one job.
 *
 * @param {number} semanticScore - cosine similarity from Qdrant (0–1)
 * @param {object} candidateProfile - MongoDB AI profile
 * @param {object} jobProfile - MongoDB AI profile for job
 * @returns {object} scores breakdown + overallScore (0–100)
 */
export const computeHybridScore = (
  semanticScore,
  candidateProfile,
  jobProfile,
) => {
  const skillsScore = scoreSkills(
    candidateProfile.skills,
    jobProfile.requiredSkills,
    jobProfile.preferredSkills,
  );
  const experienceScore = scoreExperience(
    candidateProfile.totalExperienceYears,
    jobProfile.minExperienceYears || 0,
    jobProfile.maxExperienceYears,
  );
  const educationScore = scoreEducation(
    candidateProfile.education,
    jobProfile.educationLevel,
  );
  const behavioralScore = scoreBehavioral(candidateProfile);
  const resumeQuality = scoreResumeQuality(candidateProfile);
  const projectsScore = scoreProjects(
    candidateProfile.projects,
    jobProfile.requiredSkills,
  );

  const overallScore =
    semanticScore * RANKING_WEIGHTS.SEMANTIC +
    skillsScore * RANKING_WEIGHTS.SKILLS +
    experienceScore * RANKING_WEIGHTS.EXPERIENCE +
    behavioralScore * RANKING_WEIGHTS.BEHAVIORAL +
    educationScore * RANKING_WEIGHTS.EDUCATION +
    projectsScore * RANKING_WEIGHTS.PROJECTS +
    resumeQuality * RANKING_WEIGHTS.RESUME_QUALITY;

  return {
    semanticScore: parseFloat(semanticScore.toFixed(4)),
    skillsScore: parseFloat(skillsScore.toFixed(4)),
    experienceScore: parseFloat(experienceScore.toFixed(4)),
    educationScore: parseFloat(educationScore.toFixed(4)),
    behaviorScore: parseFloat(behavioralScore.toFixed(4)),
    resumeQuality: parseFloat(resumeQuality.toFixed(4)),
    projectsScore: parseFloat(projectsScore.toFixed(4)),
    overallScore: parseFloat((overallScore * 100).toFixed(2)), // 0–100
  };
};
