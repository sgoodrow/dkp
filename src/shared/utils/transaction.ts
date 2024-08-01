import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import type { WalletTransactionType } from "@prisma/client";

export const transaction = {
  isCleared: ({
    type,
    itemId,
    walletId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    rejected: boolean;
  }) => {
    if (walletId === null || rejected) {
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
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    rejected: boolean;
  }) => {
    if (rejected) {
      return false;
    }
    if (walletId === null) {
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
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    rejected: boolean;
  }) => {
    return (
      transaction.isCleared({
        type,
        itemId,
        walletId,
        rejected,
      }) && type === "ATTENDANCE"
    );
  },

  isClearedAdjustment: ({
    type,
    itemId,
    walletId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    rejected: boolean;
  }) => {
    return (
      transaction.isCleared({
        type,
        itemId,
        walletId,
        rejected,
      }) && type === "ADJUSTMENT"
    );
  },

  isClearedPurchase: ({
    type,
    itemId,
    walletId,
    rejected,
  }: {
    type: WalletTransactionType;
    itemId: number | null;
    walletId: number | null;
    rejected: boolean;
  }) => {
    return (
      transaction.isCleared({
        type,
        itemId,
        walletId,
        rejected,
      }) && type === "PURCHASE"
    );
  },
};
