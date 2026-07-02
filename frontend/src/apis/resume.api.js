import axiosInstance from "./axios";

// Candidate upload
export const uploadResumeCandidate = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await axiosInstance.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};

// Recruiter upload single for a specific candidate
export const uploadResumeRecruiterSingle = async (
  file,
  candidateId,
  onUploadProgress,
) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("candidateId", candidateId);
  const response = await axiosInstance.post(
    "/resumes/upload-single",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    },
  );
  return response.data;
};

// Recruiter bulk upload
export const uploadResumeRecruiterBulk = async (files, onUploadProgress) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("resumes", files[i]);
  }
  const response = await axiosInstance.post("/resumes/upload-bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};

// Recruiter ZIP upload
export const uploadResumeRecruiterZip = async (zipFile, onUploadProgress) => {
  const formData = new FormData();
  formData.append("zip", zipFile);
  const response = await axiosInstance.post("/resumes/upload-zip", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};

// Get current candidate's active resume and parsed AI profile
export const getMyResume = async () => {
  const response = await axiosInstance.get("/resumes/me");
  return response.data;
};

// Get a candidate's resume by ID (Recruiter only)
export const getResumeById = async (id) => {
  const response = await axiosInstance.get(`/resumes/${id}`);
  return response.data;
};

// Delete resume (Owner or Recruiter)
export const deleteResume = async (id) => {
  const response = await axiosInstance.delete(`/resumes/${id}`);
  return response.data;
};

// Recruiter dataset (CSV) upload
export const uploadResumeDataset = async (csvFile, onUploadProgress) => {
  const formData = new FormData();
  formData.append("dataset", csvFile);
  const response = await axiosInstance.post(
    "/resumes/upload-dataset",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    },
  );
  return response.data;
};
