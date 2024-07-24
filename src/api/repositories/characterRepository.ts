import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import {
  AgSortModel,
  agSortModelToPrismaOrderBy,
} from "@/api/shared/agGridUtils/sort";

export const characterRepository = (p: PrismaTransactionClient = prisma) => ({
  createMany: async ({
    characters,
  }: {
    characters: {
      name: string;
      raceId: number;
      classId: number;
      defaultPilotId?: string;
    }[];
  }) => {
    return p.character.createMany({
      data: characters.map((c) => {
        return {
          name: c.name,
          raceId: c.raceId,
          classId: c.classId,
          defaultPilotId: c.defaultPilotId,
        };
      }),
    });
  },

  createClass: async ({
    name,
    colorHexLight,
    colorHexDark,
    allowedRaces,
  }: {
    name: string;
    colorHexLight: string;
    colorHexDark: string;
    allowedRaces: string[];
  }) => {
    return p.characterClass.create({
      data: {
        name,
        colorHexLight,
        colorHexDark,
        raceClassCombinations: {
          create: allowedRaces.map((raceName) => {
            return {
              race: {
                connect: {
                  name: raceName,
                },
              },
            };
          }),
        },
      },
    });
  },

  createRace: async ({ name }: { name: string }) => {
    return p.characterRace.create({
      data: {
        name,
      },
    });
  },

  isNameAvailable: async ({ name }: { name: string }) => {
    const numCharactersWithName = await p.character.count({
      where: {
        name,
      },
    });
    return numCharactersWithName === 0;
  },

  isAllowedRaceClassCombination: async ({
    raceId,
    classId,
  }: {
    raceId: number;
    classId: number;
  }) => {
    const combination = await p.raceClassCombination.findFirst({
      where: {
        raceId,
        classId,
      },
    });
    return combination !== null;
  },

  countByUserId: async ({
    userId,
    filterModel,
    sortModel,
  }: {
    userId: string;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.character.count({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        defaultPilotId: userId,
      },
      orderBy: agSortModelToPrismaOrderBy(sortModel),
    });
  },

  getManyByUserId: async ({
    userId,
    startRow,
    endRow,
    filterModel,
    sortModel,
  }: {
    userId: string;
    startRow: number;
    endRow: number;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.character.findMany({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        defaultPilotId: userId,
      },
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        createdAt: "desc",
      },
      include: {
        class: {
          select: {
            name: true,
            colorHexDark: true,
            colorHexLight: true,
          },
        },
        race: {
          select: {
            name: true,
          },
        },
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },

  getClasses: async ({ raceId }: { raceId?: number }) => {
    return p.characterClass.findMany({
      where: {
        raceClassCombinations: {
          some: {
            raceId,
          },
        },
      },
    });
  },

  getClassByName: async ({ name }: { name: string }) => {
    return p.characterClass.findUniqueOrThrow({
      where: {
        name,
      },
    });
  },

  getRaces: async ({ classId }: { classId?: number }) => {
    return p.characterRace.findMany({
      where: {
        raceClassCombinations: {
          some: {
            classId,
          },
        },
      },
    });
  },

  getRaceByName: async ({ name }: { name: string }) => {
    return p.characterRace.findUniqueOrThrow({
      where: {
        name,
      },
    });
  },

  getByNameMatch: async ({ search }: { search: string }) => {
    return p.character.findFirst({
      where: {
        name: {
          equals: search,
          mode: "insensitive",
        },
      },
    });
  },

  getByNameIncludes: async ({
    search,
    take,
  }: {
    search: string;
    take: number;
  }) => {
    return p.character.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take,
    });
  },

  getCharacterNameWalletIdMap: async ({
    characterNames,
  }: {
    characterNames: string[];
  }) => {
    const characters = await p.character.findMany({
      where: {
        name: {
          in: characterNames,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        defaultPilot: {
          select: {
            email: true,
            wallet: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    return characters.reduce(
      (acc, c) => {
        acc[c.name] = c.defaultPilot?.wallet?.id;
        return acc;
      },
      {} as Record<string, number | undefined>,
    );
  },
});
