/*
  Warnings:

  - You are about to drop the column `number` on the `Client` table. All the data in the column will be lost.
  - Added the required column `behaviour` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dealValue` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailedRemarks` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldVisits` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "number",
ADD COLUMN     "behaviour" TEXT NOT NULL,
ADD COLUMN     "dealStatus" TEXT NOT NULL DEFAULT 'IAccepted',
ADD COLUMN     "dealValue" INTEGER NOT NULL,
ADD COLUMN     "detailedRemarks" TEXT NOT NULL,
ADD COLUMN     "fieldVisits" TEXT NOT NULL,
ADD COLUMN     "remarks" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ClientContactDetails" (
    "id" SERIAL NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "ClientContactDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAddress" (
    "id" SERIAL NOT NULL,
    "doorNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "ClientAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientMetting" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "ClientMetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientContactDetails_contactNumber_key" ON "ClientContactDetails"("contactNumber");

-- AddForeignKey
ALTER TABLE "ClientContactDetails" ADD CONSTRAINT "ClientContactDetails_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAddress" ADD CONSTRAINT "ClientAddress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMetting" ADD CONSTRAINT "ClientMetting_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
