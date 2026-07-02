import prisma from "../../config/prisma.js";

export const findById = (id) =>
  prisma.candidate.findUnique({
    where: { id },
    include: { resumes: { where: { isActive: true } } },
  });

export const findByClerkId = (clerkId) =>
  prisma.candidate.findUnique({ where: { clerkId } });

export const updateById = (id, data) =>
  prisma.candidate.update({ where: { id }, data });
