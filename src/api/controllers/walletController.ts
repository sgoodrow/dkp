import { userController } from "@/api/controllers/userController";
import { PrismaTransactionClient } from "@/api/repositories/shared/client";
import { walletRepository } from "@/api/repositories/walletRepository";
import { AgGrid } from "@/api/shared/agGridUtils/table";

export const walletController = (p?: PrismaTransactionClient) => ({
  assignTransactionItem: async ({
    userId,
    transactionId,
    itemId,
  }: {
    userId: string;
    transactionId: number;
    itemId: number;
  }) => {
    return walletRepository(p).assignTransactionItem({
      updatedById: userId,
      transactionId,
      itemId,
    });
  },

  assignTransactionPilot: async ({
    userId,
    transactionId,
    pilotId,
  }: {
    userId: string;
    transactionId: number;
    pilotId: string;
  }) => {
    const wallet = await walletRepository(p).getByUserId({
      userId: pilotId,
    });
    return walletRepository(p).assignTransactionPilot({
      updatedById: userId,
      transactionId,
      walletId: wallet.id,
    });
  },

  rejectTransaction: async ({
    transactionId,
    rejected = false,
  }: {
    transactionId: number;
    rejected?: boolean;
  }) => {
    return walletRepository(p).rejectTransaction({
      transactionId,
      rejected,
    });
  },

  create: async ({ userId }: { userId: string }) => {
    return walletRepository(p).create({ userId });
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
    return walletRepository(p).createManyAttendants({
      attendees,
      payout,
      raidActivityId,
      createdById,
      updatedById,
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
    return walletRepository(p).createManyAdjustments({
      adjustments,
      raidActivityId,
      createdById,
      updatedById,
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
      itemName: string;
      pilotCharacterName?: string;
      walletId: number | null;
      itemId: number | null;
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    return walletRepository(p).createManyPurchases({
      purchases,
      raidActivityId,
      createdById,
      updatedById,
    });
  },

  countUnclearedTransactions: async () => {
    return walletRepository(p).countUnclearedTransactions();
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return walletRepository(p).getByUserId({ userId });
  },

  getUserDkp: async ({ userId }: { userId: string }) => {
    const { id } = await walletRepository(p).getByUserId({ userId });
    return walletRepository(p).getWalletDkp({ walletId: id });
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
    const rows = await walletRepository(p).getManyTransactions({
      startRow,
      endRow,
      filterModel,
      sortModel,
      showRejected,
      showCleared,
    });
    return {
      totalRowCount: await walletRepository(p).countTransactions({
        showRejected,
        showCleared,
        filterModel,
      }),
      rows: rows.map((r) => ({
        ...r,
        wallet: r.wallet
          ? {
              ...r.wallet,
              user: userController(p).addDisplayName({ user: r.wallet.user }),
            }
          : null,
      })),
    };
  },
});
