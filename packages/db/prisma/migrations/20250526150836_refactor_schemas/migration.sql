/*
  Warnings:

  - You are about to drop the column `clientEmail` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `senderEmail` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the `ProcessedEmailMessage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[flowRunId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Flow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Approval" DROP CONSTRAINT "Approval_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "ProcessedEmailMessage" DROP CONSTRAINT "ProcessedEmailMessage_triggerId_fkey";

-- DropForeignKey
ALTER TABLE "ProcessedEmailMessage" DROP CONSTRAINT "ProcessedEmailMessage_userId_fkey";

-- AlterTable
ALTER TABLE "Approval" ALTER COLUMN "invoiceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Flow" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FlowRun" ADD COLUMN     "clientId" INTEGER;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
DROP COLUMN "senderEmail",
DROP COLUMN "senderName",
DROP COLUMN "services",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ProcessedEmailMessage";

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "services" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_flowRunId_key" ON "Invoice"("flowRunId");

-- AddForeignKey
ALTER TABLE "FlowRun" ADD CONSTRAINT "FlowRun_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
