/*
  Warnings:

  - The values [WEBHOOK] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPEN,UNCOLLECTIBLE,PENDING] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [GMAIL_LABEL,CRON] on the enum `TriggerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('EMAIL', 'INVOICE', 'DELAY', 'NOTIFICATION');
ALTER TABLE "AvailableAction" ALTER COLUMN "actionType" TYPE "ActionType_new" USING ("actionType"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'CANCELLED');
ALTER TABLE "Invoice" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TriggerType_new" AS ENUM ('CLIENT_ONBOARDING', 'SCHEDULE', 'WEBHOOK');
ALTER TABLE "AvailableTrigger" ALTER COLUMN "triggerType" TYPE "TriggerType_new" USING ("triggerType"::text::"TriggerType_new");
ALTER TYPE "TriggerType" RENAME TO "TriggerType_old";
ALTER TYPE "TriggerType_new" RENAME TO "TriggerType";
DROP TYPE "TriggerType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "testimonialFormUrl" TEXT;
