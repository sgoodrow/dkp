import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { InstallAttempt, InstallAttemptStatus } from "@prisma/client";

export const installRepository = (p: PrismaTransactionClient = prisma) => ({
  get: async ({ id }: { id: number }) => {
    return p.installAttempt.findUniqueOrThrow({
      where: {
        id,
      },
    });
  },

  getLatest: async () => {
    return p.installAttempt.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  create: async (data: {
    status: InstallAttemptStatus;
    createdById: string;
  }) => {
    return p.installAttempt.create({
      data,
    });
  },

  update: async (data: InstallAttempt) => {
    return p.installAttempt.update({
      where: {
        id: data.id,
      },
      data,
    });
  },
});
