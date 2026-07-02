import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { register, getMe } from "./auth.controller.js";

const router = Router();

router.post("/register", protect, register);
router.get("/me", protect, getMe);

export default router;
