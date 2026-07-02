import asyncHandler from "../../utils/asyncHandler.js";
import {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
} from "../../utils/apiResponse.js";
import {
  generateRanking,
  getStoredRankings,
  explainCandidateRanking,
} from "./ranking.service.js";

// POST /api/ranking/generate
// Runs full pipeline: semantic search → hybrid score → persist → return
export const runRanking = asyncHandler(async (req, res) => {
  const { jobId, topK = 20, filters = {}, withExplanation = false } = req.body;
  if (!jobId) return sendBadRequest(res, "jobId is required");

  const ranked = await generateRanking({
    jobId,
    topK,
    filters,
    withExplanation,
  });

  const results = ranked.map((item, index) => ({
    rank: index + 1,
    candidateId: item.candidateId,
    name: `${item.candidate.firstName} ${item.candidate.lastName}`,
    email: item.candidate.email,
    location: item.candidate.location || null,
    topSkills: item.profile.topSkills || [],
    seniorityLevel: item.profile.seniorityLevel || null,
    totalExperienceYears: item.profile.totalExperienceYears || 0,
    scores: item.scores,
    explanation: item.explanation || null,
  }));

  return sendSuccess(res, { jobId, count: results.length, results });
});

// GET /api/ranking/:jobId
// Fetches stored rankings from Postgres (no AI cost, instant)
export const getRanking = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const rankings = await getStoredRankings(jobId);
  if (!rankings.length)
    return sendNotFound(
      res,
      "No rankings found for this job — run ranking first",
    );

  const results = rankings.map((r) => ({
    rank: r.rank,
    candidateId: r.candidateId,
    name: `${r.candidate.firstName} ${r.candidate.lastName}`,
    email: r.candidate.email,
    overallScore: r.overallScore,
    scores: {
      semanticScore: r.semanticScore,
      skillsScore: r.skillsScore,
      experienceScore: r.experienceScore,
      educationScore: r.educationScore,
      behaviorScore: r.behaviorScore,
      projectsScore: r.projectsScore,
      resumeQuality: r.resumeQuality,
    },
  }));

  return sendSuccess(res, { jobId, count: results.length, results });
});

// POST /api/ranking/explain
// Generates AI explanation for a specific candidate's ranking
export const explainScore = asyncHandler(async (req, res) => {
  const { candidateId, jobId } = req.body;
  if (!candidateId || !jobId)
    return sendBadRequest(res, "candidateId and jobId are required");

  const result = await explainCandidateRanking({ candidateId, jobId });
  return sendSuccess(res, result);
});
