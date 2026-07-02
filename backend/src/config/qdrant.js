import { QdrantClient } from "@qdrant/js-client-rest";
import logger from "../utils/logger.js";

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export const VECTOR_SIZE = 768;

export const COLLECTIONS = {
  CANDIDATES: "candidate_embeddings",
  JOBS: "job_embeddings",
};

export const initQdrant = async () => {
  const { collections } = await qdrant.getCollections();
  const existing = new Set(collections.map((c) => c.name));

  for (const name of Object.values(COLLECTIONS)) {
    if (!existing.has(name)) {
      await qdrant.createCollection(name, {
        vectors: { size: VECTOR_SIZE, distance: "Cosine" },
      });
      logger.info(`Qdrant: created collection '${name}'`);
    }
  }

  // Ensure filtering payload indexes exist on CANDIDATES collection
  try {
    await qdrant.createPayloadIndex(COLLECTIONS.CANDIDATES, {
      field_name: "location",
      field_schema: "keyword",
    });
    await qdrant.createPayloadIndex(COLLECTIONS.CANDIDATES, {
      field_name: "skills",
      field_schema: "keyword",
    });
    await qdrant.createPayloadIndex(COLLECTIONS.CANDIDATES, {
      field_name: "experienceYears",
      field_schema: "integer",
    });
  } catch (err) {
    logger.debug(`Qdrant payload index initialization: ${err.message}`);
  }

  logger.info("Qdrant ready");
};
