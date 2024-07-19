import { itemRepository } from "@/api/repositories/itemRepository";

type CreateItem = {
  name: string;
  wikiSlug: string;
};

export const itemController = {
  createMany: async ({ items }: { items: CreateItem[] }) => {
    return itemRepository.createMany({ items });
  },

  create: async (item: CreateItem) => {
    return itemController.createMany({ items: [item] });
  },
};
