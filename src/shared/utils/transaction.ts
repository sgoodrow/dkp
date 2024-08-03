import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import type { WalletTransactionType } from "@prisma/client";

export const transaction = {
  isCleared: ({
    type,
    itemId,
    walletId,
    characterId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    characterId: number | null;
    rejected: boolean;
  }) => {
    if (walletId === null || characterId === null || rejected) {
      return false;
    }
    switch (type) {
      case "ADJUSTMENT":
        return true;
      case "ATTENDANCE":
        return true;
      case "PURCHASE":
        return itemId !== null;
      default:
        return exhaustiveSwitchCheck(type);
    }
  },

  isPending: ({
    type,
    itemId,
    walletId,
    characterId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    characterId: number | null;
    rejected: boolean;
  }) => {
    if (rejected) {
      return false;
    }
    if (walletId === null || characterId === null) {
      return true;
    }
    switch (type) {
      case "ADJUSTMENT":
        return false;
      case "ATTENDANCE":
        return false;
      case "PURCHASE":
        return itemId === null;
      default:
        return exhaustiveSwitchCheck(type);
    }
  },

  isClearedAttendance: ({
    type,
    itemId,
    walletId,
    characterId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    characterId: number | null;
    rejected: boolean;
  }) => {
    return (
      transaction.isCleared({
        type,
        itemId,
        walletId,
        characterId,
        rejected,
      }) && type === "ATTENDANCE"
    );
  },

  isClearedAdjustment: ({
    type,
    itemId,
    walletId,
    characterId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    characterId: number | null;
    rejected: boolean;
  }) => {
    return (
      transaction.isCleared({
        type,
        itemId,
        walletId,
        characterId,
        rejected,
      }) && type === "ADJUSTMENT"
    );
  },

  isAttendance: ({
    type,
    rejected,
  }: {
    type: WalletTransactionType;
    rejected: boolean;
  }) => {
    if (rejected) {
      return false;
    }
    return type === "ATTENDANCE";
  },

  isPurchase: ({
    type,
    rejected,
  }: {
    type: WalletTransactionType;
    rejected: boolean;
  }) => {
    if (rejected) {
      return false;
    }
    return type === "PURCHASE";
  },

  isClearedPurchase: ({
    type,
    itemId,
    walletId,
    characterId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    characterId: number | null;
    rejected: boolean;
  }) => {
    return (
      transaction.isCleared({
        type,
        itemId,
        walletId,
        characterId,
        rejected,
      }) && type === "PURCHASE"
    );
  },
};
