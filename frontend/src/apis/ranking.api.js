import axiosInstance from "./axios";

// Generate rankings for a job description
// body: { jobId, topK, filters, withExplanation }
export const generateRankings = async (rankingData) => {
  const response = await axiosInstance.post("/ranking/generate", rankingData);
  return response.data;
};

// Retrieve pre-calculated stored rankings (fast, no AI cost)
export const getStoredRankings = async (jobId) => {
  const response = await axiosInstance.get(`/ranking/${jobId}`);
  return response.data;
};

// Get detailed AI explainability for a specific candidate match
// body: { candidateId, jobId }
export const getRankingExplanation = async (explainData) => {
  const response = await axiosInstance.post("/ranking/explain", explainData);
  return response.data;
};
