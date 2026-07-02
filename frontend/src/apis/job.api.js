import axiosInstance from "./axios";

// Get all active jobs (optionally paginated or filtered if supported)
export const getAllJobs = async () => {
  const response = await axiosInstance.get("/jobs");
  return response.data;
};

// Get a specific job's details by ID
export const getJobById = async (id) => {
  const response = await axiosInstance.get(`/jobs/${id}`);
  return response.data;
};

// Create a new job (Recruiter only)
export const createJob = async (jobData) => {
  const response = await axiosInstance.post("/jobs", jobData);
  return response.data;
};

// Update an existing job (Recruiter only)
export const updateJob = async (id, jobData) => {
  const response = await axiosInstance.patch(`/jobs/${id}`, jobData);
  return response.data;
};

// Archive / delete a job (Recruiter only)
export const deleteJob = async (id) => {
  const response = await axiosInstance.delete(`/jobs/${id}`);
  return response.data;
};
