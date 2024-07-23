import { characterController } from "@/api/controllers/characterController";
import { itemController } from "@/api/controllers/itemController";
import { PrismaTransactionClient } from "@/api/repositories/shared/client";
import { walletRepository } from "@/api/repositories/walletRepository";

export const walletController = (p?: PrismaTransactionClient) => ({
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
    }[];
    payout: number;
    raidActivityId: number;
    createdById: string;
    updatedById: string;
  }) => {
    const attendeesWithIds = await Promise.all(
      attendees.map(async ({ characterName, pilotCharacterName }) => {
        const userId = await characterController(p).getPilotIdFromNames({
          characterName,
          pilotCharacterName,
        });

        const wallet = userId
          ? await walletController(p).getByUserId({
              userId,
            })
          : null;

        return {
          characterName,
          pilotCharacterName,
          walletId: wallet?.id || null,
        };
      }),
    );

    return walletRepository(p).createManyAttendants({
      attendeesWithIds,
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
      characterName: string;
      pilotCharacterName?: string;
      amount: number;
      reason: string;
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    const adjustmentsWithIds = await Promise.all(
      adjustments.map(
        async ({ amount, reason, characterName, pilotCharacterName }) => {
          const userId = await characterController(p).getPilotIdFromNames({
            characterName,
            pilotCharacterName,
          });

          const wallet = userId
            ? await walletController(p).getByUserId({
                userId,
              })
            : null;

          return {
            amount,
            reason,
            characterName,
            pilotCharacterName,
            walletId: wallet?.id || null,
          };
        },
      ),
    );

    return walletRepository(p).createManyAdjustments({
      adjustmentsWithIds,
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
      characterName: string;
      pilotCharacterName?: string;
      amount: number;
      itemName: string;
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    const purchasesWithIds = await Promise.all(
      purchases.map(
        async ({ characterName, pilotCharacterName, amount, itemName }) => {
          const userId = await characterController(p).getPilotIdFromNames({
            characterName,
            pilotCharacterName,
          });

          const wallet = userId
            ? await walletController(p).getByUserId({
                userId,
              })
            : null;

          const item = await itemController(p).getByNameMatch({
            search: itemName,
          });

          return {
            amount: -Math.abs(amount),
            characterName,
            pilotCharacterName,
            itemName,
            walletId: wallet?.id || null,
            itemId: item?.id || null,
          };
        },
      ),
    );

    return walletRepository(p).createManyPurchases({
      purchasesWithIds,
      raidActivityId,
      createdById,
      updatedById,
    });
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return walletRepository(p).getByUserId({ userId });
  },

  getUserDkp: async ({ userId }: { userId: string }) => {
    const { id } = await walletRepository(p).getByUserId({ userId });
    return walletRepository(p).getWalletDkp({ walletId: id });
  },
});
