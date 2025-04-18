/*
  Warnings:

  - A unique constraint covering the columns `[triggerType]` on the table `AvailableTrigger` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('GMAIL_LABEL', 'CRON', 'WEBHOOK');

-- AlterTable
ALTER TABLE "AvailableTrigger" ADD COLUMN     "triggerType" "TriggerType";

-- CreateTable
CREATE TABLE "ProcessedEmailMessage" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedEmailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedEmailMessage_triggerId_messageId_key" ON "ProcessedEmailMessage"("triggerId", "messageId");

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTrigger_triggerType_key" ON "AvailableTrigger"("triggerType");

-- AddForeignKey
ALTER TABLE "ProcessedEmailMessage" ADD CONSTRAINT "ProcessedEmailMessage_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
