import { getJobVector, searchCandidates } from "../embeddings/vectorStore.js";
import prisma from "../../config/prisma.js";

/**
 * Given a jobId, retrieve its stored embedding and search Qdrant
 * for the top-K most semantically similar candidates.
 */
export const semanticSearch = async (jobId, topK = 20, filters = {}) => {
  // Fetch job's embeddingPointId from Postgres
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job?.embeddingPointId)
    throw new Error("Job has no embedding. Run job intelligence first.");

  const jobVector = await getJobVector(job.embeddingPointId);
  if (!jobVector) throw new Error("Job vector not found in Qdrant.");

  // Build Qdrant filter conditions
  const must = [];
  const minExp = filters.minExperience ?? filters.experienceYears;
  const maxExp = filters.maxExperience;

  if (minExp != null) {
    must.push({
      key: "experienceYears",
      range: { gte: minExp },
    });
  }
  if (maxExp != null) {
    must.push({
      key: "experienceYears",
      range: { lte: maxExp },
    });
  }
  if (filters.location) {
    must.push({ key: "location", match: { value: filters.location } });
  }
  if (filters.skills && filters.skills.length > 0) {
    filters.skills.forEach((skill) => {
      const titleCase = skill.charAt(0).toUpperCase() + skill.slice(1);
      must.push({
        should: [
          { key: "skills", match: { value: skill } },
          { key: "skills", match: { value: titleCase } },
          { key: "skills", match: { value: skill.toLowerCase() } },
          { key: "skills", match: { value: skill.toUpperCase() } }
        ]
      });
    });
  }

  const filter = must.length > 0 ? { must } : null;

  const results = await searchCandidates(jobVector, topK, filter);
  return { jobVector, results };
};
