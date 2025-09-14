/*
  Warnings:

  - Changed the type of `cpu` on the `Metric` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `memory` on the `Metric` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `network` on the `Metric` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Metric" DROP COLUMN "cpu",
ADD COLUMN     "cpu" DOUBLE PRECISION NOT NULL,
DROP COLUMN "memory",
ADD COLUMN     "memory" DOUBLE PRECISION NOT NULL,
DROP COLUMN "network",
ADD COLUMN     "network" DOUBLE PRECISION NOT NULL;
