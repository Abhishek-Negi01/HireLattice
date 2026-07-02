import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import ROLES from "../../constants/roles.js";
import {
  uploadSingle,
  uploadBulk,
  uploadZip,
} from "../../middlewares/upload.middleware.js";
import {
  uploadResume,
  uploadSingleForCandidate,
  bulkUpload,
  zipUpload,
  getMyResume,
  getResumeById,
  deleteResume,
} from "./resume.controller.js";

const router = Router();

// Candidate
router.post("/upload", protect, uploadSingle, uploadResume);
router.get("/me", protect, getMyResume);

// Recruiter
router.post(
  "/upload-single",
  protect,
  requireRole(ROLES.RECRUITER),
  uploadSingle,
  uploadSingleForCandidate,
);
router.post(
  "/upload-bulk",
  protect,
  requireRole(ROLES.RECRUITER),
  uploadBulk,
  bulkUpload,
);
router.post(
  "/upload-zip",
  protect,
  requireRole(ROLES.RECRUITER),
  uploadZip,
  zipUpload,
);
router.get("/:id", protect, requireRole(ROLES.RECRUITER), getResumeById);

// Shared (owner or recruiter) — guard is in controller
router.delete("/:id", protect, deleteResume);

export default router;
