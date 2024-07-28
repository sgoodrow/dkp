import { userController } from "@/api/controllers/userController";
import { PrismaTransactionClient } from "@/api/repositories/shared/client";
import { walletRepository } from "@/api/repositories/walletRepository";
import { AgGrid } from "@/api/shared/agGridUtils/table";

export const walletController = (p?: PrismaTransactionClient) => ({
  archiveTransaction: async ({
    transactionId,
    archived = false,
  }: {
    transactionId: number;
    archived?: boolean;
  }) => {
    return walletRepository(p).archiveTransaction({
      transactionId,
      archived,
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
    showArchived,
    showCleared,
  }: {
    showArchived: boolean;
    showCleared: boolean;
  } & AgGrid) => {
    const rows = await walletRepository(p).getManyTransactions({
      startRow,
      endRow,
      filterModel,
      sortModel,
      showArchived,
      showCleared,
    });
    return {
      totalRowCount: await walletRepository(p).countTransactions({
        showArchived,
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
