/*
  Warnings:

  - Changed the type of `provider` on the `ConnectedAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('TOGGL', 'GMAIL', 'NOTION', 'STRIPE', 'OTHER');

-- AlterTable
ALTER TABLE "ConnectedAccount" DROP COLUMN "provider",
ADD COLUMN     "provider" "Provider" NOT NULL;
