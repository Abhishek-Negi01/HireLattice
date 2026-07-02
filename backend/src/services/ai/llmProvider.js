import { getGemini } from "../../config/gemini.js";
import { getGroq } from "../../config/groq.js";
import PROMPT_CONFIG from "../../constants/prompts.js";
import logger from "../../utils/logger.js";

const safeParseJSON = (raw) => {
  const clean = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI returned invalid JSON");
  }
};

const callGemini = async (prompt) => {
  const ai = getGemini();
  const response = await ai.models.generateContent({
    model: PROMPT_CONFIG.GEMINI_MODEL,
    contents: prompt,
  });
  return { data: safeParseJSON(response.text?.trim() || ""), model: "gemini" };
};

const callGroq = async (prompt) => {
  const groq = getGroq();
  const completion = await groq.chat.completions.create({
    model: PROMPT_CONFIG.GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a structured data extractor. Return valid JSON only. No markdown. No explanation.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    max_tokens: PROMPT_CONFIG.MAX_RESPONSE_TOKENS,
  });
  const text = completion.choices[0]?.message?.content?.trim() || "";
  return { data: safeParseJSON(text), model: "groq" };
};

// Primary: Gemini flash, Fallback: Groq llama3-8b
export const runLLM = async (prompt) => {
  try {
    logger.info("LLM: calling Gemini...");
    return await callGemini(prompt);
  } catch (err) {
    logger.warn(`Gemini failed (${err.message}) — falling back to Groq`);
    return await callGroq(prompt);
  }
};
