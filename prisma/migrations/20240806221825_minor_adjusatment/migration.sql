/*
  Warnings:

  - You are about to drop the `DiscordMemberMetadata` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdById]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DiscordMemberMetadata" DROP CONSTRAINT "DiscordMemberMetadata_userId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_walletId_fkey";

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WalletTransaction" ALTER COLUMN "walletId" DROP NOT NULL;

-- DropTable
DROP TABLE "DiscordMemberMetadata";

-- CreateTable
CREATE TABLE "DiscordUserMetadata" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "roleIds" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "DiscordUserMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUserMetadata_memberId_key" ON "DiscordUserMetadata"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUserMetadata_userId_key" ON "DiscordUserMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_createdById_key" ON "Guild"("createdById");

-- AddForeignKey
ALTER TABLE "DiscordUserMetadata" ADD CONSTRAINT "DiscordUserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
