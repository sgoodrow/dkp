import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { InstallAttemptStatus } from "@prisma/client";

export type CreateInstallAttempt = {
  status: InstallAttemptStatus;
  createdById: string;
  error?: string;
  installedRaces?: boolean;
  installedClasses?: boolean;
  installedRaceClassCombinations?: boolean;
  installedItems?: boolean;
  installedGuild?: boolean;
  syncedDiscordMetadata?: boolean;
};

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

  create: async (data: CreateInstallAttempt) => {
    return p.installAttempt.create({
      data,
    });
  },

  complete: async ({ id }: { id: number }) => {
    return p.installAttempt.update({
      where: {
        id,
      },
      data: {
        status: InstallAttemptStatus.COMPLETE,
      },
    });
  },
});
