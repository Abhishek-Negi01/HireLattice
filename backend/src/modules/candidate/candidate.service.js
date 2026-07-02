import * as repo from "./candidate.repository.js";
import CandidateAiProfile from "./candidateAiProfile.model.js";

export const getCandidateProfile = async (candidateId) => {
  const candidate = await repo.findById(candidateId);
  if (!candidate) return null;

  const aiProfile = await CandidateAiProfile.findOne({ candidateId }).lean();
  return { ...candidate, aiProfile };
};

export const updateCandidateProfile = async (candidateId, data) => {
  return repo.updateById(candidateId, data);
};
