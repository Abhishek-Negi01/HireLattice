import { rankCandidatesForJob } from "../../services/ranking/rankingEngine.js";
import {
  findRankingsByJob,
  findRankingByJobAndCandidate,
} from "./ranking.repository.js";
import { generateExplanation } from "../../services/ai/explanationGenerator.js";
import CandidateAiProfile from "../candidate/candidateAiProfile.model.js";
import JobAiProfile from "../job/jobAiProfile.model.js";
import { findById as findJob } from "../job/job.repository.js";

// Run full ranking pipeline and persist results
export const generateRanking = async ({
  jobId,
  topK = 20,
  filters = {},
  withExplanation = false,
}) => {
  return rankCandidatesForJob(jobId, topK, filters, withExplanation);
};

// Fetch previously stored rankings from Postgres (no AI cost)
export const getStoredRankings = async (jobId) => {
  return findRankingsByJob(jobId);
};

// Generate explanation for a single candidate-job pair
export const explainCandidateRanking = async ({ candidateId, jobId }) => {
  const [job, jobAiProfile, ranking, candidateProfile] = await Promise.all([
    findJob(jobId),
    JobAiProfile.findOne({ jobId }).lean(),
    findRankingByJobAndCandidate(jobId, candidateId),
    CandidateAiProfile.findOne({ candidateId }).lean(),
  ]);

  if (!job || !jobAiProfile) throw new Error("Job not found");
  if (!ranking) throw new Error("No ranking found — run ranking first");
  if (!candidateProfile) throw new Error("Candidate AI profile not found");

  const scores = {
    semanticScore: ranking.semanticScore,
    skillsScore: ranking.skillsScore,
    experienceScore: ranking.experienceScore,
    educationScore: ranking.educationScore,
    behaviorScore: ranking.behaviorScore,
    projectsScore: ranking.projectsScore,
    resumeQuality: ranking.resumeQuality,
    overallScore: ranking.overallScore,
  };

  const explanation = await generateExplanation(
    candidateProfile,
    { ...job, ...jobAiProfile },
    scores,
  );
  return { candidateId, jobId, rank: ranking.rank, scores, explanation };
};
