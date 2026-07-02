const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const isAllowedMime = (mimetype) => ALLOWED_MIME_TYPES.has(mimetype);

export const isWithinSizeLimit = (sizeBytes) =>
  sizeBytes <= MAX_FILE_SIZE_BYTES;

export const validateFile = (file) => {
  if (!isAllowedMime(file.mimetype)) {
    return {
      valid: false,
      reason: `Unsupported file type: ${file.mimetype}. Only PDF and DOCX are allowed.`,
    };
  }
  if (!isWithinSizeLimit(file.size)) {
    return {
      valid: false,
      reason: `File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB. Max 10 MB.`,
    };
  }
  if (!file.buffer || file.buffer.length === 0) {
    return { valid: false, reason: "File is empty." };
  }
  return { valid: true };
};
