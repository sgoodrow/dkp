import { itemRepository } from "@/api/repositories/itemRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/client";

type CreateItem = {
  name: string;
  wikiSlug: string;
};

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

  getItemMap: async ({ itemNames }: { itemNames: string[] }) => {
    return itemRepository(p).getItemMap({
      itemNames,
    });
  },
});
