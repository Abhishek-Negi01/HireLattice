import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess, sendBadRequest } from "../../utils/apiResponse.js";
import { semanticOnly, semanticWithRanking } from "./search.service.js";

// POST /api/search
// Fast semantic-only — returns raw Qdrant similarity results
export const search = asyncHandler(async (req, res) => {
  const { jobId, topK, filters } = req.body;
  if (!jobId) return sendBadRequest(res, "jobId is required");

  const results = await semanticOnly({ jobId, topK, filters });
  return sendSuccess(res, { jobId, count: results.length, results });
});

// POST /api/search/semantic
// Full hybrid-ranked semantic search
export const semanticSearch = asyncHandler(async (req, res) => {
  const { jobId, topK, filters } = req.body;
  if (!jobId) return sendBadRequest(res, "jobId is required");

  const results = await semanticWithRanking({ jobId, topK, filters });
  return sendSuccess(res, { jobId, count: results.length, results });
});
