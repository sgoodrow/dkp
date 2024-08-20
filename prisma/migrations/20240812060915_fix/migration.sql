/*
  Warnings:

  - The values [IN_PROGRESS,SUCCESS] on the enum `InstallAttemptStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InstallAttemptStatus_new" AS ENUM ('FAIL', 'READY_FOR_IMPORT', 'COMPLETE');
ALTER TABLE "InstallAttempt" ALTER COLUMN "status" TYPE "InstallAttemptStatus_new" USING ("status"::text::"InstallAttemptStatus_new");
ALTER TYPE "InstallAttemptStatus" RENAME TO "InstallAttemptStatus_old";
ALTER TYPE "InstallAttemptStatus_new" RENAME TO "InstallAttemptStatus";
DROP TYPE "InstallAttemptStatus_old";
COMMIT;
