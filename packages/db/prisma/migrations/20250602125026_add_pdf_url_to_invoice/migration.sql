/*
  Warnings:

  - You are about to drop the column `invoiceHtml` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "invoiceHtml",
ADD COLUMN     "pdfUrl" TEXT;
