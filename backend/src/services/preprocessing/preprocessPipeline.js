import { extractPdf } from "./pdfExtractor.js";
import { extractDocx } from "./docxExtractor.js";
import { cleanResumeText } from "./cleanResume.js";
import { detectDuplicate } from "./duplicateDetector.js";
import { validateFile } from "../../utils/fileValidator.js";
import logger from "../../utils/logger.js";

/**
 * Full preprocessing pipeline for a single resume file.
 *
 * Returns:
 * {
 *   success: boolean,
 *   text: string,          // cleaned extracted text
 *   fileHash: string,
 *   isDuplicate: boolean,
 *   reason?: string,       // if isDuplicate or error
 *   isLikelyScanned?: boolean,
 * }
 */
export const preprocessResume = async (file, candidateEmail = null) => {
  // 1. Validate
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, reason: validation.reason };
  }

  // 2. Extract text
  let extracted;
  try {
    if (file.mimetype === "application/pdf") {
      extracted = await extractPdf(file.buffer);
    } else {
      extracted = await extractDocx(file.buffer);
    }
  } catch (err) {
    logger.error(`Text extraction failed: ${err.message}`);
    return { success: false, reason: `Text extraction failed: ${err.message}` };
  }

  if (!extracted.text || extracted.text.length < 50) {
    return {
      success: false,
      reason: "Could not extract readable text. File may be scanned or empty.",
    };
  }

  // 3. Clean
  const cleanedText = cleanResumeText(extracted.text);

  // 4. Duplicate check
  const dupResult = await detectDuplicate(file.buffer, candidateEmail);
  if (dupResult.isDuplicate) {
    return {
      success: false,
      isDuplicate: true,
      reason: dupResult.reason,
      fileHash: dupResult.fileHash,
    };
  }

  return {
    success: true,
    text: cleanedText,
    fileHash: dupResult.fileHash,
    isLikelyScanned: extracted.isLikelyScanned || false,
    isExistingCandidate: dupResult.isExistingCandidate || false,
    existingCandidateId: dupResult.existingCandidateId || null,
  };
};
