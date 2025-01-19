/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,groupId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `liked` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vote_groupId_userId_movieId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "createdAt",
ADD COLUMN     "liked" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_groupId_key" ON "Vote"("userId", "groupId");
