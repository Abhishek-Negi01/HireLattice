import { semanticSearch } from "../../services/ranking/semanticSearch.js";
import { rankCandidatesForJob } from "../../services/ranking/rankingEngine.js";
import CandidateAiProfile from "../candidate/candidateAiProfile.model.js";
import prisma from "../../config/prisma.js";

// POST /api/search  — fast semantic-only, returns raw Qdrant results
export const semanticOnly = async ({ jobId, topK = 20, filters = {} }) => {
  const { results } = await semanticSearch(jobId, topK, filters);
  if (!results.length) return [];

  const candidateIds = results.map((r) => r.candidateId);
  const [candidates, profiles] = await Promise.all([
    prisma.candidate.findMany({ where: { id: { in: candidateIds } } }),
    CandidateAiProfile.find(
      { candidateId: { $in: candidateIds } },
      "candidateId name topSkills seniorityLevel totalExperienceYears location",
    ).lean(),
  ]);

  const candMap = Object.fromEntries(candidates.map((c) => [c.id, c]));
  const profileMap = Object.fromEntries(
    profiles.map((p) => [p.candidateId, p]),
  );

  return results.map((r, i) => ({
    rank: i + 1,
    candidateId: r.candidateId,
    semanticScore: parseFloat(r.score.toFixed(4)),
    name: candMap[r.candidateId]
      ? `${candMap[r.candidateId].firstName} ${candMap[r.candidateId].lastName}`
      : null,
    email: candMap[r.candidateId]?.email || null,
    location: profileMap[r.candidateId]?.location || null,
    topSkills: profileMap[r.candidateId]?.topSkills || [],
    seniorityLevel: profileMap[r.candidateId]?.seniorityLevel || null,
    totalExperienceYears: profileMap[r.candidateId]?.totalExperienceYears || 0,
  }));
};

// POST /api/search/semantic  — full hybrid ranked search
export const semanticWithRanking = async ({
  jobId,
  topK = 20,
  filters = {},
}) => {
  const ranked = await rankCandidatesForJob(jobId, topK, filters, false);

  return ranked.map((item, index) => ({
    rank: index + 1,
    candidateId: item.candidateId,
    name: `${item.candidate.firstName} ${item.candidate.lastName}`,
    email: item.candidate.email,
    location: item.candidate.location || null,
    topSkills: item.profile.topSkills || [],
    seniorityLevel: item.profile.seniorityLevel || null,
    totalExperienceYears: item.profile.totalExperienceYears || 0,
    scores: item.scores,
  }));
};
