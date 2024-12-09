/*
  Warnings:

  - The `fieldVisits` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ClientMetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientMetting" DROP CONSTRAINT "ClientMetting_clientId_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "detailedRemarks" DROP NOT NULL,
DROP COLUMN "fieldVisits",
ADD COLUMN     "fieldVisits" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ClientMetting";

-- CreateTable
CREATE TABLE "ClientMeeting" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "ClientMeeting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientMeeting" ADD CONSTRAINT "ClientMeeting_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
