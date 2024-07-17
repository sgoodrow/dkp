import { prisma } from "@/api/repositories/prisma";

export const itemRepository = {
  create: async ({ name, wikiSlug }: { name: string; wikiSlug: string }) => {
    return prisma.item.create({
      data: {
        name,
        wikiSlug,
      },
    });
  },
};
