-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "testimonialRequested" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "followUpSent" BOOLEAN NOT NULL DEFAULT false;
