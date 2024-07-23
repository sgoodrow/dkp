import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";

export const userRepository = (p: PrismaTransactionClient = prisma) => ({
  getProviderUserId: async ({
    userId,
    provider,
  }: {
    userId: string;
    provider: string;
  }) => {
    const user = await p.user.findUniqueOrThrow({
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
    return p.user.findUniqueOrThrow({
      where: { id: userId },
    });
  },

  getByEmail: async ({ email }: { email: string }) => {
    return p.user.findUnique({
      where: { email },
    });
  },

  searchByName: async ({ search, take }: { search: string; take: number }) => {
    return p.user.findMany({
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
});
