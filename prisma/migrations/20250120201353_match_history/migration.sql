/*
  Warnings:

  - You are about to drop the column `winnerId` on the `Match` table. All the data in the column will be lost.
  - Added the required column `winnerTitle` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "winnerId",
ADD COLUMN     "winnerTitle" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'completed';

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
