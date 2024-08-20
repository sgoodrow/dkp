import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { MakeFieldNonNullable } from "@/ui/shared/utils/nonNullable";
import { MigrateAttemptStatus, MigrateEqdkpUser } from "@prisma/client";

export type CreateMigrateAttempt = {
  status: MigrateAttemptStatus;
  createdById: string;
  error?: string;
  importedUsers?: boolean;
  importedCharacters?: boolean;
  importedRaidActivityTypes?: boolean;
  importedRaidActivities?: boolean;
};

export const migrateRepository = (p: PrismaTransactionClient = prisma) => ({
  createUsers: async ({
    users,
  }: {
    users: { eqdkpUserId: number; currentDkp: number; name: string }[];
  }) => {
    await p.migrateEqdkpUser.createMany({
      data: users,
    });
    return p.migrateEqdkpUser.findMany({
      where: {
        eqdkpUserId: {
          in: users.map(({ eqdkpUserId }) => eqdkpUserId),
        },
      },
    });
  },

  getUsersMap: async ({ eqdkpUserIds }: { eqdkpUserIds: number[] }) => {
    return p.migrateEqdkpUser.findMany({
      where: {
        eqdkpUserId: {
          in: eqdkpUserIds,
        },
      },
    });
  },

  getManyUsersWithEmails: async ({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }) => {
    const users = await p.migrateEqdkpUser.findMany({
      where: {
        email: { not: null },
      },
      orderBy: {
        id: "asc",
      },
      take,
      skip,
    });
    // Ensure type safety
    return users.flatMap((u) =>
      u.email !== null ? [{ ...u, email: u.email }] : [],
    );
  },

  getUsersCount: async () => {
    return p.migrateEqdkpUser.count();
  },

  getUsersCountWithEmails: async () => {
    return p.migrateEqdkpUser.count({ where: { email: { not: null } } });
  },

  getManyUsersWithoutEmails: async ({ take }: { take: number }) => {
    return p.migrateEqdkpUser.findMany({
      where: {
        email: null,
      },
      orderBy: {
        id: "asc",
      },
      take,
    });
  },

  prepareUsers: async ({
    users,
  }: {
    users: {
      id: number;
      currentDkp: number;
      eqdkpUserId: number;
      email: string;
      name: string;
    }[];
  }) => {
    return prisma.$transaction(async (p) => {
      await p.migrateEqdkpUser.deleteMany({
        where: {
          eqdkpUserId: {
            in: users.map((u) => u.eqdkpUserId),
          },
        },
      });
      await p.migrateEqdkpUser.createMany({
        data: users,
      });
    });
  },

  getLatest: async () => {
    return p.migrateAttempt.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  create: async (data: {
    status: MigrateAttemptStatus;
    createdById: string;
    error?: string;
  }) => {
    return p.migrateAttempt.create({
      data,
    });
  },
});
