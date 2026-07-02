import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess, sendNotFound } from "../../utils/apiResponse.js";
import {
  getCandidateProfile,
  updateCandidateProfile,
} from "./candidate.service.js";
import { findByClerkId } from "./candidate.repository.js";

// GET /api/candidates/me
export const getMyProfile = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const candidate = await findByClerkId(userId);
  if (!candidate) return sendNotFound(res, "Candidate not found");

  const profile = await getCandidateProfile(candidate.id);
  return sendSuccess(res, profile);
});

// PATCH /api/candidates/me
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const candidate = await findByClerkId(userId);
  if (!candidate) return sendNotFound(res, "Candidate not found");

  const { firstName, lastName, phone, linkedinUrl, location } = req.body;
  const updated = await updateCandidateProfile(candidate.id, {
    firstName,
    lastName,
    phone,
    linkedinUrl,
    location,
  });
  return sendSuccess(res, updated, "Profile updated");
});

// GET /api/candidates/:id  (recruiter access)
export const getCandidateById = asyncHandler(async (req, res) => {
  const profile = await getCandidateProfile(req.params.id);
  if (!profile) return sendNotFound(res, "Candidate not found");
  return sendSuccess(res, profile);
});
