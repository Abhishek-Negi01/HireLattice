import AdmZip from "adm-zip";
import { processAndStoreResume } from "./resume.service.js";
import { findByClerkId } from "../candidate/candidate.repository.js";
import logger from "../../utils/logger.js";

const ALLOWED_EXTS = [".pdf", ".docx"];

/**
 * Handle bulk upload — array of files (multipart) OR single ZIP
 * Returns per-file results array
 */
export const processBulkFiles = async (files) => {
  const results = [];

  for (const file of files) {
    try {
      const result = await processAndStoreResume({
        file,
        candidateId: null, // recruiter upload — no candidateId yet
        candidateEmail: null,
      });
      results.push({ fileName: file.originalname, ...result });
    } catch (err) {
      logger.error(
        `Bulk: failed processing ${file.originalname}: ${err.message}`,
      );
      results.push({
        fileName: file.originalname,
        success: false,
        reason: err.message,
      });
    }
  }

  return results;
};

/**
 * Extract files from a ZIP buffer and process each
 */
export const processZipUpload = async (buffer) => {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries().filter((e) => {
    const name = e.entryName.toLowerCase();
    return !e.isDirectory && ALLOWED_EXTS.some((ext) => name.endsWith(ext));
  });

  if (!entries.length) {
    return {
      success: false,
      reason: "ZIP contains no valid PDF or DOCX files",
    };
  }

  const files = entries.map((entry) => ({
    originalname: entry.name,
    mimetype: entry.name.toLowerCase().endsWith(".pdf")
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    buffer: entry.getData(),
    size: entry.header.compressedSize,
  }));

  const results = await processBulkFiles(files);
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { success: true, total: entries.length, passed, failed, results };
};
