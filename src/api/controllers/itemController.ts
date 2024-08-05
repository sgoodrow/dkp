import { itemRepository } from "@/api/repositories/itemRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";

type CreateItem = {
  name: string;
  wikiSlug: string;
};

const normalizeItemName = (name: string) => name.toLowerCase();

export const itemController = (p?: PrismaTransactionClient) => ({
  createMany: async ({ items }: { items: CreateItem[] }) => {
    return itemRepository(p).createMany({ items });
  },

  create: async (item: CreateItem) => {
    return itemController(p).createMany({ items: [item] });
  },

  getByNameMatch: async ({ search }: { search: string }) => {
    return itemRepository(p).getByNameMatch({ search });
  },

  getByNameIncludes: async ({
    search,
    take,
  }: {
    search: string;
    take: number;
  }) => {
    return itemRepository(p).getByNameIncludes({ search, take });
  },

  getItemMap: async ({ itemNames }: { itemNames: string[] }) => {
    const map = await itemRepository(p).getItemMap({ itemNames });
    return {
      get: (itemName: string) => map[normalizeItemName(itemName)] || null,
    };
  },
});
