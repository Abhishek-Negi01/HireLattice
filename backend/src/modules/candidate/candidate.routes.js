import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import ROLES from "../../constants/roles.js";
import {
  getMyProfile,
  updateMyProfile,
  getCandidateById,
} from "./candidate.controller.js";

const router = Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);
router.get("/:id", protect, requireRole(ROLES.RECRUITER), getCandidateById);

export default router;
