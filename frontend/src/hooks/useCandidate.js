import { useState, useCallback } from 'react';
import * as candidateApi from '../apis/candidate.api';

export const useCandidate = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await candidateApi.getMyProfile();
      setProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch candidate profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await candidateApi.updateMyProfile(profileData);
      setProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCandidateById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await candidateApi.getCandidateById(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch candidate');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchMyProfile,
    updateProfile,
    fetchCandidateById,
  };
};

export default useCandidate;
