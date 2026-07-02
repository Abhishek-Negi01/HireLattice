const PROMPT_CONFIG = {
  MAX_RESUME_CHARS: 8000, // ~2000 tokens
  MAX_JD_CHARS: 3000, // ~750 tokens
  GEMINI_MODEL: "gemini-2.0-flash-lite",
  GROQ_MODEL: "llama-3.3-70b-versatile",
  EMBEDDING_MODEL: "gemini-embedding-001",
  MAX_RESPONSE_TOKENS: 1500,
};

export default PROMPT_CONFIG;
