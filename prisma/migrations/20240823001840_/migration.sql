/*
  Warnings:

  - You are about to drop the column `remoteCharacterId` on the `MigrateInvalidCharacter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[remoteId]` on the table `MigrateInvalidCharacter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `remoteId` to the `MigrateInvalidCharacter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MigrateInvalidCharacter_remoteCharacterId_key";

-- AlterTable
ALTER TABLE "MigrateInvalidCharacter" DROP COLUMN "remoteCharacterId",
ADD COLUMN     "remoteId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MigrateInvalidCharacter_remoteId_key" ON "MigrateInvalidCharacter"("remoteId");
