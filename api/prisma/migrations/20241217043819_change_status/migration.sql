/*
  Warnings:

  - The values [Pending,Finished] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('PENDING', 'FINISHED');
ALTER TABLE "Task" ALTER COLUMN "taskStatus" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "taskStatus" TYPE "TaskStatus_new" USING ("taskStatus"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "taskStatus" DROP DEFAULT;
