/*
  Warnings:

  - You are about to drop the column `isBot` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `archived` on the `WalletTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `archivedAt` on the `WalletTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "isBot";

-- AlterTable
ALTER TABLE "WalletTransaction" DROP COLUMN "archived",
DROP COLUMN "archivedAt",
ADD COLUMN     "rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectedAt" TIMESTAMP(3);
