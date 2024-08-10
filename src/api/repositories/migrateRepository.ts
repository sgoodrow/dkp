import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { InstallAttemptStatus } from "@prisma/client";

export type MigrateProgress = {
  importedUsers?: boolean;
  importedCharacters?: boolean;
  importedRaidActivityTypes?: boolean;
  importedRaidActivities?: boolean;
  syncedDiscordMetadata?: boolean;
};

export const migrateRepository = (p: PrismaTransactionClient = prisma) => ({
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

  create: async (
    data: {
      status: InstallAttemptStatus;
      error?: string;
      createdById: string;
    } & MigrateProgress,
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
    } & MigrateProgress,
  ) => {
    return p.installAttempt.update({
      where: {
        id: data.id,
      },
      data,
    });
  },
});
