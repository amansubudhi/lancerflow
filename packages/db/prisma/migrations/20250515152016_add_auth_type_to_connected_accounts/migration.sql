/*
  Warnings:

  - Added the required column `type` to the `ConnectedAccount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Authtype" AS ENUM ('OAUTH', 'API_KEY', 'WEBHOOK', 'NONE');

-- AlterTable
ALTER TABLE "ConnectedAccount" ADD COLUMN     "apiKey" TEXT,
ADD COLUMN     "config" JSONB,
ADD COLUMN     "type" "Authtype" NOT NULL,
ALTER COLUMN "accessToken" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "expiresAt" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
