/*
  Warnings:

  - Added the required column `currentDkp` to the `MigrateEqdkpUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MigrateEqdkpUser" ADD COLUMN     "currentDkp" DOUBLE PRECISION NOT NULL;
