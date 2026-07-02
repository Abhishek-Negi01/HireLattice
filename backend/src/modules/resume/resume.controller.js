import asyncHandler from "../../utils/asyncHandler.js";
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendNotFound,
  sendConflict,
  sendForbidden,
} from "../../utils/apiResponse.js";
import { processAndStoreResume } from "./resume.service.js";
import { processBulkFiles, processZipUpload } from "./bulkUpload.service.js";
import {
  findById,
  findActiveByCandidateId,
  findAllByCandidateId,
  softDelete,
} from "./resume.repository.js";
import {
  findByClerkId,
  findById as findCandidateById,
} from "../candidate/candidate.repository.js";
import CandidateAiProfile from "../candidate/candidateAiProfile.model.js";
import { deleteCandidateVector } from "../../services/embeddings/vectorStore.js";
import logger from "../../utils/logger.js";

import prisma from "../../config/prisma.js";
import * as repo from "./resume.repository.js";
import RESUME_STATUS from "../../constants/resumeStatus.js";

// POST /api/resumes/upload  — candidate uploads own resume
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return sendBadRequest(res, "No file uploaded");

  const { userId } = req.auth();
  const candidate = await findByClerkId(userId);
  if (!candidate)
    return sendNotFound(res, "Candidate not found — register first");

  const result = await processAndStoreResume({
    file: req.file,
    candidateId: candidate.id,
    candidateEmail: candidate.email,
  });

  if (!result.success) {
    return result.isDuplicate
      ? sendConflict(res, result.reason)
      : sendBadRequest(res, result.reason);
  }

  return sendCreated(
    res,
    { resumeId: result.resumeId },
    "Resume uploaded and processed",
  );
});

// POST /api/resumes/upload-single  — recruiter uploads for a specific candidate
export const uploadSingleForCandidate = asyncHandler(async (req, res) => {
  if (!req.file) return sendBadRequest(res, "No file uploaded");
  const { candidateId } = req.body;
  if (!candidateId) return sendBadRequest(res, "candidateId is required");

  // Validate candidate existence in Postgres before running the processor
  const candidate = await findCandidateById(candidateId);
  if (!candidate) {
    return sendNotFound(
      res,
      `Candidate with ID ${candidateId} does not exist in the database`,
    );
  }

  const result = await processAndStoreResume({
    file: req.file,
    candidateId,
    candidateEmail: candidate.email,
  });

  if (!result.success) {
    return result.isDuplicate
      ? sendConflict(res, result.reason)
      : sendBadRequest(res, result.reason);
  }

  return sendCreated(
    res,
    { resumeId: result.resumeId },
    "Resume uploaded and processed",
  );
});

// POST /api/resumes/upload-bulk  — recruiter bulk upload
export const bulkUpload = asyncHandler(async (req, res) => {
  if (!req.files?.length) return sendBadRequest(res, "No files uploaded");

  const results = await processBulkFiles(req.files);
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return sendCreated(
    res,
    { total: req.files.length, passed, failed, results },
    "Bulk upload complete",
  );
});

// POST /api/resumes/upload-zip  — recruiter ZIP upload
export const zipUpload = asyncHandler(async (req, res) => {
  if (!req.file) return sendBadRequest(res, "No ZIP file uploaded");

  const result = await processZipUpload(req.file.buffer);
  if (!result.success) return sendBadRequest(res, result.reason);

  return sendCreated(res, result, "ZIP processed");
});

// GET /api/resumes/me  — candidate views their active resume
export const getMyResume = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const candidate = await findByClerkId(userId);
  if (!candidate) return sendNotFound(res, "Candidate not found");

  const resume = await findActiveByCandidateId(candidate.id);
  if (!resume) return sendNotFound(res, "No active resume found");

  const aiProfile = await CandidateAiProfile.findOne({
    resumeId: resume.id,
  }).lean();
  return sendSuccess(res, { resume, aiProfile });
});

// GET /api/resumes/:id  — recruiter views any resume
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await findById(req.params.id);
  if (!resume) return sendNotFound(res, "Resume not found");

  const aiProfile = await CandidateAiProfile.findOne({
    resumeId: resume.id,
  }).lean();
  return sendSuccess(res, { resume, aiProfile });
});

// DELETE /api/resumes/:id  — candidate deletes own resume / recruiter deletes any
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await findById(req.params.id);
  if (!resume) return sendNotFound(res, "Resume not found");

  const { userId } = req.auth();
  const candidate = await findByClerkId(userId);
  const isOwner = candidate && candidate.id === resume.candidateId;
  const role =
    req.auth()?.sessionClaims?.metadata?.role ||
    req.auth()?.sessionClaims?.public_metadata?.role;

  if (!isOwner && role !== "recruiter")
    return sendForbidden(res, "Not authorised to delete this resume");

  // Remove vector from Qdrant if indexed
  if (resume.embeddingPointId) {
    try {
      await deleteCandidateVector(resume.embeddingPointId);
    } catch (err) {
      logger.warn(
        `Qdrant vector delete failed for ${resume.id}: ${err.message}`,
      );
    }
  }

  // Remove AI profile from MongoDB
  await CandidateAiProfile.deleteOne({ resumeId: resume.id });

  // Soft delete in Postgres
  await softDelete(resume.id);

  return sendSuccess(res, null, "Resume deleted");
});

import { parseDatasetBuffer } from "../../services/preprocessing/datasetParser.js";
import { embedCandidate } from "../../services/embeddings/candidateEmbedding.js";
import crypto from "crypto";

// POST /api/resumes/upload-dataset — recruiter uploads CSV dataset
export const datasetUpload = asyncHandler(async (req, res) => {
  if (!req.file) return sendBadRequest(res, "No CSV file uploaded");

  let rows;
  try {
    rows = parseDatasetBuffer(req.file.buffer);
  } catch (err) {
    return sendBadRequest(res, `CSV parsing failed: ${err.message}`);
  }

  const results = [];

  for (const row of rows) {
    try {
      // Resolve or create candidate
      let candidate = row.email
        ? await prisma.candidate.findUnique({ where: { email: row.email } })
        : null;

      if (!candidate) {
        const parts = (row.name || "Unknown").split(/\s+/);
        candidate = await prisma.candidate.create({
          data: {
            clerkId: `dataset_${row.email || crypto.randomUUID()}`,
            email:
              row.email || `dataset_${crypto.randomUUID()}@hirelattice.local`,
            firstName: parts[0] || "Unknown",
            lastName: parts.slice(1).join(" ") || "Imported",
          },
        });
      }

      // Save resume record (no file URL — dataset row)
      const resume = await repo.createResume({
        candidateId: candidate.id,
        fileUrl: "",
        fileType: "csv",
        fileHash: row.rawTextHash,
        originalFileName: req.file.originalname,
        status: RESUME_STATUS.PARSED,
        parsedAt: new Date(),
      });

      await repo.deactivatePrevious(candidate.id, resume.id);

      // Save AI profile to MongoDB
      await CandidateAiProfile.findOneAndUpdate(
        { candidateId: candidate.id, resumeId: resume.id },
        {
          ...row.profile,
          candidateId: candidate.id,
          resumeId: resume.id,
          parsingModel: "dataset",
          rawTextHash: row.rawTextHash,
        },
        { upsert: true, returnDocument: "after" },
      );

      // Embed
      try {
        const { pointId } = await embedCandidate(candidate.id, row.profile);
        await repo.updateStatus(resume.id, RESUME_STATUS.INDEXED, {
          indexedAt: new Date(),
          embeddingPointId: pointId,
        });
        await CandidateAiProfile.updateOne(
          { candidateId: candidate.id, resumeId: resume.id },
          { embeddingPointId: pointId },
        );
      } catch (err) {
        logger.warn(
          `Embedding failed for dataset row ${row.email}: ${err.message}`,
        );
      }

      results.push({
        name: row.name,
        email: row.email,
        success: true,
        candidateId: candidate.id,
      });
    } catch (err) {
      logger.error(`Dataset row failed for ${row.email}: ${err.message}`);
      results.push({
        name: row.name,
        email: row.email,
        success: false,
        reason: err.message,
      });
    }
  }

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return sendCreated(
    res,
    { total: rows.length, passed, failed, results },
    "Dataset uploaded",
  );
});
