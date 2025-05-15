/*
  Warnings:

  - You are about to drop the column `provider` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Invoice` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Invoice_providerId_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "provider",
DROP COLUMN "providerId",
ADD COLUMN     "flowRunId" TEXT,
ADD COLUMN     "invoiceHtml" TEXT,
ADD COLUMN     "services" JSONB;

-- DropEnum
DROP TYPE "InvoiceProvider";

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_flowRunId_fkey" FOREIGN KEY ("flowRunId") REFERENCES "FlowRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
