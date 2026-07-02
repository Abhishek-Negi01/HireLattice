import crypto from "crypto";

// SHA-256 hash of file buffer — used for exact duplicate detection
export const hashBuffer = (buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");

// Hash of normalised text — used for near-duplicate detection
export const hashText = (text) =>
  crypto.createHash("sha256").update(text.toLowerCase().trim()).digest("hex");
