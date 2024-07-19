import { prisma } from "@/api/repositories/prisma";

export const itemRepository = {
  createMany: async ({
    items,
  }: {
    items: { name: string; wikiSlug: string }[];
  }) => {
    return prisma.item.createMany({
      data: items.map((i) => {
        return {
          name: i.name,
          wikiSlug: i.wikiSlug,
        };
      }),
    });
  },
};
