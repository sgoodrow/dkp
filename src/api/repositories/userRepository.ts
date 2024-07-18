import { prisma } from "@/api/repositories/prisma";

export const userRepository = {
  getProviderUserId: async ({
    userId,
    provider,
  }: {
    userId: string;
    provider: string;
  }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
        AND: {
          accounts: {
            some: {
              provider,
            },
          },
        },
      },
      include: {
        accounts: true,
      },
    });
    const providerAccountId = user.accounts?.[0].providerAccountId;
    if (!providerAccountId) {
      throw new Error("No provider account found");
    }
    return providerAccountId;
  },

  get: async ({ userId }: { userId: string }) => {
    return prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
  },

  getByEmail: async ({ email }: { email: string }) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  searchByName: async ({ search, take }: { search: string; take: number }) => {
    return prisma.user.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take,
    });
  },
};
