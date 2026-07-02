import { useState, useCallback } from 'react';
import * as resumeApi from '../apis/resume.api';

export const useResumeUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [bulkResult, setBulkResult] = useState(null);

  const resetQueue = useCallback(() => {
    setUploadQueue([]);
    setBulkResult(null);
    setError(null);
  }, []);

  const validateFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ];
    const maxSize = 15 * 1024 * 1024; // 15MB

    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.zip')) {
      return 'Unsupported file format. Please upload PDF, DOCX, or ZIP files.';
    }
    if (file.size > maxSize) {
      return 'File size exceeds the 15MB limit.';
    }
    return null;
  };

  const uploadCandidate = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await resumeApi.uploadResumeCandidate(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      return response;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.reason || err.message || 'Upload failed';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadRecruiterSingle = useCallback(async (file, candidateId) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await resumeApi.uploadResumeRecruiterSingle(file, candidateId, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      return response;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.reason || err.message || 'Upload failed';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadRecruiterBulk = useCallback(async (files) => {
    const items = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      error: validateFile(file),
    }));

    setUploadQueue(items);
    setLoading(true);
    setError(null);

    // Filter valid files to submit in body
    const validFiles = Array.from(files).filter((file) => !validateFile(file));
    if (!validFiles.length) {
      setLoading(false);
      setError('No valid files to upload.');
      return;
    }

    // Set first few items status to uploading
    setUploadQueue((prev) =>
      prev.map((item) => (item.error ? item : { ...item, status: 'uploading' }))
    );

    try {
      const response = await resumeApi.uploadResumeRecruiterBulk(validFiles, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.status === 'uploading' ? { ...item, progress: percentCompleted } : item
          )
        );
      });

      setBulkResult(response.data);

      // Map backend results back to queue
      // response.data.results: [{ success, file, reason, resumeId, isDuplicate }]
      const resultsMap = {};
      response.data.results?.forEach((r) => {
        resultsMap[r.file] = r;
      });

      setUploadQueue((prev) =>
        prev.map((item) => {
          if (item.error) return { ...item, status: 'failed' };
          const res = resultsMap[item.name];
          if (!res) return { ...item, status: 'success', progress: 100 };
          if (res.success) {
            return { ...item, status: 'success', progress: 100 };
          } else {
            return {
              ...item,
              status: res.isDuplicate ? 'duplicate' : 'failed',
              error: res.reason || 'Processing failed',
              progress: 100,
            };
          }
        })
      );

      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Bulk upload request failed';
      setError(errMsg);
      setUploadQueue((prev) =>
        prev.map((item) => (item.error ? item : { ...item, status: 'failed', error: errMsg }))
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadRecruiterZip = useCallback(async (zipFile) => {
    const validationError = validateFile(zipFile);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await resumeApi.uploadResumeRecruiterZip(zipFile, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      setBulkResult(response.data);
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'ZIP upload failed';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadProgress,
    uploadQueue,
    bulkResult,
    uploadCandidate,
    uploadRecruiterSingle,
    uploadRecruiterBulk,
    uploadRecruiterZip,
    resetQueue,
  };
};

export default useResumeUpload;
