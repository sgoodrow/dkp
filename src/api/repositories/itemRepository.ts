import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";

export const itemRepository = (p: PrismaTransactionClient = prisma) => ({
  createMany: async ({
    items,
  }: {
    items: { name: string; wikiSlug: string }[];
  }) => {
    return p.item.createMany({
      data: items.map((i) => {
        return {
          name: i.name,
          wikiSlug: i.wikiSlug,
        };
      }),
    });
  },

  getByNameMatch: async ({ search }: { search: string }) => {
    return p.item.findFirst({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  },
});
