import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import ROLES from "../../constants/roles.js";
import { search, semanticSearch } from "./search.controller.js";

const router = Router();

router.post("/", protect, requireRole(ROLES.RECRUITER), search);
router.post("/semantic", protect, requireRole(ROLES.RECRUITER), semanticSearch);

export default router;
