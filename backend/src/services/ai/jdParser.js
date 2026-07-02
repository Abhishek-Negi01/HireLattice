import { runLLM } from "./llmProvider.js";
import { buildJdPrompt } from "../../prompts/jd.prompt.js";

export const parseJobDescription = async (jdText) => {
  const prompt = buildJdPrompt(jdText);
  const { data, model } = await runLLM(prompt);
  return { parsed: data, model };
};
