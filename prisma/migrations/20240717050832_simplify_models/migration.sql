/*
  Warnings:

  - You are about to drop the column `level` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `payoutId` on the `RaidActivity` table. All the data in the column will be lost.
  - You are about to drop the column `defaultPayoutTransactionAmount` on the `RaidActivityType` table. All the data in the column will be lost.
  - You are about to drop the `Adjustment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[defaultPilotId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payout` to the `RaidActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultPayout` to the `RaidActivityType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Adjustment" DROP CONSTRAINT "Adjustment_raidActivityId_fkey";

-- DropForeignKey
ALTER TABLE "Adjustment" DROP CONSTRAINT "Adjustment_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "RaidActivity" DROP CONSTRAINT "RaidActivity_payoutId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_walletId_fkey";

-- DropIndex
DROP INDEX "Character_userId_key";

-- DropIndex
DROP INDEX "RaidActivity_payoutId_key";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "level",
DROP COLUMN "userId",
ADD COLUMN     "defaultPilotId" TEXT;

-- AlterTable
ALTER TABLE "RaidActivity" DROP COLUMN "payoutId",
ADD COLUMN     "payout" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "RaidActivityType" DROP COLUMN "defaultPayoutTransactionAmount",
ADD COLUMN     "defaultPayout" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "earned" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "spent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Adjustment";

-- DropTable
DROP TABLE "Payout";

-- DropTable
DROP TABLE "Purchase";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "RaidActivityAttendant" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "pilotId" TEXT,
    "raidActivityId" INTEGER NOT NULL,

    CONSTRAINT "RaidActivityAttendant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "walletId" INTEGER NOT NULL,
    "itemId" INTEGER,
    "raidActivityId" INTEGER,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RaidActivityAttendant_characterId_key" ON "RaidActivityAttendant"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "RaidActivityAttendant_pilotId_key" ON "RaidActivityAttendant"("pilotId");

-- CreateIndex
CREATE UNIQUE INDEX "RaidActivityAttendant_raidActivityId_key" ON "RaidActivityAttendant"("raidActivityId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_walletId_key" ON "WalletTransaction"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_itemId_key" ON "WalletTransaction"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_raidActivityId_key" ON "WalletTransaction"("raidActivityId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_createdById_key" ON "WalletTransaction"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_updatedById_key" ON "WalletTransaction"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Character_defaultPilotId_key" ON "Character"("defaultPilotId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_defaultPilotId_fkey" FOREIGN KEY ("defaultPilotId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidActivityAttendant" ADD CONSTRAINT "RaidActivityAttendant_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidActivityAttendant" ADD CONSTRAINT "RaidActivityAttendant_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidActivityAttendant" ADD CONSTRAINT "RaidActivityAttendant_raidActivityId_fkey" FOREIGN KEY ("raidActivityId") REFERENCES "RaidActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_raidActivityId_fkey" FOREIGN KEY ("raidActivityId") REFERENCES "RaidActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
