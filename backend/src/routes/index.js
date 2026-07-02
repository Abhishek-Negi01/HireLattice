import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import candidateRoutes from "../modules/candidate/candidate.routes.js";
import resumeRoutes from "../modules/resume/resume.routes.js";
import jobRoutes from "../modules/job/job.routes.js";
import searchRoutes from "../modules/search/search.routes.js";
import rankingRoutes from "../modules/ranking/ranking.routes.js";
import { getGemini } from "../config/gemini.js";
import { getGroq } from "../config/groq.js";
import { qdrant } from "../config/qdrant.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/candidates", candidateRoutes);
router.use("/resumes", resumeRoutes);
router.use("/jobs", jobRoutes);
router.use("/search", searchRoutes);
router.use("/ranking", rankingRoutes);

// GET /api/ai/status  — verify all AI services are reachable
router.get(
  "/ai/status",
  asyncHandler(async (req, res) => {
    const status = { gemini: false, groq: false, qdrant: false };
    const errors = {};

    try {
      const ai = getGemini();
      await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: "ping",
      });
      status.gemini = true;
    } catch (e) {
      errors.gemini = e.message;
    }

    try {
      const groq = getGroq();
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      });
      status.groq = true;
    } catch (e) {
      errors.groq = e.message;
    }

    try {
      await qdrant.getCollections();
      status.qdrant = true;
    } catch (e) {
      errors.qdrant = e.message;
    }

    const allOk = Object.values(status).every(Boolean);
    res.status(allOk ? 200 : 207).json({ success: allOk, status, errors });
  }),
);

export default router;
