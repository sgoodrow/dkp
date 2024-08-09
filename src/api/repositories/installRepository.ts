import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { InstallAttemptStatus } from "@prisma/client";

export type InstallProgress = {
  installedRaces?: boolean;
  installedClasses?: boolean;
  installedItems?: boolean;
  installedGuild?: boolean;
  syncedDiscordMetadata?: boolean;
  importedCharacters?: boolean;
  importedRaidActivityTypes?: boolean;
  importedRaidActivities?: boolean;
};

export const installRepository = (p: PrismaTransactionClient = prisma) => ({
  getLatest: async () => {
    return p.installAttempt.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  create: async (
    data: {
      status: InstallAttemptStatus;
      error?: string;
      createdById: string;
    } & InstallProgress,
  ) => {
    return p.installAttempt.create({
      data,
    });
  },

  update: async (
    data: {
      id: number;
      status: InstallAttemptStatus;
      error?: string;
      createdById: string;
    } & InstallProgress,
  ) => {
    return p.installAttempt.update({
      where: {
        id: data.id,
      },
      data,
    });
  },
});
