import axiosInstance from './axios';

// Fast semantic-only search (returns raw Qdrant similarities)
// req.body: { jobId, topK, filters }
export const searchSemanticOnly = async (searchData) => {
  const response = await axiosInstance.post('/search', searchData);
  return response.data;
};

// Full hybrid-ranked semantic search
// req.body: { jobId, topK, filters }
export const searchHybridRanked = async (searchData) => {
  const response = await axiosInstance.post('/search/semantic', searchData);
  return response.data;
};
