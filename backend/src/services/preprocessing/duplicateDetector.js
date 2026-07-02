import prisma from "../../config/prisma.js";
import { hashBuffer } from "../../utils/hashResume.js";

/**
 * Returns { isDuplicate, reason, existingResumeId? }
 * Checks: (1) file hash, (2) candidate email
 */
export const detectDuplicate = async (buffer, candidateEmail) => {
  const fileHash = hashBuffer(buffer);

  // 1. Exact file hash match
  const existingResume = await prisma.resume.findUnique({
    where: { fileHash },
  });
  if (existingResume) {
    return {
      isDuplicate: true,
      reason: "Exact file already uploaded",
      existingResumeId: existingResume.id,
      fileHash,
    };
  }

  // 2. Candidate email already has an active resume
  if (candidateEmail) {
    const candidate = await prisma.candidate.findUnique({
      where: { email: candidateEmail },
      include: { resumes: { where: { isActive: true }, take: 1 } },
    });
    if (candidate?.resumes?.length > 0) {
      return {
        isDuplicate: false,
        isExistingCandidate: true,
        existingCandidateId: candidate.id,
        fileHash,
      };
    }
  }

  return { isDuplicate: false, fileHash };
};
