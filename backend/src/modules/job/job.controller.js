import asyncHandler from "../../utils/asyncHandler.js";
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} from "../../utils/apiResponse.js";
import {
  createAndProcessJob,
  getJobWithProfile,
  listJobs,
  updateJob,
} from "./job.service.js";
import * as repo from "./job.repository.js";

// POST /api/jobs
export const createJob = asyncHandler(async (req, res) => {
  const { title, description, department, location, employmentType } = req.body;
  if (!title || !description)
    return sendBadRequest(res, "title and description are required");

  const result = await createAndProcessJob({
    title,
    description,
    department,
    location,
    employmentType,
  });
  return sendCreated(res, result, result.warning || "Job created and indexed");
});

// GET /api/jobs
export const getAllJobs = asyncHandler(async (req, res) => {
  const result = await listJobs(req.query);
  return sendSuccess(res, result);
});

// GET /api/jobs/:id
export const getJob = asyncHandler(async (req, res) => {
  const result = await getJobWithProfile(req.params.id);
  if (!result) return sendNotFound(res, "Job not found");
  return sendSuccess(res, result);
});

// PATCH /api/jobs/:id
export const patchJob = asyncHandler(async (req, res) => {
  const job = await repo.findById(req.params.id);
  if (!job) return sendNotFound(res, "Job not found");

  const updated = await updateJob(req.params.id, req.body);
  return sendSuccess(res, updated, "Job updated");
});

// DELETE /api/jobs/:id  (soft delete → ARCHIVED)
export const archiveJob = asyncHandler(async (req, res) => {
  const job = await repo.findById(req.params.id);
  if (!job) return sendNotFound(res, "Job not found");

  await repo.deleteById(req.params.id);
  return sendSuccess(res, null, "Job archived");
});
