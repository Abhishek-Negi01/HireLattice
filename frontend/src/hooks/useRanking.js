import { useState, useCallback } from "react";
import * as rankingApi from "../apis/ranking.api";

export const useRanking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const getRankings = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rankingApi.getStoredRankings(jobId);
      setRankings(response.data.results || []);
      return response.data.results || [];
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch rankings",
      );
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateNewRankings = useCallback(
    async ({ jobId, topK = 20, filters = {}, withExplanation = false }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await rankingApi.generateRankings({
          jobId,
          topK,
          filters,
          withExplanation,
        });
        setRankings(response.data.results || []);
        return response.data.results || [];
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to generate rankings",
        );
        setRankings([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const explainRanking = useCallback(async ({ candidateId, jobId }) => {
    setExplainLoading(true);
    setError(null);
    setExplanation(null);
    try {
      const response = await rankingApi.getRankingExplanation({
        candidateId,
        jobId,
      });
      if (response && response.data) {
        setExplanation({
          ...response.data.explanation,
          overallScore: response.data.scores?.overallScore,
        });
      }
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to explain score",
      );
      throw err;
    } finally {
      setExplainLoading(false);
    }
  }, []);

  return {
    rankings,
    loading,
    explainLoading,
    error,
    explanation,
    getRankings,
    generateNewRankings,
    explainRanking,
    setExplanation,
  };
};

export default useRanking;
