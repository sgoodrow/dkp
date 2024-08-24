import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import {
  AgSortModel,
  agSortModelToPrismaOrderBy,
} from "@/api/shared/agGridUtils/sort";

// Since migrations are incremental and apply directly to our database, we only allow one attempt.
// If it fails or needs to be rolled back, we delete it along with all of the partially applied data.
const id = 1;

export const migrateRepository = (p: PrismaTransactionClient = prisma) => ({
  deleteAllCharacters: async () => {
    await p.$executeRaw`TRUNCATE TABLE "MigrateInvalidCharacter", "MigrateCharacter" RESTART IDENTITY CASCADE;`;
  },

  createManyUsers: async ({
    users,
  }: {
    users: { userId: string; remoteUserId: number }[];
  }) => {
    await p.migrateUser.createMany({
      data: users,
    });
  },

  createManyCharacters: async ({
    characters,
  }: {
    characters: { characterId: number; remoteCharacterId: number }[];
  }) => {
    await p.migrateCharacter.createMany({
      data: characters,
    });
  },

  createManyRaidActivityTypes: async ({
    raidActivityTypes,
  }: {
    raidActivityTypes: {
      raidActivityTypeId: number;
      remoteRaidActivityTypeId: number;
    }[];
  }) => {
    await p.migrateRaidActivityType.createMany({
      data: raidActivityTypes,
    });
  },

  createManyInvalidCharacters: async ({
    invalidCharacters,
  }: {
    invalidCharacters: {
      name: string;
      remoteId: number;
      invalidName: boolean;
      missingOwner: boolean;
      duplicateNormalizedName: boolean;
    }[];
  }) => {
    await p.migrateInvalidCharacter.createMany({
      data: invalidCharacters,
    });
  },

  countInvalidCharacters: async ({
    filterModel,
  }: {
    filterModel?: AgFilterModel;
  }) => {
    return p.migrateInvalidCharacter.count({
      where: agFilterModelToPrismaWhere(filterModel),
    });
  },

  getOrCreate: async ({ userId }: { userId: string }) => {
    const attempt = await p.migrateAttempt.findUnique({
      where: {
        id,
      },
    });

    if (attempt) {
      return attempt;
    }

    return p.migrateAttempt.create({
      data: {
        id,
        createdById: userId,
      },
    });
  },

  getAllInvalidCharacters: async () => {
    return p.migrateInvalidCharacter.findMany();
  },

  getManyInvalidCharacters: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
  }: {
    startRow: number;
    endRow: number;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.migrateInvalidCharacter.findMany({
      skip: startRow,
      take: endRow - startRow,
      where: agFilterModelToPrismaWhere(filterModel),
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        id: "desc",
      },
    });
  },

  update: async ({
    lastMigratedRemoteUserId,
    lastMigratedRemoteCharacterId,
    lastMigratedRemoteRaidActivityId,
    lastMigratedRemoteRaidActivityTypeId,
  }: {
    lastMigratedRemoteUserId?: number;
    lastMigratedRemoteCharacterId?: number;
    lastMigratedRemoteRaidActivityId?: number;
    lastMigratedRemoteRaidActivityTypeId?: number;
  }) => {
    return p.migrateAttempt.update({
      where: {
        id,
      },
      data: {
        lastMigratedRemoteUserId,
        lastMigratedRemoteCharacterId,
        lastMigratedRemoteRaidActivityId,
        lastMigratedRemoteRaidActivityTypeId,
      },
    });
  },

  upsertRaidActivityTypeById: async ({
    raidActivityTypeId,
    remoteRaidActivityTypeId,
  }: {
    raidActivityTypeId: number;
    remoteRaidActivityTypeId: number;
  }) => {
    return p.migrateRaidActivityType.upsert({
      where: {
        raidActivityTypeId,
      },
      update: {
        remoteRaidActivityTypeId,
      },
      create: {
        raidActivityTypeId,
        remoteRaidActivityTypeId,
      },
    });
  },

  getManyUsersByRemoteUserIds: async ({
    remoteUserIds,
  }: {
    remoteUserIds: number[];
  }) => {
    return p.migrateUser.findMany({
      where: {
        remoteUserId: {
          in: remoteUserIds,
        },
      },
    });
  },

  getManyCharactersByRemoteCharacterIds: async ({
    remoteCharacterIds,
  }: {
    remoteCharacterIds: number[];
  }) => {
    return p.migrateCharacter.findMany({
      where: {
        remoteCharacterId: {
          in: remoteCharacterIds,
        },
      },
    });
  },

  getManyRaidActivityTypesByRemoteRaidActivityTypeIds: async ({
    remoteRaidActivityTypeIds,
  }: {
    remoteRaidActivityTypeIds: number[];
  }) => {
    return p.migrateRaidActivityType.findMany({
      where: {
        remoteRaidActivityTypeId: {
          in: remoteRaidActivityTypeIds,
        },
      },
    });
  },
});
