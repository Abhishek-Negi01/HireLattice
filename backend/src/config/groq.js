import Groq from "groq-sdk";

let _client = null;

export const getGroq = () => {
  if (!_client) _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _client;
};
