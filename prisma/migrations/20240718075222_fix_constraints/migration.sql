/*
  Warnings:

  - You are about to drop the column `hexColor` on the `CharacterClass` table. All the data in the column will be lost.
  - You are about to drop the column `raidActivityTypeId` on the `RaidActivity` table. All the data in the column will be lost.
  - Added the required column `colorHexDark` to the `CharacterClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorHexLight` to the `CharacterClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `RaidActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RaidActivity" DROP CONSTRAINT "RaidActivity_raidActivityTypeId_fkey";

-- DropIndex
DROP INDEX "Character_classId_key";

-- DropIndex
DROP INDEX "Character_defaultPilotId_key";

-- DropIndex
DROP INDEX "Character_raceId_key";

-- DropIndex
DROP INDEX "RaidActivity_createdById_key";

-- DropIndex
DROP INDEX "RaidActivity_raidActivityTypeId_key";

-- DropIndex
DROP INDEX "RaidActivity_updatedById_key";

-- DropIndex
DROP INDEX "RaidActivityAttendant_characterId_key";

-- DropIndex
DROP INDEX "RaidActivityAttendant_pilotId_key";

-- DropIndex
DROP INDEX "RaidActivityType_createdById_key";

-- DropIndex
DROP INDEX "RaidActivityType_updatedById_key";

-- DropIndex
DROP INDEX "WalletTransaction_createdById_key";

-- DropIndex
DROP INDEX "WalletTransaction_itemId_key";

-- DropIndex
DROP INDEX "WalletTransaction_raidActivityId_key";

-- DropIndex
DROP INDEX "WalletTransaction_updatedById_key";

-- DropIndex
DROP INDEX "WalletTransaction_walletId_key";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CharacterClass" DROP COLUMN "hexColor",
ADD COLUMN     "colorHexDark" TEXT NOT NULL,
ADD COLUMN     "colorHexLight" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RaidActivity" DROP COLUMN "raidActivityTypeId",
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RaceClassCombination" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "RaceClassCombination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Character_defaultPilotId_idx" ON "Character"("defaultPilotId");

-- CreateIndex
CREATE INDEX "Character_classId_idx" ON "Character"("classId");

-- CreateIndex
CREATE INDEX "Character_raceId_idx" ON "Character"("raceId");

-- AddForeignKey
ALTER TABLE "RaceClassCombination" ADD CONSTRAINT "RaceClassCombination_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "CharacterRace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceClassCombination" ADD CONSTRAINT "RaceClassCombination_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CharacterClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidActivity" ADD CONSTRAINT "RaidActivity_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "RaidActivityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
