/*
  Warnings:

  - Added the required column `deadline` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "InvoiceStatus" ADD VALUE 'PENDING';

-- AlterEnum
ALTER TYPE "TriggerType" ADD VALUE 'CLIENT_ONBOARDING';

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;
