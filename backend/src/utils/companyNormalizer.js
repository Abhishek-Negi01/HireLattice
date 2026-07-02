// Strips common legal suffixes and normalises casing
const SUFFIXES =
  /\s+(pvt\.?|ltd\.?|llc\.?|inc\.?|corp\.?|private limited|limited|llp)\b/gi;

export const normalizeCompany = (name = "") =>
  name.replace(SUFFIXES, "").replace(/\s+/g, " ").trim();
