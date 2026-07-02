import { requireAuth } from "@clerk/express";
import { sendUnauthorized } from "../utils/apiResponse.js";

// Protects any route — Clerk verifies the JWT and attaches auth() to req
export const protect = requireAuth();

// Fallback manual check if Clerk middleware wasn't run
export const ensureAuth = (req, res, next) => {
  const auth = req.auth?.();
  if (!auth?.userId) return sendUnauthorized(res, "Authentication required");
  next();
};
