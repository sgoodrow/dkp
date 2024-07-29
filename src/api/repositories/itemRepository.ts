import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";

const normalizeItemName = (name: string) => name.toLowerCase();

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
          contains: normalizeItemName(search),
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
          contains: normalizeItemName(search),
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
          in: itemNames.map((i) => normalizeItemName(i)),
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
