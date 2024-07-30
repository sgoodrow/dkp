import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import {
  AgSortModel,
  agSortModelToPrismaOrderBy,
} from "@/api/shared/agGridUtils/sort";
import { guild } from "@/shared/constants/guild";

export const userRepository = (p: PrismaTransactionClient = prisma) => ({
  isAdmin: ({ userId }: { userId: string }) => {
    return p.discordUserMetadata.findFirst({
      where: {
        AND: {
          roleIds: {
            hasSome: [guild.discordAdminRoleId],
          },
          userId,
        },
      },
    });
  },

  countAdmins: async ({
    filterModel,
    sortModel,
  }: {
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.user.count({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        discordMetadata: {
          roleIds: {
            has: guild.discordAdminRoleId,
          },
        },
      },
      orderBy: agSortModelToPrismaOrderBy(sortModel),
    });
  },

  getManyAdmins: async ({
    filterModel,
    sortModel,
  }: {
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.user.findMany({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        discordMetadata: {
          roleIds: {
            hasSome: [guild.discordAdminRoleId],
          },
        },
      },
      orderBy: agSortModelToPrismaOrderBy(sortModel),
      include: {
        discordMetadata: true,
        _count: {
          select: {
            updatedTransactions: {
              where: {
                requiredIntervention: true,
              },
            },
          },
        },
        updatedTransactions: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
          select: {
            updatedAt: true,
          },
        },
      },
    });
  },

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

  getManyByProviderAccountIds: async ({
    providerAccountIds,
    provider,
  }: {
    providerAccountIds: string[];
    provider: string;
  }) => {
    return p.user.findMany({
      where: {
        accounts: {
          some: {
            provider,
            providerAccountId: {
              in: providerAccountIds,
            },
          },
        },
      },
      select: {
        id: true,
        accounts: {
          select: {
            providerAccountId: true,
          },
        },
      },
    });
  },

  get: async ({ userId }: { userId: string }) => {
    return p.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        discordMetadata: true,
      },
    });
  },

  getByEmail: async ({ email }: { email: string }) => {
    return p.user.findUnique({
      where: { email },
    });
  },

  getByWalletId: async ({ walletId }: { walletId: number }) => {
    return p.user.findFirstOrThrow({
      where: {
        wallet: {
          id: walletId,
        },
      },
      include: {
        discordMetadata: true,
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
    return p.user.findMany({
      where: {
        OR: [
          {
            discordMetadata: {
              displayName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            characters: {
              some: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        discordMetadata: true,
      },
      orderBy: {
        name: "asc",
      },
      take,
    });
  },
});
