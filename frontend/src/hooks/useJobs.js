import { useState, useCallback } from 'react';
import * as jobApi from '../apis/job.api';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobApi.getAllJobs();
      setJobs(response.data?.jobs || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobApi.getJobById(id);
      const jobData = response.data?.job || response.data;
      setCurrentJob(jobData);
      return jobData;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch job details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewJob = useCallback(async (jobData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobApi.createJob(jobData);
      const newJob = response.data?.job || response.data;
      setJobs((prev) => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create job');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateJobDetails = useCallback(async (id, jobData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobApi.updateJob(id, jobData);
      const updatedJob = response.data?.job || response.data;
      setJobs((prev) => prev.map((j) => (j.id === id ? updatedJob : j)));
      if (currentJob?.id === id) {
        setCurrentJob(updatedJob);
      }
      return updatedJob;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update job');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentJob]);

  const archiveJobDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await jobApi.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      if (currentJob?.id === id) {
        setCurrentJob(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to archive job');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentJob]);

  return {
    jobs,
    currentJob,
    loading,
    error,
    fetchJobs,
    fetchJobDetails,
    createNewJob,
    updateJobDetails,
    archiveJobDetails,
  };
};

export default useJobs;
