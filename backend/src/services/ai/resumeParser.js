import { runLLM } from "./llmProvider.js";
import { buildResumePrompt } from "../../prompts/resume.prompt.js";
import { normalizeResumeProfile } from "../preprocessing/normalizeResume.js";

export const parseResume = async (rawText) => {
  const prompt = buildResumePrompt(rawText);
  const { data, model } = await runLLM(prompt);

  const normalized = normalizeResumeProfile(data);

  return { parsed: normalized, model };
};
