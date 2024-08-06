import { itemRepository } from "@/api/repositories/itemRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";

type CreateItem = {
  name: string;
  wikiSlug: string;
};

export const itemController = (p?: PrismaTransactionClient) => ({
  createMany: async ({
    items,
    gameId,
  }: {
    items: CreateItem[];
    gameId: number;
  }) => {
    return itemRepository(p).createMany({ items, gameId });
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
    return itemRepository(p).getItemMap({ itemNames });
  },
});
