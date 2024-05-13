/*
  Warnings:

  - You are about to drop the `MembersMatchMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MembersMatchMovie";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "second_name" TEXT,
    "user" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "conf_password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "location_number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_user_key" ON "User"("user");
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
