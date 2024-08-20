import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { item } from "@/shared/utils/item";

export const itemRepository = (p: PrismaTransactionClient = prisma) => ({
  createMany: async ({
    items,
  }: {
    items: { name: string; wikiSlug: string }[];
  }) => {
    await p.item.createMany({
      data: items.map((i) => {
        return {
          name: item.normalizeName(i.name),
          wikiSlug: i.wikiSlug,
        };
      }),
    });
  },

  getById: async ({ itemId }: { itemId: number }) => {
    return p.item.findUniqueOrThrow({
      where: {
        id: itemId,
      },
    });
  },

  getByNameMatch: async ({ search }: { search: string }) => {
    return p.item.findFirst({
      where: {
        name: {
          contains: item.normalizeName(search),
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
    return p.item.findMany({
      where: {
        name: {
          contains: item.normalizeName(search),
        },
      },
      orderBy: {
        name: "asc",
      },
      take,
    });
  },

  getItemMap: async ({ itemNames }: { itemNames: string[] }) => {
    const items = await p.item.findMany({
      where: {
        name: {
          in: itemNames.map((i) => item.normalizeName(i)),
        },
      },
    });

    const map = items.reduce<Record<string, { id: number }>>((acc, item) => {
      acc[item.name] = { id: item.id };
      return acc;
    }, {});

    return {
      get: (itemName: string) => map[item.normalizeName(itemName)] || null,
    };
  },
});
