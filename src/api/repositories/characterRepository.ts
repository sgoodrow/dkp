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
import { character } from "@/shared/utils/character";
import { startCase } from "lodash";

const normalizeRace = (race: string) => {
  return startCase(race.toLowerCase());
};

const normalizeClass = (c: string) => {
  return startCase(c.toLowerCase());
};

export const characterRepository = (p: PrismaTransactionClient = prisma) => ({
  deleteAll: async () => {
    await p.$executeRaw`TRUNCATE TABLE "Character" RESTART IDENTITY CASCADE;`;
  },

  count: async () => {
    return p.character.count();
  },

  getManyByIds: async ({ ids }: { ids: number[] }) => {
    return p.character.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        defaultPilot: {
          include: {
            wallet: true,
          },
        },
      },
    });
  },

  upsert: async ({
    name,
    raceId,
    classId,
    defaultPilotId,
  }: {
    name: string;
    raceId: number;
    classId: number;
    defaultPilotId?: string;
  }) => {
    const normalizedName = character.normalizeName(name);
    return p.character.upsert({
      where: {
        name: normalizedName,
      },
      create: {
        name: normalizedName,
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
  }: {
    characters: {
      name: string;
      raceId: number;
      classId: number;
      defaultPilotId: string | null;
    }[];
  }) => {
    return p.character.createManyAndReturn({
      data: characters.map((c) => {
        return {
          name: character.normalizeName(c.name),
          raceId: c.raceId,
          classId: c.classId,
          defaultPilotId: c.defaultPilotId,
        };
      }),
      include: {
        defaultPilot: {
          include: {
            wallet: true,
          },
        },
      },
    });
  },

  createClasses: async ({
    classes,
  }: {
    classes: {
      name: string;
      colorHexLight: string;
      colorHexDark: string;
    }[];
  }) => {
    await p.characterClass.createMany({
      data: classes.map((c) => {
        return {
          name: normalizeClass(c.name),
          colorHexLight: c.colorHexLight,
          colorHexDark: c.colorHexDark,
        };
      }),
    });
  },

  createRaces: async (races: { name: string }[]) => {
    await p.characterRace.createMany({
      data: races.map((r) => {
        return {
          name: normalizeRace(r.name),
        };
      }),
    });
  },

  createRaceClassCombinations: async ({
    classCombinations,
  }: {
    classCombinations: {
      name: string;
      allowedRaces: string[];
    }[];
  }) => {
    const classes = await characterRepository(p).getClasses({});
    const races = await characterRepository(p).getRaces({});

    const data = classes.flatMap((c) => {
      const match = classCombinations.find(
        ({ name }) => normalizeClass(name) === c.name,
      );
      if (!match) {
        return [];
      }

      return races
        .filter((r) =>
          match.allowedRaces.map((r) => normalizeRace(r)).includes(r.name),
        )
        .map((r) => ({
          classId: c.id,
          raceId: r.id,
        }));
    });

    await p.raceClassCombination.createMany({
      data,
    });
  },

  isNameAvailable: async ({ name }: { name: string }) => {
    const numCharactersWithName = await p.character.count({
      where: {
        name: character.normalizeName(name),
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

  countWithoutDefaultPilot: async ({
    filterModel,
  }: {
    filterModel?: AgFilterModel;
  }) => {
    return p.character.count({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        defaultPilotId: null,
      },
    });
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

  getRaceClassCombinations: async () => {
    return p.raceClassCombination.findMany();
  },

  getManyByNameMatch: async ({ names }: { names: string[] }) => {
    return p.character.findMany({
      where: {
        name: {
          in: names.map((name) => character.normalizeName(name)),
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

  getManyWithoutDefaultPilot: async ({
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
    return p.character.findMany({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        defaultPilotId: null,
      },
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        createdAt: "desc",
      },
      include: {
        class: true,
        race: true,
      },
      skip: startRow,
      take: endRow - startRow,
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
        class: true,
        race: true,
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },

  getClasses: async ({ raceId }: { raceId?: number }) => {
    if (!raceId) {
      return p.characterClass.findMany();
    }
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
    if (!classId) {
      return p.characterRace.findMany();
    }
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
          equals: character.normalizeName(search),
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
          contains: character.normalizeName(search),
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
  }: {
    characterNames: string[];
  }) => {
    const characters = await p.character.findMany({
      where: {
        name: {
          in: characterNames.map((n) => character.normalizeName(n)),
        },
      },
      select: {
        name: true,
        id: true,
        defaultPilot: {
          select: {
            wallet: true,
          },
        },
      },
    });

    const map = characters.reduce<
      Record<string, { id: number; defaultWalletId: number | null }>
    >((acc, c) => {
      acc[c.name] = {
        id: c.id,
        defaultWalletId: c.defaultPilot?.wallet?.id || null,
      };
      return acc;
    }, {});

    return {
      get: (name?: string) =>
        name === undefined ? null : map[character.normalizeName(name)] || null,
    };
  },
});
