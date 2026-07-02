import prisma from "../../config/prisma.js";
import crypto from "crypto";
import cloudinary from "../../config/cloudinary.js";
import { preprocessResume } from "../../services/preprocessing/preprocessPipeline.js";
import { parseResume } from "../../services/ai/resumeParser.js";
import { embedCandidate } from "../../services/embeddings/candidateEmbedding.js";
import CandidateAiProfile from "../candidate/candidateAiProfile.model.js";
import * as repo from "./resume.repository.js";
import { hashText } from "../../utils/hashResume.js";
import RESUME_STATUS from "../../constants/resumeStatus.js";
import logger from "../../utils/logger.js";

/**
 * Full pipeline: upload → preprocess → parse → embed → store
 */
export const processAndStoreResume = async ({
  file,
  candidateId,
  candidateEmail,
}) => {
  // 1. Preprocess (extract text, clean, duplicate check)
  const pre = await preprocessResume(file, candidateEmail);
  if (!pre.success) {
    return {
      success: false,
      reason: pre.reason,
      isDuplicate: pre.isDuplicate || false,
    };
  }

  // 2. AI parse first to extract candidate details (especially for bulk recruiter uploads)
  let parsed, parsingModel;
  try {
    ({ parsed, model: parsingModel } = await parseResume(pre.text));
  } catch (err) {
    logger.error(`AI parsing failed during ingestion: ${err.message}`);
    return { success: false, reason: "AI parsing failed during ingestion" };
  }

  // 3. Resolve or create Candidate in Postgres
  let activeCandidateId = candidateId;
  let activeEmail = candidateEmail || parsed.email;

  if (!activeCandidateId) {
    let candidateRecord = null;
    if (activeEmail) {
      candidateRecord = await prisma.candidate.findUnique({
        where: { email: activeEmail },
      });
    }

    if (!candidateRecord) {
      // Create a new Candidate record dynamically
      const candidateName = (parsed.name || "Imported Candidate").trim();
      const parts = candidateName.split(/\s+/);
      const firstName = parts[0] || "Candidate";
      const lastName = parts.slice(1).join(" ") || "Imported";

      candidateRecord = await prisma.candidate.create({
        data: {
          clerkId: `imported_${activeEmail || crypto.randomUUID()}`,
          email: activeEmail || `imported_${crypto.randomUUID()}@hirelattice.local`,
          firstName,
          lastName,
          phone: parsed.phone,
          location: parsed.location,
          linkedinUrl: parsed.linkedinUrl,
        },
      });
    }

    activeCandidateId = candidateRecord.id;
    activeEmail = candidateRecord.email;
  }

  // 4. Upload original file to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hirelattice/resumes",
        resource_type: "raw",
        public_id: `${activeCandidateId}_${Date.now()}`,
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(file.buffer);
  });

  // 5. Save resume record in Postgres
  const resume = await repo.createResume({
    candidateId: activeCandidateId,
    fileUrl: uploadResult.secure_url,
    fileType: file.mimetype.includes("pdf") ? "pdf" : "docx",
    fileHash: pre.fileHash,
    originalFileName: file.originalname,
    status: RESUME_STATUS.PARSED,
    parsedAt: new Date(),
  });

  // Deactivate previous active resume for this candidate
  await repo.deactivatePrevious(activeCandidateId, resume.id);

  // 6. Save AI profile to MongoDB
  const rawTextHash = hashText(pre.text);
  await CandidateAiProfile.findOneAndUpdate(
    { candidateId: activeCandidateId, resumeId: resume.id },
    { ...parsed, candidateId: activeCandidateId, resumeId: resume.id, parsingModel, rawTextHash },
    { upsert: true, new: true },
  );

  // 7. Generate + store embedding
  try {
    const { pointId } = await embedCandidate(activeCandidateId, parsed);
    await repo.updateStatus(resume.id, RESUME_STATUS.INDEXED, {
      indexedAt: new Date(),
      embeddingPointId: pointId,
    });
    await CandidateAiProfile.updateOne(
      { candidateId: activeCandidateId, resumeId: resume.id },
      { embeddingPointId: pointId },
    );
  } catch (err) {
    logger.error(`Embedding failed for ${resume.id}: ${err.message}`);
    // Non-fatal — resume is still parsed and usable
  }

  return { success: true, resumeId: resume.id, candidateId: activeCandidateId, parsed };
};
