import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import ROLES from "../../constants/roles.js";
import { runRanking, getRanking, explainScore } from "./ranking.controller.js";

const router = Router();

router.post("/generate", protect, requireRole(ROLES.RECRUITER), runRanking);
router.get("/:jobId", protect, requireRole(ROLES.RECRUITER), getRanking);
router.post("/explain", protect, requireRole(ROLES.RECRUITER), explainScore);

export default router;
