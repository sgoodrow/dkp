/*
  Warnings:

  - You are about to drop the column `clearedByUserId` on the `WalletTransaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_clearedByUserId_fkey";

-- AlterTable
ALTER TABLE "WalletTransaction" DROP COLUMN "clearedByUserId";
