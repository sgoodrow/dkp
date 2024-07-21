import { prisma } from "@/api/repositories/prisma";

export const characterRepository = {
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
    return prisma.character.createMany({
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
    return prisma.characterClass.create({
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
    return prisma.characterRace.create({
      data: {
        name,
      },
    });
  },

  isNameAvailable: async ({ name }: { name: string }) => {
    const numCharactersWithName = await prisma.character.count({
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
    const combination = await prisma.raceClassCombination.findFirst({
      where: {
        raceId,
        classId,
      },
    });
    return combination !== null;
  },

  getCount: async ({ userId }: { userId: string }) => {
    return prisma.character.count({
      where: {
        defaultPilotId: userId,
      },
    });
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return prisma.character.findMany({
      where: {
        defaultPilotId: userId,
      },
      orderBy: {
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
    });
  },

  getClasses: async ({ raceId }: { raceId?: number }) => {
    return prisma.characterClass.findMany({
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
    return prisma.characterClass.findUniqueOrThrow({
      where: {
        name,
      },
    });
  },

  getRaces: async ({ classId }: { classId?: number }) => {
    return prisma.characterRace.findMany({
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
    return prisma.characterRace.findUniqueOrThrow({
      where: {
        name,
      },
    });
  },

  searchByName: async ({ search, take }: { search: string; take: number }) => {
    return prisma.character.findMany({
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
};
