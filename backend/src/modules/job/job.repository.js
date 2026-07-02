import prisma from "../../config/prisma.js";

export const createJob = (data) => prisma.job.create({ data });

export const findById = (id) => prisma.job.findUnique({ where: { id } });

export const findAll = ({ status = "ACTIVE", skip = 0, take = 20 } = {}) =>
  prisma.job.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

export const countAll = (status = "ACTIVE") =>
  prisma.job.count({ where: { status } });

export const updateById = (id, data) =>
  prisma.job.update({ where: { id }, data });

export const deleteById = (id) =>
  prisma.job.update({ where: { id }, data: { status: "ARCHIVED" } });
