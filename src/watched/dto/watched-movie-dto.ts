import { PartialType } from "@nestjs/swagger";
import { FavoriteMovieDto } from "../../favorites/dto/favorite-movie.dto";

export class WatchedMovieDto extends PartialType(FavoriteMovieDto) {}