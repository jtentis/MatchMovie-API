/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WatchedMovies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_movieId_fkey";

-- DropForeignKey
ALTER TABLE "_WatchedMovies" DROP CONSTRAINT "_WatchedMovies_A_fkey";

-- DropForeignKey
ALTER TABLE "_WatchedMovies" DROP CONSTRAINT "_WatchedMovies_B_fkey";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "_WatchedMovies";
