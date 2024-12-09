/*
  Warnings:

  - Made the column `date` on table `ClientMeeting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes` on table `ClientMeeting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ClientMeeting" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "notes" SET NOT NULL;
