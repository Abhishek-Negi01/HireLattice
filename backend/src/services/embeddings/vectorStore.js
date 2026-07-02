import { qdrant, COLLECTIONS } from "../../config/qdrant.js";
import { v4 as uuidv4 } from "uuid";

// Upsert a candidate vector into Qdrant
export const upsertCandidateVector = async (
  candidateId,
  vector,
  payload = {},
) => {
  const pointId = uuidv4();
  await qdrant.upsert(COLLECTIONS.CANDIDATES, {
    points: [{ id: pointId, vector, payload: { candidateId, ...payload } }],
  });
  return pointId;
};

// Upsert a job vector into Qdrant
export const upsertJobVector = async (jobId, vector, payload = {}) => {
  const pointId = uuidv4();
  await qdrant.upsert(COLLECTIONS.JOBS, {
    points: [{ id: pointId, vector, payload: { jobId, ...payload } }],
  });
  return pointId;
};

// Search top-K candidates by a job embedding vector
export const searchCandidates = async (jobVector, topK = 20, filter = null) => {
  const params = { vector: jobVector, limit: topK, with_payload: true };
  if (filter) params.filter = filter;

  const results = await qdrant.search(COLLECTIONS.CANDIDATES, params);
  return results.map((r) => ({
    candidateId: r.payload.candidateId,
    score: r.score,
    pointId: r.id,
    payload: r.payload,
  }));
};

// Retrieve a job's stored vector by pointId
export const getJobVector = async (pointId) => {
  const results = await qdrant.retrieve(COLLECTIONS.JOBS, {
    ids: [pointId],
    with_vector: true,
  });
  return results[0]?.vector || null;
};

// Delete candidate vector by pointId
export const deleteCandidateVector = async (pointId) => {
  await qdrant.delete(COLLECTIONS.CANDIDATES, { points: [pointId] });
};
