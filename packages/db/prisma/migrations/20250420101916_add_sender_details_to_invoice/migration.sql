/*
  Warnings:

  - Added the required column `clientName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderEmail` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "senderEmail" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL;
