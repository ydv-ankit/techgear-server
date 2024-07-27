/*
  Warnings:

  - You are about to alter the column `rating` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;
