-- AlterTable
ALTER TABLE "ClientMeeting" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "notes" DROP NOT NULL;
