import { prisma } from "@/api/repositories/prisma";

export const characterRepository = {
  createClass: async ({
    name,
    hexColor,
  }: {
    name: string;
    hexColor: string;
  }) => {
    return prisma.characterClass.create({
      data: {
        name,
        hexColor,
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
};
