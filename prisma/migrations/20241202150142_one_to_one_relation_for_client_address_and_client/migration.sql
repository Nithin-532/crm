/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `ClientAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClientAddress_clientId_key" ON "ClientAddress"("clientId");
