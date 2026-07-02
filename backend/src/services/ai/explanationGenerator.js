import { runLLM } from "./llmProvider.js";
import { buildExplanationPrompt } from "../../prompts/explanation.prompt.js";

export const generateExplanation = async (candidate, job, scores) => {
  const prompt = buildExplanationPrompt(candidate, job, scores);
  const { data } = await runLLM(prompt);
  return data;
};
