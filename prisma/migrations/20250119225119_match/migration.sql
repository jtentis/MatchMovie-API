-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
