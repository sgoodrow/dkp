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

  getItemMap: async ({ itemNames }: { itemNames: string[] }) => {
    const items = await p.item.findMany({
      where: {
        name: {
          in: itemNames,
          mode: "insensitive",
        },
      },
    });
    return items.reduce(
      (acc, item) => {
        acc[item.name] = item.id;
        return acc;
      },
      {} as { [key: string]: number },
    );
  },
});
