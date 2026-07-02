import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import ROLES from "../../constants/roles.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../../validations/job.validation.js";
import {
  createJob,
  getAllJobs,
  getJob,
  patchJob,
  archiveJob,
} from "./job.controller.js";

const router = Router();

router.get("/", protect, getAllJobs);
router.get("/:id", protect, getJob);

// Recruiter only
router.post(
  "/",
  protect,
  requireRole(ROLES.RECRUITER),
  validate(createJobSchema),
  createJob,
);
router.patch(
  "/:id",
  protect,
  requireRole(ROLES.RECRUITER),
  validate(updateJobSchema),
  patchJob,
);
router.delete("/:id", protect, requireRole(ROLES.RECRUITER), archiveJob);

export default router;
