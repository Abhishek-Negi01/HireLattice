import { semanticSearch } from "./semanticSearch.js";
import { computeHybridScore } from "./hybridRanking.js";
import { generateExplanation } from "../ai/explanationGenerator.js";
import prisma from "../../config/prisma.js";
import CandidateAiProfile from "../../modules/candidate/candidateAiProfile.model.js";
import JobAiProfile from "../../modules/job/jobAiProfile.model.js";
import logger from "../../utils/logger.js";

/**
 * Full ranking pipeline for a job.
 * 1. Semantic search → top-K from Qdrant
 * 2. Bulk fetch Postgres + MongoDB profiles
 * 3. Compute hybrid score per candidate
 * 4. Optionally generate AI explanations
 * 5. Persist rankings to Postgres
 * 6. Return sorted results
 */
export const rankCandidatesForJob = async (
  jobId,
  topK = 20,
  filters = {},
  withExplanation = false,
) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found");

  const jobAiProfile = await JobAiProfile.findOne({ jobId }).lean();
  if (!jobAiProfile)
    throw new Error("Job AI profile not found — run job intelligence first");

  // 1. Semantic search
  const { results: semanticResults } = await semanticSearch(
    jobId,
    topK,
    filters,
  );
  if (!semanticResults.length) return [];

  // 2. Bulk fetch
  const candidateIds = semanticResults.map((r) => r.candidateId);

  const [candidates, aiProfiles] = await Promise.all([
    prisma.candidate.findMany({ where: { id: { in: candidateIds } } }),
    CandidateAiProfile.find({ candidateId: { $in: candidateIds } }).lean(),
  ]);

  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));
  const profileMap = Object.fromEntries(
    aiProfiles.map((p) => [p.candidateId, p]),
  );

  // 3. Score
  const scored = semanticResults
    .map((result) => {
      const candidate = candidateMap[result.candidateId];
      const profile = profileMap[result.candidateId];
      if (!candidate || !profile) return null;
      const scores = computeHybridScore(result.score, profile, jobAiProfile);
      return { candidateId: result.candidateId, candidate, profile, scores };
    })
    .filter(Boolean)
    .sort((a, b) => b.scores.overallScore - a.scores.overallScore);

  // 4. Persist rankings to Postgres (upsert)
  await Promise.all(
    scored.map((item, index) =>
      prisma.ranking.upsert({
        where: { jobId_candidateId: { jobId, candidateId: item.candidateId } },
        update: { rank: index + 1, ...item.scores },
        create: {
          jobId,
          candidateId: item.candidateId,
          rank: index + 1,
          ...item.scores,
        },
      }),
    ),
  );

  // 5. Optionally generate AI explanations (token cost — only on explicit request)
  if (withExplanation) {
    for (const item of scored) {
      try {
        item.explanation = await generateExplanation(
          item.profile,
          { ...job, ...jobAiProfile },
          item.scores,
        );
      } catch (err) {
        logger.warn(
          `Explanation failed for ${item.candidateId}: ${err.message}`,
        );
        item.explanation = null;
      }
    }
  }

  return scored;
};
