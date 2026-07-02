import mammoth from "mammoth";
import logger from "../../utils/logger.js";

export const extractDocx = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });

  if (result.messages?.length) {
    logger.warn(
      "DOCX extraction warnings: " +
        result.messages.map((m) => m.message).join(", "),
    );
  }

  return { text: result.value?.trim() || "" };
};
