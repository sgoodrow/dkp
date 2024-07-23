import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import { WalletTransactionType } from "@prisma/client";
import { sum, sumBy } from "lodash";

export const walletRepository = (p: PrismaTransactionClient = prisma) => ({
  createManyAttendants: async ({
    attendeesWithIds,
    payout,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    attendeesWithIds: {
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
      data: attendeesWithIds.map(
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
    adjustmentsWithIds: adjustmentsWithWalletId,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    adjustmentsWithIds: {
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
      data: adjustmentsWithWalletId.map(
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
    purchasesWithIds,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    purchasesWithIds: {
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
      data: purchasesWithIds.map(
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
        walletId,
      },
      _sum: {
        amount: true,
      },
    });

    const spentDkp = Math.abs(
      t.find(({ type }) => type === "PURCHASE")?._sum.amount ?? 0,
    );

    const earnedDkp =
      (t.find(({ type }) => type === "ATTENDANCE")?._sum.amount ?? 0) +
      (t.find(({ type }) => type === "ADJUSTMENT")?._sum.amount ?? 0);

    return {
      currentDkp: earnedDkp - spentDkp,
      spentDkp,
      earnedDkp,
    };
  },
});
