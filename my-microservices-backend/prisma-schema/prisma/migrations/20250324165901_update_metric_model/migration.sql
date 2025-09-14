/*
  Warnings:

  - You are about to drop the column `key` on the `Metric` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Metric` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Metric` table. All the data in the column will be lost.
  - Added the required column `cpu` to the `Metric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memory` to the `Metric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `network` to the `Metric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Metric" DROP COLUMN "key",
DROP COLUMN "unit",
DROP COLUMN "value",
ADD COLUMN     "cpu" TEXT NOT NULL,
ADD COLUMN     "memory" TEXT NOT NULL,
ADD COLUMN     "network" TEXT NOT NULL;
