-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "releaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FavoriteMovies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_WatchedMovies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteMovies_AB_unique" ON "_FavoriteMovies"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteMovies_B_index" ON "_FavoriteMovies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WatchedMovies_AB_unique" ON "_WatchedMovies"("A", "B");

-- CreateIndex
CREATE INDEX "_WatchedMovies_B_index" ON "_WatchedMovies"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteMovies" ADD CONSTRAINT "_FavoriteMovies_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteMovies" ADD CONSTRAINT "_FavoriteMovies_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchedMovies" ADD CONSTRAINT "_WatchedMovies_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchedMovies" ADD CONSTRAINT "_WatchedMovies_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
