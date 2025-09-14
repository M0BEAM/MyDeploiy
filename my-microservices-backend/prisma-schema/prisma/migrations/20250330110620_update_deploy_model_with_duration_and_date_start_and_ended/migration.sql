/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Deploy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deploy" DROP COLUMN "createdAt",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "endedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
