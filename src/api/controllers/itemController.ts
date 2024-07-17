import { itemRepository } from "@/api/repositories/itemRepository";

export const itemController = {
  create: async ({ name, wikiSlug }: { name: string; wikiSlug: string }) => {
    return itemRepository.create({ name, wikiSlug });
  },
};
