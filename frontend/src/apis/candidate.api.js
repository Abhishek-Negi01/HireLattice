import axiosInstance from "./axios";

// Get current candidate's profile
export const getMyProfile = async () => {
  const response = await axiosInstance.get("/candidates/me");
  return response.data;
};

// Update current candidate's profile
export const updateMyProfile = async (profileData) => {
  const response = await axiosInstance.patch("/candidates/me", profileData);
  return response.data;
};

// Get a candidate's profile by ID (Recruiter access)
export const getCandidateById = async (id) => {
  const response = await axiosInstance.get(`/candidates/${id}`);
  return response.data;
};
