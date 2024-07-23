/*
  Warnings:

  - You are about to drop the column `payout` on the `RaidActivity` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `earned` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `spent` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `RaidActivityAttendant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemToRaidActivity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `characterName` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('ATTENDANCE', 'PURCHASE', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "RaidActivityAttendant" DROP CONSTRAINT "RaidActivityAttendant_characterId_fkey";

-- DropForeignKey
ALTER TABLE "RaidActivityAttendant" DROP CONSTRAINT "RaidActivityAttendant_pilotId_fkey";

-- DropForeignKey
ALTER TABLE "RaidActivityAttendant" DROP CONSTRAINT "RaidActivityAttendant_raidActivityId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_walletId_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToRaidActivity" DROP CONSTRAINT "_ItemToRaidActivity_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToRaidActivity" DROP CONSTRAINT "_ItemToRaidActivity_B_fkey";

-- AlterTable
ALTER TABLE "RaidActivity" DROP COLUMN "payout";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "balance",
DROP COLUMN "earned",
DROP COLUMN "spent";

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "characterName" TEXT NOT NULL,
ADD COLUMN     "itemName" TEXT,
ADD COLUMN     "pilotCharacterName" TEXT,
ADD COLUMN     "type" "WalletTransactionType" NOT NULL,
ALTER COLUMN "walletId" DROP NOT NULL;

-- DropTable
DROP TABLE "RaidActivityAttendant";

-- DropTable
DROP TABLE "_ItemToRaidActivity";

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
