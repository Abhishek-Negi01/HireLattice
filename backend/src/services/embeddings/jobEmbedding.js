import { getGemini } from "../../config/gemini.js";
import PROMPT_CONFIG from "../../constants/prompts.js";
import { upsertJobVector } from "./vectorStore.js";
import logger from "../../utils/logger.js";

const buildEmbedText = (profile) => {
  const parts = [
    profile.summary || "",
    (profile.requiredSkills || []).join(" "),
    (profile.preferredSkills || []).join(" "),
    (profile.responsibilities || []).slice(0, 5).join(" "),
    (profile.keywords || []).join(" "),
  ];
  return parts.join(" ").replace(/\s+/g, " ").trim().slice(0, 1500);
};

export const embedJob = async (jobId, profile) => {
  const text = buildEmbedText(profile);
  logger.info(`Embedding job ${jobId} (${text.length} chars)`);

  const ai = getGemini();
  const response = await ai.models.embedContent({
    model: PROMPT_CONFIG.EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });
  const vector = response.embeddings?.[0]?.values || response.embedding?.values;

  const pointId = await upsertJobVector(jobId, vector, {
    requiredSkills: profile.requiredSkills || [],
    minExperienceYears: profile.minExperienceYears || 0,
  });

  return { vector, pointId };
};
