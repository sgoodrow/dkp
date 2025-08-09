import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import {
  AgSortModel,
  agSortModelToPrismaOrderBy,
} from "@/api/shared/agGridUtils/sort";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { WalletTransactionType } from "@prisma/client";

const SYSTEM_USER_EMAIL = "system@dkp.com";

export const userRepository = (p: PrismaTransactionClient = prisma) => ({
  createManyStubUsers: async ({
    users,
  }: {
    users: { name: string; email: string }[];
  }) => {
    return p.user.createManyAndReturn({
      data: users,
    });
  },

  upsertSystemUser: async () => {
    return p.user.upsert({
      where: {
        email: SYSTEM_USER_EMAIL,
      },
      create: {
        name: "System",
        email: SYSTEM_USER_EMAIL,
      },
      update: {},
    });
  },

  upsert: ({ name, email }: { name?: string; email: string }) => {
    return p.user.upsert({
      where: {
        email,
      },
      create: {
        name,
        email,
      },
      update: {
        name,
      },
    });
  },

  hasRole: ({ userId, roleIds }: { userId: string; roleIds: string[] }) => {
    return p.discordUserMetadata.findFirst({
      where: {
        AND: {
          roleIds: {
            hasSome: roleIds,
          },
          userId,
        },
      },
    });
  },

  countAdmins: async ({
    discordOwnerRoleId,
    discordHelperRoleId,
    filterModel,
    sortModel,
  }: {
    discordOwnerRoleId: string;
    discordHelperRoleId: string;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.user.count({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        discordMetadata: {
          roleIds: {
            hasSome: [discordOwnerRoleId, discordHelperRoleId],
          },
        },
      },
      orderBy: agSortModelToPrismaOrderBy(sortModel),
    });
  },

  getSystemUserId: async () => {
    const systemUser = await p.user.findFirstOrThrow({
      where: {
        email: SYSTEM_USER_EMAIL,
      },
    });
    return systemUser.id;
  },

  getMany: async ({ startRow, endRow, filterModel, sortModel }: AgGrid) => {
    const systemUserId = await userRepository(p).getSystemUserId();
    const users = await p.user.findMany({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        id: { not: systemUserId },
      },
      orderBy: agSortModelToPrismaOrderBy(sortModel),
      include: {
        characters: true,
        discordMetadata: true,
        wallet: true,
        accounts: true,
        _count: {
          select: {
            accounts: true,
            characters: true,
          },
        },
      },
      skip: startRow,
      take: endRow - startRow,
    });
    const walletIds = users.flatMap((u) =>
      u.wallet?.id === undefined ? [] : [u.wallet.id],
    );
    const walletBalances = await p.walletTransaction.groupBy({
      by: ["walletId"],
      _sum: {
        amount: true,
      },
      where: {
        AND: [
          {
            walletId: {
              in: walletIds,
            },
            OR: [
              {
                // If it is a purchase, it must be missing an item, wallet or character ID
                type: WalletTransactionType.PURCHASE,
                OR: [{ itemId: { not: null } }, { characterId: { not: null } }],
              },
              {
                // If it is not a purchase, it must be missing a wallet or character ID
                type: { not: WalletTransactionType.PURCHASE },
                OR: [{ characterId: { not: null } }],
              },
            ],
          },
        ],
      },
    });

    return users.map((u) => ({
      ...u,
      walletBalance:
        walletBalances.find((w) => w.walletId === u.wallet?.id)?._sum.amount ||
        0,
    }));
  },

  count: async ({ filterModel }: { filterModel?: AgFilterModel }) => {
    const systemUserId = await userRepository(p).getSystemUserId();
    return p.user.count({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        id: {
          not: systemUserId,
        },
      },
    });
  },

  getManyAdmins: async ({
    startRow,
    endRow,
    discordHelperRoleId,
    discordOwnerRoleId,
    filterModel,
    sortModel,
  }: {
    startRow: number;
    endRow: number;
    discordHelperRoleId: string;
    discordOwnerRoleId: string;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.user.findMany({
      where: {
        ...agFilterModelToPrismaWhere(filterModel),
        discordMetadata: {
          roleIds: {
            hasSome: [discordHelperRoleId, discordOwnerRoleId],
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
      skip: startRow,
      take: endRow - startRow,
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

  getManyByEmails: async ({ emails }: { emails: string[] }) => {
    return p.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      include: {
        wallet: true,
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
