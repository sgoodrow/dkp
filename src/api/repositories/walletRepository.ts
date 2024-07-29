import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import { agSortModelToPrismaOrderBy } from "@/api/shared/agGridUtils/sort";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { WalletTransactionType } from "@prisma/client";

const getShowRejectedTransactionPrismaWhere = (showRejected: boolean) =>
  showRejected ? {} : { rejected: false };

const getShowClearedTransactionPrismaWhere = (showCleared: boolean) =>
  // The conditions which make a transaction 'uncleared' depend on if it is a purchase or not.
  showCleared
    ? {}
    : {
        OR: [
          // If it is a purchase, it must be missing an item ID or a wallet ID
          {
            type: WalletTransactionType.PURCHASE,
            OR: [{ itemId: null }, { walletId: null }],
            // If it is not a purchase, it must be missing a wallet ID
          },
          {
            type: { not: WalletTransactionType.PURCHASE },
            walletId: null,
          },
        ],
      };

export const walletRepository = (p: PrismaTransactionClient = prisma) => ({
  assignTransactionItem: async ({
    transactionId,
    itemId,
    itemName,
  }: {
    transactionId: number;
    itemId: number;
    itemName: string;
  }) => {
    return p.walletTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        itemId,
        itemName,
        requiredIntervention: true,
      },
    });
  },

  assignTransactionPilot: async ({
    transactionId,
    walletId,
  }: {
    transactionId: number;
    walletId: number;
  }) => {
    return p.walletTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        walletId,
        requiredIntervention: true,
      },
    });
  },

  rejectTransaction: async ({
    transactionId,
    rejected,
  }: {
    transactionId: number;
    rejected: boolean;
  }) => {
    return p.walletTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        rejected,
      },
    });
  },

  create: async ({ userId }: { userId: string }) => {
    return p.wallet.create({
      data: {
        userId,
      },
    });
  },

  createManyAttendants: async ({
    attendees,
    payout,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    attendees: {
      characterName: string;
      pilotCharacterName?: string;
      walletId: number | null;
    }[];
    payout: number;
    raidActivityId: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: attendees.map(
        ({ characterName, pilotCharacterName, walletId }) => ({
          type: WalletTransactionType.ATTENDANCE,
          amount: payout,
          characterName,
          pilotCharacterName,
          walletId,
          itemId: null,
          raidActivityId,
          createdById,
          updatedById,
        }),
      ),
    });
  },

  createManyAdjustments: async ({
    adjustments,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    adjustments: {
      amount: number;
      reason: string;
      characterName: string;
      pilotCharacterName?: string;
      walletId: number | null;
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: adjustments.map(
        ({ amount, reason, characterName, pilotCharacterName, walletId }) => ({
          type: WalletTransactionType.ADJUSTMENT,
          amount,
          reason,
          characterName,
          pilotCharacterName,
          walletId,
          itemId: null,
          raidActivityId,
          createdById,
          updatedById,
        }),
      ),
    });
  },

  createManyPurchases: async ({
    purchases,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    purchases: {
      amount: number;
      characterName: string;
      pilotCharacterName?: string;
      itemName: string;
      walletId: number | null;
      itemId: number | null;
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: purchases.map(
        ({
          amount,
          characterName,
          pilotCharacterName,
          itemName,
          itemId,
          walletId,
        }) => ({
          type: WalletTransactionType.PURCHASE,
          amount,
          characterName,
          pilotCharacterName,
          itemName,
          walletId,
          itemId,
          raidActivityId,
          createdById,
          updatedById,
        }),
      ),
    });
  },

  countUnclearedTransactions: async () => {
    return p.walletTransaction.count({
      where: {
        AND: [
          getShowClearedTransactionPrismaWhere(false),
          getShowRejectedTransactionPrismaWhere(false),
        ],
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
        AND: [
          {
            walletId,
          },
          {
            AND: {
              type: WalletTransactionType.PURCHASE,
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

    const spent = Math.abs(
      t.find(({ type }) => type === "PURCHASE")?._sum.amount ?? 0,
    );

    const earned =
      (t.find(({ type }) => type === "ATTENDANCE")?._sum.amount ?? 0) +
      (t.find(({ type }) => type === "ADJUSTMENT")?._sum.amount ?? 0);

    return {
      current: earned - spent,
      spentDkp: spent,
      earnedDkp: earned,
    };
  },

  countTransactions: async ({
    showRejected,
    showCleared,
    filterModel,
  }: {
    showRejected: boolean;
    showCleared: boolean;
    filterModel: AgFilterModel;
  }) => {
    return p.walletTransaction.count({
      where: {
        AND: {
          ...agFilterModelToPrismaWhere(filterModel),
          ...getShowRejectedTransactionPrismaWhere(showRejected),
          ...getShowClearedTransactionPrismaWhere(showCleared),
        },
      },
    });
  },

  getManyTransactions: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
    showRejected,
    showCleared,
  }: {
    showRejected: boolean;
    showCleared: boolean;
  } & AgGrid) => {
    return p.walletTransaction.findMany({
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        id: "desc",
      },
      where: {
        AND: {
          ...agFilterModelToPrismaWhere(filterModel),
          ...getShowRejectedTransactionPrismaWhere(showRejected),
          ...getShowClearedTransactionPrismaWhere(showCleared),
        },
      },
      include: {
        createdByUser: true,
        clearedByUser: true,
        item: true,
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
        updatedByUser: true,
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },
});
