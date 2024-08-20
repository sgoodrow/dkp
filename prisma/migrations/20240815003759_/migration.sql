/*
  Warnings:

  - You are about to drop the column `dryRun` on the `MigrateAttempt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MigrateAttempt" DROP COLUMN "dryRun";
