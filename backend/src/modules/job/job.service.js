import * as repo from "./job.repository.js";
import JobAiProfile from "./jobAiProfile.model.js";
import { parseJobDescription } from "../../services/ai/jdParser.js";
import { embedJob } from "../../services/embeddings/jobEmbedding.js";
import logger from "../../utils/logger.js";

export const createAndProcessJob = async (data) => {
  // 1. Save to Postgres
  const job = await repo.createJob({ ...data, status: "ACTIVE" });

  // 2. AI parse JD
  let parsed, parsingModel;
  try {
    ({ parsed, model: parsingModel } = await parseJobDescription(
      data.description,
    ));
    await repo.updateById(job.id, { parsedAt: new Date() });
  } catch (err) {
    logger.error(`JD parsing failed for job ${job.id}: ${err.message}`);
    return {
      job,
      aiProfile: null,
      warning: "JD parsing failed — job saved without AI profile",
    };
  }

  // 3. Save AI profile to MongoDB
  const aiProfile = await JobAiProfile.findOneAndUpdate(
    { jobId: job.id },
    { ...parsed, jobId: job.id, parsingModel },
    { upsert: true, new: true },
  );

  // 4. Embed
  try {
    const { pointId } = await embedJob(job.id, parsed);
    await repo.updateById(job.id, {
      indexedAt: new Date(),
      embeddingPointId: pointId,
    });
    await JobAiProfile.updateOne(
      { jobId: job.id },
      { embeddingPointId: pointId },
    );
  } catch (err) {
    logger.error(`Job embedding failed for ${job.id}: ${err.message}`);
  }

  return { job, aiProfile };
};

export const getJobWithProfile = async (jobId) => {
  const job = await repo.findById(jobId);
  if (!job) return null;
  const aiProfile = await JobAiProfile.findOne({ jobId }).lean();
  return { job, aiProfile };
};

export const listJobs = async (query = {}) => {
  const page = parseInt(query.page || 1);
  const limit = parseInt(query.limit || 20);
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    repo.findAll({ skip, take: limit }),
    repo.countAll(),
  ]);

  return { jobs, total, page, pages: Math.ceil(total / limit) };
};

export const updateJob = async (jobId, data) => {
  const job = await repo.updateById(jobId, data);

  // Re-parse and re-embed if description changed
  if (data.description) {
    try {
      const { parsed, model } = await parseJobDescription(data.description);
      await JobAiProfile.findOneAndUpdate(
        { jobId },
        { ...parsed, parsingModel: model },
        { upsert: true },
      );
      const { pointId } = await embedJob(jobId, parsed);
      await repo.updateById(jobId, {
        embeddingPointId: pointId,
        indexedAt: new Date(),
      });
    } catch (err) {
      logger.error(`Re-indexing failed for job ${jobId}: ${err.message}`);
    }
  }

  return job;
};
