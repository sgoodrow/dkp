import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import { agSortModelToPrismaOrderBy } from "@/api/shared/agGridUtils/sort";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { WalletTransactionType } from "@prisma/client";

const getTypeTransactionsPrismaWhere = (type?: WalletTransactionType) =>
  type ? { type } : undefined;

const getRaidActivityTransactionsPrismaWhere = (raidActivityId?: number) =>
  raidActivityId ? { raidActivityId } : undefined;

const getUserTransactionsPrismaWhere = (userId?: string) =>
  userId ? { wallet: { userId } } : undefined;

const UNCLEARED_PRISMA_WHERE = {
  OR: [
    {
      // If it is a purchase, it must be missing an item, wallet or character ID
      type: WalletTransactionType.PURCHASE,
      OR: [{ itemId: null }, { walletId: null }, { characterId: null }],
    },
    {
      // If it is not a purchase, it must be missing a wallet or character ID
      type: { not: WalletTransactionType.PURCHASE },
      OR: [{ walletId: null }, { characterId: null }],
    },
  ],
};

const getUnclearedTransactionsPrismaWhere = (showUncleared: boolean) =>
  showUncleared ? UNCLEARED_PRISMA_WHERE : undefined;

export const walletRepository = (p: PrismaTransactionClient = prisma) => ({
  getTransaction: async ({ transactionId }: { transactionId: number }) => {
    return p.walletTransaction.findUniqueOrThrow({
      where: { id: transactionId },
    });
  },

  getUnassignedPurchaseIdsByName: async ({
    itemName,
  }: {
    itemName: string | null;
  }) => {
    if (itemName === null) {
      throw new Error("itemName cannot be null");
    }
    const transactions = await p.walletTransaction.findMany({
      where: {
        type: WalletTransactionType.PURCHASE,
        itemId: null,
        itemName,
      },
    });

    return transactions.map((transaction) => transaction.id);
  },

  getManyByUserIds: async ({ userIds }: { userIds: string[] }) => {
    return p.wallet.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });
  },

  createMany: async ({ userIds }: { userIds: string[] }) => {
    return p.wallet.createManyAndReturn({
      data: userIds.map((userId) => ({ userId })),
      include: {
        user: true,
      },
    });
  },

  assignPurchasesItem: async ({
    userId,
    transactionIds,
    itemId,
  }: {
    userId: string;
    transactionIds: number[];
    itemId?: number;
  }) => {
    return p.walletTransaction.updateMany({
      where: {
        id: {
          in: transactionIds,
        },
      },
      data: {
        updatedById: userId,
        itemId,
      },
    });
  },

  updateTransaction: async ({
    updatedById,
    transactionId,
    rejected,
    amount,
    pilotId,
    itemId,
    characterId,
  }: {
    updatedById: string;
    transactionId: number;
    rejected?: boolean;
    amount?: number;
    pilotId?: string;
    itemId?: number;
    characterId?: number;
  }) => {
    let walletId: number | undefined = undefined;
    if (pilotId !== undefined) {
      const wallet = await walletRepository(p).getByUserId({
        userId: pilotId,
      });
      walletId = wallet.id;
    }
    return p.walletTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        rejected,
        amount,
        walletId,
        itemId,
        characterId,
        updatedById,
        requiredIntervention: true,
      },
    });
  },

  setRaidActivityAttendanceAmount: async ({
    userId,
    raidActivityId,
    amount,
  }: {
    userId: string;
    raidActivityId: number;
    amount: number;
  }) => {
    return p.walletTransaction.updateMany({
      where: {
        type: WalletTransactionType.ATTENDANCE,
        raidActivityId,
      },
      data: {
        amount,
        updatedById: userId,
      },
    });
  },

  rejectManyUnclearedTransactions: async ({
    userId,
    before,
    includePurchases,
    includeAdjustments,
    onlyBots,
  }: {
    userId: string;
    before: Date;
    includePurchases: boolean;
    includeAdjustments: boolean;
    onlyBots: boolean;
  }) => {
    let types: WalletTransactionType[] = [WalletTransactionType.ATTENDANCE];
    if (includePurchases) {
      types.push(WalletTransactionType.PURCHASE);
    }
    if (includeAdjustments) {
      types.push(WalletTransactionType.ADJUSTMENT);
    }
    return p.walletTransaction.updateMany({
      where: {
        ...UNCLEARED_PRISMA_WHERE,
        walletId: onlyBots ? { equals: null } : undefined,
        createdAt: {
          lt: before,
        },
        type: {
          in: types,
        },
      },
      data: {
        rejected: true,
        requiredIntervention: true,
        updatedById: userId,
      },
    });
  },

  upsert: async ({ userId }: { userId: string }) => {
    return p.wallet.upsert({
      where: {
        userId,
      },
      create: {
        userId,
      },
      update: {},
    });
  },

  createManyAttendants: async ({
    attendees,
    userId,
  }: {
    attendees: {
      createdAt?: string;
      characterName: string;
      pilotCharacterName?: string;
      walletId: number | null;
      characterId: number | null;
      amount: number;
      raidActivityId: number;
    }[];
    userId: string;
  }) => {
    await p.walletTransaction.createMany({
      data: attendees.map(
        ({
          createdAt,
          characterName,
          pilotCharacterName,
          walletId,
          characterId,
          amount,
          raidActivityId,
        }) => ({
          type: WalletTransactionType.ATTENDANCE,
          createdAt,
          amount: Math.abs(amount),
          characterName,
          pilotCharacterName,
          walletId,
          characterId,
          itemId: null,
          raidActivityId,
          createdById: userId,
          updatedById: userId,
        }),
      ),
    });
  },

  createManyAdjustments: async ({
    adjustments,
    userId,
  }: {
    adjustments: {
      createdAt?: string;
      amount: number;
      reason: string;
      characterName: string;
      pilotCharacterName?: string;
      walletId: number | null;
      characterId: number | null;
      raidActivityId: number;
    }[];
    userId: string;
  }) => {
    await p.walletTransaction.createMany({
      data: adjustments.map(
        ({
          createdAt,
          amount,
          reason,
          characterName,
          pilotCharacterName,
          walletId,
          characterId,
          raidActivityId,
        }) => ({
          type: WalletTransactionType.ADJUSTMENT,
          createdAt,
          amount,
          reason,
          characterName,
          pilotCharacterName,
          walletId,
          characterId,
          itemId: null,
          raidActivityId,
          createdById: userId,
          updatedById: userId,
        }),
      ),
    });
  },

  createManyPurchases: async ({
    purchases,
    userId,
  }: {
    purchases: {
      createdAt?: string;
      amount: number;
      characterName: string;
      pilotCharacterName?: string;
      itemName: string;
      walletId: number | null;
      itemId: number | null;
      raidActivityId: number;
      characterId: number | null;
    }[];
    userId: string;
  }) => {
    await p.walletTransaction.createMany({
      data: purchases.map(
        ({
          createdAt,
          amount,
          characterName,
          pilotCharacterName,
          itemName,
          itemId,
          walletId,
          characterId,
          raidActivityId,
        }) => ({
          type: WalletTransactionType.PURCHASE,
          createdAt,
          amount: -Math.abs(amount),
          characterName,
          pilotCharacterName,
          itemName,
          walletId,
          characterId,
          itemId,
          raidActivityId,
          createdById: userId,
          updatedById: userId,
        }),
      ),
    });
  },

  countUnclearedTransactions: async () => {
    return p.walletTransaction.count({
      where: {
        AND: [UNCLEARED_PRISMA_WHERE, { rejected: false }],
      },
    });
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return p.wallet.upsert({
      update: {
        userId,
      },
      create: {
        userId,
      },
      where: {
        userId,
      },
    });
  },

  getWalletDkp: async ({ walletId }: { walletId: number }) => {
    const t = await prisma.walletTransaction.groupBy({
      by: ["type"],
      where: {
        OR: [
          {
            AND: {
              type: {
                not: WalletTransactionType.PURCHASE,
              },
              walletId,
            },
          },
          {
            AND: {
              type: WalletTransactionType.PURCHASE,
              walletId,
              itemId: {
                not: null,
              },
            },
          },
        ],
      },
      _sum: {
        amount: true,
      },
    });

    const earned =
      (t.find(({ type }) => type === "ATTENDANCE")?._sum.amount ?? 0) +
      (t.find(({ type }) => type === "ADJUSTMENT")?._sum.amount ?? 0);

    const spent = t.find(({ type }) => type === "PURCHASE")?._sum.amount ?? 0;

    return {
      current: earned + spent,
      spentDkp: spent,
      earnedDkp: earned,
    };
  },

  countTransactions: async ({
    showRejected,
    showCleared,
    type,
    raidActivityId,
    userId,
    filterModel,
  }: {
    showRejected?: boolean;
    showCleared?: boolean;
    type?: WalletTransactionType;
    raidActivityId?: number;
    userId?: string;
    filterModel: AgFilterModel;
  }) => {
    return p.walletTransaction.count({
      where: {
        AND: {
          ...agFilterModelToPrismaWhere(filterModel),
          ...getUnclearedTransactionsPrismaWhere(!showCleared),
          ...getTypeTransactionsPrismaWhere(type),
          ...getRaidActivityTransactionsPrismaWhere(raidActivityId),
          ...getUserTransactionsPrismaWhere(userId),
        },
      },
    });
  },

  getManyTransactions: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
    showCleared,
    type,
    raidActivityId,
    userId,
  }: {
    showCleared?: boolean;
    type?: WalletTransactionType;
    raidActivityId?: number;
    userId?: string;
  } & AgGrid) => {
    return p.walletTransaction.findMany({
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        createdAt: "desc",
      },
      where: {
        AND: {
          ...agFilterModelToPrismaWhere(filterModel),
          ...getUnclearedTransactionsPrismaWhere(!showCleared),
          ...getTypeTransactionsPrismaWhere(type),
          ...getRaidActivityTransactionsPrismaWhere(raidActivityId),
          ...getUserTransactionsPrismaWhere(userId),
        },
      },
      include: {
        createdBy: true,
        item: true,
        character: true,
        wallet: {
          include: {
            user: {
              include: {
                discordMetadata: true,
              },
            },
          },
        },
        raidActivity: {
          include: {
            type: true,
          },
        },
        updatedBy: true,
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },
});
