import { getGemini } from "../../config/gemini.js";
import PROMPT_CONFIG from "../../constants/prompts.js";
import { upsertCandidateVector } from "./vectorStore.js";
import logger from "../../utils/logger.js";

// Build a compact, signal-dense text for embedding — minimises tokens
const buildEmbedText = (profile) => {
  const parts = [
    profile.summary || "",
    (profile.topSkills || []).join(" "),
    (profile.skills || []).slice(0, 20).join(" "),
    (profile.experience || [])
      .slice(0, 3)
      .map(
        (e) =>
          `${e.title || ""} ${e.company || ""} ${(e.description || "").slice(0, 150)}`,
      )
      .join(" "),
    (profile.certifications || []).join(" "),
  ];
  return parts.join(" ").replace(/\s+/g, " ").trim().slice(0, 2500);
};

export const embedCandidate = async (candidateId, profile) => {
  const text = buildEmbedText(profile);
  logger.info(`Embedding candidate ${candidateId} (${text.length} chars)`);

  const ai = getGemini();
  const response = await ai.models.embedContent({
    model: PROMPT_CONFIG.EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });
  const vector = response.embeddings?.[0]?.values || response.embedding?.values;

  const pointId = await upsertCandidateVector(candidateId, vector, {
    experienceYears: profile.totalExperienceYears || 0,
    skills: profile.topSkills || [],
    location: profile.location || "",
    seniorityLevel: profile.seniorityLevel || "",
  });

  return { vector, pointId };
};
