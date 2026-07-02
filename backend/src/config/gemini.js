import { GoogleGenAI } from "@google/genai";

let _client = null;

export const getGemini = () => {
  if (!_client)
    _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return _client;
};
