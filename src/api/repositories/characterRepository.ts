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
import { startCase, upperFirst } from "lodash";

const normalizeName = (name: string) => {
  return upperFirst(name.toLowerCase());
};

const normalizeRace = (race: string) => {
  return startCase(race.toLowerCase());
};

const normalizeClass = (c: string) => {
  return startCase(c.toLowerCase());
};

export const characterRepository = (p: PrismaTransactionClient = prisma) => ({
  upsert: async ({
    character: { name, raceId, classId, defaultPilotId },
    guildId,
  }: {
    character: {
      name: string;
      raceId: number;
      classId: number;
      defaultPilotId?: string;
    };
    guildId: number;
  }) => {
    const normalizedName = normalizeName(name);
    return p.character.upsert({
      where: {
        name: normalizedName,
      },
      create: {
        name: normalizedName,
        guildId,
        raceId,
        classId,
        defaultPilotId,
      },
      update: {
        raceId,
        classId,
        defaultPilotId,
      },
    });
  },

  createMany: async ({
    characters,
    guildId,
  }: {
    characters: {
      name: string;
      raceId: number;
      classId: number;
      defaultPilotId?: string;
    }[];
    guildId: number;
  }) => {
    return p.character.createMany({
      data: characters.map((c) => {
        return {
          name: normalizeName(c.name),
          guildId,
          raceId: c.raceId,
          classId: c.classId,
          defaultPilotId: c.defaultPilotId,
        };
      }),
    });
  },

  createClass: async ({
    gameId,
    name,
    colorHexLight,
    colorHexDark,
    allowedRaces,
  }: {
    gameId: number;
    name: string;
    colorHexLight: string;
    colorHexDark: string;
    allowedRaces: string[];
  }) => {
    return p.characterClass.create({
      data: {
        gameId,
        name: normalizeClass(name),
        colorHexLight,
        colorHexDark,
        raceClassCombinations: {
          create: allowedRaces.map((raceName) => {
            return {
              race: {
                connect: {
                  name: normalizeRace(raceName),
                },
              },
            };
          }),
        },
      },
    });
  },

  createRace: async ({ gameId, name }: { gameId: number; name: string }) => {
    return p.characterRace.create({
      data: {
        gameId,
        name: normalizeRace(name),
      },
    });
  },

  isNameAvailable: async ({ name }: { name: string }) => {
    const numCharactersWithName = await p.character.count({
      where: {
        name: normalizeName(name),
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

  getManyByNameMatch: async ({ names }: { names: string[] }) => {
    return p.character.findMany({
      where: {
        name: {
          in: names.map((name) => normalizeName(name)),
        },
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
    });
  },

  getByRaidActivityId: async ({
    raidActivityId,
  }: {
    raidActivityId: number;
  }) => {
    return p.character.findMany({
      where: {
        transactions: {
          some: {
            raidActivityId,
          },
        },
      },
      include: {
        transactions: {
          select: {
            raidActivityId: true,
          },
        },
        class: true,
        race: true,
      },
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
        id: "desc",
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
        name: normalizeClass(name),
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
        name: normalizeRace(name),
      },
    });
  },

  getByNameMatch: async ({ search }: { search: string }) => {
    return p.character.findFirst({
      where: {
        name: {
          equals: normalizeName(search),
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
          contains: normalizeName(search),
        },
      },
      orderBy: {
        name: "asc",
      },
      take,
    });
  },

  getCharacterNameMap: async ({
    characterNames,
    guildId,
  }: {
    characterNames: string[];
    guildId: number;
  }) => {
    const characters = await p.character.findMany({
      where: {
        guildId,
        name: {
          in: characterNames.map((n) => normalizeName(n)),
        },
      },
      select: {
        name: true,
        id: true,
        defaultPilot: {
          select: {
            wallets: {
              where: {
                guildId,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const map = characters.reduce<
      Record<string, { id: number; defaultWalletId: number | null }>
    >((acc, c) => {
      acc[c.name] = {
        id: c.id,
        defaultWalletId: c.defaultPilot?.wallets?.[0]?.id || null,
      };
      return acc;
    }, {});

    return {
      get: (name?: string) =>
        name === undefined ? null : map[normalizeName(name)] || null,
    };
  },
});
