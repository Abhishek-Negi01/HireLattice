import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Papa = require("papaparse");

const REQUIRED_COLUMNS = ["Name", "Email", "Resume_Text"];

export const extractCsv = (buffer) => {
  const csv = buffer.toString("utf-8");
  const { data, errors } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length) throw new Error(`CSV parse error: ${errors[0].message}`);

  const headers = Object.keys(data[0] || {});
  const missing = REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
  if (missing.length)
    throw new Error(`CSV missing required columns: ${missing.join(", ")}`);

  return data.map((row) => ({
    name: row.Name?.trim() || "Unknown",
    email: row.Email?.trim() || null,
    phone: row.Phone?.trim() || null,
    university: row.University?.trim() || null,
    graduationYear: row.Graduation_Year?.trim() || null,
    yearsExperience: parseFloat(row.Years_Experience) || 0,
    jobRole: row.Job_Role?.trim() || null,
    skills: row.Skills
      ? row.Skills.split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    resumeText: row.Resume_Text?.trim() || "",
  }));
};
