import { useState, useCallback } from 'react';
import * as searchApi from '../apis/search.api';

export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSemanticSearch = useCallback(async ({ jobId, topK = 10, filters = {} }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchApi.searchSemanticOnly({ jobId, topK, filters });
      setResults(response.data.results || []);
      return response.data.results || [];
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const runHybridSearch = useCallback(async ({ jobId, topK = 10, filters = {} }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchApi.searchHybridRanked({ jobId, topK, filters });
      setResults(response.data.results || []);
      return response.data.results || [];
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Hybrid search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    runSemanticSearch,
    runHybridSearch,
    setResults,
  };
};

export default useSearch;
