import prisma from "../../config/prisma.js";

// Called after Clerk webhook or first login — syncs Clerk user to our DB
export const syncCandidate = async ({
  clerkId,
  email,
  firstName,
  lastName,
  phone,
}) => {
  return prisma.candidate.upsert({
    where: { clerkId },
    update: { email, firstName, lastName, phone },
    create: { clerkId, email, firstName, lastName, phone },
  });
};

export const getCandidateByClerkId = async (clerkId) => {
  return prisma.candidate.findUnique({ where: { clerkId } });
};
