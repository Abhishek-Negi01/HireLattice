import asyncHandler from "../../utils/asyncHandler.js";
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
} from "../../utils/apiResponse.js";
import { syncCandidate, getCandidateByClerkId } from "./auth.service.js";

// POST /api/auth/register
// Called on first login from frontend — creates/syncs candidate in Postgres
export const register = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const { email, firstName, lastName, phone } = req.body;

  if (!email || !firstName || !lastName) {
    return sendBadRequest(res, "email, firstName, and lastName are required");
  }

  const candidate = await syncCandidate({
    clerkId: userId,
    email,
    firstName,
    lastName,
    phone,
  });
  return sendCreated(res, candidate, "Candidate registered");
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const candidate = await getCandidateByClerkId(userId);
  if (!candidate)
    return sendBadRequest(res, "Candidate not found — please register first");
  return sendSuccess(res, candidate);
});
