/*
  Warnings:

  - The values [IN_PROGRESS,SUCCESS] on the enum `MigrateAttemptStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MigrateAttemptStatus_new" AS ENUM ('FAIL', 'COMPLETE');
ALTER TABLE "MigrateAttempt" ALTER COLUMN "status" TYPE "MigrateAttemptStatus_new" USING ("status"::text::"MigrateAttemptStatus_new");
ALTER TYPE "MigrateAttemptStatus" RENAME TO "MigrateAttemptStatus_old";
ALTER TYPE "MigrateAttemptStatus_new" RENAME TO "MigrateAttemptStatus";
DROP TYPE "MigrateAttemptStatus_old";
COMMIT;
