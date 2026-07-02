import prisma from "../../config/prisma.js";

export const findRankingsByJob = (jobId) =>
  prisma.ranking.findMany({
    where: { jobId },
    orderBy: { rank: "asc" },
    include: { candidate: true },
  });

export const findRankingByJobAndCandidate = (jobId, candidateId) =>
  prisma.ranking.findUnique({
    where: { jobId_candidateId: { jobId, candidateId } },
  });
