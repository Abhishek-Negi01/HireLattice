import prisma from "../../config/prisma.js";

export const createResume = (data) => prisma.resume.create({ data });

export const findByHash = (fileHash) =>
  prisma.resume.findUnique({ where: { fileHash } });

export const findById = (id) => prisma.resume.findUnique({ where: { id } });

export const findAllByCandidateId = (candidateId) =>
  prisma.resume.findMany({
    where: { candidateId },
    orderBy: { createdAt: "desc" },
  });

export const findActiveByCandidateId = (candidateId) =>
  prisma.resume.findFirst({
    where: { candidateId, isActive: true },
    orderBy: { createdAt: "desc" },
  });

export const updateStatus = (id, status, extra = {}) =>
  prisma.resume.update({ where: { id }, data: { status, ...extra } });

export const deactivatePrevious = (candidateId, excludeId) =>
  prisma.resume.updateMany({
    where: { candidateId, id: { not: excludeId }, isActive: true },
    data: { isActive: false },
  });

export const softDelete = (id) =>
  prisma.resume.update({
    where: { id },
    data: { isActive: false, status: "FAILED" },
  });
