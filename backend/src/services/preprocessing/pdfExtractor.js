import pdfParse from "pdf-parse";
import logger from "../../utils/logger.js";

export const extractPdf = async (buffer) => {
  const result = await pdfParse(buffer);
  const text = result.text?.trim() || "";

  if (text.length < 50) {
    logger.warn("PDF extracted very little text — may be scanned/image-based");
    return { text, pageCount: result.numpages, isLikelyScanned: true };
  }

  return { text, pageCount: result.numpages, isLikelyScanned: false };
};
